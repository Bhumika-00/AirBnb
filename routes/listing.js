const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const { listingSchema } = require('../schema.js');
const ExpressError = require('../utils/ExpressError.js');
const {isLoggedIn, isOwner}=require("../middleware.js");


// ✅ Middleware to validate listing input
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body); // req.body should have listing key
  if (error) throw new ExpressError(400, error.details[0].message);
  next();
};

// ✅ INDEX ROUTE - List all
router.get("/", wrapAsync(async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/index.ejs", { listings });
}));

// ✅ NEW FORM ROUTE
router.get("/new", isLoggedIn,(req, res) => {
  
  res.render("listings/new.ejs");
});

// ✅ ADD ROUTE
router.post("/", isLoggedIn, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing); // ✅ define it
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect(`/listings/${newListing._id}`);
}));


// ✅ EDIT FORM ROUTE
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

// ✅ UPDATE ROUTE
router.put("/:id",isLoggedIn,isOwner, validateListing, wrapAsync(async (req, res) => {
  const { id } = req.params;
listing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });

  res.redirect(`/listings/${listing._id}`);
}));

// ✅ DELETE ROUTE
router.delete("/:id",isLoggedIn, wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success" , "Successfully Deleted");
  res.redirect("/listings");
}));

// ✅ SHOW ROUTE (placed last)
router.get("/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
     .populate({
      path: 'reviews',
      populate: { path: 'author' }  // ✅ This is crucial!
    })
    .populate('owner');

  if (!listing) {
    req.flash("error", "The listing you requested does not exist!");
    return res.redirect("/listings"); // ⬅️ added return here
  }

  console.log(listing);
  res.render("listings/show.ejs", { listing });
}));


module.exports = router;
