const express = require("express");
const router = express.Router();

const {
  addToCart,
  removeFromCart,
  getCartItems,
} = require("../controllers/cartController");

const verifyCognitoToken = require("../middleware/authmiddleware");

router.post("/add", verifyCognitoToken, addToCart);
router.post("/remove", verifyCognitoToken, removeFromCart);
router.get("/", verifyCognitoToken, getCartItems);

module.exports = router;