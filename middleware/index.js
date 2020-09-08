var Touristplace = require("../models/touristplace");
var Comment = require("../models/comment");
var User = require("../models/user");
// all middleware here
var middlewareObj = {};

middlewareObj.checkTouristplaceOwnership = function (req, res, next) {

    if (req.isAuthenticated()) {
        Touristplace.findById(req.params.id, function (err, foundTouristplace) {
            if (err || !foundTouristplace) {
                req.flash("error", "Touristplace not found");
                res.redirect("back");
            } else {
                // does user own touristplace?
                if ((foundTouristplace.author.id.equals(req.user._id)) || req.user.isAdmin) {
                    next();
                } else {
                    req.flash("error", "You don't have prmission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!!");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {

        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err || !foundComment) { //found comment could be null
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                // does user own comment?
                if ((foundComment.author.id.equals(req.user._id)) || (req.user.isAdmin)) {
                    next();
                } else {
                    req.flash("error", "you don't have permission to do that!")
                    res.redirect("back");
                }
            }
        });

    } else {
        req.flash("error", "You need to be logged in to do that!")
        res.redirect("back");
    }
}

middlewareObj.checkProfileOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {

        User.findById(req.params.user_id, function (err, foundUser) {
            if (err || !foundUser) {
                req.flash("error", "Sorry, that user doesn't exist");
                res.redirect("back");
            } else {
                if (foundUser._id.equals(req.user._id) || req.user.isAdmin) {
                    req.user = foundUser;
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!")
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that!!");
    res.redirect("/login");
}


module.exports = middlewareObj