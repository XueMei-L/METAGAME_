/**
 * _Show total purchase price_
 * @param {*} price price
 */
 function processCart(priceAndDate) {
    document.getElementById('cartText').innerText = ('Coste total: ' + priceAndDate);
    document.getElementById('cartText').style.visibility = 'visible';
}