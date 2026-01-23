import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
import { PassThrough } from "stream";

export function makeCertificateFilename(enrollment) {
  const rawName = `${enrollment.user.name}_${enrollment.course.title}_Yeneta`
    .replace(/[^a-z0-9_\- ]/gi, "")
    .replace(/\s+/g, "_")
    .slice(0, 120);
  return `${rawName}_certificate.pdf`;
}

export function renderCertificatePdf({ doc, enrollment, verifyUrl }) {
  const W = doc.page.width;
  const H = doc.page.height - 50;
  const margin = 60;
  const centerX = W / 2;
  const centerY = H / 2;

  // Watermark
  doc.save();
  doc.fillColor("#f3f4f6").opacity(0.22).fontSize(96);
  const wmText = "YENETA";
  doc.translate(centerX - 240, centerY - 40);
  doc.rotate(-20);
  doc.text(wmText, 0, 0, { lineBreak: false });
  doc.rotate(20);
  doc.translate(-(centerX - 240), -(centerY - 40));
  doc.opacity(1);
  doc.restore();

  // Border
  doc
    .lineWidth(1.6)
    .strokeColor("#c9a34a")
    .rect(margin - 10, margin - 10, W - (margin - 10) * 2, H - (margin - 10) * 2)
    .stroke();

  // Optional logo
  const logoPaths = [
    path.join(process.cwd(), "server", "src", "templates", "yeneta2.png"),
    path.join(process.cwd(), "assets", "certificate_logo.png"),
    path.join(process.cwd(), "assets", "logo.png"),
  ];
  let logoUsed = false;
  for (const p of logoPaths) {
    if (fs.existsSync(p)) {
      try {
        const maxLogoWidth = 130;
        const maxLogoHeight = 60;
        doc.image(p, centerX - maxLogoWidth / 2, margin + 6, {
          width: maxLogoWidth,
          height: maxLogoHeight,
          align: "center",
        });
        logoUsed = true;
        break;
      } catch {
        // try next
      }
    }
  }
  if (!logoUsed) {
    doc.save();
    doc.circle(margin + 24, margin + 28, 28).fill("#0b1220");
    doc.fillColor("#fff").fontSize(18).text("Y", margin + 18, margin + 16);
    doc.restore();
    doc
      .fillColor("#0b1220")
      .fontSize(12)
      .font("Times-Roman")
      .text("Yeneta Learning", W - margin - 120, margin + 22, {
        width: 120,
        align: "right",
      });
  } else {
    doc
      .fillColor("#0b1220")
      .fontSize(12)
      .font("Times-Roman")
      .text("Yeneta Learning", W - margin - 120, margin + 12, {
        width: 120,
        align: "right",
      });
  }

  // Title
  const titleY = margin + 50;
  const titleX = centerX - 260;
  doc
    .fillColor("#0f172a")
    .fontSize(30)
    .font("Times-Bold")
    .text("Certificate of Completion", titleX, titleY, { width: 520, align: "center" });

  const subY = titleY + 42;
  doc
    .fontSize(14)
    .font("Times-Roman")
    .fillColor("#6b7280")
    .text("This certifies that", titleX, subY, { width: 520, align: "center" });

  // Recipient
  const recipient = `${enrollment.user.name}`;
  const recipientMaxWidth = 640;
  let nameFontSize = 44;
  doc.font("Times-BoldItalic");
  while (doc.widthOfString(recipient, { size: nameFontSize }) > recipientMaxWidth && nameFontSize > 18) {
    nameFontSize -= 2;
  }
  const nameY = subY + 30;
  doc
    .fontSize(nameFontSize)
    .fillColor("#0b1220")
    .text(recipient, centerX - recipientMaxWidth / 2, nameY, {
      width: recipientMaxWidth,
      align: "center",
      lineBreak: false,
    });

  const line1Y = nameY + nameFontSize + 8;
  doc
    .font("Times-Roman")
    .fontSize(14)
    .fillColor("#374151")
    .text("has successfully completed the program", titleX, line1Y, {
      width: 520,
      align: "center",
    });

  // Course title
  const courseTitle = `${enrollment.course.title}`;
  const courseMaxWidth = 640;
  let courseFontSize = 22;
  doc.font("Times-Bold");
  while (doc.widthOfString(courseTitle, { size: courseFontSize }) > courseMaxWidth && courseFontSize > 12) {
    courseFontSize -= 1;
  }
  const courseY = line1Y + 28;
  doc
    .fontSize(courseFontSize)
    .fillColor("#0f172a")
    .text(courseTitle, centerX - courseMaxWidth / 2, courseY, {
      width: courseMaxWidth,
      align: "center",
      lineBreak: false,
    });

  const descY = courseY + courseFontSize + 12;
  const desc = `Awarded for successful completion and demonstration of skills in ${enrollment.course.title}.`;
  doc
    .font("Times-Roman")
    .fontSize(10)
    .fillColor("#6b7280")
    .text(desc, centerX - 300, descY, { width: 600, align: "center", lineBreak: true, ellipsis: true });

  // Metadata
  const bottomY = H - margin - 80;
  const certId = String(enrollment._id);
  doc.fontSize(10).fillColor("#6b7280").text(`Certificate ID: ${certId}`, margin + 8, bottomY);

  const issuedAt = enrollment.completedAt ? new Date(enrollment.completedAt) : new Date();
  doc
    .fontSize(10)
    .fillColor("#6b7280")
    .text(`Issued: ${issuedAt.toLocaleDateString()}`, W - margin - 160, bottomY, {
      width: 150,
      align: "right",
    });

  // Signature area
  const sigX = doc.page.width - 320;
  const sigY = doc.page.height - 160;

  doc
    .moveTo(margin + 30, sigY - 46)
    .lineTo(W - margin - 30, sigY - 46)
    .lineWidth(1)
    .strokeOpacity(0.12)
    .stroke("#374151");

  function drawRandomSignature(x, y) {
    const amplitude = 6 + Math.random() * 6;
    const segments = 7 + Math.floor(Math.random() * 6);
    let cx = x;
    let cy = y;
    doc.save();
    doc.strokeColor("#0f172a").lineWidth(1.8).moveTo(cx, cy);
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

  drawRandomSignature(sigX + 24, sigY - 8);
  doc.fontSize(13).fillColor("#0f172a").font("Times-Bold").text("Habetamu bae", sigX + 8, sigY + 6);
  doc
    .fontSize(10)
    .fillColor("#6B7280")
    .font("Times-Roman")
    .text("Chief Executive Officer", sigX + 8, sigY + 22);

  const verifyLine = verifyUrl || process.env.CERT_VERIFY_URL || "https://yeneta.local/verify";
  doc.fontSize(9).fillColor("#9aa0a6").text(`Verify this certificate at ${verifyLine}`, sigX - 220, sigY + 88);

  doc.fontSize(12).fillColor("#9CA3AF").text("🎓 Yeneta Learning Platform", 0, H - 26, { align: "center" });
}

export async function generateCertificatePdfBuffer({ enrollment, verifyUrl }) {
  const doc = new PDFDocument({
    size: "A4",
    layout: "landscape",
    margins: { top: 80, bottom: 50, left: 50, right: 50 },
  });

  const stream = new PassThrough();
  const chunks = [];

  stream.on("data", (chunk) => chunks.push(chunk));

  const done = new Promise((resolve, reject) => {
    stream.on("end", resolve);
    stream.on("error", reject);
    doc.on("error", reject);
  });

  doc.pipe(stream);
  renderCertificatePdf({ doc, enrollment, verifyUrl });
  doc.end();

  await done;
  return Buffer.concat(chunks);
}
