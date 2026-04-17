const express = require("express");
const router = express.Router();
const artworkController = require("../controllers/artworkController");
const verifyCognitoToken = require("../middleware/authmiddleware");
const requireArtistProfile = require("../middleware/requireArtistProfile");
const upload = require("../middleware/upload");

router.get("/", artworkController.getAllArtworks);
router.get("/mine", verifyCognitoToken, requireArtistProfile, artworkController.getMyArtworks);
router.get("/:id", artworkController.getArtworkById);

router.post("/", verifyCognitoToken, requireArtistProfile, upload.single("image"), artworkController.createArtwork);
router.put("/:id", verifyCognitoToken, requireArtistProfile, artworkController.updateArtwork);
router.delete("/:id", verifyCognitoToken, requireArtistProfile, artworkController.deleteArtwork);

module.exports = router;