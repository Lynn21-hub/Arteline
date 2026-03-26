const express = require("express");
const router = express.Router();

const {
  addToCart,
  removeFromCart,
  getCartItems,
  updateCartQuantity
} = require("../controllers/cartController");

const verifyCognitoToken = require("../middleware/authmiddleware");

router.post("/add", verifyCognitoToken, addToCart);
router.delete("/remove", verifyCognitoToken, removeFromCart);
router.patch("/update-quantity", verifyCognitoToken, updateCartQuantity);
router.get("/", verifyCognitoToken, getCartItems);

module.exports = router;