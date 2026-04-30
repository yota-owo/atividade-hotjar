const prisma = require("../../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * ============================================================================
 * ENTREGÁVEL: DESIGN DE SOFTWARE - CÓDIGO ANOTADO
 * PADRÃO APLICADO: CONTROLLER (MVC) & SINGLETON (Prisma)
 * * Justificativa: Este arquivo atua como o 'Controller' no padrão MVC,
 * isolando a lógica de negócio (validação, criptografia e geração de token)
 * das rotas e da visualização. Ele utiliza a instância Singleton do banco
 * de dados para garantir performance.
 * ============================================================================
 */

class AuthController {
  // Método de Cadastro (Registro)
  async registrar(req, res) {
    try {
      // Os nomes dos campos aqui batem com o que o Frontend vai enviar
      const { nome, email, senha, perfil } = req.body;

      // 1. Verifica se o usuário já existe
      const usuarioExistente = await prisma.usuario.findUnique({
        where: { email },
      });

      if (usuarioExistente) {
        // Status 409 Conflict (Conforme mapeado nos Casos de Uso)
        return res.status(409).json({ erro: "Este e-mail já está em uso." });
      }

      // 2. Criptografa a senha (Nunca salvamos em texto puro)
      const salt = await bcrypt.genSalt(10);
      const senhaCriptografada = await bcrypt.hash(senha, salt);

      // 3. Salva no banco de dados
      const novoUsuario = await prisma.usuario.create({
        data: {
          nome,
          email,
          senha: senhaCriptografada,
          // Garante que o perfil seja JOGADOR ou MESTRE (maiúsculo para bater com o Prisma Enum)
          perfil: perfil ? perfil.toUpperCase() : "JOGADOR",
        },
      });

      // 4. Resposta de sucesso (Ocultando a senha do retorno por segurança)
      novoUsuario.senha = undefined;
      return res.status(201).json({
        mensagem: "Conta forjada com sucesso!",
        usuario: novoUsuario,
      });
    } catch (erro) {
      console.error("Erro no Cadastro:", erro);
      return res
        .status(500)
        .json({ erro: "Houve um distúrbio na Forja. Tente novamente." });
    }
  }

  // Método de Login
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      // 1. Busca o usuário
      const usuario = await prisma.usuario.findUnique({
        where: { email },
      });

      // Status 401 Unauthorized (Conforme Casos de Uso FE01/FE02)
      if (!usuario) {
        return res
          .status(401)
          .json({ erro: "Credenciais inválidas. Tente novamente." });
      }

      // 2. Compara as senhas
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        return res
          .status(401)
          .json({ erro: "Credenciais inválidas. Tente novamente." });
      }

      // 3. Gera o Token JWT (Payload com id, nome e perfil)
      const token = jwt.sign(
        { id: usuario.id, nome: usuario.nome, perfil: usuario.perfil },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }, // Token expira em 8 horas
      );

      // 4. Retorna o token para o frontend
      return res.status(200).json({
        mensagem: "Acesso liberado.",
        token,
        usuario: { id: usuario.id, nome: usuario.nome, perfil: usuario.perfil },
      });
    } catch (erro) {
      console.error("Erro no Login:", erro);
      return res
        .status(500)
        .json({ erro: "As linhas de mana estão instáveis. Tente novamente." });
    }
  }
}

module.exports = new AuthController();
