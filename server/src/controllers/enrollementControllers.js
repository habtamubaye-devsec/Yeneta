import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

// POST /api/enroll/:courseId
export const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if already enrolled
    const existing = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (existing) {
      return res.status(400).json({ success: false, message: "Already enrolled" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    const enrollment = await Enrollment.create({
      user: req.user._id,
      course: courseId,
      pricePaid: course.price,
      completedLessons: [],
    });

    res.status(201).json({ success: true, data: enrollment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/enroll/my
export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id }).populate("course");
    res.status(200).json({ success: true, data: enrollments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/enroll/:courseId/progress
export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
    }).populate("completedLessons");

    if (!enrollment) return res.status(404).json({ success: false, message: "Not enrolled" });

    res.status(200).json({ success: true, data: enrollment.completedLessons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/enroll/:courseId/progress
export const updateLessonProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lessonId } = req.body;

    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (!enrollment) return res.status(404).json({ success: false, message: "Not enrolled" });

    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
      await enrollment.save();
    }

    res.status(200).json({ success: true, data: enrollment.completedLessons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/enroll/:courseId/certificate
export const generateCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
    }).populate("course user completedLessons");

    if (!enrollment) return res.status(404).json({ success: false, message: "Not enrolled" });

    // Optional: check all lessons completed
    if (enrollment.completedLessons.length < enrollment.course.lessons.length) {
      return res.status(400).json({ success: false, message: "Complete all lessons first" });
    }

    const certificate = {
      student: enrollment.user.name,
      course: enrollment.course.title,
      date: new Date(),
      message: "Certificate of Completion",
    };

    res.status(200).json({ success: true, data: certificate });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
