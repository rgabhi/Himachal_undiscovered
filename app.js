var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

var campgrounds = [
  {
    name: "agnes",
    image:
      "https://images.unsplash.com/photo-1533873984035-25970ab07461?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
  },
  {
    name: "ulrich",
    image:
      "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
  },
  {
    name: "johnas",
    image:
      "https://images.unsplash.com/photo-1500332988905-1bf2a5733f63?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
  },
  {
    name: "martha",
    image:
      "https://images.unsplash.com/photo-1503265192943-9d7eea6fc77a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
  },
];

app.get("/", function (req, res) {
  res.render("landing");
});

app.get("/campgrounds", function (req, res) {
  res.render("campgrounds", { campgrounds: campgrounds });
});

app.post("/campgrounds", function (req, res) {
  //GET DATA FROM THE FORM AND ADD TO CAMPGROUNDS 
  // REDIRECT BACK TO CAMPGROUNDS PAGE
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = { name: name, image: image };
  campgrounds.push(newCampground);

  res.redirect("/campgrounds");
})

app.get("/campgrounds/new", function (req, res) {
  res.render("new");
})



var port = process.env.PORT || 3001;
app.listen(port, process.env.IP, function () {
  console.log(`The yelpCamp server started at port: ${port}`);
});
