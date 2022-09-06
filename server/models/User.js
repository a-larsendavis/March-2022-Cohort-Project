//Use Modules here
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

//this is a mongoose constructor
let userSchema = new mongoose.Schema({
    username: String,
    password: String
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', userSchema);