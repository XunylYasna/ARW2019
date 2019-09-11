/* Script for welcome.hbs */
/* Global Variables */
var reg = '';

function set(regType){
    reg = regType
}



function submit(num){
    reg += num;
    $('#regInput').val(reg)
    $('#typeForm').submit();
}