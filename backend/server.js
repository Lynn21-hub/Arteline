const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());


const searchRouter = require("./routes/search");


app.use("/search", searchRouter);


app.get("/", (req, res) => res.send("Backend running"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));