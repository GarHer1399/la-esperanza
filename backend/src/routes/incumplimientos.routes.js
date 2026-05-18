const express = require("express");

const router = express.Router();

const {
  crearIncumplimiento,
  obtenerIncumplimientos,
  revisarIncumplimiento
} = require("../controllers/incumplimientos.controller");

router.post(
  "/incumplimientos",
  crearIncumplimiento
);

router.get(
  "/incumplimientos",
  obtenerIncumplimientos
);

router.put(
  "/incumplimientos/:id/revisar",
  revisarIncumplimiento
);

module.exports = router;