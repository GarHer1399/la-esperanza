const express = require("express");
const cors = require("cors");

require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const productosRoutes = require("./routes/productos.routes");
const solicitudesRoutes = require("./routes/solicitudes.routes");
const entregasRoutes = require("./routes/entregas.routes");
const incumplimientosRoutes = require("./routes/incumplimientos.routes");
const reputacionRoutes = require("./routes/reputacion.routes");
const adminRoutes = require("./routes/admin.routes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {

  res.json({
    mensaje:
      "API Sistema La Esperanza funcionando"
  });
});

app.use("/api/auth", authRoutes);

app.use("/api", productosRoutes);

app.use("/api", solicitudesRoutes);

app.use("/api", entregasRoutes);

app.use("/api", incumplimientosRoutes);

app.use("/api", reputacionRoutes);

app.use("/api", adminRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `Servidor corriendo en http://localhost:${PORT}`
  );
});