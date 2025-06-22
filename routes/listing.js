const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const { listingSchema } = require('../schema.js');
const ExpressError = require('../utils/ExpressError.js');
const {isLoggedIn, isOwner}=require("../middleware.js");
const ListingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require('../cloudConfig.js')
const upload = multer({ storage });

// ✅ Middleware to validate listing input
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body); // req.body should have listing key
  if (error) throw new ExpressError(400, error.details[0].message);
  next();
};

router
.route("/")
.get(wrapAsync(ListingController.index))
.post(isLoggedIn,upload.single("listing[image]"), wrapAsync(ListingController.add))

// ✅ NEW FORM ROUTE
router.get("/new", isLoggedIn, ListingController.new);

router
.route("/:id")
.put(isLoggedIn,isOwner, validateListing, wrapAsync(ListingController.update))
.delete(isLoggedIn, wrapAsync(ListingController.delete))
.get(wrapAsync(ListingController.show));


// ✅ EDIT FORM ROUTE
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(ListingController.edit));




module.exports = router;
