const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
    },

    image: {
        filename: String,
        url: {
            type: String,
            // default: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            // set: (v) => v === "" ? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
        },
    },

    price: {
        type: Number,
    },

    location: {
        type: String,
    },

    country: {
        type: String,
    },

    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        }
    ],

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
            coordinates: {
            type: [Number],
            required: true
        }
    },

    amenities: {
        type: [String],
        default: []
    }
});

listingSchema.post("findOneAndDelete", async(listing)=>{        //mongoose middleware to delete listings reviews when listing deleted
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
