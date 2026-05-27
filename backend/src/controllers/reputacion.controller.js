const pool = require("../config/db");

const obtenerReputaciones = async (req, res) => {
  try {
    const usuarios = await pool.query(`
      SELECT
        usuarios.id,
        usuarios.nombre,
        roles.nombre AS rol,
        usuarios.reputacion,
        COUNT(incumplimientos.id) AS incumplimientos_aprobados
      FROM usuarios
      INNER JOIN roles
        ON usuarios.rol_id = roles.id
      LEFT JOIN incumplimientos
        ON incumplimientos.reportado_por = usuarios.id
        AND incumplimientos.aprobado = true
      GROUP BY usuarios.id, roles.nombre
      ORDER BY usuarios.reputacion DESC
    `);

    res.json(usuarios.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error obteniendo reputaciones"
    });
  }
};

const recalcularReputacion = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    const reportes = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM incumplimientos
      WHERE reportado_por = $1
      AND aprobado = true
      `,
      [usuario_id]
    );

    const total = Number(reportes.rows[0].total);

    let reputacion = 5.0;

    if (total === 1) reputacion = 4.0;
    if (total === 2) reputacion = 3.0;
    if (total === 3) reputacion = 2.0;
    if (total >= 4) reputacion = 1.0;

    const usuarioActualizado = await pool.query(
      `
      UPDATE usuarios
      SET reputacion = $1
      WHERE id = $2
      RETURNING id, nombre, reputacion
      `,
      [reputacion, usuario_id]
    );

    res.json({
      mensaje: "Reputación recalculada correctamente",
      usuario: usuarioActualizado.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error recalculando reputación"
    });
  }
};

module.exports = {
  obtenerReputaciones,
  recalcularReputacion
};