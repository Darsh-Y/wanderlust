const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const listing = require("../models/listing.js");
const {
  validatereview,
  isloggedin,
  isReviewAuthor,
} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

// post routes
router.post(
  "/",
  isloggedin,
  validatereview,
  wrapAsync(reviewController.createReview)
);

//delete review delete
router.delete(
  "/:reviewId",
  isloggedin,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
