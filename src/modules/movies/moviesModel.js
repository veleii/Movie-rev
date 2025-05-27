import mongoose, { Schema } from "mongoose";

const movieSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Titel måste anges"],
      trim: true,
    },
    director: {
      type: String,
      required: [true, "Regissör måste anges"],
      trim: true,
    },
    releaseYear: {
      type: Number,
      required: [true, "Utgivningsår måste anges"],
      min: [1888, "Ogiltigt utgivningsår"],
    },
    genre: {
      type: String,
      required: [true, "Genre måste anges"],
      enum: {
        values: [
          "Drama",
          "Komedi",
          "Action",
          "Skräck",
          "Dokumentär",
          "Äventyr",
          "Sci-Fi",
          "Romantik",
          "Thriller",
          "Annat",
        ],
        message: "Ogiltig genre",
      },
    },
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
