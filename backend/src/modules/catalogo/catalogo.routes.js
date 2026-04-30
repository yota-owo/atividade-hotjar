const express = require("express");
const catalogoController = require("./catalogo.controller");

const router = express.Router();

// Rotas abertas (sem validação de Token)
router.get("/racas", catalogoController.listarRacas);
router.get("/classes", catalogoController.listarClasses);

module.exports = router;
