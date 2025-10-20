import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: String,
  category: String,
  price: { type: Number, default: 0 },
  thumbnailUrl: String,
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
  published: { type: Boolean, default: false },
}, { timestamps: true });

// ✅ Fix OverwriteModelError
const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);

export default Course;
