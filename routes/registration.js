const express = require('express');
const router = express.Router();

// Database
const PouchDB = require('pouchdb')
var db = new PouchDB('members'); //local
// var db = new PouchDB('http://localhost:5984/members'); // web

router.get('/', (req,res) =>
    res.render('register',{
        rType: req.query.rType
    })
)

router.post('/submit', (req, res) => {
    let idNum = req.body.id_number;
    let firstName = req.body.first_name;
    let middleName = req.body.middle_name;
    let lastName = req.body.last_name;
    let course = req.body.course;

    let contactNum = req.body.contact_number;
    let facebookName = req.body.facebook_name;
    let email = req.body.dlsu_mail;
    
    let isOfficer = req.body.is_officer;
    let officerPos = req.body.officer_position;

    let recieptNum = req.body.reciept_number;
    
    let regType = req.body.registration_type;

    var doc = {
        "_id": idNum,
        "firstName": firstName,
        "middleName":middleName,
        "lastName":lastName,
        "course":course,
        "contactNum":contactNum,
        "facebookName":facebookName,
        "email":email,
        "isOfficer":isOfficer,
        "officerPos":officerPos,
        "recieptNum":recieptNum,
        "regType":regType,
        "date": Date.now()
      };
      db.put(doc);

      res.render('welcome',{
        message: regType + " member added sucessfully"
    })
})


module.exports = router;