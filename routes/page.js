const express = require("express");
const router = express.Router();

const pageController = require("../controllers/pages.js");

router.get("/about", pageController.renderAboutPage);

router.get("/", pageController.renderHomePage);

module.exports = router