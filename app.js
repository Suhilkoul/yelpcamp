var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    localStrategy = require("passport-local"),
    User          = require("./models/Users"),
    Campground    = require("./models/Campgrounds"),
    methodOverride= require("method-override"),
    Comment       = require("./models/Comments"),
    seedDB        = require("./seeds");

//REQUIRING ROUTES IN APP.JS
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments"),
    indexRoutes      = require("./routes/index");

mongoose.connect(process.env.DATABASEURL);
//mongoose.connect("mongodb://suhilkoul:sudanti123@ds117545.mlab.com:17545/yelpcamp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// seedDB();

//Passport config
app.use(require("express-session")({
    secret:"My phone sucks and i hate it",
    resave: false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Adding CurrentUser to all the pages
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT , process.env.IP , function(){
    console.log("The server has started");
});