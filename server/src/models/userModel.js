import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "instructor", "admin", "superadmin"],
      default: "student",
    },
    status: {
      type: String,
      enum: ["active", "banned"],
      default: "active", // this is the field your updateUserStatus controller modifies
    },
    requestedToBeInstructor: {
      type: String,
      enum: ["none", "requested", "approved"],
      default: "none"
    },
    profileImage: {
      type: String, // URL to profile picture
      default: "https://example.com/default-profile.png",
    },
    phone: {
      type: String,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    isVerified: {
      type: Boolean,
      default: false, // email verified or not
    },
    otp: {
      type: String, // stores the OTP
    },
    otpExpiry: {
      type: Date, // OTP expiration date/time
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;

// Auto change for Tue Oct 22 2024 03:00:00 GMT+0300 (East Africa Time)
// Auto change for Wed Oct 30 2024 03:00:00 GMT+0300 (East Africa Time)