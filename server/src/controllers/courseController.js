import Course from "../models/Course.js";
import Lesson from "../models/lesson.js"
import Enrollment from "../models/Enrollment.js";
import Earning from "../models/Earning.js";
import cloudinary from "../utils/cloudinary.js";

// ✅ Create a new course (with Cloudinary upload)
const createCourse = async (req, res) => {
   try {
    console.log("Received body:", req.body);
    console.log("Received file:", req.file);

    const { title, description, category, subCategories, price, level } = req.body;

    if (!title || !description || !category || !subCategories) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    let thumbnailUrl = "";

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "courses" },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(req.file.buffer);
      });
      thumbnailUrl = result.secure_url;
    }

    const course = await Course.create({
      instructor: req.user._id,
      title,
      description,
      category,
      subCategories,
      price,
      level,
      thumbnailUrl,
    });

    res.status(201).json({
      success: true,
      data: course,
      message: "Course created successfully",
    });
  } catch (err) {
    console.error("Create course error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

//UPDATE
const updateCourse = async (req, res) => {
  try {
    console.log("Received body:", req.body);
    console.log("Received file:", req.file);

    const { title, description, category, subCategories, price, level } = req.body;

    // Find course owned by instructor
    const course = await Course.findOne({
      _id: req.params.id,
      instructor: req.user._id,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or not owned by you",
      });
    }

    // ✅ Update text fields if present
    if (title) course.title = title;
    if (description) course.description = description;
    if (category) course.category = category;
    if (subCategories)
      course.subCategories = Array.isArray(subCategories)
        ? subCategories
        : subCategories.split(",");
    if (price) course.price = price;
    if (level) course.level = level;

    // ✅ Handle Cloudinary thumbnail upload (if file included)
    if (req.file) {
      // Upload new thumbnail using Cloudinary stream
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "courses" },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(req.file.buffer);
      });

      // Replace the existing thumbnail URL
      course.thumbnailUrl = result.secure_url;
    }

    // Save updates
    await course.save();

    res.status(200).json({
      success: true,
      message: "✅ Course updated successfully",
      data: course,
    });
  } catch (err) {
    console.error("Update course error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to update course",
    });
  }
};

// PATCH /api/courses/:id/publish
const togglePublishCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findOne({ _id: id, instructor: req.user._id });
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found or not owned by you" });
    }

    // 🔍 Count lessons for this course (accurate even if not populated)
    const lessonCount = await Lesson.countDocuments({ course: course._id });

    // 🟢 Publish if >= 2 lessons, otherwise prevent
    if (!course.published) {
      if (lessonCount < 2) {
        return res.status(400).json({
          success: false,
          message: "You must have at least 2 lessons to publish this course",
        });
      }
      course.published = true;
      course.publishedAt = new Date();
    } else {
      // 🔴 Unpublish
      course.published = false;
      course.publishedAt = null;
    }

    await course.save();

    res.json({
      success: true,
      message: course.published
        ? "Course published successfully"
        : "Course unpublished successfully",
      data: course,
    });
  } catch (err) {
    console.error("Toggle publish error:", err);
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

//Get course by instructor
// Get courses by instructor
const getCoursesByInstructor = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Instructor not found",
      });
    }

    // Fetch all courses created by the logged-in instructor
    const courses = await Course.find({ instructor: req.user._id }).sort({ createdAt: -1 });

    // Check if instructor has no courses
    if (!courses.length) {
      return res.status(404).json({
        success: false,
        message: "No courses found for this instructor",
      });
    }

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (err) {
    console.error("❌ Error fetching courses:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching courses",
    });
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
  togglePublishCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  getCoursesByInstructor,
  getStats,
};
