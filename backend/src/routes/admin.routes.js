const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const { autorizarRoles, ROLES } = require('../middlewares/roles.middleware');
const c = require('../controllers/admin.controller');

router.get('/admin/estadisticas', verificarToken, autorizarRoles(ROLES.ADMIN), c.obtenerEstadisticas);
router.get('/usuarios', verificarToken, autorizarRoles(ROLES.ADMIN, ROLES.OPERADOR), c.obtenerUsuarios);
router.put('/usuarios/:id', verificarToken, autorizarRoles(ROLES.ADMIN), c.actualizarUsuario);
router.get('/puntos-entrega', verificarToken, c.obtenerPuntos);
router.post('/puntos-entrega', verificarToken, autorizarRoles(ROLES.ADMIN), c.crearPunto);
router.get('/historial', verificarToken, c.historial);

module.exports = router;
