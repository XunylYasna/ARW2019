const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    idNum: {
        type: String,
        required: true
    }, 
    firstName: {
        type: String,
        required: true
    }, 
    middleName: {
        type: String,
        required: true
    }, 
    lastName: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true
    }, 
    course: {
        type: String,
        required: true
    }, 
    contactNum: {
        type: Number
    }, 
    fbName: {
        type: String
    }, 
    memberType: {
        type: String,
        required: true
    }, 
    receiptNum: {
        type: String,
        required: true
    },
    datejoined: {
        type: Date,
        default: Date.now
    }
});

const Member = mongoose.model('Member', MemberSchema);

exports.create = function(member){
    return new Promise(function(resolve, reject){
      let m = new Member(member)
  
      m.save().then((newMember)=>{
        resolve(newMember)
      }, (err)=>{
        reject(err)
      })
    })
};

module.exports = Member;