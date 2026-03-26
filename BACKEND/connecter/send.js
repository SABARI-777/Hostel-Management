// send.js
import sendMail from "./MailConnect.js";
import dotenv from "dotenv";

dotenv.config();

async function sendTestEmail() {
  try {
    const response = await sendMail({
      to: "sabari7091095@gmail.com",
      subject: "Test Email from Hostel Management",
      text: "This is a test email.",
      html: "<h2>Hello from Hostel Management System</h2><p>This is a test email.</p>",
    });

    console.log("Email Sent Successfully!");
    console.log("Message ID:", response.messageId);
  } catch (error) {
    console.error("Email Send Failed:", error.message);
  }
}

sendTestEmail();

export default sendTestEmail;
