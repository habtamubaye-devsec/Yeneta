import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  subCategories: {
    type: String,
    required: true
  },
  level: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" }, 
  price: { type: Number, default: 0 },
  thumbnailUrl: String,
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
  status: { type: String, default: "unpublished", enum: ["unpublished", "pending", "published", "rejected"] },
}, { timestamps: true });

// ✅ Fix OverwriteModelError
const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);

export default Course;
