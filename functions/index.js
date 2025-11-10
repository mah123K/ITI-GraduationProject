// ===============================
// ✅ Imports
// ===============================
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { setGlobalOptions } = require("firebase-functions/v2/options");
const { defineSecret, defineString } = require("firebase-functions/params");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

// ===============================
// ✅ Secrets & Firebase Init
// ===============================
const SENDGRID_API_KEY = defineSecret("SENDGRID_API_KEY");
const SENDGRID_FROM = "mahmoudsolimanofficial1@gmail.com";

admin.initializeApp();
setGlobalOptions({
  region: "us-central1",
  secrets: [SENDGRID_API_KEY],
});

// ===============================
// ✅ Function: Send Email on Notification Create
// ===============================
exports.sendEmailNotification = onDocumentCreated(
  "users/{userId}/notifications/{notificationId}",
  async (event) => {
    sgMail.setApiKey(SENDGRID_API_KEY.value());
    const data = event.data.data();
    const userId = event.params.userId;

    console.log("📩 New Notification Created For:", userId);

    // ✅ جبنا بيانات العميل من مجموعة clients مش users
    const clientRef = admin.firestore().doc(`clients/${userId}`);
    const clientSnap = await clientRef.get();
    const clientEmail = clientSnap.exists ? clientSnap.data().email : null;

    const emailToSend = data.email || clientEmail;

    if (!emailToSend) {
      console.warn("⚠️ Missing email field in notification document");
      return;
    }

    const msg = {
      to: emailToSend,
      from: {
        email: SENDGRID_FROM,
        name: "Tashtebaty Support",
      },
      subject: "Tashtebaty | New Notification",
      text: data.message || "You have a new update!",
      html: `
      <div style="
        font-family: 'Segoe UI', Arial, sans-serif;
        background-color: #f5f7fa;
        padding: 40px 20px;
      ">
        <div style="
          max-width: 600px;
          margin: auto;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          overflow: hidden;
        ">

          <!-- Header -->
          <div style="background-color: #133B5D; color: #ffffff; padding: 20px 30px;">
            <h2 style="margin: 0; font-weight: 600;">Tashtebaty Notification</h2>
          </div>

          <!-- Body -->
          <div style="padding: 30px; color: #333;">
            <p style="font-size: 16px;">Hello,</p>
            <p style="font-size: 16px; line-height: 1.6;">
              ${
                data.message ||
                "You have a new update from Tashtebaty regarding your order."
              }
            </p>
            <div style="margin: 30px 0; text-align: center;">
              <a href="https://tashtebaty.netlify.app/"
                style="
                  background-color: #5984C6;
                  color: white;
                  text-decoration: none;
                  padding: 12px 24px;
                  border-radius: 8px;
                  font-weight: 600;
                  display: inline-block;
                ">
                Visit Your Dashboard
              </a>
            </div>
            <p style="font-size: 14px; color: #666;">
              If you didn’t request this update, you can safely ignore this email.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f0f4f9; padding: 15px 30px; text-align: center; font-size: 13px; color: #777;">
            <p style="margin: 0;">© 2025 Tashtebaty. All Rights Reserved.</p>
            <p style="margin: 5px 0 0;">Made with 💙 in Egypt</p>
          </div>
        </div>
      </div>
      `,
    };

    try {
      console.log("FROM EMAIL VALUE:", SENDGRID_FROM);
      await sgMail.send(msg);
      console.log("✅ Email sent successfully to:", emailToSend);
    } catch (error) {
      console.error("❌ Error sending email:", error?.response?.body || error);
    }
  }
);
