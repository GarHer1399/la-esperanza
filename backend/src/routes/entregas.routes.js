const express = require("express");

const router = express.Router();

const {
  crearEntrega,
  obtenerEntregas
} = require("../controllers/entregas.controller");

router.post("/entregas", crearEntrega);

router.get("/entregas", obtenerEntregas);

module.exports = router;