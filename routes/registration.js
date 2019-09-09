const express = require('express');
const router = express.Router();

router.get('/', (req,res) =>
    res.render('register')
)

router.post('/process', /*urlencoder,*/ function(req, res){
    let idNum = req.body.id_number;
    let firstName = req.body.first_name;
    let middleName = req.body.middle_name;
    let lastName = req.body.last_name;
    let email = req.body.dlsu_mail;
    let course = req.body.course;
    let contactNum = req.body.contact_number;
    let facebookName = req.body.facebook_name;
    let isOfficer = req.body.is_officer;
    let officerPos = req.body.officer_position;
    let recieptNum = req.body.reciept_number;


    let member = new Member({
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        idNum: idNum,
        email: email,
        course: course,
        contactNum: contactNum,
        facebookName: facebookName,
        isOfficer: isOfficer,
        officerPos: isOfficer,
        recieptNum: recieptNum
    });
})


module.exports = router;