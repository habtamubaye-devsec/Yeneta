import Enrollment from "../models/enrollment.js";
import Course from "../models/course.js";
import Review from "../models/reviewModel.js";

export const studentDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const enrollments = await Enrollment.find({ user: userId });

    const enrollmentCount = await Enrollment.countDocuments({ user: userId });

    const completedCourse = await Enrollment.countDocuments({
      user: userId,
      status: "completed",
    });

    let totalSpendMoney = 0;

    for (const enrollment of enrollments) {
      totalSpendMoney += enrollment.pricePaid || 0;  // FIXED
    }

    return res.status(200).json({
      success: true,
      completedCourse,
      enrollmentCount,
      totalSpendMoney,
    });

  } catch (error) {
    console.error("Error fetching student dashboard data:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const instructorDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const courses = await Course.find({ instructor: userId });

    const totalCourses = courses.length;  

    const studentsCount = await Enrollment.countDocuments({
      instructor: userId,
    }); 

    const reviews = await Review.find({ course: { $in: courses.map(c => c._id) } });

    const totalReviews = reviews.length; 

    let totalEarnings = 0;

    for (const course of courses) {
      const enrollments = await Enrollment.find({ course: course._id });
      for (const enrollment of enrollments) {
        totalEarnings += enrollment.pricePaid || 0; 
      }
    }
    return res.status(200).json({
      success: true,
      totalCourses,
      studentsCount,
      totalReviews,
      totalEarnings,
    });
  } catch (error) {
    console.error("Error fetching instructor dashboard data:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// Auto change for Wed Oct 23 2024 03:00:00 GMT+0300 (East Africa Time)
// Auto change for Thu Oct 24 2024 03:00:00 GMT+0300 (East Africa Time)