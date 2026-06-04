const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");


const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body); // for all defining schema condition match or not
  console.log(error);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, errMsg);
  } else {
    next();
  }
};

// POST Review
router.post("/",validateReview,wrapAsync( async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  res.redirect(`/listings/${listing._id}`);
}));


//Delete Review Route

router.delete("/:reviewId", wrapAsync(async(req,res)=>{
  let {id,reviewId} = req.params;

  await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listings/${id}`);
}));

module.exports=router;