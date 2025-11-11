import mongoose from "mongoose";

const EnrollmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pricePaid: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "cancelled"], default: "active" },
    currentLesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
    progress: { type: Number, default: 0 }, // ✅ track overall course progress
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }], // ✅ track lesson progress
    completed: {
      type: String,
      enum: ["pending", "in-progress", "completed"], // <-- allowed values
      default: "pending",
    },
  },
  { timestamps: true }
);

// Prevent OverwriteModelError in dev mode
const Enrollment =
  mongoose.models.Enrollment || mongoose.model("Enrollment", EnrollmentSchema);

export default Enrollment;
