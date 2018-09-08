/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.equal(res.body.stock, 'GOOG')
          done();
        });
      });
      
      test('1 stock with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: 'gm', like: true})
        .end(function(err, res) {
          console.log(`res.body: `, res.body)
          assert.equal(res.status, 200)
          assert.equal(res.body.stock, 'GM')
          assert.isAtLeast(res.body.likes, 1)
          done()
        })
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: 'gm', like: true })
        .end(function(err, res) {
          console.log(`res.body: `, res.body)
          assert.equal(res.status, 200)
          assert.equal(res.body.stock, 'GM')
          assert.equal(res.body.likes, 1)
          done()
        })
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['goog','fb']})
        .end(function(err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.body.stockData[0].stock, 'GOOG')
          assert.equal(res.body.stockData[1].stock, 'FB')
          done()
        })
      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({ stock: ['t', 'vz'], like: true  })
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.body.stockData[0].stock, 'T')
            assert.equal(res.body.stockData[1].stock, 'VZ')
            assert.equal(res.body.stockData[0].rel_likes, 0)
            done()
          })
      });
      
    });

});
