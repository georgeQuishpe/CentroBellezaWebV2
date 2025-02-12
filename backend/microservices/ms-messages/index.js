// ms-messages
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
// const routerApi = require('./routes');
const { config } = require('./config/config');
const jwt = require('jsonwebtoken');
const router = express.Router();
const chatMessagesRouter = require('./routes/chatMessages.routes');
const exp = require('constants');
const metricsMiddleware = require('./services/monitoring');

const app = express();
app.use(metricsMiddleware);
const httpServer = createServer(app);

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:8080",
  "http://localhost:5000",
  "http://ms-auth:5000",
  "http://ms-services:5000",
  "http://ms-appointments:5000",
  "http://ms-messages:5000",

];

const io = new Server(httpServer, {
  path: '/ms-messages/socket.io',
  maxHttpBufferSize: 1e6, // 1MB max message size
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["content-type"]
  },
  transports: ['websocket', 'polling'], // Prioriza WebSocket
  pingTimeout: 60000,
  pingInterval: 25000,
  connectTimeout: 45000,  // Añadido timeout de conexión
  allowEIO3: true,
  // Añadidas opciones de reconexión
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  maxPayload: 1048576, // 1MB in bytes
  perMessageDeflate: {
    threshold: 1024, // only compress data if size > 1KB
    maxPayload: 1048576
  }
});

app.use(cors({
  // origin: ALLOWED_ORIGINS,
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

// Manejo de eventos de Socket.IO
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });

  socket.on('error', (error) => {
    if (error.name === 'RangeError') {
      console.error('Buffer allocation failed:', error);
      socket.emit('error', 'Message size too large');
    } else {
      console.error('Socket error:', error);
    }
  });
});

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

app.use('/api/v1', router);
router.use('/chat-messages', chatMessagesRouter);

const port = process.env.PORT_MESSAGES || 5004;
const host = '0.0.0.0';

// Middleware de autenticación para Socket.IO
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: Token not provided'));
    }

    console.log('JWT Secret usado para verificación:', config.jwtSecret); // Para debug
    const decoded = jwt.verify(token, config.jwtSecret);
    socket.user = decoded;
    console.log('Token verificado correctamente:', decoded);
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new Error('Token expired'));
    }
    console.error('Error de autenticación:', err);
    return next(new Error('Authentication error: ' + err.message));
  }
});


// Inicio del servidor con manejo de errores
httpServer.listen(port, host, () => {
  console.log(`Service messages funcionando en http://localhost:${port}`);
}).on('error', (err) => {
  console.error('Error al iniciar el Service messages:', err);
  process.exit(1);
});

// Manejo de señales de terminación
process.on('SIGTERM', () => {
  console.log('Cerrando Service messages...');
  httpServer.close(() => {
    console.log('Service messages cerrado');
    process.exit(0);
  });
});

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
  console.error('Error no capturado:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa rechazada no manejada:', reason);
  process.exit(1);
});