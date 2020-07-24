var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
const campground = require("../models/campground");
var middleware = require("../middleware");

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
router.post("/", middleware.isLoggedIn, function (req, res) {
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
router.get("/new", middleware.isLoggedIn, function (req, res) {
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

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
    // is user logged in
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campgrounds/edit", { campground: foundCampground });
    });
});
// UPDATE CAMPGROUND
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    // find and update the correct campground

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            // redirect show page
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;