var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    phone: String,
    fullName: String,
    image: String,
    imageId: String,
    joined: { type: Date, default: Date.now },
    isAdmin: { type: Boolean, default: false },
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);
