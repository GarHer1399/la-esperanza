const express = require("express");
const cors = require("cors");

require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const productosRoutes = require("./routes/productos.routes");
const solicitudesRoutes = require("./routes/solicitudes.routes");
const entregasRoutes = require("./routes/entregas.routes");
const incumplimientosRoutes = require("./routes/incumplimientos.routes");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensaje: "API Sistema La Esperanza funcionando"
  });
});

app.use("/api/auth", authRoutes);

app.use("/api", productosRoutes);

app.use("/api", solicitudesRoutes);

app.use("/api", entregasRoutes);

app.use("/api", incumplimientosRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});