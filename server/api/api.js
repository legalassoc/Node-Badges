'use strict';

const badgeRoutes = require('./resources/badges/badgeRoutes');

module.exports = function(app) {
	app.use('/api/badges', badgeRoutes);
}