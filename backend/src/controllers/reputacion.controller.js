const pool = require('../config/db');
const { ROLES } = require('../middlewares/roles.middleware');

const obtenerReputaciones = async (req, res) => {
  try {
    const rol = Number(req.usuario.rol_id); let where = "WHERE r.nombre IN ('PRODUCTOR','COMPRADOR')"; let params = [];
    if (rol === ROLES.PRODUCTOR || rol === ROLES.COMPRADOR) { where += ' AND u.id=$1'; params = [req.usuario.id]; }
    const r = await pool.query(`
      SELECT u.id,u.nombre,r.nombre AS rol,u.reputacion,
             COUNT(i.id) FILTER (WHERE i.aprobado=true) AS incumplimientos_aprobados
      FROM usuarios u
      JOIN roles r ON u.rol_id=r.id
      LEFT JOIN incumplimientos i ON i.reportado_por=u.id
      ${where}
      GROUP BY u.id,r.nombre
      ORDER BY u.reputacion DESC,u.nombre ASC`, params);
    res.json(r.rows);
  } catch (e) { console.error(e); res.status(500).json({ mensaje: 'Error obteniendo reputaciones' }); }
};

const recalcularReputacion = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    if (Number(req.usuario.rol_id) !== ROLES.ADMIN && Number(usuario_id) !== Number(req.usuario.id)) return res.status(403).json({ mensaje: 'No autorizado' });
    const total = Number((await pool.query('SELECT COUNT(*) AS total FROM incumplimientos WHERE reportado_por=$1 AND aprobado=true', [usuario_id])).rows[0].total);
    const reputacion = Math.max(1, 5 - total);
    const u = await pool.query('UPDATE usuarios SET reputacion=$1 WHERE id=$2 RETURNING id,nombre,reputacion', [reputacion, usuario_id]);
    res.json({ mensaje: 'Reputación recalculada correctamente', usuario: u.rows[0] });
  } catch (e) { console.error(e); res.status(500).json({ mensaje: 'Error recalculando reputación' }); }
};

module.exports = { obtenerReputaciones, recalcularReputacion };
