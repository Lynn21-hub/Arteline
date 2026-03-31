const express = require("express");
const router = express.Router();
const { placeOrderCOD, getUserOrders } = require("../controllers/orderController");
const verifyCognitoToken = require("../middleware/authmiddleware");

router.post("/place-order/cod", verifyCognitoToken, placeOrderCOD);
router.get("/", verifyCognitoToken, getUserOrders);

module.exports = router;