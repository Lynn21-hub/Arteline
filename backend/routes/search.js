const express = require("express");
const router = express.Router();
const { searchArtworks } = require("../controllers/searchController");

console.log("🔥 SEARCH ROUTE LOADED");

// REAL SEARCH ROUTE
router.get("/", searchArtworks);

module.exports = router;