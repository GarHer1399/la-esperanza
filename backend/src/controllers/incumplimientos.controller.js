const pool = require('../config/db');
const { ROLES } = require('../middlewares/roles.middleware');

const crearIncumplimiento = async (req, res) => {
  try {
    const { entrega_id, descripcion } = req.body; const reportado_por = req.usuario.id;
    if (!entrega_id || !descripcion) return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
    const e = await pool.query(`SELECT e.id, sc.comprador_id, pu.productor_id FROM entregas e JOIN solicitudes_compra sc ON e.solicitud_id=sc.id JOIN publicaciones pu ON sc.publicacion_id=pu.id WHERE e.id=$1`, [entrega_id]);
    if (!e.rows.length) return res.status(404).json({ mensaje: 'Entrega no encontrada' });
    const parte = [Number(e.rows[0].comprador_id), Number(e.rows[0].productor_id)].includes(Number(req.usuario.id));
    if (!parte && ![ROLES.ADMIN, ROLES.OPERADOR].includes(Number(req.usuario.rol_id))) return res.status(403).json({ mensaje: 'Solo usuarios involucrados pueden reportar esta entrega' });
    const n = await pool.query(`INSERT INTO incumplimientos(entrega_id,reportado_por,descripcion) VALUES($1,$2,$3) RETURNING *`, [entrega_id, reportado_por, descripcion]);
    res.status(201).json({ mensaje: 'Incumplimiento reportado correctamente', incumplimiento: n.rows[0] });
  } catch (e) { console.error(e); res.status(500).json({ mensaje: 'Error creando incumplimiento' }); }
};

const obtenerIncumplimientos = async (req, res) => {
  try {
    const rol = Number(req.usuario.rol_id); let where = ''; let params = [];
    if (rol === ROLES.PRODUCTOR) { where = 'WHERE pu.productor_id=$1 OR i.reportado_por=$1'; params = [req.usuario.id]; }
    if (rol === ROLES.COMPRADOR) { where = 'WHERE sc.comprador_id=$1 OR i.reportado_por=$1'; params = [req.usuario.id]; }
    const r = await pool.query(`
      SELECT i.id,i.entrega_id,i.descripcion,i.estado,i.aprobado,u.nombre AS reportado_por,
             p.nombre producto, prod.nombre productor, c.nombre comprador
      FROM incumplimientos i
      JOIN usuarios u ON i.reportado_por=u.id
      JOIN entregas e ON i.entrega_id=e.id
      JOIN solicitudes_compra sc ON e.solicitud_id=sc.id
      JOIN publicaciones pu ON sc.publicacion_id=pu.id
      JOIN productos p ON pu.producto_id=p.id
      JOIN usuarios prod ON pu.productor_id=prod.id
      JOIN usuarios c ON sc.comprador_id=c.id
      ${where}
      ORDER BY i.created_at DESC`, params);
    res.json(r.rows);
  } catch (e) { console.error(e); res.status(500).json({ mensaje: 'Error obteniendo incumplimientos' }); }
};

const revisarIncumplimiento = async (req, res) => {
  try {
    const { aprobado } = req.body; const estado = aprobado ? 'APROBADO' : 'RECHAZADO';
    const r = await pool.query('UPDATE incumplimientos SET aprobado=$1, estado=$2 WHERE id=$3 RETURNING *', [!!aprobado, estado, req.params.id]);
    if (!r.rows.length) return res.status(404).json({ mensaje: 'Incumplimiento no encontrado' });
    if (aprobado) {
      const user = r.rows[0].reportado_por;
      const total = Number((await pool.query('SELECT COUNT(*) FROM incumplimientos WHERE reportado_por=$1 AND aprobado=true', [user])).rows[0].count);
      const rep = Math.max(1, 5 - total);
      await pool.query('UPDATE usuarios SET reputacion=$1 WHERE id=$2', [rep, user]);
    }
    res.json({ mensaje: 'Incumplimiento revisado correctamente', incumplimiento: r.rows[0] });
  } catch (e) { console.error(e); res.status(500).json({ mensaje: 'Error revisando incumplimiento' }); }
};

module.exports = { crearIncumplimiento, obtenerIncumplimientos, revisarIncumplimiento };
