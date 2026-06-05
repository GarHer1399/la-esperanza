const pool = require('../config/db');
const { ROLES } = require('../middlewares/roles.middleware');

const obtenerUnidades = async (_req, res) => {
  try { res.json((await pool.query('SELECT * FROM unidades_medida ORDER BY nombre ASC')).rows); }
  catch (e) { console.error(e); res.status(500).json({ mensaje: 'Error obteniendo unidades' }); }
};

const obtenerProductos = async (_req, res) => {
  try { res.json((await pool.query('SELECT * FROM productos WHERE activo=true ORDER BY nombre ASC')).rows); }
  catch (e) { console.error(e); res.status(500).json({ mensaje: 'Error obteniendo productos' }); }
};

const crearPublicacion = async (req, res) => {
  try {
    const productor_id = req.usuario.id;
    const { producto_id, unidad_id, cantidad, precio_referencial, descripcion } = req.body;
    if (!producto_id || !unidad_id || !cantidad || !precio_referencial) return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
    if (Number(cantidad) <= 0 || Number(precio_referencial) <= 0) return res.status(400).json({ mensaje: 'Cantidad y precio deben ser mayores a cero' });
    const nueva = await pool.query(
      `INSERT INTO publicaciones(productor_id,producto_id,unidad_id,cantidad,precio_referencial,descripcion)
       VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
      [productor_id, producto_id, unidad_id, cantidad, precio_referencial, descripcion]
    );
    res.status(201).json({ mensaje: 'Publicación creada exitosamente', publicacion: nueva.rows[0] });
  } catch (e) { console.error(e); res.status(500).json({ mensaje: 'Error creando publicación' }); }
};

const obtenerPublicaciones = async (req, res) => {
  try {
    const filtro = Number(req.usuario.rol_id) === ROLES.PRODUCTOR ? 'WHERE pu.productor_id=$1' : "WHERE pu.estado='DISPONIBLE'";
    const params = Number(req.usuario.rol_id) === ROLES.PRODUCTOR ? [req.usuario.id] : [];
    const r = await pool.query(`
      SELECT pu.id, pu.productor_id, pr.nombre AS producto, pu.cantidad, pu.precio_referencial,
             pu.estado, pu.descripcion, um.nombre AS unidad, u.nombre AS productor, u.reputacion
      FROM publicaciones pu
      JOIN productos pr ON pu.producto_id=pr.id
      JOIN unidades_medida um ON pu.unidad_id=um.id
      JOIN usuarios u ON pu.productor_id=u.id
      ${filtro}
      ORDER BY pu.created_at DESC`, params);
    res.json(r.rows);
  } catch (e) { console.error(e); res.status(500).json({ mensaje: 'Error obteniendo publicaciones' }); }
};

module.exports = { obtenerUnidades, obtenerProductos, crearPublicacion, obtenerPublicaciones };
