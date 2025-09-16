// index.js
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware para leer los datos que Twilio envía
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Ruta base (opcional) para verificar que el backend funciona
app.get("/", (req, res) => {
    res.send("🚀 LucaBot Backend funcionando correctamente!");
});

// Endpoint para recibir mensajes de WhatsApp desde Twilio
app.post("/whatsapp", (req, res) => {
    const from = req.body.From; // número de quien envía
    const body = req.body.Body; // mensaje enviado

    console.log("Mensaje recibido de Twilio:", req.body);

    // Respuesta automática
    const respuesta = `<Response><Message>¡Hola! Te recibí correctamente.</Message></Response>`;
    res.type("text/xml").send(respuesta);
});

// Arrancar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
