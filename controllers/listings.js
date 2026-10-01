const Listing = require("../models/listing.js");
const axios = require("axios");

module.exports.index = async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
}

module.exports.renderNewForm = (req, res)=>{
    res.render("./listings/new.ejs");
}

module.exports.showListing = async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id)
            .populate({path: "reviews", populate: {path: "author"}})        //nested populate
            .populate("owner");
            
    // console.log(listing);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }else{
        // let amenitySize = [Math.ceil(listing.amenities.length /2),Math.floor(listing.amenities.length /2)];
        // console.log(amenitySize);
        res.render("./listings/show.ejs", {listing});
    }
}

module.exports.createListing = async (req, res, next)=>{
    let finalLocation = req.body.listing.location + ", " + req.body.listing.country;
    
    let response = await axios.get("https://nominatim.openstreetmap.org/search",
        {
            params: {
                q: finalLocation,
                format: "jsonv2",
                limit: 1,
            },
            headers: {
                "User-Agent": "wanderlust-app",
            },
        }
    );
    let data = response.data[0];

    let geometry = {
        type: "Point",
        coordinates: [Number(data.lon), Number(data.lat)],      //lon come first for GeoJSON
    };
    // console.log(geometry);


    let listing = req.body.listing;     //or let {title, description, image, price, location, coutry} = req.body;
    let newListing = new Listing(listing);

    let url = req.file.path;
    let filename = req.file.filename;

    newListing.owner = req.user._id;
    newListing.image = {url, filename};

    newListing.geometry = geometry;

    let savedListing = await newListing.save();
    // console.log(savedListing);

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);

    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }else{
        let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
        res.render("./listings/edit.ejs", {listing, originalImageUrl});
    }
    
}

module.exports.updateListing = async (req, res)=>{
    let {id} = req.params;
    
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}