// backend/index.js
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const routerApi = require('./routes');

const app = express();
const httpServer = createServer(app);

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  // Añadir tu dominio de producción cuando lo tengas
];

const io = new Server(httpServer, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'], // Prioriza WebSocket
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
  connectTimeout: 45000,  // Añadido timeout de conexión
  // Añadidas opciones de reconexión
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000
});

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

// Manejo de errores de Socket.IO
io.on('connect_error', (err) => {
  console.error('Error de conexión Socket.IO:', err);
});
io.on('error', (err) => {
  console.error('Error general Socket.IO:', err);
});

// Configuración de WebSocket con manejo de errores
try {
  require('./websocket/chat.socket')(io);
} catch (error) {
  console.error('Error al configurar WebSocket:', error);
}

app.get('/', (req, res) => {
  res.send('Conexión exitosa con el backend!');
});

// Manejo de errores para Express
app.use((err, req, res, next) => {
  console.error('Error en el servidor:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

routerApi(app);

const port = process.env.PORT || 5000;
// Inicio del servidor con manejo de errores
httpServer.listen(port, () => {
  console.log(`Backend funcionando en http://localhost:${port}`);
}).on('error', (err) => {
  console.error('Error al iniciar el servidor:', err);
});
// Manejo de señales de terminación
process.on('SIGTERM', () => {
  console.log('Cerrando servidor...');
  httpServer.close(() => {
    console.log('Servidor cerrado');
    process.exit(0);
  });
});