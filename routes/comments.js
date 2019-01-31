var express = require("express"),
    router  = express.Router(),
    Campground = require("../models/Campgrounds"),
    Comment    = require("../models/Comments");
    
    
//Routes for comments
router.get("/campgrounds/:id/comments/new",isLoggedIn, function(req, res) {
    Campground.findById(req.params.id,function(error, foundCampground){
        if(error){
            console.log(error);
        }
        else{
           res.render("comments/new",{campgrounds:foundCampground}); 
        }
    });
    
});

router.post("/campgrounds/:id/comments",isLoggedIn,function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } 
       else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else { 
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               comment.save();
               campground.comments.push(comment);
               campground.save();
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
});
router.get("/campgrounds/:id/comments/:comment_id/edit",checkCommentOwnership, function(req,res){
    Comment.findById(req.params.comment_id,function(error,foundComment){
        if(error){
            console.log("An Error occured");
        }
        else
            res.render("comments/edit",{campground:req.params.id,comment:foundComment});
    });
});
router.put("/campgrounds/:id/comments/:comment_id",checkCommentOwnership,function(req,res){
    
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(error){
        if(error){
            console.log(error);
            res.redirect("back");
        }
        else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});
router.delete("/campgrounds/:id/comments/:comment_id",checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(error){
        if(error)
            res.redirect("/campgrounds/"+req.params.id);
        else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});
 function checkCommentOwnership(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
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

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/user/login");
}
module.exports = router;