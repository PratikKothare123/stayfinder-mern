const express = require("express");
require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js"); // If app.js and models folder are at same level, then:
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const session = require("express-session");

const listingRouter = require("./routes/listing.js");
const reviewRouter= require("./routes/review.js");
const userRouter= require("./routes/user.js");



const MONGO_URL = process.env.MONGO_URL;
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
  secret : "mysecretcode",
  resave : false,
  saveUninitialized: true,
  cookie :{
    expires: Date.now()+ 7*24*60*60*100,
    maxAge: Date.now()+ 7*24*60*60*100,
    httpOnly: true,
  },
};

app.get("/", (req, res) => {
  res.send("Hi Am Pratik");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // This is a static method added by passport-local-mongoose to our User model, which is used to authenticate users using their username and password.

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.get("/demouser",async(req,res)=>{
  let fakeUser = new User({
    email: "kothare@gmail.com",
    username: "pratik-kothare",
  });

  let registeredUser = await User.register(fakeUser,"helloworld");
  res.send(registeredUser);
});

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


// app.get("/testListing",async(req,res)=>{
//     let sampleListing = new Listing({
//         title:"Orange City",
//         description: "Famous For Orange",
//         price:599,
//         location:"Nagpur, Maharastra",
//         country: "India"
//     });

//    await sampleListing.save();
//    console.log("Sample data was saved");
//    res.send("Data store Successful");
// })

// This uses a Regex catch-all (.*) because Express 5/path-to-regexp v8+
// no longer supports the basic '*' wildcard. It captures all undefined routes.
app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError(404, "Page not Found!"));
});

app.use((err, req, res, next) => {
  let { statuscode = 500, message = "Somthing went wrong!" } = err;
  // res.status(statuscode).send(message);
  res.status(statuscode).render("listings/error.ejs", { message });
  // res.send("somthing went wrong");
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
