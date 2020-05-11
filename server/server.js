// import fs from 'fs';
const express = require('express');

const routes = require('./api/api');
const appMiddleware = require('./middleware/middleware');

const PORT = process.env.PORT || 3006;
const app = express();

appMiddleware(app);
routes(app);

app.get('/', (req, res) => {
  return res.status(200).json({message: 'connected',});
});

app.listen(PORT, () => {
  console.log(`😎 Server is listening on port ${PORT}`);
});