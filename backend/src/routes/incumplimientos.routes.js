const express = require("express");

const router = express.Router();

const verificarToken = require("../middlewares/auth.middleware");

const {
  crearIncumplimiento,
  obtenerIncumplimientos,
  revisarIncumplimiento,
} = require("../controllers/incumplimientos.controller");


/**
 * @swagger
 * tags:
 *   name: Incumplimientos
 *   description: Gestión de incumplimientos
 */

/**
 * @swagger
 * /incumplimientos:
 *   post:
 *     summary: Crear incumplimiento
 *     tags: [Incumplimientos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - entrega_id
 *               - descripcion
 *             properties:
 *               entrega_id:
 *                 type: integer
 *                 example: 1
 *               descripcion:
 *                 type: string
 *                 example: "El producto no fue entregado"
 *     responses:
 *       201:
 *         description: Incumplimiento creado correctamente
 *       401:
 *         description: Token inválido
 *       500:
 *         description: Error interno
 */
router.post(
  "/incumplimientos",
  verificarToken,
  crearIncumplimiento
);


/**
 * @swagger
 * /incumplimientos:
 *   get:
 *     summary: Obtener incumplimientos
 *     tags: [Incumplimientos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de incumplimientos
 *       401:
 *         description: Token inválido
 *       500:
 *         description: Error interno
 */

router.get(
  "/incumplimientos",
  verificarToken,
  obtenerIncumplimientos
);


/**
 * @swagger
 * /incumplimientos/{id}/revisar:
 *   put:
 *     summary: Revisar incumplimiento
 *     tags: [Incumplimientos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del incumplimiento
 *     responses:
 *       200:
 *         description: Incumplimiento revisado correctamente
 *       401:
 *         description: Token inválido
 *       404:
 *         description: Incumplimiento no encontrado
 *       500:
 *         description: Error interno
 */

router.put(
  "/incumplimientos/:id/revisar",
  verificarToken,
  revisarIncumplimiento
);

module.exports = router;