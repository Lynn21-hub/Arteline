const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

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

const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});