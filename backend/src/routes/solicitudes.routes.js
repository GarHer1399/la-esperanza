const express = require("express");

const router = express.Router();

const verificarToken = require("../middlewares/auth.middleware");

const {
  crearSolicitud,
  obtenerSolicitudes,
  actualizarEstadoSolicitud,
} = require("../controllers/solicitudes.controller");

router.post("/solicitudes", verificarToken, crearSolicitud);

router.get("/solicitudes", verificarToken, obtenerSolicitudes);

router.put(
  "/solicitudes/:id/estado",
  verificarToken,
  actualizarEstadoSolicitud
);

module.exports = router;