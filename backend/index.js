// backend/index.js
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const routerApi = require('./routes');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // URL de tu frontend en Vite
    methods: ["GET", "POST"]
  }
});

app.use(cors());
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