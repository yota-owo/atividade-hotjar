const express = require("express");
const personagemController = require("./personagem.controller");
const authMiddleware = require("../../middlewares/auth");

const router = express.Router();

/**
 * ============================================================================
 * PADRÃO APLICADO: MIDDLEWARE / DECORATOR (Estrutural)
 * * Justificativa: A linha abaixo aplica o authMiddleware a TODAS as rotas
 * deste arquivo simultaneamente. Isso evita a repetição de código (DRY) e
 * garante que nenhuma rota de personagem fique exposta a usuários sem token.
 * ============================================================================
 */
router.use(authMiddleware);

// Endpoints do CRUD
router.post("/", personagemController.criar);
router.get("/", personagemController.listar);
router.patch("/:id", personagemController.editar);
router.delete("/:id", personagemController.deletar);

module.exports = router;
