// ===============================
// ✅ Imports
// ===============================
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { setGlobalOptions } = require("firebase-functions/v2/options");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

// ===============================
// ✅ Firebase & SendGrid Init
// ===============================
admin.initializeApp();
setGlobalOptions({ region: "us-central1" });

const SENDGRID_API_KEY =
  process.env.SENDGRID_API_KEY || process.env.sendgrid_key;

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
  console.log("✅ SendGrid Key Loaded Successfully");
} else {
  console.error("❌ Missing SendGrid API key");
}

// ===============================
// ✅ Function: Send Email on Notification Create
// ===============================
exports.sendEmailNotification = onDocumentCreated(
  "users/{userId}/notifications/{notificationId}",
  async (event) => {
    const data = event.data.data();
    const userId = event.params.userId;

    console.log("📩 New Notification Created For:", userId);

    // ✅ جبنا بيانات العميل من مجموعة clients مش users
    const clientRef = admin.firestore().doc(`clients/${userId}`);
    const clientSnap = await clientRef.get();
    const clientEmail = clientSnap.exists ? clientSnap.data().email : null;

    const emailToSend = data.email || clientEmail || "noemail@tashtebaty.com";

    if (!emailToSend) {
      console.warn("⚠️ Missing email field in notification document");
      return;
    }

    const msg = {
      to: emailToSend,
      from: {
        email: "mahmoudsolimanofficial1@gmail.com",
        name: "Tashtebaty Support",
      },
      subject: "New Notification from Tashtebaty",
      text: data.message || "You have a new update!",
      html: `<strong>${data.message || "You have a new update!"}</strong>`,
    };

    try {
      await sgMail.send(msg);
      console.log("✅ Email sent successfully to:", emailToSend);
    } catch (error) {
      console.error("❌ Error sending email:", error);
    }
  }
);
