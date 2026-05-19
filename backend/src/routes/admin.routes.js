const express = require("express");

const router = express.Router();

const {
  obtenerEstadisticas
} = require(
  "../controllers/admin.controller"
);

router.get(
  "/admin/estadisticas",
  obtenerEstadisticas
);

module.exports = router;