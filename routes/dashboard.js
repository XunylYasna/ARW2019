const express = require('express');
const router = express.Router();
const fs = require('fs');

// database
const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('http://localhost:5984/members');
let admin = require("firebase-admin");

let serviceAccount = require("../serviceAccountFirebase.json");


let firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://lscs-registration-2019.firebaseio.com"
});
let ref = firebase.database().ref('/members');

router.get('/accounting', (req,res) =>{


    var HA = 50, HQ = 0, NMSQ = 0, NMSA = 250, OMSA = 230, OMSQ = 0, NMGQ = 0, NMGA = 230, OMGQ = 0, OMGA = 200;
    var TQ, TA;

    db.allDocs({
        include_docs: true
      }).then(function (entries) {
        
        for (var i = 0, len = entries.rows.length; i < len; i++){
            var row = entries.rows[i].doc
            // console.log(row.registration_type)
            if (row.registration_type == 'Honorary') {
                HQ++;
            }else if(row.registration_type == 'OldMemberSolo'){
                OMSQ++
            }else if(row.registration_type == 'NewMemberSolo'){
                NMSQ++
            }else if(row.registration_type == 'OldMemberGroup'){
                OMGQ++
            }else if(row.registration_type == 'NewMemberGroup'){
                NMGQ++
            }
        } 
        HA *= HQ
        NMSA *= NMSQ
        OMSA *= OMSQ
        OMGA *= OMGQ
        NMGA *= NMGQ
        TA = HA + NMSA + OMSA + OMGA + NMGA
        TQ = HQ + NMSQ + OMSQ + OMGQ + NMGQ
        res.render('accounting',{
            HA, HQ, NMSQ, NMSA, OMSA, OMSQ, NMGQ, NMGA, OMGQ, OMGA, TQ, TA
        })
    }).catch((err) => {
        console.log(err)
        res.render('accounting')
    });
})

function formatDate(date) {
   
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
  
    return month +'-'+day+'-'+year;
  }

// Today
router.get('/accounting/today', (req,res) =>{

    var HA = 50, HQ = 0, NMSQ = 0, NMSA = 250, OMSA = 230, OMSQ = 0, NMGQ = 0, NMGA = 230, OMGQ = 0, OMGA = 200;
    var TQ, TA;
    var today = formatDate(new Date);
    db.find({
        selector: {date: {$regex: ('^'+today)}},
        fields: ['_id','registration_type'],
        }).then(function (entries) {
            // console.log(entries)
            for (var i = 0, len = entries.docs.length; i < len; i++){
                var row = entries.docs[i]
                if (row.registration_type == 'Honorary') {
                    HQ++;
                }else if(row.registration_type == 'OldMemberSolo'){
                    OMSQ++
                }else if(row.registration_type == 'NewMemberSolo'){
                    NMSQ++
                }else if(row.registration_type == 'OldMemberGroup'){
                    OMGQ++
                }else if(row.registration_type == 'NewMemberGroup'){
                    NMGQ++
                }
            } 
            HA *= HQ
            NMSA *= NMSQ
            OMSA *= OMSQ
            OMGA *= OMGQ
            NMGA *= NMGQ
            TA = HA + NMSA + OMSA + OMGA + NMGA
            TQ = HQ + NMSQ + OMSQ + OMGQ + NMGQ
            res.render('accounting',{
                HA, HQ, NMSQ, NMSA, OMSA, OMSQ, NMGQ, NMGA, OMGQ, OMGA, TQ, TA
            })
        }).catch(function (err) {
            console.log(err);
            res.render('accounting')
        });
})

router.get('/members', (req,res) =>{
    

    db.allDocs({
        include_docs: true
      }).then(function (entries) {
        var dataSet = [];
        for (var i = 0, len = entries.rows.length; i < len; i++){
            var row = entries.rows[i].doc
            var rowData = {
                ID_Number: row._id,
                Last_Name: row.firstName,
                First_Name: row.lastName,
                Middle_Name: row.middleName,
                College: row.college,
                Degree_Program: row.course,        
                Contact_Number: row.contactNum,       
                Facebook_Name: row.facebookName,
                Email: row.email,
                Is_Officer: row.isOfficer,
                Is_JO: row.joProgram,
                Position: row.officerPos,
                Receipt_Number: row.recieptNum,
            }
            dataSet[i] = rowData;
        } 
        res.render('members',{
            dataSet
        })
    }).catch((err) => {
        console.log(err)
    });
    
})

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


// Export to CSV
function setPrice(rType){
    switch(rType) {
        case 'OldMemberSolo': return 230;
        case 'NewMemberSolo': return 250;
        case 'Honorary': return 50;
        case 'OldMemberGroup': return 200;
        case 'NewMemberGroup': return 230;
        default: return 'Invalid transaction';
    }
}

router.get('/export', (req,res) => {
    console.log('Exporting...')
    var CSV;
    db.allDocs({
        include_docs: true
      }).then(function (entries) {
        for (var i = 0, len = entries.rows.length; i < len; i++){
            var row = entries.rows[i].doc
            var date = row.date
            var idnum = row._id
            var fname = row.firstName
            var lname = row.lastName
            var mname = row.middleName
            var college = row.college
            var course =  row.course       
            var conactnum = row.contactNum   
            var fbname = row.facebookName
            var dlsuE = row.email
            var isOfficer = row.isOfficer
            var isJO = row.joProgram
            var posi = row.officerPos
            var receipt =  row.recieptNum
            var tleft = row.termsLeft
            var regtype = row.registration_type
            var price = setPrice(regtype);

            

            var rowValues = [date,receipt, idnum, fname, mname, lname, tleft, college, course, conactnum, fbname, dlsuE, isOfficer, regtype, price,isJO,posi];
            // turn object to csv string
            var CSVString = rowValues.join(',');
            CSVString += "" + "\n";
            CSV += CSVString
        }
        
        // Create registration file
        var stream = fs.createWriteStream("export.csv", {flags:'w'});
        stream.write(CSV)
        stream.end();
        console.log('Exported to export.csv file')
        res.redirect('/dashboard/members');
    }).catch((err) => {
        console.log(err)
    });
    
})


module.exports = router;