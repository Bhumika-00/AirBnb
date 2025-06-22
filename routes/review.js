const express = require('express');
const router = express.Router({ mergeParams: true });
const Listing = require('../models/listing');
const Review = require('../models/review');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const { reviewSchema } = require('../schema');
const { isLoggedIn } = require('../middleware');
const ReviewController = require('../controllers/review')


// Middleware to validate review
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.details[0].message);
  }
  next();
};

// POST: Create a new review
router.post('/', isLoggedIn, validateReview, wrapAsync(ReviewController.create));

// DELETE: Remove a review
router.delete('/:reviewId',isLoggedIn, wrapAsync(ReviewController.delete));

module.exports = router;
