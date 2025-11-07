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
      await sgMail.send(msg);
      console.log("✅ Email sent successfully to:", emailToSend);
    } catch (error) {
      console.error("❌ Error sending email:", error);
    }
  }
);
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Gemini Vision proxy endpoint
app.post("/gemini/analyze", async (req, res) => {
  try {
    const { base64, mimeType, prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY; // ضيفه في .env

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta1/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt || "صف الصورة بجملة قصيرة وواضحة بالعربية." },
                { inlineData: { mimeType, data: base64 } },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Gemini proxy error:", err);
    res.status(500).json({ error: err.message });
  }
});

exports.api = app;
