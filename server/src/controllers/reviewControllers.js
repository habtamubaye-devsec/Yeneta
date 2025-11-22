import Review from "../models/reviewModel.js";
import Course from "../models/course.js"
import User from "../models/userModel.js";

// POST /api/courses/:courseId/review
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const courseId = req.params.courseId;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    // Check if user already reviewed
    const existingReview = await Review.findOne({
      course: courseId,
      user: req.user._id,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ success: false, message: "You already reviewed this course" });
    }

    // Create review
    const review = await Review.create({
      course: courseId,
      user: req.user._id,
      rating,
      comment,
    });

    // Populate user and course info for immediate frontend use
    const populatedReview = await Review.findById(review._id)
      .populate("user", "name profileImage") // only needed fields
      .populate("course", "title thumbnailUrl");

    res.status(201).json({ success: true, data: populatedReview });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET /api/courses/:courseId/reviews
export const getCourseReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ course: req.params.courseId }).populate("user", "name email profileImage");
    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/review/me
export const getMyReview = async (req, res) => {
  try {
    const review = await Review.findOne({ user: req.user.id })
      .populate("course", "title thumbnailUrl");

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "You have not submitted a review yet",
      });
    }

    res.status(200).json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/review/:id
export const deleteMyReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,   // match the review ID from URL
      user: req.user.id,    // ensure user can only delete their own review
    });

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    await Review.findByIdAndDelete(review._id);

    res.status(200).json({ success: true, message: "Review deleted successfully" });
  } catch (err) {
    console.error(err); // logs for debugging
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET /api/review/instructor
export const getInstructorReviews = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id });

    const courseIds = courses.map(c => c._id);

    const reviews = await Review.find({ course: { $in: courseIds } })
      .populate("user", "name")
      .populate("course", "title");

    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// DELETE /api/reviews/:id (admin only)
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });

    await review.remove();
    res.status(200).json({ success: true, message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
