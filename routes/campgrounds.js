var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
const campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX ROUTE - show all campmgrounds
router.get("/", function (req, res) {
    if (req.query.search) {
        // fuzzy search
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Campground.find({ $or: [{ name: regex }, { "author.username": regex }] }, function (err, allCampgrounds) {
            if (err) {
                console.log(err);
            } else {
                if (allCampgrounds.length < 1) {
                    req.flash("error", " No Campgrounds matched your search.Try again!");
                    return res.redirect("back");
                }
                res.render("campgrounds/index", { campgrounds: allCampgrounds, page: 'campgrounds' });
            }
        });
    } else {
        // Get all campgrounds from DB
        Campground.find({}, function (err, allCampgrounds) {
            if (err) {
                console.log(err);
            } else {
                res.render("campgrounds/index", { campgrounds: allCampgrounds, page: 'campgrounds' });
            }
        });
    }

});

// CREATE ROUTE - add new camp to the database
router.post("/", middleware.isLoggedIn, function (req, res) {
    //GET DATA FROM THE FORM AND ADD TO CAMPGROUNDS 
    // REDIRECT BACK TO CAMPGROUNDS PAGE
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = { name: name, price: price, image: image, description: description, author: author };
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
        if (err || !foundCampground) { // foundCampground could be null
            req.flash("error", "Campground not found")
            res.redirect("back");
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


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router;