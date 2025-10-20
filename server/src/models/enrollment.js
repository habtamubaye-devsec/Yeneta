import mongoose from "mongoose";

const EnrollmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    pricePaid: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "cancelled"], default: "active" },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }], // ✅ track lesson progress
  },
  { timestamps: true }
);

// Prevent OverwriteModelError in dev mode
const Enrollment = mongoose.models.Enrollment || mongoose.model("Enrollment", EnrollmentSchema);

export default Enrollment;
