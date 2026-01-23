import { sendTemplateEmail } from "./mailer.js";
import { generateCertificatePdfBuffer, makeCertificateFilename } from "./certificatePdf.js";

export async function sendEnrollmentConfirmedEmail({ to, name, courseTitle, dashboardUrl }) {
  const subject = `${process.env.APP_NAME || "Yeneta"} — Enrollment confirmed`;
  const text = `Hi ${name || "there"},\n\nYou are enrolled in "${courseTitle}".\n\nOpen your dashboard: ${dashboardUrl || ""}`;

  return sendTemplateEmail({
    to,
    subject,
    templateFile: "enrollmentConfirmed.ejs",
    templateData: { name, courseTitle, dashboardUrl },
    text,
  });
}

export async function sendCourseCompletedCertificateEmail({
  to,
  name,
  courseTitle,
  certificateUrl,
  enrollment,
}) {
  const subject = `${process.env.APP_NAME || "Yeneta"} — Your certificate for ${courseTitle}`;

  const filename = makeCertificateFilename(enrollment);
  const pdfBuffer = await generateCertificatePdfBuffer({ enrollment });

  const text =
    `Congratulations ${name || ""}!\n\n` +
    `You completed "${courseTitle}". Your certificate is attached as a PDF.\n\n` +
    (certificateUrl ? `You can also download it here: ${certificateUrl}\n` : "");

  return sendTemplateEmail({
    to,
    subject,
    templateFile: "courseCompletedCertificate.ejs",
    templateData: { name, courseTitle, certificateUrl },
    text,
    attachments: [
      {
        filename,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
}
