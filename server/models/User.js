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
    familymember1:String,
    familymember2:String,
    familymember3:String
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);