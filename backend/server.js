/* require("dotenv").config();
const express = require("express");
const cors = require("cors");

const artworkRoutes = require("./routes/artworkRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/artworks", artworkRoutes);

app.get("/", (req, res) => {
  res.send("Artwork Management API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
*/

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const artworkRoutes = require("./routes/artworkRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/artworks", artworkRoutes);

app.get("/", (req, res) => {
  res.send("Artwork Management API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});