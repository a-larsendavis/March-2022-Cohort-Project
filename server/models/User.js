//Use Modules here
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

//this is a mongoose constructor
let userSchema = new mongoose.Schema({
    username:String,
    password:String,
    fullname:String,
    birth:Date,
    email:String,
    zipcode:String,
    address:String,
    phone:String,
    primephone:String,
    ername:String,
    erphone:String,
    userpartner:String,
    primephysician:String,
    isAdmin: {
        type: Boolean,
        default: false
    },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);