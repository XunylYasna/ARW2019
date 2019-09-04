
/* Checks if input fields are empty */
function checkEmptyInput () {
    console.log("checkEmptyInput ()");
    $('.input').each(function(){
        if($(this).val().trim() != "") {
            $(this).addClass('not-empty');
        }
        else {
            $(this).removeClass('not-empty');
        }
        $(this).on('blur', function(){
            if($(this).val().trim() != "") {
                $(this).addClass('not-empty');
            }
            else {
                $(this).removeClass('not-empty');
            }
        })    
    });
}

function submitFieldSet (input) {
    $('.validate-form').on('submit',function(){
        console.log("VALIDATE FORM");
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }
        return check;
    });
}

function validate (input) {
    console.log('validate(' + input + ')');
    if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
        if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
            return false;
        }
    }
    else {
        if($(input).val().trim() == ''){
            return false;
        }
    }
}

function showValidate(input) {
    let thisAlert = $(input).parent();
    $(thisAlert).addClass('alert-validate');
}

function hideValidate(input) {
    let thisAlert = $(input).parent();

    $(thisAlert).removeClass('alert-validate');
}
$(document).ready(function () {
    checkEmptyInput();
    let input = $('.validate-input .input');

    submitFieldSet(input);

    $('.validate-form .input').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });
});