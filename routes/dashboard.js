const express = require('express');
const router = express.Router();

// // Database
// const PouchDB = require('pouchdb')
// // var db = new PouchDB('members'); //local
// var db = new PouchDB('http://localhost:5984/members'); // web
// db.info()

router.get('/accounting', (req,res) =>
    res.render('accounting')
)

router.get('/members', (req,res) =>
    res.render('members')
)




module.exports = router;