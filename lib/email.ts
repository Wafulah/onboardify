import nodemailer from "nodemailer";

// Configure your NodeMailer transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT || 587) === 465, // Use 465 for secure=true
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * Sends a 6-digit OTP to the specified email address.
 * @param to The recipient's email address.
 * @param otp The 6-digit code.
 * @param name The recipient's name (optional).
 */
export async function sendEmailOtp(to: string, otp: string, name?: string) {
  const text = `Hello${name ? " " + name : ""},\n\nYour verification code is: ${otp}\nIt expires in 10 minutes.\n\nIf you did not request this, contact support.`;
  await transporter.sendMail({
    from: `"No-Reply" <no-reply@yourdomain.com>`, 
    to,
    subject: "Your Customer Verification Code",
    text,
    html: `<p>Hello${name ? " " + name : ""},</p><p>Your verification code is: <strong>${otp}</strong></p><p>It expires in 10 minutes.</p>`
  });
}