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

app.get("/", (req, res) => {
  res.send("Hi Am Pratik");
});

//Index Route
app.get("/listings", wrapAsync(async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

// New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});
// Show Route
app.get("/listings/:id",wrapAsync( async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
}));

//Finf

// Create Route
app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    // let{title,description,location,cuntry,price} = req.body;
    //or
    // let listing = req.body.listing;
    // new Listing(listing);
    //or
    if(!req.body.listing){
      throw new ExpressError(500,"Send valid data for listing");
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  }),
);

// Edit Route
app.get("/listings/:id/edit",wrapAsync( async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

// Update Route

app.put("/listings/:id",wrapAsync( async (req, res) => {
  if(!req.body.listing){
      throw new ExpressError(500,"Send valid data for listing");
    }
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));
//Delete Route

app.delete("/listings/:id",wrapAsync( async (req, res) => {
  let { id } = req.params;
  let deletingListing = await Listing.findByIdAndDelete(id);
  console.log(deletingListing);
  res.redirect("/listings");
}));
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
  let{statuscode=500,message="Somthing went wrong!"} = err;
  res.status(statuscode).send(message);
  // res.send("somthing went wrong");
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
