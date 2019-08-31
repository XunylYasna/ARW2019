const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
    registrationType: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    },

    amount:{ 
        type: String,
        required: true
    },

    score: {
        type: Number,
        default:0
    }
})

const Registration = mongoose.model('Registration', RegistrationSchema)

module.exports = Registration;