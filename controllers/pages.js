const Listing = require("../models/listing.js");


module.exports.renderAboutPage = (req, res)=>{
    res.render("./pages/about.ejs");
}

module.exports.renderHomePage = async(req, res) => {
    const allListings = await Listing.find().limit(8);

    res.render("./pages/home.ejs", {allListings});
}