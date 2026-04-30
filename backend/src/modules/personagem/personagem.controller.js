const prisma = require("../../config/database");

/**
 * ============================================================================
 * ENTREGÁVEL: DESIGN DE SOFTWARE - CÓDIGO ANOTADO
 * PADRÃO APLICADO: CONTROLLER (MVC)
 * * Justificativa: Isolamento das regras de negócio do domínio "Personagem".
 * Aqui aplicamos também o princípio da "Single Responsibility" (SOLID),
 * onde o controlador lida apenas com o fluxo de entrada/saída, enquanto
 * o Prisma (Model) cuida da persistência.
 * ============================================================================
 */

class PersonagemController {
  // 1. CRIAR Personagem (C do CRUD)
  async criar(req, res) {
    try {
      // Dados enviados pelo frontend
      const { nome, racaId, classeId, mestreEmail } = req.body;
      const usuarioLogadoId = req.usuario.id; // Vem do token JWT!

      let mestreId = null;

      // Regra de Negócio: Se o jogador informou o e-mail de um Mestre, vinculamos a ficha!
      if (mestreEmail) {
        const mestre = await prisma.usuario.findUnique({
          where: { email: mestreEmail },
        });

        if (!mestre || mestre.perfil !== "MESTRE") {
          return res
            .status(404)
            .json({ erro: "Mestre não encontrado no Arquivo Etéreo." });
        }
        mestreId = mestre.id;
      }

      const novoPersonagem = await prisma.personagem.create({
        data: {
          nome,
          racaId,
          classeId,
          usuarioId: usuarioLogadoId,
          mestreId,
        },
      });

      return res.status(201).json({
        mensagem: "Ficha forjada com sucesso!",
        personagem: novoPersonagem,
      });
    } catch (erro) {
      console.error("Erro ao forjar personagem:", erro);
      return res.status(500).json({ erro: "Falha na forja. Tente novamente." });
    }
  }

  // 2. LISTAR Personagens (R do CRUD para o Dashboard)
  async listar(req, res) {
    try {
      const { id, perfil } = req.usuario; // Pegamos os dados do Token
      let condicaoBusca = {};

      // Regra de Negócio de Acesso (RBAC)
      if (perfil === "MESTRE") {
        // O Mestre vê as fichas que ele criou E as fichas vinculadas a ele
        condicaoBusca = { OR: [{ mestreId: id }, { usuarioId: id }] };
      } else {
        // O Jogador vê apenas as próprias fichas
        condicaoBusca = { usuarioId: id };
      }

      // O 'include' atua como o JOIN do SQL, trazendo os atributos da Raça e da Classe juntos
      const personagens = await prisma.personagem.findMany({
        where: condicaoBusca,
        include: {
          raca: true,
          classe: true,
        },
        orderBy: { criadoEm: "desc" },
      });

      return res.status(200).json(personagens);
    } catch (erro) {
      console.error("Erro ao listar fichas:", erro);
      return res
        .status(500)
        .json({ erro: "Erro ao consultar os arquivos etéreos." });
    }
  }

  // 3. EDITAR Personagem (U do CRUD)
  async editar(req, res) {
    try {
      const { id } = req.params;
      const { nome, vidaAtual, manaAtual } = req.body;

      const personagem = await prisma.personagem.findUnique({
        where: { id: Number(id) },
      });

      if (!personagem) {
        return res.status(404).json({ erro: "Ficha não encontrada." });
      }

      // Segurança: apenas o dono da ficha ou o Mestre vinculado podem editar
      const ehDono = personagem.usuarioId === req.usuario.id;
      const ehMestreVinculado = personagem.mestreId === req.usuario.id;

      if (!ehDono && !ehMestreVinculado) {
        return res.status(403).json({ erro: "Você não tem permissão para editar esta ficha." });
      }

      const atualizado = await prisma.personagem.update({
        where: { id: Number(id) },
        data: {
          ...(nome !== undefined && { nome }),
          ...(vidaAtual !== undefined && { vidaAtual: Number(vidaAtual) }),
          ...(manaAtual !== undefined && { manaAtual: Number(manaAtual) }),
        },
      });

      return res.status(200).json({ mensagem: "Ficha atualizada.", personagem: atualizado });
    } catch (erro) {
      console.error("Erro ao editar personagem:", erro);
      return res.status(500).json({ erro: "Falha ao atualizar a ficha." });
    }
  }

  // 4. DELETAR Personagem (D do CRUD)
  async deletar(req, res) {
    try {
      const { id } = req.params; // Pega o ID da URL (ex: /api/personagens/5)

      // Busca a ficha para verificar permissões
      const personagem = await prisma.personagem.findUnique({
        where: { id: Number(id) },
      });

      if (!personagem) {
        return res.status(404).json({ erro: "Ficha não encontrada." });
      }

      // Segurança: Apenas o dono (Jogador) ou o Mestre podem rasgar a ficha
      const ehDono = personagem.usuarioId === req.usuario.id;
      const ehMestre = personagem.mestreId === req.usuario.id;

      if (!ehDono && !ehMestre) {
        return res
          .status(403)
          .json({ erro: "Você não tem permissão para destruir esta ficha." });
      }

      await prisma.personagem.delete({ where: { id: Number(id) } });

      return res.status(200).json({ mensagem: "A lenda foi apagada." });
    } catch (erro) {
      console.error("Erro ao excluir:", erro);
      return res.status(500).json({ erro: "Falha ao destruir a ficha." });
    }
  }
}

module.exports = new PersonagemController();
