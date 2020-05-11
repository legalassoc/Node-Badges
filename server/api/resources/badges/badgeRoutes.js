'use strict';

const express = require('express');

const {getBadge} = require('./badgeCtrl');

const router = express.Router();

router.get('/:id/:assoc', function(req, res){
  getBadge(`${req.params.id}`,`${req.params.assoc}`,req,res);
});

module.exports = router;
