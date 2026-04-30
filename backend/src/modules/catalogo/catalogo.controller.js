const prisma = require("../../config/database");

/**
 * ============================================================================
 * ENTREGÁVEL: DESIGN DE SOFTWARE - CÓDIGO ANOTADO
 * PADRÃO APLICADO: REPOSITORY (Conceitual) / READ-ONLY
 * * Justificativa: Este controlador atua como uma interface de leitura (Read-Only)
 * para os domínios estáticos do sistema (Raças e Classes). Ao separar isso do
 * domínio de Personagens, aplicamos o Princípio da Segregação de Interface (ISP - SOLID),
 * garantindo que recursos imutáveis do RPG tenham seu próprio ciclo de entrega.
 * ============================================================================
 */

class CatalogoController {
  // Lista todas as Raças
  async listarRacas(req, res) {
    try {
      const racas = await prisma.raca.findMany();
      return res.status(200).json(racas);
    } catch (erro) {
      console.error("Erro ao buscar raças:", erro);
      return res
        .status(500)
        .json({ erro: "Erro ao acessar os registros de Raças." });
    }
  }

  // Lista todas as Classes
  async listarClasses(req, res) {
    try {
      const classes = await prisma.classe.findMany();
      return res.status(200).json(classes);
    } catch (erro) {
      console.error("Erro ao buscar classes:", erro);
      return res
        .status(500)
        .json({ erro: "Erro ao acessar os tomos de Classes." });
    }
  }
}

module.exports = new CatalogoController();
