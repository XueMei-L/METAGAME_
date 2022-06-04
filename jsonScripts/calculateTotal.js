
// En el json se registra para cada usuario su dni, año de nacimiento, 
// número de cuenta, productos en la compra actual, % de descuento (si lo tiene), 
// modalidad de pago. El json debe estar en el propio código, inicializando una variable, 
// explica por qué se te exige este requisito.


function fetchTime(next_day) {
    var today = new Date();
    if(!next_day) {
      var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+(today.getFullYear());
    } else {
      var date = (today.getDate()+1)+'-'+(today.getMonth()+1)+'-'+(today.getFullYear());
    }
   
    //var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    //var dateTime = date+' '+time;
    return date;
  }
/**
 * _Funcion that to calculate total price_
 * @param {*} jsonFile jsonFile (type object)
 * @returns total price
 */
function calcularTotal(jsonFile) {
    // Recorremos el array del carrito 
    if (jsonFile.length === 0){
        return 0;
    }
    isCredit = false
    if (jsonFile[0].payment_method === 'CreditCard') {
        isCredit = true
    }
    var acc = 0;
    jsonFile[0].current_cart.forEach((value) => {
        acc += value.price
    });
    return (acc.toString() + ' € ' + ' Fecha de envio: ' + fetchTime(isCredit));
}
