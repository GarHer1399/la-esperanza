const express = require("express");

const router = express.Router();

const verificarToken = require("../middlewares/auth.middleware");

const {
  crearSolicitud,
  obtenerSolicitudes,
  actualizarEstadoSolicitud,
} = require("../controllers/solicitudes.controller");

/**
 * @swagger
 * tags:
 *   name: Solicitudes
 *   description: Gestión de solicitudes de compra
 */

/**
 * @swagger
 * /solicitudes:
 *   post:
 *     summary: Crear solicitud de compra
 *     tags: [Solicitudes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - publicacion_id
 *               - cantidad
 *             properties:
 *               publicacion_id:
 *                 type: integer
 *                 example: 1
 *               cantidad:
 *                 type: number
 *                 example: 50
 *     responses:
 *       201:
 *         description: Solicitud creada correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token inválido
 *       500:
 *         description: Error interno
 */

router.post("/solicitudes", verificarToken, crearSolicitud);

/**
 * @swagger
 * /solicitudes:
 *   get:
 *     summary: Obtener solicitudes
 *     tags: [Solicitudes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de solicitudes obtenida correctamente
 *       401:
 *         description: Token inválido
 *       500:
 *         description: Error interno
 */

router.get("/solicitudes", verificarToken, obtenerSolicitudes);

/**
 * @swagger
 * /solicitudes/{id}/estado:
 *   put:
 *     summary: Actualizar estado de solicitud
 *     tags: [Solicitudes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la solicitud
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *                 example: "aceptada"
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *       401:
 *         description: Token inválido
 *       404:
 *         description: Solicitud no encontrada
 *       500:
 *         description: Error interno
 */

router.put(
  "/solicitudes/:id/estado",
  verificarToken,
  actualizarEstadoSolicitud
);

module.exports = router;