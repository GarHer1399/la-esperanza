const express = require("express");
const router = express.Router();

const verificarToken = require("../middlewares/auth.middleware");

const {
  obtenerUnidades,
  obtenerProductos,
  crearPublicacion,
  obtenerPublicaciones,
} = require("../controllers/productos.controller");

router.get("/productos", verificarToken, obtenerProductos);

router.get("/unidades", verificarToken, obtenerUnidades);

router.post("/publicaciones", verificarToken, crearPublicacion);

router.get("/publicaciones", verificarToken, obtenerPublicaciones);

module.exports = router;