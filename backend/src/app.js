const express = require("express");
const cors = require("cors");

// Importação das rotas
const authRoutes = require("./modules/auth/auth.routes");
const personagemRoutes = require("./modules/personagem/personagem.routes");
const catalogoRoutes = require("./modules/catalogo/catalogo.routes"); // <-- LINHA NOVA

const app = express();

app.use(cors());
app.use(express.json());

// Registro dos Módulos
app.use("/api/auth", authRoutes);
app.use("/api/personagens", personagemRoutes);
app.use("/api/catalogo", catalogoRoutes); // <-- LINHA NOVA

app.get("/", (req, res) => {
  res.json({ mensagem: "A Forja - API Mighty Blade está online!" });
});

module.exports = app;
