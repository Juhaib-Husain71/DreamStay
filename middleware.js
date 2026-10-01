const Listing = require("./models/listing");
const {listingSchema, reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");
const multer = require("multer");

module.exports.validateListing = (req, res, next)=>{     //server side validation for listing
    let {error} = listingSchema.validate(req.body);      //joi

    if(error){
        throw new ExpressError(400, error);
    }else{
        next();
    }
}

module.exports.validateReview = (req, res, next)=>{     //server side validation for reviews
    let {error} = reviewSchema.validate(req.body);      //joi

    if(error){
        throw new ExpressError(400, error);
    }else{
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){     //passport method
        req.session.redirectUrl = req.originalUrl;      //storing previous url
        req.flash("error", "You must be logged-in!");
        return res.redirect("/users/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);

    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this Listing!");
        return res.redirect(`/listings/${id}`);
    }

    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);

    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of this Review!");
        return res.redirect(`/listings/${id}`);
    }

    next();
}

//multer large file uploading error
module.exports.handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
        req.flash("error", "Image size must not exceed 2 MB.");
        return res.redirect("/listings/new");
    }

    next(err);
};