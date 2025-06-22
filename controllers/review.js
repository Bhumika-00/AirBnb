const Listing = require('../models/listing')
const Review = require('../models/review')

module.exports.create = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return res.status(404).send("Listing not found");
  }

  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  req.flash("success" , "New Review Added");
  await listing.save();

  res.redirect(`/listings`);
}

module.exports.delete = async (req, res) => {
  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success" , "New Review Deleted");
  res.redirect(`/listings/${id}`);
}