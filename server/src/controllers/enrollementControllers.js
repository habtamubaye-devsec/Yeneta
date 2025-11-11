import Stripe from "stripe";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ========================
// Create Stripe checkout session
// POST /api/enrollment/checkout/:courseId
// ========================
export const createCheckoutSession = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;
    const course = await Course.findById(courseId);
    const enrollment = await Enrollment.findOne({
      course: courseId,
      user: userId,
    });

    if (!course)
      return res.status(404).json({ success: false, message: "Course not found" });
    if (enrollment)
      return res.status(400).json({ success: false, message: "Already enrolled" });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: course.title },
            unit_amount: course.price * 100, // in cents
          },
          quantity: 1,
        },
      ],
  // include courseId and session id so frontend can confirm enrollment and redirect
  success_url: `${process.env.FRONTEND_URL}/enrollment/success?courseId=${course._id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: {
        userId: req.user._id.toString(),
        courseId: course._id.toString(),
      },
    });

    res.status(200).json({ success: true, url: session.url });
  } catch (err) {
    console.error("Checkout session error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ========================
// Stripe webhook
// POST /api/enrollment/webhook
// ========================
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const userId = session.metadata.userId;
      const courseId = session.metadata.courseId;

      // Prevent duplicate enrollment
      const existing = await Enrollment.findOne({ user: userId, course: courseId });
      if (!existing) {
        const course = await Course.findById(courseId);
        await Enrollment.create({
          user: userId,
          course: courseId,
          pricePaid: course.price,
          completedLessons: [],
        });
        console.log("Enrollment created successfully!");
      }
    } catch (err) {
      console.error("Error creating enrollment:", err);
    }
  }

  res.json({ received: true });
};

// ========================
// Webhook test helper (local dev)
// POST /api/enrollment/webhook-test
// Body: { sessionId: string }
// Protected route so only authenticated users can trigger it.
// This allows local testing without Stripe webhook delivery.
export const webhookTest = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ success: false, message: "sessionId required" });

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) return res.status(404).json({ success: false, message: "Session not found" });

    const userId = session.metadata?.userId;
    const courseId = session.metadata?.courseId;
    if (!userId || !courseId)
      return res.status(400).json({ success: false, message: "Missing metadata on session" });

    const course = await Course.findById(courseId);
    if (!course)
      return res.status(404).json({ success: false, message: "Course not found" });
    if (!course.instructor)
      return res.status(400).json({
        success: false,
        message: "Course has no instructor assigned yet",
      })

    const existing = await Enrollment.findOne({ user: userId, course: courseId });
    if (existing) return res.status(200).json({ success: true, message: "Already enrolled" });
   
    const enrollment = await Enrollment.create({
      user: userId,
      course: courseId,
      instructor: course.instructor, // ✅ add instructor from the course
      pricePaid: course.price,
      completedLessons: [],
    });

    console.log("[webhook-test] Enrollment created successfully for session", sessionId);
    res.status(201).json({ success: true, data: enrollment });
  } catch (err) {
    console.error("webhookTest error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ========================
// Manual enrollment (optional, for free courses/admin)
// POST /api/enroll/:courseId
// ========================
export const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Find the course
    const course = await Course.findById(courseId);
    if (!course)
      return res.status(404).json({ success: false, message: "Course not found" });
    if (!course.instructor)
      return res.status(400).json({
        success: false,
        message: "Course has no instructor assigned yet",
      })

    // Check if already enrolled
    const existing = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (existing)
      return res.status(400).json({ success: false, message: "Already enrolled" });

    // Create new enrollment
    const enrollment = await Enrollment.create({
      user: req.user._id,
      course: courseId,
      instructor: course.instructor, // ✅ add instructor from the course
      pricePaid: course.price,
      currentLesson: course.lessons?.[0]?._id || null,
      progress: 0,
      completedLessons: [],
    });

    res.status(201).json({ success: true, data: enrollment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// ========================
// Get all enrollments for the logged-in user
// GET /api/enroll/my
// ========================
export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id }).populate("course");
    res.status(200).json({ success: true, data: enrollments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ========================
// Get all enrollments  by course
// GET /api/enroll/courseId
// ========================
export const getEnrollmentsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id; // correct way
    if (!userId) {
      return res.status(404).json({ success: false, message: "user not found"})
    }

    if (!courseId) {
      return res.status(404).json({ success: false, message: "course not found"})
    }

    const enrollment = await Enrollment.findOne({ course: courseId, user: userId });
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found',  courseId });
    }

    res.status(200).json({ success: true, data: enrollment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ========================
// Get all enrollments length by course
// GET /api/enroll/length/courseId
// ========================
export const getEnrollmentsLengthByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollments = await Enrollment.find({ course: courseId });
    res.status(200).json({ success: true, data: enrollments.length ,});
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ========================
// Get completed lessons for a course
// GET /api/enroll/:courseId/progress
// ========================
export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
    }).populate("completedLessons");

    if (!enrollment)
      return res.status(404).json({ success: false, message: "Not enrolled" });

    res.status(200).json({ success: true, data: enrollment.completedLessons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ========================
// Update lesson progress
// PATCH /api/enroll/:courseId/progress
// ========================
export const updateLessonProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lessonId } = req.body;

    // 1️⃣ Find the enrollment and populate the course to access its lessons
    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
    }).populate("course");

    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Not enrolled" });
    }

    // 2️⃣ Add lesson to completed list if not already there
    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    // 3️⃣ Calculate progress (completed / total lessons)
    const totalLessons = enrollment.course?.lessons?.length || 0;
    const completedLessons = enrollment.completedLessons.length;
    console.log("Total Lessons:", totalLessons, "Completed Lessons:", completedLessons);

    // Avoid division by zero
    const progress =
      totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    enrollment.progress = progress;

    // 4️⃣ Mark course as completed if all lessons done (optional)
    if (completedLessons === totalLessons && totalLessons > 0) {
      enrollment.completed = "completed"; // you can customize field name if needed
    }

    await enrollment.save();

    // 5️⃣ Return the updated data
    res.status(200).json({
      success: true,
      message: "Progress updated successfully",
      data: {
        completedLessons: enrollment.completedLessons,
        progress: enrollment.progress,
        status: enrollment.status,
      },
    });
  } catch (err) {
    console.error("❌ updateLessonProgress error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};