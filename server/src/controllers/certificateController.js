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

    // Build a safe filename using user name, course and the platform name (Yeneta)
    const rawName = `${enrollment.user.name}_${enrollment.course.title}_Yeneta`
      .replace(/[^a-z0-9_\- ]/gi, '')
      .replace(/\s+/g, '_')
      .slice(0, 120);
    const filename = `${rawName}_certificate.pdf`;
    // Allow viewer to open inline by default. If ?download=true is present, force attachment
    const forceDownload = req.query?.download === 'true' || req.query?.download === '1';
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `${forceDownload ? 'attachment' : 'inline'}; filename="${filename}"`
    );

    // Use fixed positions to keep everything on a single page
    const W = doc.page.width;
    const H = doc.page.height - 50;
    const margin = 60;
    const centerX = W / 2;
    const centerY = H / 2;

    // Watermark (center, subtle, placed absolutely to avoid flowing text)
    doc.save();
    doc.fillColor('#f3f4f6').opacity(0.22).fontSize(96);
    const wmText = 'YENETA';
    // Draw watermark using fixed coordinates (no flow)
    doc.translate(centerX - 240, centerY - 40);
    doc.rotate(-20);
    doc.text(wmText, 0, 0, { lineBreak: false });
    // reset transformation
    doc.rotate(20);
    doc.translate(-(centerX - 240), -(centerY - 40));
    doc.opacity(1);
    doc.restore();

    // Elegant border
    doc.lineWidth(1.6).strokeColor('#c9a34a').rect(margin - 10, margin - 10, W - (margin - 10) * 2, H - (margin - 10) * 2).stroke();

    // Optional logo - if an image exists at ./assets/certificate_logo.png or ./assets/logo.png, use it
    // Prefer a high-quality logo stored in server templates (yeneta2.png), then fall back to project assets
    const logoPaths = [
      path.join(process.cwd(), 'server', 'src', 'templates', 'yeneta2.png'),
      path.join(process.cwd(), 'assets', 'certificate_logo.png'),
      path.join(process.cwd(), 'assets', 'logo.png'),
    ];
    let logoUsed = false;
    for (const p of logoPaths) {
      if (fs.existsSync(p)) {
        try {
          const maxLogoWidth = 130;
          const maxLogoHeight = 60;
          // place centered at the top
          doc.image(p, centerX - maxLogoWidth / 2, margin + 6, { width: maxLogoWidth, height: maxLogoHeight, align: 'center' });
          logoUsed = true;
          break;
        } catch (err) {
          // ignore and try next
        }
      }
    }
    // If no logo image, draw a small emblem at top-left
    if (!logoUsed) {
      doc.save();
      doc.circle(margin + 24, margin + 28, 28).fill('#0b1220');
      doc.fillColor('#fff').fontSize(18).text('Y', margin + 18, margin + 16);
      doc.restore();
      doc.fillColor('#0b1220').fontSize(12).font('Times-Roman').text('Yeneta Learning', W - margin - 120, margin + 22, { width: 120, align: 'right' });
    } else {
      doc.fillColor('#0b1220').fontSize(12).font('Times-Roman').text('Yeneta Learning', W - margin - 120, margin + 12, { width: 120, align: 'right' });
    }

    // Main title and recipient using absolute coordinates (explicit layout to avoid flow/extra pages)
    const titleY = margin + 50;
    const titleX = centerX - 260;
    doc.fillColor('#0f172a').fontSize(30).font('Times-Bold').text('Certificate of Completion', titleX, titleY, { width: 520, align: 'center' });

    const subY = titleY + 42;
    doc.fontSize(14).font('Times-Roman').fillColor('#6b7280').text('This certifies that', titleX, subY, { width: 520, align: 'center' });

    // Recipient name — measure and shrink to fit max width
    const recipient = `${enrollment.user.name}`;
    const recipientMaxWidth = 640;
    let nameFontSize = 44;
    doc.font('Times-BoldItalic');
    while (doc.widthOfString(recipient, { size: nameFontSize }) > recipientMaxWidth && nameFontSize > 18) {
      nameFontSize -= 2;
    }
    const nameY = subY + 30;
    doc.fontSize(nameFontSize).fillColor('#0b1220').text(recipient, centerX - recipientMaxWidth / 2, nameY, { width: recipientMaxWidth, align: 'center', lineBreak: false });

    const line1Y = nameY + nameFontSize + 8;
    doc.font('Times-Roman').fontSize(14).fillColor('#374151').text('has successfully completed the program', titleX, line1Y, { width: 520, align: 'center' });

    // Course title — measure and shrink to fit
    const courseTitle = `${enrollment.course.title}`;
    const courseMaxWidth = 640;
    let courseFontSize = 22;
    doc.font('Times-Bold');
    while (doc.widthOfString(courseTitle, { size: courseFontSize }) > courseMaxWidth && courseFontSize > 12) {
      courseFontSize -= 1;
    }
    const courseY = line1Y + 28;
    doc.fontSize(courseFontSize).fillColor('#0f172a').text(courseTitle, centerX - courseMaxWidth / 2, courseY, { width: courseMaxWidth, align: 'center', lineBreak: false });

    // brief description — avoid wrapping by using smaller size and fixed width
    const descY = courseY + courseFontSize + 12;
    const desc = `Awarded for successful completion and demonstration of skills in ${enrollment.course.title}.`;
    doc.font('Times-Roman').fontSize(10).fillColor('#6b7280').text(desc, centerX - 300, descY, { width: 600, align: 'center', lineBreak: true, ellipsis: true });

    // Certificate metadata - fixed bottom area
    const bottomY = H - margin - 80;
    // Use the real database id (enrollment._id) as the certificate id
    const certId = String(enrollment._id);
    doc.fontSize(10).fillColor('#6b7280').text(`Certificate ID: ${certId}`, margin + 8, bottomY);

    const issuedAt = enrollment.completedAt ? new Date(enrollment.completedAt) : new Date();
    doc.fontSize(10).fillColor('#6b7280').text(`Issued: ${issuedAt.toLocaleDateString()}`, W - margin - 160, bottomY, { width: 150, align: 'right' });

    // Horizontal signature separators and signature area - fixed coordinates
    const sigLineY = bottomY + 18;
    const sigBoxX = W - margin - 260;
    const sigBoxY = bottomY + 6;
    doc.lineWidth(0.8).strokeColor('#d1d5db').moveTo(margin + 40, sigLineY).lineTo(W - margin - 40, sigLineY).stroke();

     // Signature area (bottom-right)
     const sigX = doc.page.width - 320;
     const sigY = doc.page.height - 160;

     // Add a decorative separator line (kept in fixed coords, doesn't affect pagination)
     doc.moveTo(margin + 30, sigY - 46).lineTo(W - margin - 30, sigY - 46).lineWidth(1).strokeOpacity(0.12).stroke('#374151');

    // Draw a compact random scribble as a signature (simple bezier/lines)
     function drawRandomSignature(x, y) {
      const amplitude = 6 + Math.random() * 6;
      const segments = 7 + Math.floor(Math.random() * 6);
      let cx = x;
      let cy = y;
      doc.save();
      doc.strokeColor('#0f172a').lineWidth(1.8).moveTo(cx, cy);
      for (let i = 0; i < segments; i++) {
        const nx = cx + 20 + Math.random() * 40;
        const ny = cy + (Math.random() - 0.5) * amplitude * 2;
        const cp1x = cx + 8 + Math.random() * 10;
        const cp1y = cy + (Math.random() - 0.5) * amplitude;
        const cp2x = cx + 12 + Math.random() * 10;
        const cp2y = cy + (Math.random() - 0.5) * amplitude;
        doc.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, nx, ny);
        cx = nx;
        cy = ny;
      }
      doc.stroke();
      doc.restore();
     }

    // Place signature scribble and printed CEO name/title - compact enough to fit single page
    drawRandomSignature(sigX + 24, sigY - 8);
    doc.fontSize(13).fillColor('#0f172a').font('Times-Bold').text('Habetamu bae', sigX + 8, sigY + 6);
    doc.fontSize(10).fillColor('#6B7280').font('Times-Roman').text('Chief Executive Officer', sigX + 8, sigY + 22);

     // Verification text near the signature / small instructions
     doc.fontSize(9).fillColor('#9aa0a6').text('Verify this certificate at https://yeneta.local/verify', sigX - 220, sigY + 88);

     // Footer with education icon
     doc.fontSize(12).fillColor("#9CA3AF").text("🎓 Yeneta Learning Platform", 0, H - 26, { align: "center" });

    doc.pipe(res);
    doc.end();
    

  } catch (err) {
    console.error("Certificate generation error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Auto change for Fri Nov 01 2024 03:00:00 GMT+0300 (East Africa Time)