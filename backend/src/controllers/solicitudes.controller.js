const pool = require('../config/db');
const { ROLES } = require('../middlewares/roles.middleware');

const crearSolicitud = async (req, res) => {
  try {
    const comprador_id = req.usuario.id;
    const { publicacion_id, cantidad_solicitada } = req.body;
    if (!publicacion_id || !cantidad_solicitada) return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
    const pub = await pool.query('SELECT * FROM publicaciones WHERE id=$1 AND estado=$2', [publicacion_id, 'DISPONIBLE']);
    if (!pub.rows.length) return res.status(404).json({ mensaje: 'La publicación no existe o no está disponible' });
    if (Number(cantidad_solicitada) <= 0) return res.status(400).json({ mensaje: 'Cantidad inválida' });
    if (Number(cantidad_solicitada) > Number(pub.rows[0].cantidad)) return res.status(400).json({ mensaje: 'Stock insuficiente' });
    const nueva = await pool.query(
      `INSERT INTO solicitudes_compra(publicacion_id,comprador_id,cantidad_solicitada) VALUES($1,$2,$3) RETURNING *`,
      [publicacion_id, comprador_id, cantidad_solicitada]
    );
    res.status(201).json({ mensaje: 'Solicitud enviada exitosamente', solicitud: nueva.rows[0] });
  } catch (e) { console.error(e); res.status(500).json({ mensaje: 'Error creando solicitud' }); }
};

const obtenerSolicitudes = async (req, res) => {
  try {
    const rol = Number(req.usuario.rol_id); let where = ''; let params = [];
    if (rol === ROLES.PRODUCTOR) { where = 'WHERE pub.productor_id=$1'; params = [req.usuario.id]; }
    if (rol === ROLES.COMPRADOR) { where = 'WHERE sc.comprador_id=$1'; params = [req.usuario.id]; }
    const r = await pool.query(`
      SELECT sc.id, sc.publicacion_id, pub.productor_id, sc.comprador_id, p.nombre AS producto,
             c.nombre AS comprador, prod.nombre AS productor, sc.cantidad_solicitada, sc.precio_final,
             sc.estado, sc.created_at
      FROM solicitudes_compra sc
      JOIN publicaciones pub ON sc.publicacion_id=pub.id
      JOIN productos p ON pub.producto_id=p.id
      JOIN usuarios c ON sc.comprador_id=c.id
      JOIN usuarios prod ON pub.productor_id=prod.id
      ${where}
      ORDER BY sc.created_at DESC`, params);
    res.json(r.rows);
  } catch (e) { console.error(e); res.status(500).json({ mensaje: 'Error obteniendo solicitudes' }); }
};

const actualizarEstadoSolicitud = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params; const estado = String(req.body.estado || '').toUpperCase();
    if (!['ACEPTADA','RECHAZADA','CANCELADA'].includes(estado)) return res.status(400).json({ mensaje: 'Estado no permitido' });
    await client.query('BEGIN');
    const sdb = await client.query(`SELECT sc.*, pub.productor_id, pub.cantidad stock_actual FROM solicitudes_compra sc JOIN publicaciones pub ON sc.publicacion_id=pub.id WHERE sc.id=$1 FOR UPDATE`, [id]);
    if (!sdb.rows.length) { await client.query('ROLLBACK'); return res.status(404).json({ mensaje: 'Solicitud no encontrada' }); }
    const s = sdb.rows[0]; const rol = Number(req.usuario.rol_id);
    if ((estado === 'ACEPTADA' || estado === 'RECHAZADA') && rol !== ROLES.ADMIN && Number(s.productor_id) !== Number(req.usuario.id)) {
      await client.query('ROLLBACK'); return res.status(403).json({ mensaje: 'Solo el productor dueño puede aceptar o rechazar esta solicitud' });
    }
    if (estado === 'CANCELADA' && rol !== ROLES.ADMIN && Number(s.comprador_id) !== Number(req.usuario.id)) {
      await client.query('ROLLBACK'); return res.status(403).json({ mensaje: 'Solo el comprador puede cancelar su solicitud' });
    }
    if (estado === 'ACEPTADA' && s.estado !== 'ACEPTADA') {
      if (Number(s.cantidad_solicitada) > Number(s.stock_actual)) { await client.query('ROLLBACK'); return res.status(400).json({ mensaje: 'Stock insuficiente para aceptar' }); }
      await client.query('UPDATE publicaciones SET cantidad=cantidad-$1 WHERE id=$2', [s.cantidad_solicitada, s.publicacion_id]);
    }
    const act = await client.query('UPDATE solicitudes_compra SET estado=$1 WHERE id=$2 RETURNING *', [estado, id]);
    await client.query('COMMIT');
    res.json({ mensaje: 'Estado actualizado correctamente', solicitud: act.rows[0] });
  } catch (e) { await client.query('ROLLBACK'); console.error(e); res.status(500).json({ mensaje: 'Error actualizando solicitud' }); }
  finally { client.release(); }
};

module.exports = { crearSolicitud, obtenerSolicitudes, actualizarEstadoSolicitud };
