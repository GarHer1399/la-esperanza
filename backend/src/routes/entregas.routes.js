const express = require("express");

const router = express.Router();

const verificarToken = require("../middlewares/auth.middleware");

const {
  crearEntrega,
  obtenerEntregas,
} = require("../controllers/entregas.controller");

router.post("/entregas", verificarToken, crearEntrega);

router.get("/entregas", verificarToken, obtenerEntregas);

module.exports = router;