const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const productosRoutes = require('./routes/productos.routes');
const solicitudesRoutes = require('./routes/solicitudes.routes');
const entregasRoutes = require('./routes/entregas.routes');
const incumplimientosRoutes = require('./routes/incumplimientos.routes');
const reputacionRoutes = require('./routes/reputacion.routes');
const adminRoutes = require('./routes/admin.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origen no permitido por CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '2mb' }));

app.get('/', (_req, res) => res.json({ mensaje: 'API Sistema La Esperanza funcionando' }));
app.get('/api/health', (_req, res) => res.json({ ok: true, servicio: 'la-esperanza-api' }));

app.use('/api/auth', authRoutes);
app.use('/api', productosRoutes);
app.use('/api', solicitudesRoutes);
app.use('/api', entregasRoutes);
app.use('/api', incumplimientosRoutes);
app.use('/api', reputacionRoutes);
app.use('/api', adminRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ mensaje: err.message || 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor interno corriendo en http://127.0.0.1:${PORT}`));
