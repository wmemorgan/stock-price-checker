const axios = require('axios')

exports.getStockPrice = async (req, res) => {
  console.log(`req.ip is: `, req.ip)
  let symbol = req.query.stock.toUpperCase()
  const stockPriceEndPoint = `https://api.iextrading.com/1.0/stock/${symbol}/price`
  try {
    stockPrice = await axios.get(stockPriceEndPoint)
    let stockData = {
      stock: symbol,
      price: stockPrice.data,
      likes: 0
    }
    res.send(stockData)
  } catch (error) {
    console.error('Error:', error)
  }
}



