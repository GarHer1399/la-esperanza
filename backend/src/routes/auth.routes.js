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
 *     tags: [Autenticación]
 */
router.post("/register", registrarUsuario);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Autenticación]
 */
router.post("/login", loginUsuario);

module.exports = router;