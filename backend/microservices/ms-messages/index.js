// ms-messages
const express = require('express');
const app = express();
const port = 5004;

app.get('/ms-messages', (req, res) => {
  res.json({ message: "Service messages" });
});

app.listen(port, () => {
  console.log(`Service messages listening at http://localhost:${port}`);
});
