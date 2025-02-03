// ms-services
const express = require('express');
const app = express();
const port = 5002;

app.get('/ms-services', (req, res) => {
  res.json({ message: "Service services" });
});

app.listen(port, () => {
  console.log(`Service services listening at http://localhost:${port}`);
});
