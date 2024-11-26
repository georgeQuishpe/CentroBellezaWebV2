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
  }
});

app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

// Configuración de WebSocket
require('./websocket/chat.socket')(io);

app.get('/', (req, res) => {
  res.send('Conexión exitosa con el backend!');
});

routerApi(app);

const port = process.env.PORT || 5000;
httpServer.listen(port, () => {
  console.log(`Backend funcionando en http://localhost:${port}`);
});