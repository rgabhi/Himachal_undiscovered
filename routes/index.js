var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Touristplace = require("../models/touristplace");


//ROOT ROUTE
router.get("/", function (req, res) {
    res.render("landing");
});


// show register form
router.get("/register", function (req, res) {
    res.render("register", { page: 'register' });
});


//handle sign up logic
router.post("/register", function (req, res) {
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar,
    });
    if (req.body.adminCode === "valar_morghulis") {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome " + user.username + " !")
            res.redirect("/touristplaces");
        });
    });
});

//show login form 
router.get("/login", function (req, res) {
    res.render("login", { page: 'login' });
});

//handle login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/touristplaces",
    failureRedirect: "/login"
}), function (req, res) {

});

//logout route
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "You have been logged out!");
    res.redirect("/touristplaces");
});

// USERS ROUTE
router.get("/users/:id", function (req, res) {
    User.findById(req.params.id, function (err, foundUser) {
        if (err) {
            req.flash("error", "Something went wrong.");
            return res.redirect("/");
        }
        Touristplace.find().where('author.id').equals(foundUser._id).exec(function (err, touristplaces) {
            if (err) {
                req.flash("error", "Something went wrong.");
                return res.redirect("/");
            }
            res.render("users/show", { user: foundUser, touristplaces: touristplaces });
        });

    });
});

module.exports = router;
