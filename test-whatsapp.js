// Cargar variables de entorno
import 'dotenv/config';
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

client.messages
  .create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: 'whatsapp:+51946101031', // tu número de WhatsApp autorizado en el sandbox
    body: '¡Hola! Este es un mensaje de prueba desde LucaBot ✅'
  })
  .then(message => console.log('Mensaje enviado, SID:', message.sid))
  .catch(error => console.error('Error al enviar mensaje:', error));
