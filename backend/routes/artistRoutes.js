const express = require("express");
const router = express.Router();
const artistController = require("../controllers/artistController");
const verifyCognitoToken = require("../middleware/authmiddleware");

router.get("/featured", artistController.getFeaturedArtists);
router.get("/", artistController.getPublishedArtists);
router.get("/me", verifyCognitoToken, artistController.getMyArtistProfile);
router.put("/me", verifyCognitoToken, artistController.upsertMyArtistProfile);

module.exports = router;
