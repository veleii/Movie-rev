import Review from "./reviewsModel.js";
import Movie from "../movies/moviesModel.js";

// POST /reviews - Skapa en recension (endast inloggade användare)
export const createReview = async (req, res) => {
  try {
    const { movieId, rating, comment } = req.body;
    const userId = req.user.userId;

    // Kontrollera att filmen finns
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Filmen hittades inte" });
    }

    const review = new Review({ movieId, userId, rating, comment });
    await review.save();

    res.status(201).json({ message: "Recension skapad", review });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Kunde inte skapa recension", error: err.message });
  }
};

// GET /reviews - Hämta alla recensioner (offentligt)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "username")
      .populate("movieId", "title");

    res.status(200).json(reviews);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Fel vid hämtning av recensioner", error: err.message });
  }
};

// GET /reviews/:id - Hämta en specifik recension
export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("userId", "username")
      .populate("movieId", "title");

    if (!review) {
      return res.status(404).json({ message: "Recensionen hittades inte" });
    }

    res.status(200).json(review);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Fel vid hämtning av recension", error: err.message });
  }
};

// PUT /reviews/:id - Uppdatera recension (endast av skaparen)
export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Recensionen hittades inte" });
    }

    if (review.userId.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Du får inte ändra denna recension" });
    }

    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;
    await review.save();

    res.status(200).json({ message: "Recension uppdaterad", review });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Kunde inte uppdatera recension", error: err.message });
  }
};

// DELETE /reviews/:id - Ta bort recension (endast av skaparen)
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Recensionen hittades inte" });
    }

    if (review.userId.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Du får inte ta bort denna recension" });
    }

    await review.deleteOne();
    res.status(200).json({ message: "Recension borttagen" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Kunde inte ta bort recension", error: err.message });
  }
};
