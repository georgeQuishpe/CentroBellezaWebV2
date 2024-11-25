// backend/index.js
const express = require('express');
const cors = require('cors');
const routerApi = require('./routes');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Conexión exitosa con el backend!');
});

routerApi(app);

app.listen(port, () => {
  console.log(`Backend funcionando en http://localhost:${port}`);
});

