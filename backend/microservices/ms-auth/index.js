// ms-auth
const express = require('express');
const cors = require('cors');
const routerApi = require('./routes');
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

app.get('/ms-auth', (req, res) => {
  res.send('Conexión exitosa con el Service auth!');
});

// Manejo de errores para Express
app.use((err, req, res, next) => {
  console.error('Error en el Service auth:', err);
  res.status(500).json({
    error: 'Error interno del Service auth',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

routerApi(app);

const port = process.env.PORT_AUTH || 5001;
// Inicio del servidor con manejo de errores
app.listen(port, '0.0.0.0', () => {
  console.log(`Service auth funcionando en http://localhost:${port}`);
}).on('error', (err) => {
  console.error('Error al iniciar el Service auth:', err);
});
// Manejo de señales de terminación
process.on('SIGTERM', () => {
  console.log('Cerrando Service auth...');
  app.close(() => {
    console.log('Service auth cerrado');
    process.exit(0);
  });
});