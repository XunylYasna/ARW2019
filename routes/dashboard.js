const express = require('express');
const router = express.Router();


router.get('/accounting', (req,res) =>
    res.render('accounting')
)

router.get('/members', (req,res) =>
    res.render('members')
)




module.exports = router;