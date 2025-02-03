// ms-auth
const express = require('express');
const app = express();
const port = 5001;

app.get('/ms-auth', (req, res) => {
  res.json({ message: "Service auth" });
});

app.listen(port, () => {
  console.log(`Service auth listening at http://localhost:${port}`);
});
