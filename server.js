import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🧾 Paymob credentials
const PAYMOB_API_KEY =
  "ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2TVRBME9UQTFNQ3dpYm1GdFpTSTZJakUzTmpFMk16UXpOREF1TXpreE5qZ3lJbjAuWUFucjFzN2Zha043ZUE5bDc4YTVHTmZfWnVBc25SS3ZWdUhyaWstMUhwdnc1Vm9NX2d0ck4tVUt3dFhUZ3JQMWFETjYyajdlS2NSd2pVOUItNVdoR1E=";
const INTEGRATION_ID = "5110357";
const IFRAME_ID = "927005";

app.post("/pay", async (req, res) => {
  try {
    const { amount, orderId, serviceTitle, technicianName } = req.body;

    // 1️⃣ Auth
    const auth = await axios.post("https://accept.paymob.com/api/auth/tokens", {
      api_key: PAYMOB_API_KEY,
    });
    const token = auth.data.token;

    // 2️⃣ Register order
    const order = await axios.post(
      "https://accept.paymob.com/api/ecommerce/orders",
      {
        auth_token: token,
        delivery_needed: false,
        amount_cents: amount * 100,
        currency: "EGP",
        merchant_order_id: `${orderId}_${Date.now()}`, // avoid duplicate error
        items: [],
      }
    );

    // 3️⃣ Generate payment key
    const paymentKey = await axios.post(
      "https://accept.paymob.com/api/acceptance/payment_keys",
      {
        auth_token: token,
        amount_cents: amount * 100,
        expiration: 3600,
        order_id: order.data.id,
        billing_data: {
          apartment: "NA",
          email: "client@tashtebaty.com",
          floor: "NA",
          first_name: "Client",
          street: "Cairo",
          building: "NA",
          phone_number: "+201000000000",
          shipping_method: "NA",
          city: "Cairo",
          country: "EG",
          last_name: "User",
          state: "NA",
        },
        currency: "EGP",
        integration_id: INTEGRATION_ID,
      }
    );

    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${IFRAME_ID}?payment_token=${paymentKey.data.token}`;

    // Return both link and order details
    res.json({
      url: iframeUrl,
      orderSummary: {
        serviceTitle,
        technicianName,
        amount,
      },
    });
  } catch (error) {
    console.error("❌ Paymob error:", error.response?.data || error.message);
    res.status(500).json({ error: "Payment failed" });
  }
});

app.listen(5000, () =>
  console.log("✅ Server running on http://localhost:5000")
);
