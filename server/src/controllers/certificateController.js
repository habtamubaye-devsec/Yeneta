import PDFDocument from "pdfkit";
import Enrollment from "../models/enrollment.js";
import { makeCertificateFilename, renderCertificatePdf } from "../utils/certificatePdf.js";


export const getMyCertificates = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all completed enrollments
    const completedEnrollments = await Enrollment.find({ user: userId, completed: "completed" })
      .populate("course")
      .populate("instructor")
      .populate("user");


    // Map to certificate-friendly format
    const certificates = completedEnrollments.map((enroll) => ({
      _id: enroll._id,
      userId: userId,
      userName: enroll.user?.name || "h",
      courseId: enroll.course._id,
      thumbnailUrl: enroll.course.thumbnailUrl,
      courseTitle: enroll.course.title,
      instructor: enroll.instructor?.name || "N/A",
      completionDate: enroll.completedAt || enroll.updatedAt,
    }));

    res.status(200).json({
      success: true,
      data: certificates,
    });
  } catch (err) {
    console.error("Error fetching certificates:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const generateCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const enrollment = await Enrollment.findOne({ user: userId, course: courseId })
      .populate("course")
      .populate("instructor")
      .populate("user");

    if (!enrollment || enrollment.completed !== "completed") {
      return res.status(400).json({
        success: false,
        message: "You must complete the course to get a certificate",
      });
    }

    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape", // <-- Landscape
      margins: { top: 80, bottom: 50, left: 50, right: 50 },
    });

    const filename = makeCertificateFilename(enrollment);
    // Allow viewer to open inline by default. If ?download=true is present, force attachment
    const forceDownload = req.query?.download === 'true' || req.query?.download === '1';
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `${forceDownload ? 'attachment' : 'inline'}; filename="${filename}"`
    );
    doc.pipe(res);
    renderCertificatePdf({ doc, enrollment });
    doc.end();
    

  } catch (err) {
    console.error("Certificate generation error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Auto change for Fri Nov 01 2024 03:00:00 GMT+0300 (East Africa Time)