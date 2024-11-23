// backend/index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');


dotenv.config();
const app = express();

const port = process.env.PORT || 5000;
const routerApi = require('./routes');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Conexión exitosa con el backend!');
});

routerApi(app);

app.listen(port, () => {
  console.log(`Backend funcionando en http://localhost:${port}`);
});
