/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

const stockDataHandler = require('../controllers/stockDataHandler')

module.exports = function (app) {
  
  // Connect to database
  let db
  MongoClient.connect(CONNECTION_STRING, async (err, conn) => {
    if (err) throw err
    else {
      db = await conn.collection('stockData')
      console.log(`Successfully connected to: ${CONNECTION_STRING}`)
    }
  })

  app.route('/api/stock-prices')
    .get(function (req, res){
      
    });
    
};
