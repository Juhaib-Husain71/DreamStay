if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");        //allow to make base layout and reuse it on multiple pages
const session = require("express-session");
const {MongoStore} = require('connect-mongo');

const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");    //for local strategy

const User = require("./models/user.js");
const ExpressError = require("./utils/ExpressError.js");


const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");
const pageRoute = require("./routes/page.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

// console.log(require("connect-mongo"));

const dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE.", err);
})

const sessionOptions = {
    store,                //same name for key and value
    secret: process.env.SECRET, 
    resave: false, 
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
}

app.use(session(sessionOptions));
app.use(flash());

//
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    });

async function main(){
    await mongoose.connect(dbUrl, {
        dbName: "dreamStay",    //db with this name
    });
}

app.listen(8080, ()=>{
    console.log("listening on port 8080");
});

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;         //provided by passport
    next();
})

//routers
app.use("/listings", listingRoute);     // /listings becomes / in listingRoute

app.use("/listings/:id/reviews", reviewRoute);

app.use("/users", userRoute);    //for login, signup, logout request

app.use("/", pageRoute);


//middleware to throw error when request not match with above routes
app.use((req, res, next)=>{
    next(new ExpressError(404, "Page Not Found!"));
});

//common error handling middleware
app.use((err, req, res, next)=>{
    let {statusCode=500, message="Something Went Wrong"} = err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
});