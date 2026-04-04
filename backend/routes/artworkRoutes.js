const express = require("express");
const router = express.Router();
const artworkController = require("../controllers/artworkController");

router.get("/", artworkController.getAllArtworks);
router.get("/:id", artworkController.getArtworkById);

module.exports = router;