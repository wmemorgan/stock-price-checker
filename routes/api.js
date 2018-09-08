/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;

const stockDataHandler = require('../controllers/stockDataHandler')

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(stockDataHandler.getStockPrice)
    
};
