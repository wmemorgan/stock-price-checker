$(function () {
  $('#multi-stock-form').submit(function (e) {
    $.ajax({
      url: '/api/stock-prices',
      type: 'get',
      data: $('#multi-stock-form').serialize(),
      success: function (data) {
        $('#jsonResult').text(JSON.stringify(data));
      }
    });
    e.preventDefault();
  });
  $('#single-stock-form').submit(function (e) {
    $.ajax({
      url: '/api/stock-prices',
      type: 'get',
      data: $('#single-stock-form').serialize(),
      success: function (data) {
        $('#jsonResult').text(JSON.stringify(data));
      }
    });
    e.preventDefault();
  });
});