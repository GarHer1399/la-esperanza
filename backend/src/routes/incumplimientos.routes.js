const express = require("express");

const router = express.Router();

const verificarToken = require("../middlewares/auth.middleware");

const {
  crearIncumplimiento,
  obtenerIncumplimientos,
  revisarIncumplimiento,
} = require("../controllers/incumplimientos.controller");

router.post(
  "/incumplimientos",
  verificarToken,
  crearIncumplimiento
);

router.get(
  "/incumplimientos",
  verificarToken,
  obtenerIncumplimientos
);

router.put(
  "/incumplimientos/:id/revisar",
  verificarToken,
  revisarIncumplimiento
);

module.exports = router;