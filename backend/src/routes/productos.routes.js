const express = require("express");
const router = express.Router();

const verificarToken = require("../middlewares/auth.middleware");

const {
  obtenerProductos,
  crearPublicacion,
  obtenerPublicaciones,
} = require("../controllers/productos.controller");

router.get("/productos", verificarToken, obtenerProductos);

router.post("/publicaciones", verificarToken, crearPublicacion);

router.get("/publicaciones", verificarToken, obtenerPublicaciones);

module.exports = router;