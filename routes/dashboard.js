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

var ref = firebase.database().ref('/members');

router.get('/accounting', (req,res) =>
    res.render('accounting')
)

router.get('/members', (req,res) =>
    res.render('members')
)

router.get('/sync', (req,res) => {
    var doc
    db.allDocs({
        include_docs: true
    }).then(function(result) {
        // COUCH DB to FIREBASE
        result.rows.forEach(function (row) {
            doc = row.doc;
            delete doc._rev;
            ref.child(doc._id).set(doc).catch(function (err) {
                console.log(err);
            });
        })
        
        // FIREBASE to COUCH DB
        return ref.once('value');
    }).then(function (snapshot) {
        snapshot.forEach(function (doc) {
            db.put(doc.val()).catch(function (err) {
                console.log(err);
            });
        })
    }).catch(function (err) {
        console.log(err);
    });
    
    res.redirect('/dashboard/members');
})


module.exports = router;