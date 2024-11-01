import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
import Enrollment from "../models/enrollment.js";


export const getMyCertificates = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all completed enrollments
    const completedEnrollments = await Enrollment.find({ user: userId, completed: "completed" })
      .populate("course")
      .populate("instructor")
      .populate("user");

    console.log("Completed Enrollments:", completedEnrollments);


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

    const filename = `${enrollment.user.name}_${enrollment.course.title}_certificate.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // Outer border
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
       .lineWidth(4)
       .stroke("#2563EB");

    // Inner border
    doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80)
       .lineWidth(2)
       .stroke("#60A5FA");

    // Optional logo
    const logoPath = path.join(process.cwd(), "assets/logo.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, doc.page.width / 2 - 50, 50, { width: 100 });
    }

    // Title
    doc.fillColor("#1E3A8A")
       .fontSize(36)
       .text("Certificate of Completion", { align: "center", underline: true });

    doc.moveDown(2);

    // Subtitle
    doc.fontSize(20)
       .fillColor("#111827")
       .text("This is to certify that", { align: "center" });

    doc.moveDown();

    // Student name
    doc.fontSize(28)
       .fillColor("#1F2937")
       .text(`${enrollment.user.name}`, { align: "center", underline: true });

    doc.moveDown();

    // Completion text
    doc.fontSize(20)
       .fillColor("#374151")
       .text("has successfully completed the course", { align: "center" });

    doc.moveDown();

    // Course title with ribbon decoration
    const ribbonWidth = 400;
    const ribbonHeight = 40;
    const ribbonX = doc.page.width / 2 - ribbonWidth / 2;
    const ribbonY = doc.y;

    doc.rect(ribbonX, ribbonY - 10, ribbonWidth, ribbonHeight)
       .fillOpacity(0.1)
       .fill("#2563EB");

    doc.fillOpacity(1)
       .fontSize(24)
       .fillColor("#1E3A8A")
       .text(`${enrollment.course.title}`, ribbonX + 10, ribbonY, { width: ribbonWidth - 20, align: "center" });

    doc.moveDown(3);

    // Instructor and date
    doc.fontSize(14).fillColor("#6B7280")
       .text(`Instructor: ${enrollment.instructor?.name || "N/A"}`, 100, doc.y, { align: "left" });
    doc.fontSize(14).fillColor("#6B7280")
       .text(`Date: ${new Date().toLocaleDateString()}`, -100, doc.y, { align: "right" });

    // Footer with education icon
    doc.fontSize(12).fillColor("#9CA3AF")
       .text("🎓 Yeneta Learning Platform", 0, doc.page.height - 50, { align: "center" });

    doc.pipe(res);
    doc.end();
    

  } catch (err) {
    console.error("Certificate generation error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Auto change for Fri Nov 01 2024 03:00:00 GMT+0300 (East Africa Time)