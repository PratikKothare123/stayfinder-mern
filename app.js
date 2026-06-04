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

const listings = require("./routes/listing.js");
const reviews= require("./routes/review.js");

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

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

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
