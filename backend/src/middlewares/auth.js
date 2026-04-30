const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // 1. Pega o token do cabeçalho da requisição
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ erro: "Acesso negado. Token não fornecido." });
  }

  // 2. O padrão é "Bearer <token>", então separamos pelo espaço
  const [, token] = authHeader.split(" ");

  try {
    // 3. Valida se o token é real usando a nossa chave secreta do .env
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Injeta os dados do usuário (id, nome, perfil) dentro da requisição
    req.usuario = payload;

    return next(); // Libera a catraca, pode passar para o Controller!
  } catch (erro) {
    return res
      .status(401)
      .json({ erro: "Token expirado ou inválido. Faça login novamente." });
  }
};
