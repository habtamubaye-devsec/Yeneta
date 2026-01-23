import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let cachedTransporter;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  cachedTransporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  return cachedTransporter;
}

export async function sendTemplateEmail({
  to,
  subject,
  templateFile,
  templateData = {},
  attachments = [],
  text,
}) {
  if (!to) throw new Error("sendTemplateEmail: 'to' is required");
  if (!subject) throw new Error("sendTemplateEmail: 'subject' is required");
  if (!templateFile) throw new Error("sendTemplateEmail: 'templateFile' is required");

  const transporter = getTransporter();

  const appName = process.env.APP_NAME || "Yeneta";
  const templatePath = path.join(__dirname, "..", "templates", templateFile);

  const logoPath = path.join(__dirname, "..", "templates", "yeneta2.png");
  const logoCid = fs.existsSync(logoPath) ? "yeneta-logo" : null;

  const html = await ejs.renderFile(templatePath, {
    appName,
    logoCid,
    ...templateData,
  });

  const finalAttachments = [...attachments];
  if (logoCid) {
    finalAttachments.push({
      filename: "logo.png",
      path: logoPath,
      cid: logoCid,
    });
  }

  return transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
    attachments: finalAttachments,
  });
}
