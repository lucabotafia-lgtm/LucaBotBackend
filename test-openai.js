import 'dotenv/config';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function main() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Eres LucaBot, un asistente útil y amable." },
        { role: "user", content: "Hola LucaBot, ¿cómo estás?" }
      ]
    });

    console.log("Respuesta de OpenAI:");
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("Error con OpenAI:", error);
  }
}

main();
