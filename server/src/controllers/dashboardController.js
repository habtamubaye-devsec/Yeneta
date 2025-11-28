import Enrollment from "../models/enrollment.js";
import Course from "../models/course.js";
import Review from "../models/reviewModel.js";
import User from "../models/userModel.js";

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

// ========================
// Admin dashboard summary
// GET /api/dashboard/admin
// Returns top-level fields expected by frontend: { success, totalUsers, totalCourses, totalEnrollments, totalRevenue, instructorRequests, awaitingCourseApproval, reviewReports }
// ========================
export const adminDashboard = async (req, res) => {
  try {
    // total users
    const totalUsers = await User.countDocuments();

    // total courses
    const totalCourses = await Course.countDocuments();

    // total enrollments and total revenue
    const enrollments = await Enrollment.find();
    const totalEnrollments = enrollments.length;
    const totalRevenue = enrollments.reduce((sum, e) => sum + (Number(e.pricePaid) || 0), 0);

    // instructor requests (field on userModel)
    const instructorRequests = await User.countDocuments({ requestedToBeInstructor: 'requested' });

    // awaiting course approval (courses that are unpublished)
    const awaitingCourseApproval = await Course.countDocuments({ published: false });

    // review reports placeholder — if you later implement reported flags, update this
    // for now make educated guess: count all reviews as reviewReports for the admin overview
    const reviewReports = await Review.countDocuments();

    return res.status(200).json({
      success: true,
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalRevenue,
      instructorRequests,
      awaitingCourseApproval,
      reviewReports,
    });
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Re-add superadmin dashboard (ensure export exists for routes)
export const superAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();

    const enrollments = await Enrollment.find();
    const totalEnrollments = enrollments.length;
    const totalRevenue = enrollments.reduce((sum, e) => sum + (Number(e.pricePaid) || 0), 0);

    // counts per role
    const roles = ["student", "instructor", "admin", "superadmin"];
    const roleCounts = {};
    for (const r of roles) {
      roleCounts[r] = await User.countDocuments({ role: r });
    }

    // heuristic for security alerts
    const banned = await User.countDocuments({ status: 'banned' });
    const unverified = await User.countDocuments({ isVerified: false });
    const securityAlerts = banned + unverified;

    return res.status(200).json({
      success: true,
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalRevenue,
      roleCounts,
      securityAlerts,
    });
  } catch (error) {
    console.error("Error fetching superadmin dashboard data:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
