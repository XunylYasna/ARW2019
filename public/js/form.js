
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

function validFieldSet (input) {
    console.log("VALIDATE FORM");
    let check = true;

    for(var i=0; i<input.length; i++) {
        if(validate(input[i]) == false){
            showValidate(input[i]);
            check=false;
        }
    }
    return check;
}

function validate (input) {
    console.log('validate(' + input + ')');
    let valid = true;

    if ($(input).val().trim() == '')  // if input is empty
        return false;

    switch ($(input).attr('name')) {
        case 'id_number': // invalid if string is not numerical or 8 digits
            if (isNaN($(input).val()) || $(input).val().length != 8) valid = false;
            break;
        case 'first_name' || 'middle_name' || 'last_name': 
            // invalid if string is not alphabetical
            break;
        case 'dlsu_mail': 
            // invalid if string does not end in @dlsu.edu.ph
            break;
    }
    
    return valid;
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
    let input = $('.validate-input .input');
    let current_fs, next_fs, previous_fs; //fieldsets
    let left, opacity, scale; //fieldset properties which we will animate
    let animating; //flag to prevent quick multi-click glitches

    checkEmptyInput();

    /* Checks if inputs are valid */
    $('.validate-form').on('submit', function () {
        let valid = validFieldSet(input);
        if (valid) {
            /* insert code here */
        } else {
            /* insert code here */
        }
    });

    /* Hides all validation alerts when document is loaded */
    $('.validate-form .input').each(function() {
        $(this).focus(function(){
           hideValidate(this);
        });
    });
    

    /* Animations for transitioning between fieldsets */
    $('.next').click(function() {
        if (animating) return false; // prevents multi-clicking
        animating = true;

        current_fs = $(this).parent(); // gets parent fieldset
        console.log(current_fs);
        next_fs = $(this).parent().next(); // gets fieldset after the parent fieldset
        
        // insert code for validation
        
        let children = current_fs.find('input,textarea');

        console.log(children);
        let valid = validFieldSet(children);
        console.log(valid);

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
    });

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

});