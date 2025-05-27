import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";

dotenv.config();

const app = express();
const port = process.env.PORT || 3030;
app.use(express.json());

const mongoUri = process.env.MONGO_URI;

mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error", err));

app.listen(port, () => console.log(`Servern körs på ${port}`));
