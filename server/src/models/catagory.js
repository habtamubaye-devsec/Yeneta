import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    // 🆕 New field
    subCategories: {
      type: [String], // array of strings
      required: true

    },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
