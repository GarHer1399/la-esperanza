const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const { autorizarRoles, ROLES } = require('../middlewares/roles.middleware');
const c = require('../controllers/solicitudes.controller');

router.post('/solicitudes', verificarToken, autorizarRoles(ROLES.COMPRADOR, ROLES.ADMIN), c.crearSolicitud);
router.get('/solicitudes', verificarToken, c.obtenerSolicitudes);
router.put('/solicitudes/:id/estado', verificarToken, autorizarRoles(ROLES.PRODUCTOR, ROLES.COMPRADOR, ROLES.ADMIN), c.actualizarEstadoSolicitud);

module.exports = router;
