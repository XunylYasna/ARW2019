const express = require('express');
const router = express.Router();

// database
var PouchDB = require('pouchdb');
const db = new PouchDB('http://localhost:5984/members');
let admin = require("firebase-admin");

// var serviceAccount = require("../lscs-arw-firebase-adminsdk-vdtdd-2c1a8fc18a.json");
let serviceAccount = {
    "type": "service_account",
    "project_id": "lscs-arw",
    "private_key_id": "2c1a8fc18a3bd63a90789e29319d788c17ddd0c6",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDt1U1spaEbZzSB\nd8JHWrE1OcC5UA1fb9xlmGdeacTCR1N2WzHWtsxHLu8rgTRIs5XVoui6QKkfj2/9\nuBJ452yatXLf5bazEWHMCxG0eoVsO8LEBCjokMILonELX34jrplO7XyE4L1mnKqI\nJdKFQ90t2bDqURK77i3EVDtNCNLkiCWTmi+S2+TP4nuOo5xwB7J/3CnDbamybUKS\nRQlaK01J82H9L7gLsWRmua/W4qUzMuU6tyLQ+GnLsI7KI7dAOVphIDdYkWHYDR8d\nW1S4zAvDFSGtFZPvCICdKKmYlJDJN7T7de0k5un95jWlQdG4dqW2ajzz3EYuC8Yy\n9ZN8SH4lAgMBAAECggEAEaOCsP6dsrcWRU3Y+krHHr/wQ64kt8HHkj9Z1z436gK5\nNWtxCFAZWWQpN8xG0OeEwsnowbt+74jHUQVgVVgwjU7MvL9ALAqreqMNhpmZoJvU\nB46ZbBokUhGTmbjU1Zei5iAl3oL+eQhAe4V2lgyg8EAXZ2Fo5sg02701grKXVXyA\n03ZicPd5OX83rqv3TN03rRFRVw+2EhBXGged4CyRku5YBy9ThyYWlg+R4gK+tDFY\nAoAhqJZPstrf7RIXhU3XfKuVwjnJppj6giDYmSnq4nFSZ/TBG1UmLpWO22dmadbt\nA9/CUqoeWBf7iZ/vUbqFbwIYhNM86iTZADhbmIAZBwKBgQD90qcM0QG6jFid0VZ9\nr4vOluHVeeUegpCoFuBZKUEumIGcZNweL+vi7uBsMKqfoA3FyicWjeQP3yMT1C/1\nNguiZEwYGyS7+hqFBD+mpFs5QF4HB7qyQbgoptp7kZ8KRRAH3cggjbk8d1HGx6+U\nK/tS7mfwm5ahTzgWM1Ux6GlFAwKBgQDv34ok7K1OlLtJew/C+/ki3IWXmu5tBOoa\nvTE8MpOY4ufHrIhxkVEsPbg+U09yycl+W7l2zQW/LB7wSO6Xb4Wb1cv2RebY/R8F\n6CjV3wG2p+OXZ7/l9wmiUbNcZ5gStbL35AtG8h2IwFCPwH/IYHwa2EGGySfSCmxl\nIBQNk8hjtwKBgQCyWqo9bEQdtG60fpua95Zy1TzdR6kC1lYVdvWwUTfXKRyyK4Es\nyRmkvZv/Cfdq8QmceR8cTxn5OR8p2MjWMmLcekOqELCwUd7+puyfCRB820j3Aaxj\ng6CHGC+f8sRhcAQCswnkLhICdgmFd11d7cXNEW8B+CJRORw9JVbxGdGWxwKBgQCH\nHBBBsBYF9vxu7SP5nde8bR3KQPge6++40+vRjmNYcCZBb8sCvOlN1A3c/Sv46fPW\nem/CnMSp434htdK99ZD6L7hMpR7cBebdeuDVZmEesv4cn9GVBEqm5QH0AF3F3BZM\nTmSTt3gvOLOn5LOU99OvgzOVaeRGCJz5cNIau6zZjQKBgEKtWyKtWh9sWv8JbOCF\nhjlHdZjZ2LXIw1PtIZH48U3ufgL41A21tp6smMTu+w1JiqnxFLITA8fM9TjQMzQS\ncGu4dA327DxlA1QufoNbh/BHgnIrxQelaZit3KxP1lKI0zfyd8uw8y1qVWg+6pZo\n1ecfgZMlnTHazyn9q7yK04RB\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-vdtdd@lscs-arw.iam.gserviceaccount.com",
    "client_id": "117784944876002213360",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-vdtdd%40lscs-arw.iam.gserviceaccount.com"    
};

let firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://lscs-arw.firebaseio.com"
});
let ref = firebase.database().ref('/members');

router.get('/accounting', (req,res) =>
    res.render('accounting')
)

router.get('/members', (req,res) =>
    res.render('members')
)

router.get('/sync', (req,res) => {
    ref.once('value').then(function (snapshot) {
        // FIREBASE to COUCH DB
        snapshot.forEach(function (doc) {
            db.get(doc.val()._id).then(function (remDoc) {
                return db.remove(remDoc._id, remDoc._rev);
            }).then(function (res) {
                let temp = doc.val();
                delete temp._rev
                return db.put(temp);
            }).then(function (res) {
                console.log("Updated: " + doc.val()._id); 
            }).catch (function (err) {
                if (err.name === 'not_found') {
                    let temp = doc.val();
                    delete temp._rev;
                    db.put(temp).then(function (res) {
                        console.log("Added: " + doc.val()._id);
                    });
                } else
                    console.log(err)
            })
        });

        return db.allDocs({include_docs: true})
    }).then(function(result) {
        // COUCH DB to FIREBASE
        result.rows.forEach(function (row) {
            ref.child(row.doc._id).set(row.doc).catch(function (err) {
                console.log(err);
            });
        });
        return ref.once('value');
    }).catch(function (err) {
        console.log(err);
    });
    
    res.redirect('/dashboard/members');
})


module.exports = router;