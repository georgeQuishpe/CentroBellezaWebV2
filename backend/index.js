const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors()); // Permitir solicitudes desde el frontend
app.use(express.json()); // Parsear JSON en las peticiones

// Rutas de prueba
app.get('/api/saludo', (req, res) => {
    res.json({ mensaje: 'Hola desde el backend!' });
});

// Configuración del puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});