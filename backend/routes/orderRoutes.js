const express = require("express");
const router = express.Router();
const { placeOrderCOD, getUserOrders,createStripeCheckoutSession } = require("../controllers/orderController");
const verifyCognitoToken = require("../middleware/authmiddleware");

router.post("/place-order/cod", verifyCognitoToken, placeOrderCOD);
router.post("/place-order/stripe", verifyCognitoToken, createStripeCheckoutSession);
router.get("/", verifyCognitoToken, getUserOrders);
module.exports = router;