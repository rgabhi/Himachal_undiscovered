var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "Khajjiar",
        image: "https://cdn.s3waas.gov.in/s3577bcc914f9e55d5e4e4f82f9f00e7d4/uploads/bfi_thumb/2018040364-olw8nged76z1v26p21o05b496dbiz7mbqck8frguq2.jpg",
        description: "mini swiz, small lake, paragliding"
    },
    {
        name: "Dharamshala",
        image: "https://himachaltourism.gov.in/wp-content/uploads/2019/05/Cricket-Stadium-Dharamshala-Kangra-destination.jpg",
        description: "Cricket ground, Dalai lama, Tea gardens, peaceful"
    },
    {
        name: "Shimla",
        image: "https://cdn.s3waas.gov.in/s3b534ba68236ba543ae44b22bd110a1d6/uploads/bfi_thumb/2018031245-olwbzwfuxxurk98cqly05exlgtnqays3yhz396vrey.jpg",
        description: "Queen of hills, The mall ridge, Snow covered....."
    },
    {
        name: "Spiti Valley",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Key_Monastery.jpg/1024px-Key_Monastery.jpg",
        description: "cold desert mountain valley, Budhism, Pin Valley, Key monastery"
    },
]

// var data = [
//     {
//         name: "Cloud's Rest", 
//         image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
//         description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
//     },
//     {
//         name: "Desert Mesa", 
//         image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
//         description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
//     },
//     {
//         name: "Canyon Floor", 
//         image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
//         description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
//     }
// ]

function seedDB() {
    //Remove all campgrounds
    Campground.deleteMany({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("removed campgrounds!");
        Comment.deleteMany({}, function (err) {
            if (err) {
                console.log(err);
            }
            console.log("removed comments!");
            //add a few campgrounds
            // data.forEach(function (seed) {
            //     Campground.create(seed, function (err, campground) {
            //         if (err) {
            //             console.log(err)
            //         } else {
            //             console.log("added a campground");
            //             //create a comment
            //             Comment.create(
            //                 {
            //                     text: "This place is great, but I wish there was internet",
            //                     author: "Homer"
            //                 }, function (err, comment) {
            //                     if (err) {
            //                         console.log(err);
            //                     } else {
            //                         campground.comments.push(comment);
            //                         campground.save();
            //                         console.log("Created new comment");
            //                     }
            //                 });
            //         }
            //     });
            // });
        });
    });

}

module.exports = seedDB;


