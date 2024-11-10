// backend/index.js
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api/test', (req, res) => {
  res.json({ message: 'Conexión exitosa con el backend!' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend funcionando en http://localhost:${PORT}`);
});
