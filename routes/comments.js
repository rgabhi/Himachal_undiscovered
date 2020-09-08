var express = require("express");
var router = express.Router({ mergeParams: true });
var Touristplace = require("../models/touristplace");
var Comment = require("../models/comment");
// const { route } = require("./touristplaces");
var middleware = require("../middleware");

// NEW ROUTE
router.get("/new", middleware.isLoggedIn, function (req, res) {
    //find touristplace by id
    Touristplace.findById(req.params.id, function (err, touristplace) {
        if (err) {
            console.log(err)

        } else {
            res.render("comments/new", { touristplace: touristplace });
        }
    });
});

// CREATE ROUTE
router.post("/", middleware.isLoggedIn, function (req, res) {
    //lookup touristplace using id
    Touristplace.findById(req.params.id, function (err, foundTouristplace) {
        if (err) {
            // console.log(err);
            res.redirect("/touristplaces");
        } else {
            var ratedArray = [];
            foundTouristplace.hasRated.forEach(function (rated) {
                ratedArray.push(String(rated));
            });
            if (ratedArray.includes(String(req.user._id))) {
                req.flash(
                    "error",
                    "You've already reviewed this place, please edit your review instead."
                );
                res.redirect("/touristplaces/" + req.params.id);
            } else {
                Touristplace.findById(req.params.id, function (err, touristplace) {
                    if (err) {
                        console.log(err);
                        res.redirect("/touristplaces");
                    } else {
                        Comment.create(req.body.comment, function (err, comment) {
                            if (err) {
                                req.flash("error", "Something went wrong");
                                console.log(err);
                            } else {
                                // add username and id to comment
                                comment.author.id = req.user._id;
                                comment.author.username = req.user.username;
                                comment.save();
                                //save comment
                                touristplace.comments.push(comment);
                                touristplace.save();
                                req.flash("success", "Successfully added comment");
                                res.redirect("/touristplaces/" + touristplace._id);
                            }
                        });
                    }

                });
            }
        }
    });
});
// COMMENTS EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
    Touristplace.findById(req.params.id, function (err, foundTouristplace) {
        if (err || !foundTouristplace) {
            req.flash("error", "Touristplace not found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                res.render("comments/edit", { touristplace_id: req.params.id, comment: foundComment });
            }
        });
    });
});

// COMMENTS UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Review updated!");
            res.redirect("/touristplaces/" + req.params.id);
        }
    });
});
// COMMENTS DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            Touristplace.findByIdAndUpdate(
                req.params.id,
                { $pull: { comments: { $in: [req.params.comment_id] } } },
                function (err) {
                    if (err) {
                        console.log(err);
                    }
                }
            );
            Touristplace.findByIdAndUpdate(
                req.params.id,
                { $pull: { hasRated: { $in: [req.user._id] } } },
                function (err) {
                    if (err) {
                        console.log(err);
                    }
                }
            );
            req.flash("successs", "Comment deleted");
            res.redirect("/touristplaces/" + req.params.id);
        }
    });
});


module.exports = router;