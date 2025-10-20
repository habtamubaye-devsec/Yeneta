import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Earning from "../models/Earning.js";
import bcyrpt from 'bcrypt'

// Create a new course
const createCourse = async (req, res) => {
  try {
    const { title, description, category, price, thumbnailUrl } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const course = await Course.create({
      instructor: req.user._id,
      title,
      description,
      category,
      price,
      thumbnailUrl,
    });

    res.status(201).json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update course
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, instructor: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found or not owned by you" });
    }

    res.json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete course
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({
      _id: req.params.id,
      instructor: req.user._id,
    });

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found or not owned by you" });
    }

    res.json({ success: true, message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all courses (public)
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "name email") // only show limited instructor fields
      .select("-lessons"); // don’t return lessons list here for performance

    res.json({ success: true, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single course (public)
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name email")
      .populate({
        path: "lessons",
        select: "title content videoUrl resources",
      });

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Instructor stats
const getStats = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id }).select("_id");
    const courseIds = courses.map((c) => c._id);

    const totalEnrollments = await Enrollment.countDocuments({ course: { $in: courseIds } });

    const earnings = await Earning.aggregate([
      { $match: { instructor: req.user._id } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      success: true,
      data: {
        totalEnrollments,
        totalEarnings: earnings.length > 0 ? earnings[0].total : 0,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  getStats,
};
