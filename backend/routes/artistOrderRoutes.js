const express = require("express");
const router = express.Router();
const verifyCognitoToken = require("../middleware/authmiddleware");
const requireArtistProfile = require("../middleware/requireArtistProfile");
const { getMySales } = require("../controllers/artistOrderController");

router.get("/sales", verifyCognitoToken, requireArtistProfile, getMySales);

module.exports = router;
