var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    avatar: {
        type: String, default: "https://images.unsplash.com/photo-1595744197503-47a9f334692f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
    },
    firstName: String,
    lastName: String,
    email: String,
    isAdmin: { type: Boolean, default: false },
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);