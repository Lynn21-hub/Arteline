const express = require("express");
const router = express.Router();
const artworkController = require("../controllers/artworkController");
const upload = require("../middleware/upload");

router.post("/", upload.single("image"), artworkController.createArtwork);
router.get("/", artworkController.getAllArtworks);
router.get("/:id", artworkController.getArtworkById);
router.put("/:id", artworkController.updateArtwork);
router.delete("/:id", artworkController.deleteArtwork);

module.exports = router;