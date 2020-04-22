var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")
    
//requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")


console.log(process.env.DATABASEURL);
var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v12"
 mongoose.connect(url, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
 
/*
mongoose.connect("mongodb+srv://kumarankit:Thunder@1809@cluster0-soacr.mongodb.net/test?retryWrites=true&w=majority",
				 { useNewUrlParser: true,
				    useUnifiedTopology: true
				 });
				 */
				 


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error"); // Actually every file has Header template  .So we just write this here this code .So, that we dont we to define it again and again
	// error is a kind of variable
   res.locals.success = req.flash("success");//same goes here
	// Success is a kind of variable
   next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log("The YelpCamp Server Has Started!");
    console.log(`Our app is running on port ${ PORT }`);
});


 