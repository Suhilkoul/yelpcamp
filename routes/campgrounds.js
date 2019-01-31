var express = require("express"),
    router  = express.Router(),
    Campground = require("../models/Campgrounds"),
    Comment = require("../models/Comments");
    
    
router.get("/campgrounds", function(req , res){
    Campground.find({}, function(error, allcampgrounds){
        if(error){
            console.log("Sorry we have incountered an error in sending the data");
        }
        else{
            res.render("campgrounds/index" , {campgrounds:allcampgrounds});
        }
    });
    
});

router.post("/campgrounds/search",function(req,res){
    var key = req.body.search;
    res.redirect("/campgrounds")
});

router.post("/campgrounds", isLoggedIn, function(req, res){
    var name = req.body.name;
    var desc = req.body.description;
    var url = req.body.url;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name:name,image:url, desc:desc, author:author};
    Campground.create(newCampground,function(error, newCamp){
        if(error){
            console.log("something just occured");
        }
        else{
            res.redirect("/campgrounds");
        }
    });
    
});

router.get("/campgrounds/new", isLoggedIn, function(req,res){
    res.render("campgrounds/new.ejs");
});

// SHOW - shows more info about one campground
router.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//Edit Route
router.get("/campgrounds/:id/edit", checkCampgroundOwnership ,function(req,res){
    Campground.findById(req.params.id,function(error,foundCampground){
        if(error)
            console.log("An error occured");
        else
            res.render("campgrounds/edit",{campground:foundCampground});
    });
    
});

//Update route
router.put("/campgrounds/:id",checkCampgroundOwnership,function(req,res){
    var name = req.body.name;
    var desc = req.body.description;
    var url = req.body.url;
    
    var editedCampground = {name:name,image:url, desc:desc};
    Campground.findByIdAndUpdate(req.params.id, editedCampground, function(error,foundCampground){
        if(error)
            console.log(error);
        else
            res.redirect("/campgrounds");
    });
});
//To delete
router.delete("/campgrounds/:id",checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(error){
        if(error){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds");
        }
    });
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/user/login");
}
function checkCampgroundOwnership (req, res, next) {
 if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
           }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;