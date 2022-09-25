const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

//Post Schema
const PostSchema = new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'users'
        },
        zipcode: {
            type:String,
        },
        username: {
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
        likes: [
            {
                user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'users'
                }
            }
        ]
    },
    { timestamps: true }
);

PostSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Post", PostSchema);