const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const safeUser = (u) => {
  const { password, ...rest } = u;
  return rest;
};

const registrarUsuario = async (req, res) => {
  try {
    const { nombre, telefono, ubicacion, username, password, rol_id } = req.body;
    if (!nombre || !telefono || !username || !password || !rol_id) {
      return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
    }
    const existe = await pool.query('SELECT id FROM usuarios WHERE username=$1 OR telefono=$2', [username, telefono]);
    if (existe.rows.length) return res.status(400).json({ mensaje: 'El usuario o teléfono ya existe' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevo = await pool.query(
      `INSERT INTO usuarios(nombre, telefono, ubicacion, username, password, rol_id)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING id,nombre,telefono,ubicacion,username,rol_id,estado,reputacion,created_at`,
      [nombre, telefono, ubicacion, username, hashedPassword, rol_id]
    );
    res.status(201).json({ mensaje: 'Usuario registrado', usuario: nuevo.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

const loginUsuario = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ mensaje: 'Usuario y contraseña requeridos' });
    const usuario = await pool.query(
      `SELECT u.*, r.nombre AS rol FROM usuarios u JOIN roles r ON r.id=u.rol_id WHERE u.username=$1`,
      [username]
    );
    if (!usuario.rows.length) return res.status(400).json({ mensaje: 'Credenciales inválidas' });
    const u = usuario.rows[0];
    if (!u.estado) return res.status(403).json({ mensaje: 'Usuario inactivo. Contacta a la asociación.' });
    const ok = await bcrypt.compare(password, u.password);
    if (!ok) return res.status(400).json({ mensaje: 'Credenciales inválidas' });
    const token = jwt.sign({ id: u.id, rol_id: u.rol_id, username: u.username }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ mensaje: 'Login exitoso', token, usuario: safeUser(u) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

module.exports = { registrarUsuario, loginUsuario };
