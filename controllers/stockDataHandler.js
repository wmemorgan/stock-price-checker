const axios = require('axios')
const mongo = require('mongodb').MongoClient;

// Connect to database
const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
let db
mongo.connect(CONNECTION_STRING, async (err, conn) => {
  if (err) throw err
  else {
    db = await conn.collection('stockData')
    console.log(`Successfully connected to: ${CONNECTION_STRING}`)
  }
})

// // Stock update function
// const dbStockUpdate = async (query, action) => {
//   let data = await mongo.connect(CONNECTION_STRING)
//   let dbo = data.db("wme-practicedb")
//   let results = await dbo.collection('stockData').update(query, action, { upsert: true })
//   return results
// }

exports.getStockPrice = async (req, res) => {
  console.log(`req.ip is: `, req.ip)
  let symbol = req.query.stock.toUpperCase()
  let like = req.query.like ? 1 : 0
  let query = { symbol: symbol }
  let stockData = []
  const stockPriceEndPoint = `https://api.iextrading.com/1.0/stock/${symbol}/price`
  try {
    // Retrieve latest stock price
    const stockPrice = await axios.get(stockPriceEndPoint)
    // Upsert stock ticker symbol and like status into database
    let action = {
      $inc: { like: like },
      $push: { "ip": req.ip }
    }
    db.updateOne(query, action, { upsert: true }, (err, doc) => { if (err) throw err; })
    // Collect and publish stock price and number of likes
    let symbolInfo = await db.findOne(query)
    let stockData = {
      stockData : {
        stock: symbolInfo.symbol,
        price: stockPrice.data,
        likes: symbolInfo.like
      }
    }
    console.log(stockData)
    res.send(stockData)
  } catch (error) {
    console.error('Error:', error)
  }
}



