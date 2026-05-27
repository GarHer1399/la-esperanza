const express = require("express");

const router = express.Router();

const {
  obtenerEstadisticas
} = require(
  "../controllers/admin.controller"
);

/**
 * @swagger
 * /admin/estadisticas:
 *   get:
 *     summary: Obtener estadísticas administrativas
 *     description: Retorna estadísticas generales del sistema
 *     tags:
 *       - Administración
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas correctamente
 *       500:
 *         description: Error interno del servidor
 */

router.get(
  "/admin/estadisticas",
  obtenerEstadisticas
);

module.exports = router;