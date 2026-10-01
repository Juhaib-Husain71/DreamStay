const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newRev = new Review(req.body.review);
    newRev.author = req.user._id;       //passport provide user object in req
    // console.log(newRev);
    listing.reviews.push(newRev);

    await newRev.save();
    await listing.save();

    // console.log("new review added");
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyReview = async (req, res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
}