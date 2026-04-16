const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// ✅ CORS first
app.use(cors({
  origin: "*",
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
}));

// ✅ JSON parser for normal routes
app.use(express.json());


// ✅ Basic test routes
app.get("/", (req, res) => {
  res.send("Backend is running");
});


// ✅ ROUTES
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const artworkRoutes = require("./routes/artworkRoutes");
const searchRoutes = require("./routes/search");

console.log("🚀 SEARCH SERVER ROUTE REGISTERED");

app.use("/api/search", searchRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);
app.use("/api/artworks", artworkRoutes);

// ✅ STRIPE WEBHOOK (MUST BE LAST)
const { stripeWebhook } = require("./controllers/orderController");

app.post(
  "/payments/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// ✅ START SERVER
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});