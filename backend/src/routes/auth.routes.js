const express = require("express");
const router = express.Router();

const {
  registrarUsuario,
  loginUsuario,
} = require("../controllers/auth.controller");

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - telefono
 *               - username
 *               - password
 *               - rol_id
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan Pérez
 *               telefono:
 *                 type: string
 *                 example: "55555555"
 *               ubicacion:
 *                 type: string
 *                 example: Guatemala
 *               username:
 *                 type: string
 *                 example: juan123
 *               password:
 *                 type: string
 *                 example: "123456"
 *               rol_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Faltan datos obligatorios o el usuario ya existe
 *       500:
 *         description: Error en el servidor
 */
router.post("/register", registrarUsuario);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: juan123
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login exitoso
 *       400:
 *         description: Usuario y contraseña requeridos o credenciales inválidas
 *       500:
 *         description: Error en el servidor
 */

router.post("/register", registrarUsuario);
router.post("/login", loginUsuario);

module.exports = router;