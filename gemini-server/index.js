import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ✅ Gemini Vision proxy endpoint
app.post("/gemini/analyze", async (req, res) => {
  try {
    const { base64, mimeType, prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("❌ Missing GEMINI_API_KEY in .env file");
      return res.status(400).json({ error: "Missing API key" });
    }

    const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
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

    if (!response.ok) {
      console.error("❌ Gemini API error:", data);
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (err) {
    console.error("💥 Gemini proxy error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Gemini server running at http://localhost:${PORT}`));
