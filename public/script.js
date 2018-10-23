// Form data handler
const endPoint = '/api/stock-prices'

// Get form data
const getFormData = (form) => {
  let getData = new FormData(form)
  let params = {
    stock: getData.getAll('stock').length > 1 ? getData.getAll('stock') : getData.getAll('stock')[0],
    like: getData.getAll('like')
  }
  let query = Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&')
  let url = `${endPoint}?${query}`
  return url 
}

// Query stock data
const getStockData = (url) => {
  document.getElementById('jsonResult').innerText = 'Loading data. Please wait...'
  fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-type': 'application/json'
    }
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById('jsonResult').innerText = JSON.stringify(data)
    })
}

//Assign functions to forms
for (let i = 0; i < document.forms.length; i++) {
  document.forms[i].onsubmit = (e) => {
    e.preventDefault()
    let stockSearch = getFormData(document.forms[i])
    getStockData(stockSearch)
  }
}
