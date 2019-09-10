const express = require('express');
const router = express.Router();
const bodyparser = require("body-parser");
const urlencoder = bodyparser.urlencoded({
    extended : true
});
router.use(urlencoder);
const Member = require("../models/Member");

router.get('/', (req,res) =>
    res.render('register')
)

router.get(['/', '/honorary', '/old', '/new','/old/1', '/old/2', '/old/3', '/old/4', '/old/5', 
    '/new/1', '/new/2', '/new/3', '/new/4', '/new/5'], (req,res) =>
    res.render('register')
);

router.post('/process', urlencoder, function(req, res){
    console.log('/process');
    let idNum = req.body.id_number;
    let firstName = req.body.first_name;
    let middleName = req.body.middle_name;
    let lastName = req.body.last_name;
    let email = req.body.dlsu_mail;
    let course = req.body.course;
    let contactNum = req.body.contact_number;
    let facebookName = req.body.facebook_name;
    let memberType = req.body.memberType;
    let receiptNum = req.body.receipt_number;
});


module.exports = router;