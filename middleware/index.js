var Touristplace = require("../models/touristplace");
var Comment = require("../models/comment");
// all middleware goes here
var middlewareObj = {};

middlewareObj.checkTouristplaceOwnership = function (req, res, next) {

    if (req.isAuthenticated()) {
        Touristplace.findById(req.params.id, function (err, foundTouristplace) {
            if (err || !foundTouristplace) {
                req.flash("error", "Touristplace not found");
                res.redirect("back");
            } else {
                // does user own touristplace?
                console.log(req.user);
                if ((foundTouristplace.author.id.equals(req.user._id)) || req.user.isAdmin) {
                    next();
                } else {
                    req.flash("error", "You don't have prmission to do that");
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
                console.log(req.user);
                if ((foundComment.author.id.equals(req.user._id)) || (req.user.isAdmin)) {
                    next();
                } else {
                    req.flash("error", "you don't have permission to do that!")
                    res.redirect("back");
                }
            }
        });

    } else {
        req.flash("error", "You need to be logged in to do that!!")
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that!!");
    res.redirect("/login");
}


module.exports = middlewareObj