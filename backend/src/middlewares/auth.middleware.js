const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      mensaje: "Acceso denegado. Token no enviado",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      mensaje: "Token inválido",
    });
  }

  try {
    const usuario = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = usuario;

    next();
  } catch (error) {
    return res.status(401).json({
      mensaje: "Token expirado o inválido",
    });
  }
};

module.exports = verificarToken;