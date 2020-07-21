// import fs from 'fs';
const express = require('express');

const routes = require('./api/api');
const appMiddleware = require('./middleware/middleware');

const PORT = process.env.PORT || 3006;
const app = express();
app.use(requireHTTPS);
appMiddleware(app);
routes(app);

app.get('/', (req, res) => {
  return res.status(200).json({message: 'connected',});
});

app.listen(PORT, () => {
  console.log(`😎 Server is listening on port ${PORT}`);
});

function requireHTTPS(req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}
