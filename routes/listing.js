const express = require("express");
const router = express.Router();
const multer  = require('multer')       //handling multipart/form-data for uploading files
const {storage} = require("../cloudConfig.js");
const upload = multer({ 
    storage, 
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
})

const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing, handleUploadError} = require("../middleware.js");

const listingController = require("../controllers/listings.js");


router.route("/")
    .get(wrapAsync(listingController.index))       //index route
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, handleUploadError, wrapAsync(listingController.createListing));   //create route
    // .post(, (req, res)=>{
    //     res.send(req.file);
    // })


//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))  //show route
    .put(isLoggedIn, isOwner, upload.single('listing[image]'),validateListing, handleUploadError, wrapAsync(listingController.updateListing))  //update route
    .delete(isLoggedIn, isOwner,wrapAsync(listingController.destroyListing));   //delete route

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;