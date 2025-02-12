// ms-services
const express = require('express');
const cors = require('cors');
const router = express.Router();
const servicesRouter = require('./routes/services.routes');
const metricsMiddleware = require('./services/monitoring');


const app = express();
app.use(metricsMiddleware);

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:8080",
  "http://localhost:5000",
  "http://ms-auth:5000",
  "http://ms-services:5000",
  "http://ms-appointments:5000",
  "http://ms-messages:5000",
  "https://centro-belleza-web-v2-d8ww7ii17-george-quishpes-projects.vercel.app/"
];

app.use(cors({
  origin: ALLOWED_ORIGINS,
  origin: function (origin, callback) {
    if (!origin || ALLOWED_ORIGINS.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

app.get('/ms-services', (req, res) => {
  res.send('Conexión exitosa con el Service services!');
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Manejo de errores para Express
app.use((err, req, res, next) => {
  console.error('Error en el Service services:', err);
  res.status(500).json({
    error: 'Error interno del Service services',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.use('/api/v1', router);
router.use('/services', servicesRouter);

const port = process.env.PORT_SERVICES || 5002;
// Inicio del servidor con manejo de errores
app.listen(port, '0.0.0.0', () => {
  console.log(`Service services funcionando en http://localhost:${port}`);
}).on('error', (err) => {
  console.error('Error al iniciar el Service services:', err);
});
// Manejo de señales de terminación
process.on('SIGTERM', () => {
  console.log('Cerrando Service services...');
  app.close(() => {
    console.log('Service services cerrado');
    process.exit(0);
  });
});