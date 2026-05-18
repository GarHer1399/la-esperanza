const pool = require("../config/db");

const crearEntrega = async (req, res) => {
  try {

    const {
      solicitud_id,
      punto_entrega_id,
      fecha_entrega,
      hora_entrega,
      cantidad_entregada
    } = req.body;

    if (
      !solicitud_id ||
      !punto_entrega_id ||
      !fecha_entrega ||
      !hora_entrega ||
      !cantidad_entregada
    ) {
      return res.status(400).json({
        mensaje: "Faltan datos obligatorios"
      });
    }

    const nuevaEntrega = await pool.query(
      `
      INSERT INTO entregas
      (
        solicitud_id,
        punto_entrega_id,
        fecha_entrega,
        hora_entrega,
        cantidad_entregada
      )
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *
      `,
      [
        solicitud_id,
        punto_entrega_id,
        fecha_entrega,
        hora_entrega,
        cantidad_entregada
      ]
    );

    res.status(201).json({
      mensaje: "Entrega programada correctamente",
      entrega: nuevaEntrega.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error creando entrega"
    });
  }
};

const obtenerEntregas = async (req, res) => {

  try {

    const entregas = await pool.query(`
      SELECT
        entregas.id,
        productos.nombre AS producto,
        usuarios.nombre AS comprador,
        entregas.fecha_entrega,
        entregas.hora_entrega,
        entregas.estado,
        puntos_entrega.nombre AS punto_entrega
      FROM entregas
      INNER JOIN solicitudes_compra
        ON entregas.solicitud_id = solicitudes_compra.id
      INNER JOIN publicaciones
        ON solicitudes_compra.publicacion_id = publicaciones.id
      INNER JOIN productos
        ON publicaciones.producto_id = productos.id
      INNER JOIN usuarios
        ON solicitudes_compra.comprador_id = usuarios.id
      INNER JOIN puntos_entrega
        ON entregas.punto_entrega_id = puntos_entrega.id
      ORDER BY entregas.created_at DESC
    `);

    res.json(entregas.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error obteniendo entregas"
    });
  }
};

module.exports = {
  crearEntrega,
  obtenerEntregas
};