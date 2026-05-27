const pool = require("../config/db");

const crearSolicitud = async (req, res) => {
  try {
    const { publicacion_id, comprador_id, cantidad_solicitada } = req.body;

    if (!publicacion_id || !comprador_id || !cantidad_solicitada) {
      return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
    }

    const publicacionDB = await pool.query("SELECT * FROM publicaciones WHERE id = $1", [publicacion_id]);
    if (publicacionDB.rows.length === 0) return res.status(404).json({ mensaje: "La publicación no existe" });

    const publicacion = publicacionDB.rows[0];
    if (Number(cantidad_solicitada) > Number(publicacion.cantidad)) {
      return res.status(400).json({ mensaje: "Stock insuficiente" });
    }

    const nuevaSolicitud = await pool.query(
      `INSERT INTO solicitudes_compra (publicacion_id, comprador_id, cantidad_solicitada)
       VALUES ($1, $2, $3) RETURNING *`,
      [publicacion_id, comprador_id, cantidad_solicitada]
    );

    res.status(201).json({ mensaje: "Solicitud enviada exitosamente", solicitud: nuevaSolicitud.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error creando solicitud" });
  }
};

const obtenerSolicitudes = async (req, res) => {
  try {
    const solicitudes = await pool.query(`
      SELECT solicitudes_compra.id, productos.nombre AS producto, usuarios.nombre AS comprador,
             solicitudes_compra.cantidad_solicitada, solicitudes_compra.estado, solicitudes_compra.created_at
      FROM solicitudes_compra
      INNER JOIN publicaciones ON solicitudes_compra.publicacion_id = publicaciones.id
      INNER JOIN productos ON publicaciones.producto_id = productos.id
      INNER JOIN usuarios ON solicitudes_compra.comprador_id = usuarios.id
      ORDER BY solicitudes_compra.created_at DESC
    `);
    res.json(solicitudes.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error obteniendo solicitudes" });
  }
};

const actualizarEstadoSolicitud = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const estado = String(req.body.estado || "").toUpperCase();

    if (!["ACEPTADA", "RECHAZADA", "CANCELADA"].includes(estado)) {
      return res.status(400).json({ mensaje: "Estado no permitido" });
    }

    await client.query("BEGIN");

    const solicitudDB = await client.query(
      `SELECT sc.*, p.cantidad AS stock_actual
       FROM solicitudes_compra sc
       INNER JOIN publicaciones p ON sc.publicacion_id = p.id
       WHERE sc.id = $1 FOR UPDATE`,
      [id]
    );

    if (solicitudDB.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ mensaje: "Solicitud no encontrada" });
    }

    const solicitud = solicitudDB.rows[0];

    if (estado === "ACEPTADA") {
      if (Number(solicitud.cantidad_solicitada) > Number(solicitud.stock_actual)) {
        await client.query("ROLLBACK");
        return res.status(400).json({ mensaje: "Stock insuficiente para aceptar" });
      }

      await client.query(
        "UPDATE publicaciones SET cantidad = cantidad - $1 WHERE id = $2",
        [solicitud.cantidad_solicitada, solicitud.publicacion_id]
      );
    }

    const solicitudActualizada = await client.query(
      "UPDATE solicitudes_compra SET estado = $1 WHERE id = $2 RETURNING *",
      [estado, id]
    );

    await client.query("COMMIT");
    res.json({ mensaje: "Estado actualizado correctamente", solicitud: solicitudActualizada.rows[0] });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ mensaje: "Error actualizando solicitud" });
  } finally {
    client.release();
  }
};

module.exports = { crearSolicitud, obtenerSolicitudes, actualizarEstadoSolicitud };
