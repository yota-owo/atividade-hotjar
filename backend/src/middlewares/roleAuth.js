module.exports = (req, res, next) => {
  // Como este middleware sempre vai rodar DEPOIS do auth.js,
  // a variável req.usuario já vai existir aqui dentro.

  if (!req.usuario || req.usuario.perfil !== "MESTRE") {
    return res.status(403).json({
      erro: "Acesso restrito. Apenas Mestres da Forja podem acessar este recurso.",
    });
  }

  return next(); // É Mestre? Pode passar!
};
