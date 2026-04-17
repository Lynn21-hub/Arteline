const express = require("express");
const router = express.Router();
const verifyCognitoToken = require("../middleware/authmiddleware");
const requireArtistProfile = require("../middleware/requireArtistProfile");
const {
  getMyPayouts,
  getAdminPayouts,
  markPayoutPaid,
} = require("../controllers/payoutController");

router.get("/me", verifyCognitoToken, requireArtistProfile, getMyPayouts);
router.get("/admin", verifyCognitoToken, getAdminPayouts);
router.patch("/admin/:id/mark-paid", verifyCognitoToken, markPayoutPaid);

module.exports = router;
