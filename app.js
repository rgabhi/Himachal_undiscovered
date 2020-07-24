var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment"),
  User = require("./models/user");

var seedDB = require("./seeds");

mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/yelp_camp_v6", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "Abhi is a coder",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
})

app.get("/", function (req, res) {
  res.render("landing");
});

// INDEX ROUTE - show all campmgrounds
app.get("/campgrounds", function (req, res) {
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
app.post("/campgrounds", function (req, res) {
  //GET DATA FROM THE FORM AND ADD TO CAMPGROUNDS 
  // REDIRECT BACK TO CAMPGROUNDS PAGE
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var newCampground = { name: name, image: image, description: description };
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
app.get("/campgrounds/new", function (req, res) {
  res.render("campgrounds/new");
})

//SHOW ROUTE - shows more info about one campground
app.get("/campgrounds/:id", function (req, res) {
  //find campground with provided id
  Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      console.log(foundCampground);
      //render show template with that campground
      res.render("campgrounds/show", { campground: foundCampground });
    }
  });
});
// *************************
// COMMENTS ROUTES
// *************************

// NEW ROUTE
app.get("/campgrounds/:id/comments/new", isLoggedIn, function (req, res) {
  //find campground by id
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err)

    } else {
      res.render("comments/new", { campground: campground });
    }
  });
});
app.post("/campgrounds/:id/comments", isLoggedIn, function (req, res) {
  //lookup campground using id
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      // create new commment
      //connect new comment to campground
      // redirect to camp ground show page
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      })
    }
  })

});

//************************
// AUTH ROUTES
//********************** 

// show register form
app.get("/register", function (req, res) {
  res.render("register");
});

//handle sigh up logic
app.post("/register", function (req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function () {
      res.redirect("/campgrounds");
    });
  });
});

//show login form 
app.get("/login", function (req, res) {
  res.render("login");
});
app.post("/login", passport.authenticate("local", {
  successRedirect: "/campgrounds",
  failureRedirect: "/login"
}), function (req, res) {

});


//logout route
app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}


var port = process.env.PORT || 3001;
app.listen(port, process.env.IP, function () {
  console.log(`The yelpCamp server started at port: ${port}`);
});
