const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const { autorizarRoles, ROLES } = require('../middlewares/roles.middleware');
const c = require('../controllers/productos.controller');

router.get('/productos', verificarToken, c.obtenerProductos);
router.get('/unidades', verificarToken, c.obtenerUnidades);
router.get('/publicaciones', verificarToken, c.obtenerPublicaciones);
router.post('/publicaciones', verificarToken, autorizarRoles(ROLES.PRODUCTOR, ROLES.ADMIN), c.crearPublicacion);

module.exports = router;
