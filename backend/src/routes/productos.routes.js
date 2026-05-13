const express = require("express");
const router = express.Router();

const {
  obtenerProductos,
  crearPublicacion,
  obtenerPublicaciones,
} = require("../controllers/productos.controller");

router.get("/productos", obtenerProductos);

router.post("/publicaciones", crearPublicacion);

router.get("/publicaciones", obtenerPublicaciones);

module.exports = router;