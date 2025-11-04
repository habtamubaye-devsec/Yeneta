import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    position: { type: Number, required: true },
    videoUrl: { type: String, required: true },
    videoPublicId: { type: String },
    videoDuration: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model("Lesson", lessonSchema);
