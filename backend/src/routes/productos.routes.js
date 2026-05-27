const express = require("express");
const router = express.Router();

const verificarToken = require("../middlewares/auth.middleware");

const {
  obtenerUnidades,
  obtenerProductos,
  crearPublicacion,
  obtenerPublicaciones,
} = require("../controllers/productos.controller");

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Gestión de productos y publicaciones
 */

/**
 * @swagger
 * /productos:
 *   get:
 *     summary: Obtener productos
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos obtenida correctamente
 *       401:
 *         description: Token inválido
 *       500:
 *         description: Error interno
 */

router.get("/productos", verificarToken, obtenerProductos);

/**
 * @swagger
 * /unidades:
 *   get:
 *     summary: Obtener unidades de medida
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de unidades obtenida correctamente
 *       401:
 *         description: Token inválido
 *       500:
 *         description: Error interno
 */

router.get("/unidades", verificarToken, obtenerUnidades);

/**
 * @swagger
 * /publicaciones:
 *   post:
 *     summary: Crear publicación
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - producto_id
 *               - cantidad
 *               - unidad_id
 *               - precio
 *             properties:
 *               producto_id:
 *                 type: integer
 *                 example: 1
 *               cantidad:
 *                 type: number
 *                 example: 100
 *               unidad_id:
 *                 type: integer
 *                 example: 2
 *               precio:
 *                 type: number
 *                 example: 25.50
 *     responses:
 *       201:
 *         description: Publicación creada correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token inválido
 *       500:
 *         description: Error interno
 */

router.post("/publicaciones", verificarToken, crearPublicacion);

/**
 * @swagger
 * /publicaciones:
 *   get:
 *     summary: Obtener publicaciones
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de publicaciones obtenida correctamente
 *       401:
 *         description: Token inválido
 *       500:
 *         description: Error interno
 */

router.get("/publicaciones", verificarToken, obtenerPublicaciones);

module.exports = router;