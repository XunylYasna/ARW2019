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

router.post('/process', urlencoder, (req, res) => {
    console.log('/process');
    let member = {
        idNum: req.body.id_number, 
        firstName: req.body.first_name, 
        middleName: req.body.middle_name, 
        lastName: req.body.last_name, 
        email: req.body.dlsu_mail, 
        course: req.body.course, 
        contactNum: req.body.contact_number, 
        fbName: req.body.facebook_name, 
        memberType: req.body.member_type, 
        receiptNum: req.body.receipt_number 
    }

    Member.create(member).then((member)=>{
        console.log("successful member logging " + member)
        console.log('Name: ' + member.firstName);
        res.send(member);
    }, (error)=>{
        console.log('ERROR ERROR');
        console.log(error);
    })
});


module.exports = router;