import Review from "../models/reviewModel.js";
import Course from "../models/course.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";

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
    const reviews = await Review.find({ course: req.params.courseId }).populate(
      "user",
      "name email profileImage"
    );
    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/review/me
export const getMyReview = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id }).populate(
      "course",
      "title thumbnailUrl"
    );

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: "You have not submitted any reviews yet",
      });
    }

    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/review/:id
export const deleteMyReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id, // match the review ID from URL
      user: req.user.id, // ensure user can only delete their own review
    });

    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    await Review.findByIdAndDelete(review._id);

    res
      .status(200)
      .json({ success: true, message: "Review deleted successfully" });
  } catch (err) {
    console.error(err); // logs for debugging
    res.status(500).json({ success: false, message: err.message });
  }
};

//Patch /api/review/:id
export const updateMyReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    review.rating = rating !== undefined ? rating : review.rating;
    review.comment = comment !== undefined ? comment : review.comment;

    await review.save();

    const updatedReview = await Review.findById(review._id)
      .populate("user", "name profileImage")
      .populate("course", "title thumbnailUrl");

    res.status(200).json({
      success: true,
      data: {
        ...updatedReview.toObject(),
        id: updatedReview._id,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/review/instructor
export const getInstructorReviews = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id });

    const courseIds = courses.map((c) => c._id);

    const reviews = await Review.find({ course: { $in: courseIds } })
      .populate("user", "name profileImage")
      .populate("course", "title thumbnailUrl");

    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/review/summary
export const getReviewSummaryForCourses = async (req, res) => {
  try {
    const result = await Review.aggregate([
      {
        $group: {
          _id: "$course",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },
      {
        $project: {
          _id: 0,
          courseId: "$course._id",
          title: "$course.title",
          thumbnailUrl: "$course.thumbnailUrl",
          averageRating: 1,
          reviewCount: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get review summary (average rating and number of raters) for a single course
export const getReviewSummaryForSingleCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Cast courseId to ObjectId
    const objectId = new mongoose.Types.ObjectId(courseId);

    const result = await Review.aggregate([
      { $match: { course: objectId } }, // <- important
      {
        $group: {
          _id: "$course",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          averageRating: 1,
          reviewCount: 1,
        },
      },
    ]);

    // Optionally also fetch the reviews themselves
    const reviews = await Review.find({ course: objectId });

    res.status(200).json({
      success: true,
      data: result[0] || { averageRating: 0, reviewCount: 0 },
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get ALL reviews with user + course info (Admin Only)
export const getReviewForAdmin = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate({
        path: "user",
        select: "name profileImage email",
      })
      .populate({
        path: "course",
        select: "title thumbnailUrl instructor",
      })
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({
      success: true,
      data: reviews,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/reviews/:id (admin only)
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review)
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });

    await review.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
