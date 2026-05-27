const express = require("express");

const router = express.Router();

const verificarToken = require("../middlewares/auth.middleware");

const {
  crearEntrega,
  obtenerEntregas,
} = require("../controllers/entregas.controller");

/**
 * @swagger
 * tags:
 *   name: Entregas
 *   description: Gestión de entregas
 */

/**
 * @swagger
 * /entregas:
 *   post:
 *     summary: Crear una entrega
 *     tags: [Entregas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - solicitud_id
 *               - punto_entrega_id
 *               - fecha_entrega
 *               - hora_entrega
 *               - cantidad_entregada
 *             properties:
 *               solicitud_id:
 *                 type: integer
 *                 example: 1
 *               punto_entrega_id:
 *                 type: integer
 *                 example: 2
 *               fecha_entrega:
 *                 type: string
 *                 example: "2026-06-10"
 *               hora_entrega:
 *                 type: string
 *                 example: "15:30"
 *               cantidad_entregada:
 *                 type: number
 *                 example: 20
 *     responses:
 *       201:
 *         description: Entrega creada correctamente
 *       401:
 *         description: Token inválido
 *       500:
 *         description: Error del servidor
 */

router.post("/entregas", verificarToken, crearEntrega);

/**
 * @swagger
 * /entregas:
 *   get:
 *     summary: Obtener todas las entregas
 *     tags: [Entregas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de entregas
 *       401:
 *         description: Token requerido
 *       500:
 *         description: Error interno
 */

router.get("/entregas", verificarToken, obtenerEntregas);

module.exports = router;