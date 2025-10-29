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

          <!-- 🧾 Payment Button -->
          <div v-if="order.status === 'unconfirmed'" class="mt-5 text-center">
            <button
              @click="openPaymentPopup(order)"
              class="bg-accent-color hover:bg-[#1b5383] text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Pay Now
            </button>
          </div>

          <!-- ✅ Paid -->
          <div v-else-if="order.status === 'upcoming'" class="mt-5 text-center text-green-600 font-semibold">
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
          <div
            v-else-if="order.status === 'completed'"
            class="mt-5 text-center text-accent-color font-semibold"
          >
            Service Completed
          </div>
        </div>
      </div>

      <!-- ❌ No orders -->
      <div v-else class="text-center text-gray-500 mt-10">
        No orders found.
      </div>
    </div>

    <!-- 💳 Payment Confirmation Popup -->
    <transition name="fade">
      <div
        v-if="showPopup"
        class="fixed inset-0 bg-[#000000d0] flex items-center justify-center z-50"
      >
        <div
          class="bg-white rounded-2xl p-8 w-[90%] max-w-md shadow-lg text-center"
        >
          <h2 class="text-2xl font-semibold text-[#133B5D] mb-4">
            Confirm Your Payment
          </h2>

          <p class="text-gray-700 mb-4">
            <span class="font-semibold">Service:</span>
            {{ selectedOrder?.serviceTitle }}
          </p>
          <p class="text-gray-700 mb-4">
            <span class="font-semibold">Technician:</span>
            {{ selectedOrder?.technicianName }}
          </p>
          <p class="text-gray-900 text-xl font-bold mb-6">
            Total: {{ selectedOrder?.price }} EGP
          </p>

          <div class="flex justify-center gap-4">
            <button
              @click="confirmPayment"
              class="bg-[#133B5D] hover:bg-[#1b5383] text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Confirm & Pay
            </button>
            <button
              @click="cancelPayment"
              class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@/firebase/firebase";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";

const orders = ref([]);
const loading = ref(true);

const showPopup = ref(false);
const selectedOrder = ref(null);

// 🟩 Open confirmation popup before redirecting
const openPaymentPopup = (order) => {
  selectedOrder.value = order;
  showPopup.value = true;
};

// 🟥 Cancel popup
const cancelPayment = () => {
  selectedOrder.value = null;
  showPopup.value = false;
};

// 🟦 Confirm & redirect to Paymob
const confirmPayment = async () => {
  if (!selectedOrder.value) return;

  try {
    // 🟩 أولًا: حدث الحالة في Firestore إلى "upcoming"
    const orderRef = doc(db, "orders", selectedOrder.value.id);
    await updateDoc(orderRef, { status: "upcoming" });

    // 🟦 ثانيًا: كمل العملية عادي بالربط مع السيرفر / باي موب
    const response = await fetch("http://localhost:5000/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(selectedOrder.value.price) || 0,
        orderId: selectedOrder.value.id,
        serviceTitle: selectedOrder.value.serviceTitle,
        technicianName: selectedOrder.value.technicianName,
      }),
    });

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url; // 🚀 يروح على صفحة الدفع
    } else {
      alert("Payment request failed.");
      console.error("❌ Payment response:", data);
    }
  } catch (err) {
    console.error("❌ Error updating order or connecting to payment:", err);
    alert("Error while preparing payment.");
  }
};


// 🟨 Status badge colors
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

// ⚡ Load user's orders from Firestore
onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
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
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
