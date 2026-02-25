const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js"); // If app.js and models folder are at same level, then:
const path = require("path");
const methodOverride = require("method-override");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.send("Hi Am Pratik");
});

//Index Route 
app.get("/listings", async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});


// New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});
// Show Route 
app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing})
});


// Create Route
app.post("/listings",async(req,res)=>{
    // let{title,description,location,cuntry,price} = req.body;
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});


// Edit Route 
app.get("/listings/:id/edit",async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

// Update Route

app.put("/listings/:id",async(req,res)=>{
     let {id} = req.params;
     await Listing.findByIdAndUpdate(id,{...req.body.listing});
     res.redirect(`/listings/${id}`);
});
//Delete Route

app.delete("/listings/:id",async(req,res)=>{
     let {id} = req.params;
     let deletingListing = await Listing.findByIdAndDelete(id);
     console.log(deletingListing);
     res.redirect("/listings")
})
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

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
