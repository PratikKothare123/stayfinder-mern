const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js");


const reviewController = require("../controllers/reviews.js");

// =======================
// Create Review Route
// POST /listings/:id/reviews
// =======================

router.post(
  "/",isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// =======================
// Delete Review Route
// DELETE /listings/:id/reviews/:reviewId
// =======================
router.delete(
  "/:reviewId",isLoggedIn,isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;