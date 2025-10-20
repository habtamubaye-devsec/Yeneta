import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
  },
  { timestamps: true }
);

// Prevent OverwriteModelError
const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

export default Review;
