import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    movieId: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
      required: [true, "filmeferens måste anges"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Användarreferens måste anges"],
    },
    rating: {
      type: Number,
      required: [true, "Betyg måste anges"],
      min: [0, "Lägsta betyg är 0"],
      max: [10, "Högsta betyg är 10"],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [10000, "Kommentaren får vara max 10000 tecken"],
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
