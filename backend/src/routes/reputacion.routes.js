const express = require("express");

const router = express.Router();

const {
  obtenerReputaciones,
  recalcularReputacion
} = require("../controllers/reputacion.controller");

router.get("/reputaciones", obtenerReputaciones);

router.put(
  "/reputaciones/:usuario_id/recalcular",
  recalcularReputacion
);

module.exports = router;