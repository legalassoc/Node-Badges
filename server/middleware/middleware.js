const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

module.exports = function(app) {
	// app.use(requireHTTPS);
	app.use(morgan('dev'));
	app.use(express.json());
	app.use(cors());
};
// function requireHTTPS(req, res, next) {
//   // The 'x-forwarded-proto' check is for Heroku
//   if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
//     return res.redirect('https://' + req.get('host') + req.url);
//   }
//   next();
// }
