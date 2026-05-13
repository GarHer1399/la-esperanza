const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registrarUsuario = async (req, res) => {
  try {
    const { nombre, telefono, ubicacion, username, password, rol_id } = req.body;

    if (!nombre || !telefono || !username || !password || !rol_id) {
      return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
    }

    const existe = await pool.query(
      "SELECT * FROM usuarios WHERE telefono = $1 OR username = $2",
      [telefono, username]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({ mensaje: "El usuario ya existe" });
    }

    const passwordEncriptada = await bcrypt.hash(password, 10);

    const nuevoUsuario = await pool.query(
      `INSERT INTO usuarios 
      (nombre, telefono, ubicacion, username, password, rol_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, nombre, telefono, ubicacion, username, rol_id, estado, reputacion`,
      [nombre, telefono, ubicacion, username, passwordEncriptada, rol_id]
    );

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario: nuevoUsuario.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

const loginUsuario = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ mensaje: "Usuario y contraseña requeridos" });
    }

    const usuarioDB = await pool.query(
      `SELECT usuarios.*, roles.nombre AS rol
       FROM usuarios
       INNER JOIN roles ON usuarios.rol_id = roles.id
       WHERE username = $1`,
      [username]
    );

    if (usuarioDB.rows.length === 0) {
      return res.status(400).json({ mensaje: "Credenciales inválidas" });
    }

    const usuario = usuarioDB.rows[0];

    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return res.status(400).json({ mensaje: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        username: usuario.username,
        rol: usuario.rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        username: usuario.username,
        rol: usuario.rol,
        reputacion: usuario.reputacion,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

module.exports = {
  registrarUsuario,
  loginUsuario,
};