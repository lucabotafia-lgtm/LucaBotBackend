import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("🚀 LucaBot Backend funcionando correctamente!");
});

// Puerto dinámico (para Render o local)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});
