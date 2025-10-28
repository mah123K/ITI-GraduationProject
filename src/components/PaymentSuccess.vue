<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-[#f5f8fc] text-center px-6">
    <div class="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full">
      <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <i class="fa-solid fa-check text-green-600 text-5xl"></i>
      </div>

      <h1 class="text-3xl font-bold text-[#133B5D] mb-3">Payment Successful 🎉</h1>
      <p class="text-gray-600 mb-6">
        Your payment has been received successfully!  
        Your order is now confirmed and will be processed by our technician.
      </p>

      <button
        @click="goToOrders"
        class="bg-[#133B5D] hover:bg-[#1b5383] text-white px-6 py-3 rounded-lg font-semibold transition"
      >
        View My Orders
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

const router = useRouter();

// ✅ Get order_id from Paymob redirect link
const params = new URLSearchParams(window.location.search);
const orderId = params.get("order_id");

// ✅ Update order status in Firebase + call backend to confirm payment
if (orderId) {
  const updateOrderStatus = async () => {
    try {
      // 1️⃣ Update Firestore directly
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: "upcoming" });

      // 2️⃣ Notify backend (optional but recommended for Paymob confirmation)
      await fetch("http://localhost:5000/payment-callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, success: true }),
      });

      console.log("✅ Order marked as upcoming successfully.");
    } catch (error) {
      console.error("❌ Failed to update order status:", error);
    }
  };

  updateOrderStatus();
}

// 🔁 Redirect to My Orders
const goToOrders = () => {
  router.push("/userorders");
};
</script>
