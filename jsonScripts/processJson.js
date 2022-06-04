
function processJson(directory) {
  var result = ''
  fetch(directory)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      result = calcularTotal(data);
      alert('Precio de la compra: '+result)
    })
} 

