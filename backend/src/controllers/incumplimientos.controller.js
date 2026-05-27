const pool = require("../config/db");

const crearIncumplimiento = async (req, res) => {

  try {

    const {
      entrega_id,
      reportado_por,
      descripcion
    } = req.body;

    if (
      !entrega_id ||
      !reportado_por ||
      !descripcion
    ) {
      return res.status(400).json({
        mensaje: "Faltan datos obligatorios"
      });
    }

    const nuevoReporte = await pool.query(
      `
      INSERT INTO incumplimientos
      (
        entrega_id,
        reportado_por,
        descripcion
      )
      VALUES ($1,$2,$3)
      RETURNING *
      `,
      [
        entrega_id,
        reportado_por,
        descripcion
      ]
    );

    res.status(201).json({
      mensaje: "Incumplimiento reportado correctamente",
      incumplimiento: nuevoReporte.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error creando incumplimiento"
    });
  }
};

const obtenerIncumplimientos = async (req, res) => {

  try {

    const incumplimientos = await pool.query(`
      SELECT
        incumplimientos.id,
        incumplimientos.descripcion,
        incumplimientos.estado,
        incumplimientos.aprobado,
        usuarios.nombre AS reportado_por
      FROM incumplimientos
      INNER JOIN usuarios
        ON incumplimientos.reportado_por = usuarios.id
      ORDER BY incumplimientos.created_at DESC
    `);

    res.json(incumplimientos.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error obteniendo incumplimientos"
    });
  }
};

const revisarIncumplimiento = async (req, res) => {

  try {

    const { id } = req.params;

    const { aprobado } = req.body;

    const incumplimiento = await pool.query(
      `
      UPDATE incumplimientos
      SET aprobado = $1,
          estado = 'REVISADO'
      WHERE id = $2
      RETURNING *
      `,
      [aprobado, id]
    );

    res.json({
      mensaje: "Incumplimiento revisado",
      incumplimiento: incumplimiento.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error revisando incumplimiento"
    });
  }
};

module.exports = {
  crearIncumplimiento,
  obtenerIncumplimientos,
  revisarIncumplimiento
};