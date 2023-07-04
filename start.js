const express = require('express');
const { exec } = require('child_process');

const app = express();
const port = 5000;

app.use(express.static('client/build'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor Express iniciado em http://localhost:${port}`);
  exec('npm run start --prefix client');
});