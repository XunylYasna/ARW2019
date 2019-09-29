const express = require('express');
const router = express.Router();

// Database
const PouchDB = require('pouchdb');
// var db = new PouchDB('members'); //local
var db = new PouchDB('http://localhost:5984/members'); // web

router.get('/', (req,res) =>
    res.render('register',{
        rType: req.query.rType
    })
)

router.post('/submit', (req, res) => {
    console.log('POST /SUBMIT');

    let idNum = req.body.id_number;
    let firstName = req.body.first_name;
    let middleName = req.body.middle_name;
    let lastName = req.body.last_name;
    let course = req.body.course;

    let contactNum = req.body.contact_number;
    let facebookName = req.body.facebook_name;
    let email = req.body.dlsu_mail;
    
    let isOfficer = req.body.is_officer;
    let officerPos = req.body.member_type;

    let receiptNum = req.body.receipt_number;
    
    let regType = req.body.registration_type;
    let joProgram = req.body.jo_program;
    let college = req.body.college;
    let termsLeft = req.body.terms_left

    let doc = {
        "_id": idNum,
        "firstName": firstName,
        "middleName":middleName,
        "lastName":lastName,
        "course":course,
        "contactNum":contactNum,
        "facebookName":facebookName,
        "email":email,
        "isOfficer":isOfficer,
        "joProgram":joProgram,
        "officerPos":officerPos,
        "recieptNum":receiptNum,
        "registration_type":regType,
        "college": college,
        "termsLeft": termsLeft,
        "date": Date.now()
    };

    console.log(doc);
    
    db.put(doc, function callback(err, result) {
        if (!err) {
            res.render('welcome',{
                message: regType + " member added sucessfully"
            })
        } else {
            console.log("ERROR");
            console.log(err);
        }
    });
        
})


module.exports = router;