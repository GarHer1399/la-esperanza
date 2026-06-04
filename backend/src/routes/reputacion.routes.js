const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const c = require('../controllers/reputacion.controller');

router.get('/reputaciones', verificarToken, c.obtenerReputaciones);
router.put('/reputaciones/:usuario_id/recalcular', verificarToken, c.recalcularReputacion);

module.exports = router;
