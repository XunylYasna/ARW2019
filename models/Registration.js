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
        type: Number,
        required: true
    }
})

const Registration = mongoose.model('Registration', RegistrationSchema)

module.exports = Registration;