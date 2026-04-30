const express = require("express");
const authController = require("./auth.controller");
const router = express.Router();

/**
 * ============================================================================
 * ENTREGÁVEL: DESIGN DE SOFTWARE - CÓDIGO ANOTADO
 * PADRÃO APLICADO: ROUTING (Mapeamento de Endpoints)
 * * Justificativa: Isola a definição das URLs da lógica de negócio.
 * O roteador recebe a requisição HTTP (POST) e delega a execução para o
 * método correspondente no AuthController.
 * ============================================================================
 */

// Rota: POST /api/auth/cadastro
router.post("/cadastro", authController.registrar);

// Rota: POST /api/auth/login
router.post("/login", authController.login);

module.exports = router;
