const pool = require('../config/db');
const q = (sql, p=[]) => pool.query(sql, p);

const obtenerEstadisticas = async (_req,res) => {
  try {
    const tables = ['usuarios','productos','publicaciones','solicitudes_compra','entregas','incumplimientos']; const out = {};
    for (const t of tables) out[t] = Number((await q(`SELECT COUNT(*) FROM ${t}`)).rows[0].count);
    res.json(out);
  } catch(e){ console.error(e); res.status(500).json({mensaje:'Error obteniendo estadísticas'}); }
};
const obtenerUsuarios = async (_req,res) => { try { const r = await q(`SELECT u.id,u.nombre,u.telefono,u.ubicacion,u.username,u.estado,u.reputacion,r.nombre rol,u.rol_id FROM usuarios u LEFT JOIN roles r ON r.id=u.rol_id ORDER BY u.id`); res.json(r.rows); } catch(e){ console.error(e); res.status(500).json({mensaje:'Error obteniendo usuarios'}); } };
const actualizarUsuario = async (req,res) => { try { const {id}=req.params; const {rol_id,estado,nombre,telefono,ubicacion}=req.body; const r=await q(`UPDATE usuarios SET rol_id=COALESCE($1,rol_id), estado=COALESCE($2,estado), nombre=COALESCE($3,nombre), telefono=COALESCE($4,telefono), ubicacion=COALESCE($5,ubicacion) WHERE id=$6 RETURNING id,nombre,telefono,rol_id,estado`,[rol_id,estado,nombre,telefono,ubicacion,id]); res.json({mensaje:'Usuario actualizado',usuario:r.rows[0]}); } catch(e){ console.error(e); res.status(500).json({mensaje:'Error actualizando usuario'}); } };
const obtenerPuntos = async (_req,res) => { try { res.json((await q('SELECT * FROM puntos_entrega WHERE activo=true ORDER BY nombre')).rows); } catch(e){ res.status(500).json({mensaje:'Error obteniendo puntos'}); } };
const crearPunto = async (req,res) => { try { const {nombre,direccion}=req.body; const r=await q('INSERT INTO puntos_entrega(nombre,direccion) VALUES($1,$2) RETURNING *',[nombre,direccion]); res.status(201).json({mensaje:'Punto creado',punto:r.rows[0]}); } catch(e){ res.status(500).json({mensaje:'Error creando punto'}); } };
const historial = async (req,res) => { try { const rol=Number(req.usuario.rol_id); let where=''; let params=[]; if(rol===3){where='WHERE pu.productor_id=$1';params=[req.usuario.id]} if(rol===4){where='WHERE sc.comprador_id=$1';params=[req.usuario.id]} const r=await q(`SELECT p.nombre producto, sc.estado, to_char(sc.created_at,'YYYY-MM-DD') fecha, COALESCE(e.estado,'Negociación') resultado, prod.nombre productor, c.nombre comprador FROM solicitudes_compra sc JOIN publicaciones pu ON pu.id=sc.publicacion_id JOIN productos p ON p.id=pu.producto_id JOIN usuarios prod ON prod.id=pu.productor_id JOIN usuarios c ON c.id=sc.comprador_id LEFT JOIN entregas e ON e.solicitud_id=sc.id ${where} ORDER BY sc.created_at DESC LIMIT 100`,params); res.json(r.rows); } catch(e){ console.error(e); res.status(500).json({mensaje:'Error obteniendo historial'}); } };
module.exports={obtenerEstadisticas,obtenerUsuarios,actualizarUsuario,obtenerPuntos,crearPunto,historial};
