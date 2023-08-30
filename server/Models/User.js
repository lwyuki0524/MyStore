const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    phone: {
        type: String,
    },
    address: {
        trpe: String,
    }
},{ timestamps: true});

module.exports = mongoose.model('User',userSchema);