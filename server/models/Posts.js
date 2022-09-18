const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

//Post Schema
const PostSchema = new mongoose.Schema(
    {
        zipcode: {
            type:String,
        },
        bgColor:{
            type:String,
            default:"9CAA9C",
        },
        postit: {
            type: String,
            max: 500,
        },
        img: {
            type: String,
        },
        likes: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true }
);

PostSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Post", PostSchema);