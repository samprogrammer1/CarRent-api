const mongoose = require('mongoose');
const required = require('nodemon/lib/config');

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    isVerify: {
        type: Boolean
    },
    isAdmin : {
        type : Boolean
    }
},
    { timestamps: true }
);

module.exports = mongoose.model('user', userSchema);