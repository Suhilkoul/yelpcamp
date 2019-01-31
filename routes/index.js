var express = require("express"),
    router  = express.Router(),
    passport = require("passport"),
    User    = require("../models/Users");


//Root Route
router.get("/", function(req , res){
    res.render("landing");
});

//All the Authenticate Route go here
router.get("/user/new",function(req,res){
    res.render("user/new");
});

router.post("/user", function(req,res){
    var user = new User({username:req.body.username});
    User.register(user, req.body.password, function(error, newUser){
        if(error){
            console.log(error);
            return res.render("user/new");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
            
    });
    
});

//For Logging in 
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/user/login"
    }),function(req,res){
    
});

router.get("/user/login",function(req,res){
    res.render("user/login");
});

// logic route
router.get("/logout", function(req, res){
   req.logout();
   res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/user/login");
}

module.exports = router;