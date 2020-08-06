var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    avatar: {
        type: String, default: "https://image.shutterstock.com/image-vector/user-login-authenticate-icon-human-260nw-1365533969.jpg"
    },
    firstName: String,
    lastName: String,
    email: String,
    isAdmin: { type: Boolean, default: false },
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);
