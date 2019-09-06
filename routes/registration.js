const express = require('express');
const router = express.Router();

router.get('/', (req,res) =>
    res.render('register')
)

router.post('/process', urlencoder, function(req, res){
    var name = req.body.name;
    var idNum = req.body.idNum;
    var email = req.body.email;
    var course = req.body.course;
    var contactNum = req.body.contactNum;
    var facebookName = req.body.facebookName;

    let member = new Member({
        name: name,
        idNum: idNum,
        email: email,
        course: course,
        contactNum: contactNum,
        facebookName: facebookName
    });
})


module.exports = router;