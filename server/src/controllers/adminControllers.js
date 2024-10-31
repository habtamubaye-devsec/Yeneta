import User from "../models/userModel.js";
import Course from "../models/course.js";
import Enrollment from "../models/enrollment.js";

import bcrypt from "bcrypt";

/* ==============================
   DASHBOARD
============================== */
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();

    res.status(200).json({
      success: true,
      data: { totalUsers, totalCourses, totalEnrollments },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ==============================
   USERS
============================== */
export const getAllUsers = async (req, res) => {
  try {
    // Retrieve only users with role "student" or "instructor"
    const users = await User.find({ role: { $in: ["student", "instructor"] } }).select("-password");

    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const updateUserStatusAndRole = async (req, res) => {
  try {
    const { status, role } = req.body; // "active" or "banned" and "student" or "instructor"

    // Only allow updating students or instructors
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, role: { $in: ["student", "instructor"] } },
      { 
        ...(status && { status }), // update status if provided
        ...(role && { role })      // update role if provided
      },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found or not updatable" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


/* ==============================
   INSTRUCTORS CRUD
============================== */

// GET /api/admin/instructors
export const getAllInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: "instructor" }).select("-password");
    res.status(200).json({ success: true, data: instructors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/instructors/:id
export const getInstructor = async (req, res) => {
  try {
    const instructor = await User.findOne({ _id: req.params.id, role: "instructor" }).select("-password");
    if (!instructor) return res.status(404).json({ success: false, message: "Instructor not found" });
    res.status(200).json({ success: true, data: instructor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/admin/instructors
export const createInstructor = async (req, res) => {
  try {
    const { name, email, password, phone, bio } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "Email already in use" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const instructor = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "instructor",
      phone,
      bio,
    });

    res.status(201).json({ success: true, data: instructor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/admin/instructors/:id
export const updateInstructor = async (req, res) => {
  try {
    const updates = req.body;

    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const instructor = await User.findOneAndUpdate(
      { _id: req.params.id, role: "instructor" },
      updates,
      { new: true }
    ).select("-password");

    if (!instructor) return res.status(404).json({ success: false, message: "Instructor not found" });

    res.status(200).json({ success: true, data: instructor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/admin/instructors/:id
export const deleteInstructor = async (req, res) => {
  try {
    const instructor = await User.findOneAndDelete({ _id: req.params.id, role: "instructor" });
    if (!instructor) return res.status(404).json({ success: false, message: "Instructor not found" });

    res.status(200).json({ success: true, message: "Instructor deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Auto change for Mon Oct 28 2024 03:00:00 GMT+0300 (East Africa Time)
// Auto change for Thu Oct 31 2024 03:00:00 GMT+0300 (East Africa Time)