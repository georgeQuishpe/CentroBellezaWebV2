// ms-appointments
const express = require('express');
const app = express();
const port = 5003;

app.get('/ms-appointments', (req, res) => {
  res.json({ message: "Service appointment" });
});

app.listen(port, () => {
  console.log(`Service appointment listening at http://localhost:${port}`);
});
