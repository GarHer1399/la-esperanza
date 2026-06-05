const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const { autorizarRoles, ROLES } = require('../middlewares/roles.middleware');
const c = require('../controllers/incumplimientos.controller');

router.post('/incumplimientos', verificarToken, autorizarRoles(ROLES.PRODUCTOR, ROLES.COMPRADOR, ROLES.OPERADOR, ROLES.ADMIN), c.crearIncumplimiento);
router.get('/incumplimientos', verificarToken, c.obtenerIncumplimientos);
router.put('/incumplimientos/:id/revisar', verificarToken, autorizarRoles(ROLES.ADMIN), c.revisarIncumplimiento);

module.exports = router;
