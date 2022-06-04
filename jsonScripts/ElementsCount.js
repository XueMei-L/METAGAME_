/**
 * _Get length of html´s elements_
 */
// function getElementsCount() {
//     var p_count = 0;
//     var div_count = 0;
//     var li_count = 0;
//     p_count = document.getElementsByTagName('p').length;
//     div_count = document.getElementsByTagName('div').length;
//     li_count = document.getElementsByTagName('li').length;
//     document.getElementById('element-count').innerText = ('Nº p: ' + p_count + ' Nº divs: '+ div_count + ' Nº li: '+ li_count);
// }

function getElementsCountString() {
    var p_count = 0;
    var div_count = 0;
    var li_count = 0;
    p_count = document.getElementsByTagName('p').length;
    div_count = document.getElementsByTagName('div').length;
    li_count = document.getElementsByTagName('li').length;
    return ('Nº p: ' + p_count + ' Nº divs: '+ div_count + ' Nº li: '+ li_count);
}