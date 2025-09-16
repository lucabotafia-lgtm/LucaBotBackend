// server.js

// Importa dotenv para leer las variables de entorno
import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";

// Twilio (compatibilidad CommonJS)
import pkg from "twilio";
const { Twilio } = pkg;

// OpenAI
import OpenAI from "openai";

// ----------------------
// Configuración Firebase
// ----------------------
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("Firestore listo!");

// ----------------------
// Configuración Twilio
// ----------------------
const client = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const twilioNumber = process.env.TWILIO_WHATSAPP_FROM;

// ----------------------
// Configuración OpenAI
// ----------------------
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ----------------------
// Configuración Express
// ----------------------
const server = express();
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// ----------------------
// Endpoint WhatsApp
// ----------------------
server.post("/whatsapp", async (req, res) => {
  const { From, Body } = req.body;

  try {
    // Guardar mensaje entrante en Firestore
    await addDoc(collection(db, "mensajes"), {
      from: From,
      mensaje: Body,
      fecha: Timestamp.now(),
      estado: "pendiente"
    });

    // Generar respuesta automática con OpenAI
    const respuesta = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: Body }]
    });

    const textoRespuesta = respuesta.choices[0].message.content;

    // Enviar respuesta por WhatsApp usando Twilio
    await client.messages.create({
      from: twilioNumber,
      to: From,
      body: textoRespuesta
    });

    // Guardar respuesta en Firestore
    await addDoc(collection(db, "mensajes"), {
      from: twilioNumber,
      mensaje: textoRespuesta,
      fecha: Timestamp.now(),
      estado: "enviado"
    });

    res.sendStatus(200);
  } catch (error) {
    console.error("Error manejando mensaje:", error);
    res.sendStatus(500);
  }
});

// ----------------------
// Iniciar servidor
// ----------------------
server.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
