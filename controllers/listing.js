const Listing = require('../models/listing')

module.exports.index = async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/index.ejs", { listings });
}

module.exports.new = (req, res) => {
  
  res.render("listings/new.ejs");
}

module.exports.add = async (req, res) => {
  const newListing = new Listing(req.body.listing);

  if (req.file) {
    const url = req.file.path;
    const filename = req.file.filename;
    newListing.image = { url, filename };
  }

  newListing.owner = req.user._id;
  await newListing.save();

  req.flash("success", "New listing created!");
  res.redirect(`/listings/${newListing._id}`);
};


module.exports.edit = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}

module.exports.update = async (req, res) => {
  const { id } = req.params;
listing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });

  res.redirect(`/listings/${listing._id}`);
}

module.exports.delete = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success" , "Successfully Deleted");
  res.redirect("/listings");
}

module.exports.show = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
     .populate({
      path: 'reviews',
      populate: { path: 'author' } 
    })
    .populate('owner');

  if (!listing) {
    req.flash("error", "The listing you requested does not exist!");
    return res.redirect("/listings"); 
  }

  console.log(listing);
  res.render("listings/show.ejs", { listing });
}