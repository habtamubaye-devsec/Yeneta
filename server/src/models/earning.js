import mongoose from "mongoose";

const EarningSchema = new mongoose.Schema({
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  enrollment: { type: mongoose.Schema.Types.ObjectId, ref: "Enrollment" },
  amount: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model("Earning", EarningSchema);

// Auto change for Wed Oct 23 2024 03:00:00 GMT+0300 (East Africa Time)