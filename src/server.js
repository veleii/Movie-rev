import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import userRoute from "./modules/users/usersRoute.js";
import movieRoute from "./modules/movies/moviesRoute.js";
import reviewRoute from "./modules/reviews/reviewsRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3030;
app.use(express.json());

const mongoUri = process.env.MONGO_URI;

mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error", err));

app.use("/users", userRoute);
app.use("/movies", movieRoute);
app.use("/reviews", reviewRoute);

app.listen(port, () => console.log(`Servern körs på ${port}`));
