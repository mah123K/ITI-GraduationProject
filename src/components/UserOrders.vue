<template>
  <div class="min-h-screen bg-[#f5f8fc] py-16 px-6">
    <div class="max-w-6xl mx-auto mt-10">
      <h1 class="text-3xl font-bold text-accent-color mb-8 text-center">My Orders</h1>

      <!-- 🔄 Loading -->
      <div v-if="loading" class="text-center text-gray-500 mt-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-color mx-auto mb-3"></div>
        Loading your orders...
      </div>

      <!-- 📦 Orders Grid -->
      <div v-else-if="orders.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="order in orders"
          :key="order.id"
          class="bg-white rounded-2xl shadow-md p-6 relative transition hover:shadow-lg"
        >
          <!-- Header -->
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-accent-color">Service:</h2>
            <span
              class="px-3 py-1 text-sm rounded-full font-medium"
              :class="statusColor(order.status)"
            >
              {{ order.status }}
            </span>
          </div>

          <!-- Content -->
          <div class="space-y-2 text-gray-700">
            <p><span class="font-semibold text-accent-color">Technician:</span> {{ order.technicianName || "—" }}</p>
            <p><span class="font-semibold text-accent-color">Price:</span> {{ order.price }} EGP</p>
            <p><span class="font-semibold text-accent-color">Date:</span> {{ order.date }}</p>
            <p><span class="font-semibold text-accent-color">Time:</span> {{ order.time }}</p>
            <p><span class="font-semibold text-accent-color">Location:</span> {{ order.location }}</p>
          </div>

          <!-- 🧾 Payment Button (only for Unconfirmed) -->
          <div v-if="order.status === 'unconfirmed'" class="mt-5 text-center">
            <button
              @click="goToPayment(order)"
              class="bg-accent-color hover:bg-[#1b5383] text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Pay Now
            </button>
          </div>

          <!-- ✅ Paid -->
          <div
            v-else-if="order.status === 'upcoming'"
            class="mt-5 text-center text-green-600 font-semibold"
          >
            Payment Completed
          </div>

          <!-- 🔴 Declined / Cancelled -->
          <div
            v-else-if="order.status === 'declined' || order.status === 'cancelled'"
            class="mt-5 text-center text-red-500 font-semibold"
          >
            This order was {{ order.status }}.
          </div>

          <!-- 🟢 Completed -->
          <div v-else-if="order.status === 'completed'" class="mt-5 text-center text-accent-color font-semibold">
            Service Completed
          </div>
        </div>
      </div>

      <!-- ❌ No orders -->
      <div v-else class="text-center text-gray-500 mt-10">
        No orders found.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@/firebase/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const orders = ref([]);
const loading = ref(true);

const statusColor = (status) => {
  switch (status) {
    case "unconfirmed":
      return "bg-yellow-100 text-yellow-700";
    case "upcoming":
      return "bg-green-100 text-green-700";
    case "completed":
      return "bg-blue-100 text-blue-700";
    case "declined":
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

// ⚡ تحميل الطلبات من Firestore
onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // ✅ تعديل الشرط ليستخدم clientId بدل userId
      const q = query(collection(db, "orders"), where("clientId", "==", user.uid));
      onSnapshot(q, (snap) => {
        orders.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        loading.value = false;
      });
    } else {
      loading.value = false;
    }
  });
});

// 💳 الانتقال للدفع
const goToPayment = async (order) => {
  try {
    const response = await fetch("http://localhost:5000/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: order.price,
        orderId: order.id,
      }),
    });

    const data = await response.json();
    if (data.url) {
      // ✅ Store this order ID temporarily
      localStorage.setItem("lastPaidOrder", order.id);
      window.location.href = data.url;
    } else {
      alert("Payment failed. Please try again.");
    }
  } catch (err) {
    console.error("Payment error:", err);
    alert("Payment request failed.");
  }
};


</script>
