var express = require("express");
var router = express.Router();
var Campground = require("../models/campground")

// INDEX ROUTE - show all campmgrounds
router.get("/", function (req, res) {
    //GET ALL campgrounds from DB
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds, currentUser: req.user });
        }
    })
});

// CREATE ROUTE - add new camp to the database
router.post("/", isLoggedIn, function (req, res) {
    //GET DATA FROM THE FORM AND ADD TO CAMPGROUNDS 
    // REDIRECT BACK TO CAMPGROUNDS PAGE
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = { name: name, image: image, description: description, author: author };
    //CREATE A NEW CAMPGROUND AND SAVE TO DATABASE
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// NEW ROUTE- show form to create new campground
router.get("/new", isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
})

//SHOW ROUTE - shows more info about one campground
router.get("/:id", function (req, res) {
    //find campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;