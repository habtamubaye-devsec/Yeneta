import Review from "../models/reviewModel.js";
import Course from "../models/course.js"
// POST /api/courses/:courseId/review
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const courseId = req.params.courseId;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    // Check if user already reviewed
    const existingReview = await Review.findOne({ course: courseId, user: req.user._id });
    if (existingReview) {
      return res.status(400).json({ success: false, message: "You already reviewed this course" });
    }

    const review = await Review.create({
      course: courseId,
      user: req.user._id,
      rating,
      comment,
    });

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/courses/:courseId/reviews
export const getCourseReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ course: req.params.courseId }).populate("user", "name email");
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
