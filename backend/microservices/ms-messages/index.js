// ms-messages
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const routerApi = require('./routes');

const app = express();
const httpServer = createServer(app);

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:8080",
  "http://ms-auth:5000",
  "http://ms-services:5000",
  "http://ms-appointments:5000", 
  "http://ms-messages:5000",

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

app.get('/ms-messages', (req, res) => {
  res.send('Conexión exitosa con el Service messages!');
});

// Manejo de errores para Express
app.use((err, req, res, next) => {
  console.error('Error en el Service messages:', err);
  res.status(500).json({
    error: 'Error interno del Service messages',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

routerApi(app);

const port = process.env.PORT_MESSAGES || 5004;
// Inicio del servidor con manejo de errores
httpServer.listen(port, '0.0.0.0', () => {
  console.log(`Service messages funcionando en http://localhost:${port}`);
}).on('error', (err) => {
  console.error('Error al iniciar el Service messages:', err);
});
// Manejo de señales de terminación
process.on('SIGTERM', () => {
  console.log('Cerrando Service messages...');
  httpServer.close(() => {
    console.log('Service messages cerrado');
    process.exit(0);
  });
});