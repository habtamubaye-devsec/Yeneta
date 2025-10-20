import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

// Check that env variables are loaded
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD);

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // Gmail App Password
  },
});

/**
 * Send a verification email
 * @param {string} to - recipient email
 * @param {string} otp - verification code
 */
export const sendVerificationEmail = async ({ to, otp }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Email Verification Code',
      html: `<p>Your verification code is: <strong>${otp}</strong></p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Test sending email (optional)
if (process.argv[2] === 'test') {
  sendVerificationEmail({ to: 'recipient@example.com', otp: '123456' })
    .then(() => console.log('Test email sent successfully'))
    .catch(console.error);
}
