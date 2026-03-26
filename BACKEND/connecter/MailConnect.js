// connect.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const {
  SMTP_PASS,
  FROM_EMAIL,
  FROM_NAME,
  SMTP_PORT = 587
} = process.env;

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: Number(SMTP_PORT),
  secure: false, // STARTTLS
  requireTLS: true,
  auth: {
    user: FROM_EMAIL,
    pass: SMTP_PASS
  }
});

// Verify transporter
transporter.verify((err, success) => {
  if (err) {
    console.log("SMTP Error:", err.message);
  } else {
    console.log("SMTP Connected Successfully");
  }
});

export async function sendMail({ to, subject, text, html }) {
  const mailOptions = {
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to,
    subject,
    text,
    html,
  };

  return await transporter.sendMail(mailOptions);
}

export default sendMail;
