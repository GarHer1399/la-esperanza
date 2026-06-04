const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const { autorizarRoles, ROLES } = require('../middlewares/roles.middleware');
const c = require('../controllers/entregas.controller');

router.post('/entregas', verificarToken, autorizarRoles(ROLES.PRODUCTOR, ROLES.OPERADOR, ROLES.ADMIN), c.crearEntrega);
router.get('/entregas', verificarToken, c.obtenerEntregas);
router.put('/entregas/:id/confirmar-productor', verificarToken, autorizarRoles(ROLES.PRODUCTOR, ROLES.ADMIN), c.confirmarProductor);
router.put('/entregas/:id/validar-comprador', verificarToken, autorizarRoles(ROLES.COMPRADOR, ROLES.ADMIN), c.validarComprador);

module.exports = router;
