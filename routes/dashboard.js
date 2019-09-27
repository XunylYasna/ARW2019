const express = require('express');
const router = express.Router();

// // Database
// const PouchDB = require('pouchdb')
// // var db = new PouchDB('members'); //local
// var db = new PouchDB('http://localhost:5984/members'); // web
// db.info()

// database
const PouchDB = require('pouchdb');
const db = new PouchDB('http://localhost:5984/members');
var admin = require("firebase-admin");

var serviceAccount = require("../lscs-arw-firebase-adminsdk-vdtdd-2c1a8fc18a.json");

var firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://lscs-arw.firebaseio.com"
});

router.get('/accounting', (req,res) =>
    res.render('accounting')
)

router.get('/members', (req,res) =>
    res.render('members')
)

router.get('/sync', (req,res) => {
    // if ()
    db.allDocs({
        include_docs: true
    }).then(function(result) {
        db.allDocs({
            include_docs: true
        }).then(function(result) {
            result.rows.forEach(function (row) {
                var doc = row.doc;
                delete doc._rev;
                firebase.database().ref('/members/' + doc._id).set(doc)
            });
            console.log("Syncing Done!");
        }).catch(function (err) {
            console.log(err);
        });
        
        console.log("Syncing Done!");
        res.redirect('/dashboard/members');
    }).catch(function (err) {
        console.log(err);
    });
})


module.exports = router;