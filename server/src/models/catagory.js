import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);

// Prevent OverwriteModelError
const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);

export default Category;
