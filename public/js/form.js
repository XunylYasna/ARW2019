/* Script for register.hbs */
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

/* Check if inputs from fieldset are valid */
function validFieldSet (input) {
    console.log("VALIDATE FORM");
    let check = true;

    for(var i=0; i<input.length; i++) {
        if(validate(input[i]) == false){
            showValidate(input[i]);
            console.log('This input is invalid')
            check=false;
        } else {
            console.log('This input is invalid')
        }
    }
    return check;
}

function validate (input) {
    console.log('validate(' + $(input).attr('name') + ')');
    let value = $(input).val().trim();

    if (value == '')  // if input is empty
        return false;

    /* Validates based on the input name */
    switch ($(input).attr('name')) {
        case 'id_number': // invalid if string is not numerical or 8 digits
            if (isNaN(value) || value.length != 8) return false;
            break;
        case 'contact_number':
            if (isNaN(value) || value.length > 11 || value.length < 10) return false;
            break;
        case 'facebook_name':
            // invalid if words are not alphanumerical
            if (value.match(/^([0-9a-zA-Z.\-][ ]?)+$/) === null) return false;
            break;
        case 'first_name': case 'middle_name': case 'last_name': 
            // invalid if words are not alphabetical
            if (value.match(/^([a-zA-Z.\-][ ]?)+$/) === null) return false;
            break;
        case 'reciept_number': 
            // invalid if not numerical
            if (isNaN(value)) valid = false;
            break;
        case 'dlsu_mail': 
            // invalid if string does not end in @dlsu.edu.ph
            if (value.match(/^([0-9a-zA-Z._\-][ ]?)+@dlsu.edu.ph$/) === null) return false;
            break;
    }
    return true;
}

function showValidate(input) {
    let thisAlert = $(input).parent();
    $(thisAlert).addClass('alert-validate');
}

function hideValidate(input) {
    let thisAlert = $(input).parent();

    $(thisAlert).removeClass('alert-validate');
}

function setNextEvent() {
    let current_fs, next_fs; //fieldsets
    let left, opacity, scale; //fieldset properties which we will animate
    let animating; //flag to prevent quick multi-click glitches
    let valid;
    $('.next').click(function() {
        if (animating) return false; // prevents multi-clicking
        animating = true;

        current_fs = $(this).parent(); // gets parent fieldset
        console.log(current_fs);
        next_fs = $(this).parent().next(); // gets fieldset after the parent fieldset
                
        let children = current_fs.find('input,textarea');

        console.log(children);
        if (current_fs.attr('id') === 'membership_fs')
            valid = true;
        else 
            valid = validFieldSet(children);
        console.log(valid);

        // will only transition if all inputs are valid
        if (valid) {
            // insert code for progress bar (not done)

            // display next fieldset
            next_fs.show();

            // animate hiding the current fieldset
            current_fs.animate({opacity: 0}, {
                step: function(now, mx) {
                    scale = 1 - (1 - now) * 0.2; // scale down current_fs to 80% 
                    left = (now * 50)+'%'; // next_fx slides from the right
                    opacity = 1 - now; // increase next_fs opacity as it moves

                    current_fs.css({
                        'transform': 'scale('+scale+')',
                        'position': 'absolute'
                    });
                    next_fs.css({'left': left, 'opacity': opacity});
                },
                duration: 800,
                complete: function() {
                    console.log("yz");
                    current_fs.hide();
                    animating = false;
                },
                easing: 'easeInOutBack'
            });
        } else {
            setNextEvent();
        }
    });
}

function setPrevEvent () {
    let current_fs, previous_fs; //fieldsets
    let left, opacity, scale; //fieldset properties which we will animate
    let animating; //flag to prevent quick multi-click glitches
    $(".previous").click(function(){
        if(animating) return false;
        animating = true;
        
        current_fs = $(this).parent();
        previous_fs = $(this).parent().prev();
        
        //show the previous fieldset
        previous_fs.show(); 
        //hide the current fieldset with style
        current_fs.animate({opacity: 0}, {
            step: function(now, mx) {
                scale = 0.8 + (1 - now) * 0.2;
                left = ((1-now) * 50)+'%'; //move current_fs to the right(50%) - from 0%
                opacity = 1 - now; // increase previous_fs opacity as it moves
                current_fs.css({'left': left});
                previous_fs.css({
                    'transform': 'scale('+scale+')', 
                    'opacity': opacity
                });
            }, 
            duration: 800, 
            complete: function(){
                current_fs.hide();
                animating = false;
            }, 
            //this comes from the custom easing plugin
            easing: 'easeInOutBack'
        });
        previous_fs.css({
            'postion': 'relative'
        });
    });
}

function setSubmitEvent () {
    $('.validate-form').submit(function (e) {
        e.preventDefault(); // prevent actual submitting
        // check if reciept no is valid
        let form = $(this);
        let current_fs= form.parent();
        let children = current_fs.find('input,textarea'); 
        let valid = validFieldSet(children);
        let memberType = document.getElementById('memberType');

        // set hidden submit value
        if(document.getElementById('officer-radio').checked) {
            memberType.value = document.getElementById('officerType').value;
        } else if(document.getElementById('member-radio').checked) {
            memberType.val = 'Member';
        }

        if (valid) {
            /* insert ajax submit code here */
        }
    });
}

function setInputLeaveEvent () {
    $(document).on( "click", function( event ) {
		if (event.target.matches(".input")) {
            let input = event.target;
            $(document).on( "click", function( event ) {
                if (event.target != input) {
                    if(validate(input) == false){
                        showValidate(input);
                    }
                    setInputLeaveEvent();
                }
            });
		}
	});
}

$(document).ready(function () {
    checkEmptyInput(); // sets input classes based on whether an input is empty

    /* Hides all validation alerts when document is loaded */
    $('.validate-form .input').each(function() {
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    /* Set button actions */
    setNextEvent();
    setPrevEvent();
    setSubmitEvent();
    setInputLeaveEvent();

});