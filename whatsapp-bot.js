import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import OpenAI from 'openai';
import twilio from 'twilio';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.post('/whatsapp', async (req, res) => {
  const incomingMsg = req.body.Body;        // Mensaje recibido
  const from = req.body.From;               // Número de quien envía

  console.log(`Mensaje recibido de ${from}: ${incomingMsg}`);

  try {
    // Llamamos a OpenAI para generar respuesta
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Eres LucaBot, un asistente útil y amable." },
        { role: "user", content: incomingMsg }
      ]
    });

    const reply = response.choices[0].message.content;

    // Enviamos respuesta por WhatsApp usando Twilio
    await twilioClient.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: from,
      body: reply
    });

    console.log(`Respuesta enviada a ${from}: ${reply}`);
    res.sendStatus(200);

  } catch (error) {
    console.error("Error al procesar mensaje:", error);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor de LucaBot corriendo en puerto ${PORT}`);
});
