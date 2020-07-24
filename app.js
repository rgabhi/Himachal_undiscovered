var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
});
var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//   {
//     name: "khajjiar",
//     image: "https://cdn.s3waas.gov.in/s3577bcc914f9e55d5e4e4f82f9f00e7d4/uploads/bfi_thumb/2018040364-olw8nged76z1v26p21o05b496dbiz7mbqck8frguq2.jpg",
//     description: "Snowy, hilly, with a small lake.Paragliding available!",
//   }, function (err, campground) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("NEW CAMPGROUND CREATED: ");
//       console.log(campground);
//     }
//   });



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
      res.render("index", { campgrounds: allCampgrounds });
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
  res.render("new");
})

//SHOW ROUTE - shows more info about one campground
app.get("/campgrounds/:id", function (req, res) {
  //find campground with provided id
  Campground.findById(req.params.id, function (err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      //render show template with that campground
      res.render("show", { campground: foundCampground });
    }
  });
});

var port = process.env.PORT || 3001;
app.listen(port, process.env.IP, function () {
  console.log(`The yelpCamp server started at port: ${port}`);
});
