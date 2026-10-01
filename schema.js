const joi = require("joi");
const Review = require("./models/review");

module.exports.listingSchema = joi.object({         //custom listign schema validation
    listing : joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        price: joi.number().required().min(0),
        amenities: joi.array().items(joi.string()).default([]),
    }).required()
});

//
module.exports.reviewSchema = joi.object({      //custom review schema validation
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().required(),
    }).required()
})