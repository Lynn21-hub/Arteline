const express = require("express");
const router = express.Router();
const artistController = require("../controllers/artistController");
const verifyCognitoToken = require("../middleware/authmiddleware");
const requireAdmin = require("../middleware/requireAdmin");

router.get("/featured", artistController.getFeaturedArtists);
router.get("/", artistController.getPublishedArtists);
router.get("/me", verifyCognitoToken, artistController.getMyArtistProfile);
router.put("/me", verifyCognitoToken, artistController.upsertMyArtistProfile);
router.get("/admin/applications", verifyCognitoToken, requireAdmin, artistController.getAdminArtistApplications);
router.patch("/admin/applications/:id/approve", verifyCognitoToken, requireAdmin, artistController.approveArtistApplication);
router.patch("/admin/applications/:id/reject", verifyCognitoToken, requireAdmin, artistController.rejectArtistApplication);

module.exports = router;
