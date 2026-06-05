const pool = require('../config/db');
const { ROLES } = require('../middlewares/roles.middleware');

const crearEntrega = async (req, res) => {
  try {
    const { solicitud_id, punto_entrega_id, fecha_entrega, hora_entrega, cantidad_entregada } = req.body;
    if (!solicitud_id || !punto_entrega_id || !fecha_entrega || !hora_entrega || !cantidad_entregada) return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
    const s = await pool.query(`SELECT sc.*, pu.productor_id FROM solicitudes_compra sc JOIN publicaciones pu ON sc.publicacion_id=pu.id WHERE sc.id=$1`, [solicitud_id]);
    if (!s.rows.length) return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
    if (s.rows[0].estado !== 'ACEPTADA') return res.status(400).json({ mensaje: 'Solo se puede programar entrega de solicitudes aceptadas' });
    if (![ROLES.ADMIN, ROLES.OPERADOR].includes(Number(req.usuario.rol_id)) && Number(s.rows[0].productor_id) !== Number(req.usuario.id)) return res.status(403).json({ mensaje: 'Solo el productor dueño puede programar esta entrega' });
    const r = await pool.query(`INSERT INTO entregas(solicitud_id,punto_entrega_id,fecha_entrega,hora_entrega,cantidad_entregada) VALUES($1,$2,$3,$4,$5) RETURNING *`, [solicitud_id,punto_entrega_id,fecha_entrega,hora_entrega,cantidad_entregada]);
    await pool.query("UPDATE solicitudes_compra SET estado='EN COORDINACION' WHERE id=$1", [solicitud_id]);
    res.status(201).json({ mensaje: 'Entrega programada correctamente', entrega: r.rows[0] });
  } catch (e) { console.error(e); res.status(500).json({ mensaje: 'Error creando entrega' }); }
};

const obtenerEntregas = async (req, res) => {
  try {
    const rol = Number(req.usuario.rol_id); let where = ''; let params = [];
    if (rol === ROLES.PRODUCTOR) { where = 'WHERE pu.productor_id=$1'; params = [req.usuario.id]; }
    if (rol === ROLES.COMPRADOR) { where = 'WHERE sc.comprador_id=$1'; params = [req.usuario.id]; }
    const r = await pool.query(`
      SELECT e.id,e.solicitud_id,p.nombre producto,prod.nombre productor,c.nombre comprador,
             sc.comprador_id,pu.productor_id,e.fecha_entrega,e.hora_entrega,e.cantidad_entregada,
             e.estado,pe.nombre punto_entrega,e.confirmacion_productor,e.validacion_comprador
      FROM entregas e
      JOIN solicitudes_compra sc ON e.solicitud_id=sc.id
      JOIN publicaciones pu ON sc.publicacion_id=pu.id
      JOIN productos p ON pu.producto_id=p.id
      JOIN usuarios prod ON pu.productor_id=prod.id
      JOIN usuarios c ON sc.comprador_id=c.id
      JOIN puntos_entrega pe ON e.punto_entrega_id=pe.id
      ${where}
      ORDER BY e.created_at DESC`, params);
    res.json(r.rows);
  } catch (e) { console.error(e); res.status(500).json({ mensaje: 'Error obteniendo entregas' }); }
};

const confirmarProductor = async (req, res) => {
  try {
    const e = await pool.query(`SELECT e.*, pu.productor_id FROM entregas e JOIN solicitudes_compra sc ON e.solicitud_id=sc.id JOIN publicaciones pu ON sc.publicacion_id=pu.id WHERE e.id=$1`, [req.params.id]);
    if (!e.rows.length) return res.status(404).json({ mensaje: 'Entrega no encontrada' });
    if (Number(req.usuario.rol_id) !== ROLES.ADMIN && Number(e.rows[0].productor_id) !== Number(req.usuario.id)) return res.status(403).json({ mensaje: 'Solo el productor puede confirmar esta entrega' });
    const r = await pool.query(`UPDATE entregas SET confirmacion_productor=true, estado=CASE WHEN validacion_comprador THEN 'VALIDADA' ELSE 'REALIZADA' END WHERE id=$1 RETURNING *`, [req.params.id]);
    res.json({ mensaje: 'Entrega confirmada por productor', entrega: r.rows[0] });
  } catch (e) { console.error(e); res.status(500).json({ mensaje: 'Error confirmando entrega' }); }
};

const validarComprador = async (req, res) => {
  try {
    const e = await pool.query(`SELECT e.*, sc.comprador_id FROM entregas e JOIN solicitudes_compra sc ON e.solicitud_id=sc.id WHERE e.id=$1`, [req.params.id]);
    if (!e.rows.length) return res.status(404).json({ mensaje: 'Entrega no encontrada' });
    if (Number(req.usuario.rol_id) !== ROLES.ADMIN && Number(e.rows[0].comprador_id) !== Number(req.usuario.id)) return res.status(403).json({ mensaje: 'Solo el comprador puede validar esta entrega' });
    const r = await pool.query(`UPDATE entregas SET validacion_comprador=true, estado=CASE WHEN confirmacion_productor THEN 'VALIDADA' ELSE 'RECIBIDA' END WHERE id=$1 RETURNING *`, [req.params.id]);
    if (r.rows[0]?.estado === 'VALIDADA') await pool.query(`UPDATE solicitudes_compra SET estado='ENTREGADA' WHERE id=$1`, [r.rows[0].solicitud_id]);
    res.json({ mensaje: 'Entrega validada por comprador', entrega: r.rows[0] });
  } catch (e) { console.error(e); res.status(500).json({ mensaje: 'Error validando entrega' }); }
};

module.exports = { crearEntrega, obtenerEntregas, confirmarProductor, validarComprador };
