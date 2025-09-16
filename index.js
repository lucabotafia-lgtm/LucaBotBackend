import express from "express";
import bodyParser from "body-parser";
import admin from "firebase-admin";
import { MessagingResponse } from "twilio").twiml;
import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// Inicializar Firebase desde archivo secreto en Render
const serviceAccount = JSON.parse(
  fs.readFileSync(process.env.FIREBASE_KEY_PATH, "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// Inicializar OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Crear servidor Express
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Endpoint de prueba
app.get("/", (req, res) => {
  res.send("🚀 LucaBot Backend funcionando correctamente!");
});

// Endpoint WhatsApp
app.post("/whatsapp", async (req, res) => {
  try {
    const from = req.body.From;
    const msg = req.body.Body;

    await db.collection("mensajes").add({
      usuario: from,
      mensaje: msg,
      fecha: new Date(),
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: msg }],
    });

    const respuesta = completion.choices[0].message.content;
    const twiml = new MessagingResponse();
    twiml.message(respuesta);
    res.type("text/xml").send(twiml.toString());
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error en el servidor");
  }
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

