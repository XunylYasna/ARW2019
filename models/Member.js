const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    idNum: {
        type: Number,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    datejoined: {
        type: Date,
        default: Date.now
    },

    course:String,
    contactNum: Number,
    facebookName: String
})

const Member = mongoose.model('Member', MemberSchema)

module.exports = Member;