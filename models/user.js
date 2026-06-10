const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const passportLocalMongoose = require("passport-local-mongoose").default;



const userSchema = new Schema({
    email:{
        type: String,
        required: true,
    },
});

userSchema.plugin(passportLocalMongoose); // for automatically add username and password fields to the schema and also add some methods for authentication

module.exports = mongoose.model('User', userSchema);
