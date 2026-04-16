const express = require("express");
const router = express.Router();
const artworkController = require("../controllers/artworkController");
const verifyCognitoToken = require("../middleware/authmiddleware");
const upload = require("../middleware/upload");

router.get("/", artworkController.getAllArtworks);
router.get("/mine", verifyCognitoToken, artworkController.getMyArtworks);
router.get("/:id", artworkController.getArtworkById);

router.post("/", verifyCognitoToken, upload.single("image"), artworkController.createArtwork);
router.put("/:id", verifyCognitoToken, artworkController.updateArtwork);
router.delete("/:id", verifyCognitoToken, artworkController.deleteArtwork);

module.exports = router;