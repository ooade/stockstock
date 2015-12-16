'use strict';

var express = require('express');
var router = express.Router();
var stock = require('../controllers/stock.controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'StockStock' });
});

router.post('/api/data', function(req, res, next) {
  stock.addStock(req, res);
});

router.get('/api/data', function(req, res, next) {
  stock.retrieveStock(req, res);
});

module.exports = router;
