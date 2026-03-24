import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";

import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;

console.log("ENV CHECK:", {
  PORT: process.env.PORT,
  CLIENT_ID: process.env.COGNITO_CLIENT_ID,
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});