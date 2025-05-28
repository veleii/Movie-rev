import Movie from "./moviesModel.js";
import Review from "../reviews/reviewsModel.js";

// POST /movies - Lägg till ny film (admin)
export const createMovie = async (req, res) => {
  try {
    const { title, director, releaseYear, genre } = req.body;

    const movie = new Movie({ title, director, releaseYear, genre });
    await movie.save();

    res.status(201).json({ message: "Film skapad", movie });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Kunde inte skapa film", error: err.message });
  }
};

// GET /movies - Hämta alla filmer
export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Fel vid hämtning av filmer", error: err.message });
  }
};

// GET /movies/:id - Hämta en specifik film
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Filmen hittades inte" });
    }
    res.status(200).json(movie);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Fel vid hämtning av film", error: err.message });
  }
};

// PUT /movies/:id - Uppdatera film (admin)
export const updateMovie = async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedMovie) {
      return res.status(404).json({ message: "Filmen hittades inte" });
    }

    res.status(200).json({ message: "Film uppdaterad", movie: updatedMovie });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Kunde inte uppdatera film", error: err.message });
  }
};

// DELETE /movies/:id - Radera film (admin)
export const deleteMovie = async (req, res) => {
  try {
    const deleted = await Movie.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Filmen hittades inte" });
    }

    res.status(200).json({ message: "Film raderad" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Kunde inte radera film", error: err.message });
  }
};

// GET /movies/:id/reviews - Alla recensioner för en film
export const getMovieReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.id }).populate(
      "userId",
      "username"
    );

    res.status(200).json(reviews);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Fel vid hämtning av recensioner", error: err.message });
  }
};

// GET /movies/ratings - (VG) Snittbetyg för varje film
export const getMoviesWithRatings = async (req, res) => {
  try {
    const movies = await Movie.find();

    // Hämta snittbetyg per film
    const results = await Promise.all(
      movies.map(async (movie) => {
        const reviews = await Review.find({ movieId: movie._id });
        const avgRating = reviews.length
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0;

        return {
          ...movie.toObject(),
          averageRating: avgRating.toFixed(1),
        };
      })
    );

    res.status(200).json(results);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Kunde inte hämta betyg", error: err.message });
  }
};
