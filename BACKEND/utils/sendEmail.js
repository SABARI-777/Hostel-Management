import postmark from "postmark";
import dotenv from "dotenv";

dotenv.config();

// We expect POSTMARK_API_TOKEN and FROM_EMAIL in your .env file
// If they are missing, it defaults to the placeholder text
const POSTMARK_API_TOKEN = "0fc622b5-eb77-4c4a-870c-b1b52f8ee719" || "YOUR_NEW_API_TOKEN";
const FROM_EMAIL = process.env.FROM_EMAIL || "your_verified_email@domain.com";

const client = new postmark.ServerClient(POSTMARK_API_TOKEN);

export const sendOTP = async (email, otp) => {
  try {
    const htmlTemplate = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #2563eb; margin: 0;">Hostel Management</h1>
          <p style="color: #6b7280; font-size: 0.9rem;">Security Verification</p>
        </div>
        <div style="padding: 20px; background-color: #f3f4f6; border-radius: 8px; text-align: center;">
          <p style="font-size: 1.1rem; color: #374151; margin-bottom: 10px;">Your One-Time Password (OTP)</p>
          <div style="font-size: 2.5rem; font-weight: bold; color: #1e40af; letter-spacing: 5px; margin: 20px 0;">${otp}</div>
          <p style="font-size: 0.85rem; color: #6b7280;">This code will expire in 5 minutes for your security.</p>
        </div>
        <div style="margin-top: 20px; font-size: 0.8rem; color: #9ca3af; text-align: center;">
          <p>If you did not request this code, please ignore this email.</p>
          <p>&copy; 2026 Hostel Management System. All rights reserved.</p>
        </div>
      </div>
    `;

    await client.sendEmail({
      From: FROM_EMAIL,
      To: email,
      Subject: "Security Verification: Your OTP Code",
      TextBody: `Your hostel management verification code is: ${otp}`,
      HtmlBody: htmlTemplate
    });

    console.log("✅ OTP Email sent successfully via Postmark to " + email);
  } catch (err) {
    console.error("❌ Postmark error:", err.message);
  }
};

export const sendLateEntryEmail = async (parentEmail, studentName, expectedDate, actualDate, passDetails = {}) => {
  try {
    const formattedExp = new Date(expectedDate).toLocaleString();
    const formattedAct = new Date(actualDate).toLocaleString();
    const { Place = "N/A", Purpose = "N/A" } = passDetails;

    const htmlTemplate = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #fee2e2; border-radius: 10px; background-color: #ffffff;">
        <div style="background-color: #ef4444; padding: 15px; border-radius: 8px 8px 0 0; text-align: center;">
          <h2 style="color: #ffffff; margin: 0;">Late Entry Alert</h2>
        </div>
        <div style="padding: 20px; border: 1px solid #fee2e2; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="color: #374151; font-size: 1.1rem;">Dear Parent,</p>
          <p style="color: #4b5563; line-height: 1.6;">This is an automated notification regarding the return of <strong>${studentName}</strong> to the hostel.</p>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 4px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 5px 0; color: #6b7280; font-size: 0.9rem; width: 40%;">Actual Return:</td>
                <td style="padding: 5px 0; color: #b91c1c; font-weight: bold;">${formattedAct}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #6b7280; font-size: 0.9rem;">Expected Return:</td>
                <td style="padding: 5px 0; color: #374151;">${formattedExp}</td>
              </tr>
            </table>
          </div>

          <div style="margin-top: 20px;">
            <p style="color: #374151; font-weight: bold; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 10px;">Pass Details:</p>
            <table style="width: 100%; font-size: 0.95rem; color: #4b5563;">
              <tr>
                <td style="width: 30%; color: #6b7280;">Destination:</td>
                <td>${Place}</td>
              </tr>
              <tr>
                <td style="color: #6b7280;">Purpose:</td>
                <td>${Purpose}</td>
              </tr>
            </table>
          </div>

          <p style="margin-top: 30px; color: #6b7280; font-size: 0.85rem; text-align: center; font-style: italic;">
            Please contact the hostel office if you have any questions regarding this alert.
          </p>
        </div>
      </div>
    `;

    await client.sendEmail({
      From: FROM_EMAIL,
      To: parentEmail,
      Subject: `IMPORTANT: Late Entry Alert for ${studentName}`,
      TextBody: `Alert: ${studentName} returned late at ${formattedAct}. Destination: ${Place}, Purpose: ${Purpose}.`,
      HtmlBody: htmlTemplate
    });

    console.log(`✅ Late Entry Email sent successfully for ${studentName} to ${parentEmail}`);
  } catch (err) {
    console.error("❌ Postmark Late Entry error:", err.message);
  }
};
