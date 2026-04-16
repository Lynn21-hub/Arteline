const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
console.log("🔥🔥 THIS IS THE REAL SERVER FILE 🔥🔥");
dotenv.config();

const app = express();
const { stripeWebhook } = require("./controllers/orderController");

app.post(
  "/payments/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// Debug middleware - logs every incoming request
app.use((req, res, next) => {
  console.log(`INCOMING: ${req.method} ${req.path}`);
  console.log("AUTH HEADER:", req.headers.authorization);
  next();
});

app.use(cors({
  origin: "*",
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});
const searchRoutes = require("./routes/search");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const artworkRoutes = require("./routes/artworkRoutes");
app.use("/api/search", searchRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);
app.use("/api/artworks", artworkRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
