const pool = require("../config/db");

const obtenerProductos = async (req, res) => {
  try {
    const productos = await pool.query(
      "SELECT * FROM productos WHERE activo = true ORDER BY nombre ASC"
    );

    res.json(productos.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error obteniendo productos",
    });
  }
};

const crearPublicacion = async (req, res) => {
  try {
    const {
      productor_id,
      producto_id,
      unidad_id,
      cantidad,
      precio_referencial,
      descripcion,
    } = req.body;

    if (
      !productor_id ||
      !producto_id ||
      !unidad_id ||
      !cantidad ||
      !precio_referencial
    ) {
      return res.status(400).json({
        mensaje: "Faltan datos obligatorios",
      });
    }

    const nuevaPublicacion = await pool.query(
      `
      INSERT INTO publicaciones
      (
        productor_id,
        producto_id,
        unidad_id,
        cantidad,
        precio_referencial,
        descripcion
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        productor_id,
        producto_id,
        unidad_id,
        cantidad,
        precio_referencial,
        descripcion,
      ]
    );

    res.status(201).json({
      mensaje: "Publicación creada exitosamente",
      publicacion: nuevaPublicacion.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error creando publicación",
    });
  }
};

const obtenerPublicaciones = async (req, res) => {
  try {
    const publicaciones = await pool.query(`
      SELECT
        publicaciones.id,
        productos.nombre AS producto,
        publicaciones.cantidad,
        publicaciones.precio_referencial,
        publicaciones.estado,
        publicaciones.descripcion,
        unidades_medida.nombre AS unidad,
        usuarios.nombre AS productor
      FROM publicaciones
      INNER JOIN productos
        ON publicaciones.producto_id = productos.id
      INNER JOIN unidades_medida
        ON publicaciones.unidad_id = unidades_medida.id
      INNER JOIN usuarios
        ON publicaciones.productor_id = usuarios.id
      ORDER BY publicaciones.created_at DESC
    `);

    res.json(publicaciones.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error obteniendo publicaciones",
    });
  }
};

module.exports = {
  obtenerProductos,
  crearPublicacion,
  obtenerPublicaciones,
};