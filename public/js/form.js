/* Script for register.hbs */
/* Global Variables */
let currentURL, mainURL, currentPathname, pageNum, isOfficer;
// alert(rType) // Type of Registration

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
        case 'id_number': 
            if (isNaN(value) || value.length != 8) return false;
            break;
        case 'contact_number':
            if (isNaN(value) || value.length != 11 || !value.startsWith("09")) return false;
            break;
        case 'facebook_name':
            if (value.match(/^([0-9a-zA-Z.\-][ ]?)+$/) === null) return false;
            break;
        case 'first_name': case 'middle_name': case 'last_name': 
            if (value.match(/^([a-zA-Z.\-][ ]?)+$/) === null) return false;
            break;
        case 'receipt_number': 
            if (isNaN(value) || value.length != 5) valid = false;
            break;
        case 'dlsu_mail': 
            if (value.match(/^([0-9a-zA-Z._\-][ ]?)+@dlsu.edu.ph$/) === null) return false;
            break;
        case 'terms_left':
            if (isNaN(value)) return false;
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
    let animating; //flag to prevent quick multi-click glitches
    let valid;
    $('.next').click(function() {
        if (animating) return false; // prevents multi-clicking
        animating = true;

        current_fs = $(this).parent(); // gets parent fieldset
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
            animating = nextScreenAnimation(current_fs, next_fs);
        } else {
            setNextEvent();
        }
    });
}

function nextScreenAnimation(current_fs, next_fs) {
    console.log('nextScreenAnimation')
    next_fs.show();
    let left, opacity, scale; //fieldset properties which we will animate
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
            return false;
        },
        easing: 'easeInOutBack'
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

function animateReset () {
    let left, opacity, scale; //fieldset properties which we will animate
    let current_fs = $('#receipt_fs');
    let next_fs = $('#personal_fs');
            
    // insert code for progress bar (not done)

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
            next_fs.css({'left': left, 'opacity': opacity, 'transform': 'scale(1)'});
        },
        duration: 800,
        complete: function() {
            console.log("yz");
            current_fs.hide();
            animating = false;
        },
        easing: 'easeInOutBack'
    });
}

function resetForm () {
    let id_number = document.getElementsByName('id_number')[0];
    let first_name = document.getElementsByName('first_name')[0];
    let middle_name = document.getElementsByName('middle_name')[0];
    let last_name = document.getElementsByName('last_name')[0];
    let dlsu_mail = document.getElementsByName('dlsu_mail')[0];
    let contact_number = document.getElementsByName('contact_number')[0];
    let facebook_name = document.getElementsByName('facebook_name')[0];
    let receipt_number = document.getElementsByName('receipt_number')[0];
    let terms_left = document.getElementsByName('terms_left')[0];
    let course = document.getElementsByName('course')[0];

    id_number.value = '';
    first_name.value = '';
    middle_name.value = '';
    last_name.value = '';
    dlsu_mail.value = '';
    contact_number.value = '';
    facebook_name.value = '';
    receipt_number.value = '';
    terms_left.value = '';
    course.value = '';

    let presetRadio = "false";
    $("[name=is_officer]").filter("[value='"+presetRadio+"']").prop("checked", true);
    $("[name=inlineRadioOptions]").filter("[value='"+presetRadio+"']").prop("checked", true);

    let officerOptions = document.querySelectorAll('#officer-pos option');
    for (let i = 0, l = officerOptions.length; i < l; i++) {
        officerOptions[i].selected = officerOptions[i].defaultSelected;
    }

    cntr.style.display = 'none';
    jof.style.display = 'block';

    // let courseOptions = document.querySelectorAll('#course option');
    // for (let i = 0, l = courseOptions.length; i < l; i++) {
    //     courseOptions[i].selected = courseOptions[i].defaultSelected;
    // }

    checkEmptyInput();
    $('.validate-form .input').each(function() {
        $(this).focus(function(){
           hideValidate(this);
        });
    });
}

function setSubmitEvent () {
    let id_number = document.getElementsByName('id_number')[0];
    let first_name = document.getElementsByName('first_name')[0];
    let middle_name = document.getElementsByName('middle_name')[0];
    let last_name = document.getElementsByName('last_name')[0];
    let dlsu_mail = document.getElementsByName('dlsu_mail')[0];
    let contact_number = document.getElementsByName('contact_number')[0];
    let facebook_name = document.getElementsByName('facebook_name')[0];
    let receipt_number = document.getElementsByName('receipt_number')[0];

    let terms_left = document.getElementsByName('terms_left')[0];
    let e = document.getElementById('inlineFormCustomSelect');
    let college = e.options[e.selectedIndex].value

    let course = document.getElementsByName('course')[0];
    let member_type = document.getElementById('member_type');
    
    $('.validate-form').submit(function (e) {
        e.preventDefault(); // prevent actual submitting        
        let children = $('#receipt_fs').find('input,textarea'); 
        let valid = validFieldSet(children);
        let yes = document.getElementById('inlineRadio1');
        let joProgram;

        // set hidden submit value
        if(document.getElementById('officer-radio').checked) {
            member_type.value = document.getElementById('officer-pos').value;
            isOfficer = true;
        } else if(document.getElementById('member-radio').checked) {
            member_type.value = "";
            isOfficer = false;
        }

        if (yes.checked) {
            joProgram = true;
        } else {
            joProgram = false;
        }

        if (valid) {
            
            console.log();
            console.log();
            console.log('AJAX');
            let url = currentURL.split(currentPathname)[0] + '/register/submit';
            console.log(url);

            let data = {
                id_number: id_number.value,
                first_name: first_name.value,
                middle_name: middle_name.value,
                last_name: last_name.value,
                dlsu_mail: dlsu_mail.value,
                contact_number: contact_number.value,
                facebook_name: facebook_name.value,
                receipt_number: receipt_number.value,
                course: course.value,
                member_type: member_type.value,
                is_officer: isOfficer,
                registration_type: rType,
                jo_program: joProgram,
                college: college,
                terms_left: terms_left.value
            }
            console.log("DATA");
            console.log(data);

            /* insert ajax submit code here */
            $.ajax({
                url: url,
                method: "POST",
                data: data, 
                timeout: 5000,
                success: function(result){
                    console.log("SUCCESS BOIS");
                    console.log(result);
                    
                    if (rType === 'Honorary' || rType === 'OldMemberSolo' || rType === 'NewMemberSolo' || pageNum === 5) {
                        /* Insert thank you screen */
                        nextScreenAnimation($('#receipt_fs'), $('#done_fs'));
                    } else {
                        /* Increment page */
                        window.history.pushState(pageNum++, document.getElementsByTagName("title")[0].innerHTML, mainURL +"/" + pageNum);
                        animateReset();
                        resetForm();
                    }
                },
                error: function(error) {
                    console.log("FAIL");
                    console.log(error);
                }
            });
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

function setOfficerRadioEvent () {
    let cntr = document.getElementById('officer-pos-ctnr');
    let officer = document.getElementById('officer-radio');
    let member =  document.getElementById('member-radio');

    isOfficer = false;
    let jof = document.getElementById('jo-form');

    let presetRadio = "false";
    $("[name=inlineRadioOptions]").filter("[value='"+presetRadio+"']").prop("checked", true);
    $("[name=is_officer]").filter("[value='"+presetRadio+"']").prop("checked", true);


    officer.onclick = () => {
        if (cntr.style.display = 'none'){
            cntr.style.display = 'block';
            jof.style.display = 'none';
        }
        isOfficer = true;
    };

    member.onclick = () => {
        if (cntr.style.display = 'block'){
            cntr.style.display = 'none';
            jof.style.display = 'block';
        }
        isOfficer = false;
    };
}

function checkRType () {
    console.log("RTYPE IS " + rType)
    switch(rType) {
        case 'OldMemberSolo': return 'Payment: P230';
        case 'NewMemberSolo': return 'Payment: P250';
        case 'Honorary': return 'Payment: P50';
        case 'OldMemberGroup': 
            if (isNaN(pageNum)) {
                pageNum = 1;
                history.replaceState(mainURL = currentURL, 
                    document.getElementsByTagName("title")[0].innerHTML, 
                    mainURL + "/" + pageNum);
            } else {
                history.replaceState(pageNum = pageNum, 
                    document.getElementsByTagName("title")[0].innerHTML, 
                    mainURL + "/" + pageNum);
            }
            return 'Payment: P200';
        case 'NewMemberGroup': 
            if (isNaN(pageNum)) {
                pageNum = 1;
                history.replaceState(mainURL = currentURL, 
                    document.getElementsByTagName("title")[0].innerHTML, 
                    mainURL + "/" + pageNum);
            } else {
                history.replaceState(pageNum = pageNum, 
                    document.getElementsByTagName("title")[0].innerHTML, 
                    mainURL + "/" + pageNum);
            }
            return 'Payment: P230';
        default: return 'Invalid transaction';
    }
}

$(document).ready(function () {
    currentURL = window.location.href;
    currentPathname = window.location.pathname;
    let total = document.getElementById('total');

    
    rType = rType.split('/');
    console.log('rType = ' + rType);
    console.log("wowie = "+mainURL);
    if (mainURL === undefined) {
        mainURL = "/register?rType=" + rType[0];
        pageNum = rType[1];
        rType = rType[0];
        console.log("mainURL = " + mainURL);
    }

    console.log('LOCATION');
    console.log(currentURL);
    console.log(currentPathname);

    total.innerHTML = checkRType();

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
    // setInputLeaveEvent();
    setOfficerRadioEvent();

});