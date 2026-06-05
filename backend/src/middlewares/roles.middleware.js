const ROLES = { ADMIN: 1, OPERADOR: 2, PRODUCTOR: 3, COMPRADOR: 4 };

const autorizarRoles = (...rolesPermitidos) => (req, res, next) => {
  if (!req.usuario) return res.status(401).json({ mensaje: 'Sesión no válida' });
  if (!rolesPermitidos.includes(Number(req.usuario.rol_id))) {
    return res.status(403).json({ mensaje: 'No tienes permisos para acceder a esta información' });
  }
  next();
};

module.exports = { ROLES, autorizarRoles };
