const express = require('express');
const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.send('Servidor Express funcionando!');
});

app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});