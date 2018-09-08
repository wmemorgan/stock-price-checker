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
  let symbol = Array.isArray(req.query.stock) ? req.query.stock : req.query.stock.split(',')
  console.log(`length of symbol.length: `, symbol.length)

  let arr = { stockData: [] }
  for (let i = 0; i < symbol.length; i++) {
    let ticker = symbol[i].toUpperCase()
    console.log(`ticker is: ${ticker}`)
    console.log(`symbol[i].like: `, symbol[i].like)
    let like = req.query.like ? 1 : 0
    console.log(`like is : ${like}`)
    let query = { symbol: ticker }
    console.log(`query is: `, query)
    let stockPriceEndPoint = `https://api.iextrading.com/1.0/stock/${ticker}/price`
    console.log(`stockPriceEndPoint: ${stockPriceEndPoint}`)
    try {
      // Retrieve latest stock price
      let stockPrice = await axios.get(stockPriceEndPoint)
      console.log(`stockPrice `, stockPrice.data)
      let symbolInfo = await db.findOne(query)
      
      // Upsert stock ticker symbol and like status into database
      if (symbolInfo == null || !(symbolInfo.ip.includes(req.ip) && symbolInfo.like > 0)) {
        let action = {
          $inc: { like: like },
          $push: { "ip": req.ip }
        }
        db.updateOne(query, action, { upsert: true }, (err, doc) => { if (err) throw err; })
        symbolInfo = await db.findOne(query)
      }
      let stockData = {
        stock: symbolInfo.symbol,
        price: stockPrice.data,
        likes: symbolInfo.like
      }
      arr.stockData.push(stockData)
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  }
  if (symbol.length > 1) {
    let rellikes0 = arr.stockData[0].likes - arr.stockData[1].likes
    let rellikes1 = arr.stockData[1].likes - arr.stockData[0].likes
    arr.stockData[0]['rel_likes'] = rellikes0
    delete arr.stockData[0].likes
    arr.stockData[1]['rel_likes'] = rellikes1
    delete arr.stockData[1].likes
    
    console.log(arr)
    res.send(arr)
  } else {
    console.log(`arr.stockData[0]`, arr.stockData[0])
    res.send(arr.stockData[0])
  }  
}



