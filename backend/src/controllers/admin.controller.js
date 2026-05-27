const pool = require("../config/db");

const obtenerEstadisticas = async (req, res) => {

  try {

    const usuarios = await pool.query(
      "SELECT COUNT(*) FROM usuarios"
    );

    const productos = await pool.query(
      "SELECT COUNT(*) FROM productos"
    );

    const solicitudes = await pool.query(
      "SELECT COUNT(*) FROM solicitudes_compra"
    );

    const entregas = await pool.query(
      "SELECT COUNT(*) FROM entregas"
    );

    const incumplimientos = await pool.query(
      "SELECT COUNT(*) FROM incumplimientos"
    );

    res.json({

      usuarios:
        usuarios.rows[0].count,

      productos:
        productos.rows[0].count,

      solicitudes:
        solicitudes.rows[0].count,

      entregas:
        entregas.rows[0].count,

      incumplimientos:
        incumplimientos.rows[0].count

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje:
        "Error obteniendo estadísticas"
    });
  }
};

module.exports = {
  obtenerEstadisticas
};