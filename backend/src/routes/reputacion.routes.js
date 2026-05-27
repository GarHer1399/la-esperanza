const express = require("express");

const router = express.Router();

const {
  obtenerReputaciones,
  recalcularReputacion
} = require("../controllers/reputacion.controller");

/**
 * @swagger
 * tags:
 *   name: Reputación
 *   description: Gestión de reputaciones de usuarios
 */

/**
 * @swagger
 * /reputaciones:
 *   get:
 *     summary: Obtener reputaciones
 *     tags: [Reputación]
 *     responses:
 *       200:
 *         description: Lista de reputaciones obtenida correctamente
 *       500:
 *         description: Error interno del servidor
 */

router.get("/reputaciones", obtenerReputaciones);

/**
 * @swagger
 * /reputaciones/{usuario_id}/recalcular:
 *   put:
 *     summary: Recalcular reputación de un usuario
 *     tags: [Reputación]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Reputación recalculada correctamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */

router.put(
  "/reputaciones/:usuario_id/recalcular",
  recalcularReputacion
);

module.exports = router;