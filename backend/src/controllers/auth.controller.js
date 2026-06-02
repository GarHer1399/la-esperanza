const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registrarUsuario = async (req, res) => {

  try {

    const {
      nombre,
      telefono,
      ubicacion,
      username,
      password,
      rol_id
    } = req.body;

    if (
      !nombre ||
      !telefono ||
      !username ||
      !password ||
      !rol_id
    ) {
      return res.status(400).json({
        mensaje: "Faltan datos obligatorios"
      });
    }

    const usuarioExiste = await pool.query(
      `
      SELECT * FROM usuarios
      WHERE username = $1
      `,
      [username]
    );

    if (usuarioExiste.rows.length > 0) {
      return res.status(400).json({
        mensaje: "El usuario ya existe"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await pool.query(
      `
      INSERT INTO usuarios
      (
        nombre,
        telefono,
        ubicacion,
        username,
        password,
        rol_id
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [
        nombre,
        telefono,
        ubicacion,
        username,
        hashedPassword,
        rol_id
      ]
    );

    res.status(201).json({
      mensaje: "Usuario registrado",
      usuario: nuevoUsuario.rows[0]
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      mensaje: "Error en el servidor"
    });

  }

};

const loginUsuario = async (req, res) => {

  try {

    const {
      username,
      password
    } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        mensaje: "Usuario y contraseña requeridos"
      });
    }

    const usuario = await pool.query(
      `
      SELECT *
      FROM usuarios
      WHERE username = $1
      `,
      [username]
    );

    if (usuario.rows.length === 0) {
      return res.status(400).json({
        mensaje: "Credenciales inválidas"
      });
    }

    const usuarioEncontrado = usuario.rows[0];

    const passwordValida = await bcrypt.compare(
      password,
      usuarioEncontrado.password
    );

    if (!passwordValida) {
      return res.status(400).json({
        mensaje: "Credenciales inválidas"
      });
    }

    const token = jwt.sign(
      {
        id: usuarioEncontrado.id,
        rol_id: usuarioEncontrado.rol_id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h"
      }
    );

    res.json({
      mensaje: "Login exitoso",
      token,
      usuario: usuarioEncontrado
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      mensaje: "Error en el servidor"
    });

  }

};

module.exports = {
  registrarUsuario,
  loginUsuario
};