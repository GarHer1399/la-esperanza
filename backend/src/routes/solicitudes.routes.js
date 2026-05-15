const express = require("express");

const router = express.Router();

const {
  crearSolicitud,
  obtenerSolicitudes,
  actualizarEstadoSolicitud
} = require("../controllers/solicitudes.controller");

router.post("/solicitudes", crearSolicitud);

router.get("/solicitudes", obtenerSolicitudes);

router.put(
  "/solicitudes/:id/estado",
  actualizarEstadoSolicitud
);

module.exports = router;