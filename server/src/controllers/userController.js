import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";

// GET /api/users (admin or super admin only)
export const getAllUsers = async (req, res) => {
  try {
    let query = {};

    // If the requester is an admin, limit visible roles
    if (req.user.role === "admin") {
      query = { role: { $in: ["student", "instructor"] } };
    }

    // If the requester is a super admin, show everyone (including admins & super admins)
    // No filter needed — query remains {}

    const users = await User.find(query).select("-password");
    res.json({ success: true,  users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/users/current
export const getCurrentUser = async (req, res) => {
  try {
    res.json({ success: true, data: req.user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/users/current
export const updateCurrentUser = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const user = req.user;

    // ✅ Update basic info
    if (name) user.name = name;
    if (bio) user.bio = bio;

    // ✅ Upload new profile image if provided
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "profile_images",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      user.profileImage = result.secure_url;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (err) {
    console.error("Error updating profile:", err);

    // Ensure we don’t send multiple responses
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: err.message || "Server error",
      });
    }
  }
};

// PATCH /api/users/request-instructor (student only)
export const requestedToBeInstructor = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Only students can request
    if (user.role !== "student") {
      return res.status(400).json({
        success: false,
        message: "Only students can request to become instructors.",
      });
    }

    // Toggle behavior
    if (user.requestedToBeInstructor === "none") {
      user.requestedToBeInstructor = "requested";
    } else if (user.requestedToBeInstructor === "requested") {
      user.requestedToBeInstructor = "none";
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid instructor request status.",
      });
    }

    await user.save();

    res.json({
      success: true,
      message:
        user.requestedToBeInstructor === "requested"
          ? "You have requested to become an instructor."
          : "Instructor request canceled.",
      data: user,
    });
  } catch (err) {
    console.error("Error updating instructor request:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🧠 GET /api/users/instructors-request
// → Fetch users who requested to be instructors
export const getInstructorRequests = async (req, res) => {
  try {
    const requests = await User.find({ requestedToBeInstructor: "requested" }).select(
      "-password"
    );

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch instructor requests",
    });
  }
};

// PATCH /api/users/:id/approve-instructor (admin only)
export const approveInstructor = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.requestedToBeInstructor !== "requested") {
      return res.status(400).json({
        success: false,
        message: "This user has not requested to become an instructor.",
      });
    }

    // Promote user
    user.role = "instructor";
    user.requestedToBeInstructor = "approved";
    await user.save();

    res.json({
      success: true,
      message: "User has been promoted to instructor.",
      data: user,
    });
  } catch (err) { 
    console.error("Error approving instructor:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// ❌ PATCH: Reject instructor request
export const rejectInstructorRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.requestedToBeInstructor !== "requested") {
      return res.status(400).json({
        success: false,
        message: "This user has not requested to become an instructor.",
      });
    }

    user.requestedToBeInstructor = "none";
    await user.save();

    res.status(200).json({
      success: true,
      message: "Instructor request rejected successfully.",
      data: user,
    });
  } catch (error) {
    console.error("Error rejecting instructor request:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reject instructor request.",
    });
  }
};

//Update User Status (admin only)
export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["active", "banned"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.status = status;
    await user.save();

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update user's password (current user)
export const updateUserPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const id = req.user.id;
    const user  = await User.findById(id);

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: "Please provide current, new and confirm password" });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    } 
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "New password and confirm password do not match" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters long" });
    }

    // Hash new password
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    req.user.password = newHashedPassword;
    await req.user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// DELETE /api/users/:id  (admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    await User.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/users/:id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
