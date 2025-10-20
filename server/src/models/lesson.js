import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  content: { type: String, required: true }, // text or Cloudinary URL
  type: { type: String, enum: ["text", "video", "image", "other"], default: "text" },
  position: { type: Number, default: 0 }
}, { _id: true });

const LessonSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  title: { type: String, required: true },
  position: { type: Number, default: 0 },
  resources: [ResourceSchema]
}, { timestamps: true });

// Prevent OverwriteModelError
export default mongoose.models.Lesson || mongoose.model("Lesson", LessonSchema);
