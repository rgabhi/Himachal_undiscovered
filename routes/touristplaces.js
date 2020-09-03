require('dotenv').config();
var express = require("express");
var router = express.Router();
var Touristplace = require("../models/touristplace");
//const touristplace = require("../models/touristplace");
var middleware = require("../middleware");
// UPLOAD IMAGES
var multer = require('multer');
var storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter });

var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'dzwljlxwl',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// INDEX ROUTE - show all touristplaces
router.get("/", function (req, res) {
    if (req.query.search) {
        // fuzzy search
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Touristplace.find({ $or: [{ name: regex }, { "author.username": regex }] }, function (err, allTouristplaces) {
            if (err) {
                console.log(err);
            } else {
                if (allTouristplaces.length < 1) {
                    req.flash("error", " No location matched your search.Try again!");
                    return res.redirect("back");
                }
                res.render("touristplaces/index", { touristplaces: allTouristplaces, page: 'touristplaces' });
            }
        });
    } else {
        // Get all touristplaces from DB
        Touristplace.find({}, function (err, allTouristplaces) {
            if (err) {
                console.log(err);
            } else {
                res.render("touristplaces/index", { touristplaces: allTouristplaces, page: 'touristplaces' });
            }
        });
    }

});

// CREATE ROUTE - add new touristplace to the database
router.post("/", middleware.isLoggedIn, upload.single('image'), function (req, res) {
    cloudinary.v2.uploader.upload(req.file.path, function (err, result) {
        if (err) {
            res.flash("error", err.message);
            return res.redirect("back");
        }
        // add cloudinary url for the image to the touristplace object under image property
        req.body.touristplace.image = result.secure_url;
        // add image's public_id to touristplace object
        req.body.touristplace.imageId = result.public_id;
        // add author to touristplace
        req.body.touristplace.author = {
            id: req.user._id,
            username: req.user.username
        }
        //CREATE A NEW TOURISTPLACE AND SAVE TO DATABASE
        Touristplace.create(req.body.touristplace, function (err, touristplace) {
            if (err) {
                req.flash('error', err.message);
                return res.redirect('back');
            }
            // REDIRECT BACK TO TOURISTPLACE PAGE
            res.redirect('/touristplaces/' + touristplace.id);
        });
    });
});



// NEW ROUTE- show form to create new touristplace
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("touristplaces/new");
})

//SHOW ROUTE - shows more info about one touristplace
router.get("/:id", function (req, res) {
    //find touristplace with provided id
    Touristplace.findById(req.params.id).populate("comments").exec(function (err, foundTouristplace) {
        if (err || !foundTouristplace) { // foundTouristplace could be null
            req.flash("error", "Touristplace not found")
            res.redirect("back");
        } else {
            // console.log(foundTouristplace);
            //render show template with that touristplace
            res.render("touristplaces/show", { touristplace: foundTouristplace });
        }
    });
});

//EDIT TOURISTPLACE ROUTE
router.get("/:id/edit", middleware.checkTouristplaceOwnership, function (req, res) {
    // is user logged in
    Touristplace.findById(req.params.id, function (err, foundTouristplace) {
        res.render("touristplaces/edit", { touristplace: foundTouristplace });
    });
});
// UPDATE TOURISTPLACE
router.put("/:id", middleware.checkTouristplaceOwnership, upload.single('image'), function (req, res) {
    Touristplace.findById(req.params.id, async function (err, touristplace) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        } else {
            if (req.file) {
                try {
                    await cloudinary.v2.uploader.destroy(touristplace.imageId);
                    var result = await cloudinary.v2.uploader.upload(req.file.path);
                    touristplace.imageId = result.public_id;
                    touristplace.image = result.secure_url;
                } catch (err) {
                    req.flash("error", err.message);
                    return res.redirect("back");
                }
            }
            touristplace.name = req.body.touristplace.name;
            touristplace.price = req.body.touristplace.price;
            touristplace.description = req.body.touristplace.description;
            touristplace.save();
            req.flash("success", "Successfully Updated!");
            res.redirect("/touristplaces/" + req.params.id);
        }
    });
    // find and update the correct touristplace
    // Touristplace.findByIdAndUpdate(req.params.id, req.body.touristplace, function (err, updatedTouristplace) {
    //     if (err) {
    //         res.redirect("/touristplaces");
    //     } else {
    //         // redirect show page
    //         res.redirect("/touristplaces/" + req.params.id);
    //     }
    // });
});



// DESTROY TOURISTPLACE ROUTE
router.delete("/:id", middleware.checkTouristplaceOwnership, function (req, res) {
    Touristplace.findById(req.params.id, async function (err, touristplace) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        try {
            await cloudinary.v2.uploader.destroy(touristplace.imageId);
            touristplace.remove();
            req.flash('success', 'Touristplace deleted successfully!');
            res.redirect('/touristplaces');
        } catch (err) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
        }
    });
    // Touristplace.findByIdAndRemove(req.params.id, function (err) {
    //     if (err) {
    //         res.redirect("/touristplaces");
    //     } else {
    //         res.redirect("/touristplaces");
    //     }
    // });
});


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router;