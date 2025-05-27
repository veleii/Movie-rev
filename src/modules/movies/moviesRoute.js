import express from "express";
import {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
  getMovieReviews,
  getMoviesWithRatings,
} from "./moviesController";

import auth from "../../middleware/auth.js";
import checkRole from "../../middleware/roleCheck.js";

const router = express.Router();

router.post("/", auth, checkRole("admin"), createMovie);
router.get("/", getAllMovies);
router.get("/ratings", getMoviesWithRatings);
router.get("/:id", getMovieById);
router.put("/:id", auth, checkRole("admin"), updateMovie);
router.delete("/:id", auth, checkRole("admin"), deleteMovie);
router.get("/:id/reviews", getMovieReviews);

export default router;
