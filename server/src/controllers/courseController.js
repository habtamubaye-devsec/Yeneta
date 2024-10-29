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
// Instructor can request, cancel, or unpublish
const requestTogglePublish = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findOne({ _id: id, instructor: req.user._id });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or not owned by you",
      });
    }

    // Count lessons
    const lessonCount = course.lessons.length;
    console.log(`Course has ${lessonCount} lessons.`);
    if (lessonCount < 5) {
      return res.status(400).json({ success: false, message: "At least 5 lessons are required to publish the course" });
    }

    // 🧩 Logic based on status
    if (course.status === "unpublished") {
      // Request publish
      
      course.status = "pending";
    } else if (course.status === "pending") {
      // Cancel publish request
      course.status = "unpublished";
    } else if (course.status === "published") {
      // Unpublish course
      course.status = "unpublished";
      course.publishedAt = null;
    }
    else if (course.status === "rejected") {
      // Re-submit for publishing
      course.status = "pending";
    }

    await course.save();

    res.json({
      success: true,
      message:
        course.status === "pending"
          ? "Publish request sent successfully"
          : course.status === "unpublished"
          ? "Publish request cancelled or course unpublished"
          : "Course status updated",
      data: course,
    });
  } catch (err) {
    console.error("Toggle publish error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/courses/:id/approve
const approveCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (course.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending courses can be approved",
      });
    }

    course.status = "published";
    course.publishedAt = new Date();
    await course.save();

    res.json({
      success: true,
      message: "Course published successfully",
      data: course,
    });
  } catch (err) {
    console.error("Approve course error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

//patch /api/courses/:id/reject
const rejectCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (course.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending courses can be rejected",
      });
    }

    course.status = "rejected";
    await course.save();

    res.json({
      success: true,
      message: "Course rejected successfully",
      data: course,
    });
  } catch (err) {
    console.error("Reject course error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete course
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the course first
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Check role and ownership
    const isOwner = course.instructor.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin" || req.user.role === "superadmin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this course" });
    }

    // Delete the course
    await course.deleteOne();

    res.json({ success: true, message: "Course deleted successfully" });
  } catch (err) {
    console.error("Error deleting course:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// Get all courses (public)
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: "published" }) // ✅ only published courses
      .populate("instructor", "name email") // show instructor info
      .populate("category", "name") // show category name
      .select("-lessons"); // exclude lessons for performance

    res.json({ success: true, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all courses for admin (private for admin adn super admin)
const getAllCoursesForAdmin = async (req, res) => {
  try {
    const courses = await Course.find() // ✅ only published courses
      .populate("instructor", "name email") // show instructor info
      .populate("category", "name") // show category name
      .populate("lessons", "title position videoDuration") // show lesson titles and durations

    res.json({ success: true, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single course (public)
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
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
  requestTogglePublish,
  approveCourse,
  rejectCourse,
  deleteCourse,
  getAllCourses,
  getAllCoursesForAdmin,
  getCourseById,
  getCoursesByInstructor,
  getStats,
};

// Auto change for Tue Oct 22 2024 03:00:00 GMT+0300 (East Africa Time)
// Auto change for Sat Oct 26 2024 03:00:00 GMT+0300 (East Africa Time)
// Auto change for Tue Oct 29 2024 03:00:00 GMT+0300 (East Africa Time)