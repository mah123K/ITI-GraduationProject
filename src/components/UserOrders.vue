<template>
  <div class="min-h-screen py-16 px-6">
    <div class="max-w-6xl mx-auto mt-10">
      <h1 class="text-3xl font-bold text-accent-color mb-8 text-center">My Orders</h1>

      <div v-if="loading" class="text-center text-gray-500 mt-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-color mx-auto mb-3"></div>
        Loading your orders...
      </div>

      <!-- TABS + CONTENT -->
      <div v-else-if="orders.length">
        <!-- Tabs header -->
        <div class="flex flex-wrap justify-center gap-3 mb-8">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            class="px-5 py-2 rounded-lg font-medium transition-all"
            :class="activeTab === tab.key ? 'bg-accent-color text-white' : 'bg-(--surface)/50 dark:bg-(--surface) text-(--text-primary) '"
          >
            {{ tab.label }}
            <span v-if="tab.count > 0" class="ml-2 text-sm text-(--text-muted)">({{ tab.count }})</span>
          </button>
        </div>

        <!-- Tab contents -->
        <div>
          <!-- All -->
          <div v-show="activeTab === 'all'">
            <h2 class="text-2xl font-semibold mb-4 text-center text-(--text-primary)">All Orders</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="order in orders"
                :key="order.id"
                class="rounded-2xl p-6 relative transition hover:shadow-lg dark:bg-(--surface) border border-(--border)"
              >
                <!-- card content (same as original) -->
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-semibold text-accent-color">
                    {{ getTranslatedName(order.serviceTitle) || 'Service' }}:
                  </h3>
                  <span class="px-3 py-1 text-sm rounded-full font-medium" :class="statusColor(order.status)">
                    {{ order.status }}
                  </span>
                </div>

                <ul class="space-y-2 text-(--text-muted)">
                  <li><span class="font-semibold text-(--text-primary)">Technician:</span> {{ getTranslatedName(order.technicianName) || '—' }}</li>
                  <li><span class="font-semibold text-(--text-primary)">Price:</span> {{ order.price }} EGP</li>
                  <li><span class="font-semibold text-(--text-primary)">Date:</span> {{ order.date }}</li>
                  <li><span class="font-semibold text-(--text-primary)">Time:</span> {{ order.time }}</li>
                  <li><span class="font-semibold text-(--text-primary)">Location:</span> {{ formatLocation(order.location) }}</li>
                  <li v-if="order.orderCode" class="font-semibold text-green-700 mt-2">🔐 Order Code: <span class="text-accent-color">{{ order.orderCode }}</span></li>
                </ul>

                <div class="mt-5 text-center">
                  <button
                    v-if="order.status === 'unconfirmed'"
                    @click="openPaymentPopup(order)"
                    class="bg-accent-color hover:bg-(--accent) text-white px-6 py-2 rounded-lg font-semibold transition"
                  >
                    Pay Now
                  </button>
                  <button
                    v-if="order.status === 'new' || order.status === 'unconfirmed'"
                    @click="openCancelPopup(order)"
                    class="bg-red-600 ml-2 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                  >
                    Cancel Order
                  </button>
                  <div v-else-if="order.status === 'upcoming'" class="text-green-600 font-semibold">Payment Completed</div>
                  <div v-else-if="order.status === 'completed'" class="text-accent-color font-semibold">Service Completed</div>
                  <div v-else-if="order.status === 'declined' || order.status === 'cancelled'" class="text-red-500 font-semibold">This order was {{ order.status }}.</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Unconfirmed -->
          <div v-show="activeTab === 'unconfirmed'">
            <h2 class="text-2xl font-semibold mb-4 text-center text-(--text-primary)">Unconfirmed</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="order in grouped.unconfirmed"
                :key="order.id"
                class="rounded-2xl p-6 relative transition hover:shadow-lg dark:bg-(--surface) border border-(--border)"
              >
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-semibold text-accent-color">
                    {{ getTranslatedName(order.serviceTitle) || 'Service' }}:
                  </h3>
                  <span class="px-3 py-1 text-sm rounded-full font-medium" :class="statusColor(order.status)">
                    {{ order.status }}
                  </span>
                </div>

                <ul class="space-y-2 text-(--text-muted)">
                  <li><span class="font-semibold text-(--text-primary)">Technician:</span> {{ getTranslatedName(order.technicianName) || '—' }}</li>
                  <li><span class="font-semibold text-(--text-primary)">Price:</span> {{ order.price }} EGP</li>
                  <li><span class="font-semibold text-(--text-primary)">Date:</span> {{ order.date }}</li>
                  <li><span class="font-semibold text-(--text-primary)">Time:</span> {{ order.time }}</li>
                  <li><span class="font-semibold text-(--text-primary)">Location:</span> {{ formatLocation(order.location) }}</li>
                  <li v-if="order.orderCode" class="font-semibold text-green-700 mt-2">🔐 Order Code: <span class="text-accent-color">{{ order.orderCode }}</span></li>
                </ul>

                <div class="mt-5 text-center">
                  <button @click="openPaymentPopup(order)" class="bg-accent-color hover:bg-(--accent) text-white px-6 py-2 rounded-lg font-semibold transition">Pay Now</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Upcoming -->
          <div v-show="activeTab === 'upcoming'">
            <h2 class="text-2xl font-semibold mb-4 text-center text-(--text-primary)">Upcoming</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="order in grouped.upcoming"
                :key="order.id"
                class="rounded-2xl p-6 relative transition hover:shadow-lg dark:bg-(--surface) border border-(--border)"
              >
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-semibold text-accent-color">
                    {{ getTranslatedName(order.serviceTitle) || 'Service' }}:
                  </h3>
                  <span class="px-3 py-1 text-sm rounded-full font-medium" :class="statusColor(order.status)">
                    {{ order.status }}
                  </span>
                </div>

                <ul class="space-y-2 text-(--text-muted)">
                  <li><span class="font-semibold text-(--text-primary)">Technician:</span> {{ getTranslatedName(order.technicianName) || '—' }}</li>
                  <li><span class="font-semibold text-(--text-primary)">Price:</span> {{ order.price }} EGP</li>
                  <li><span class="font-semibold text-(--text-primary)">Date:</span> {{ order.date }}</li>
                  <li><span class="font-semibold text-(--text-primary)">Time:</span> {{ order.time }}</li>
                  <li><span class="font-semibold text-(--text-primary)">Location:</span> {{ formatLocation(order.location) }}</li>
                  <li v-if="order.orderCode" class="font-semibold text-green-700 mt-2">🔐 Order Code: <span class="text-accent-color">{{ order.orderCode }}</span></li>
                </ul>

                <div class="mt-5 text-center text-green-600 font-semibold">Payment Completed</div>
              </div>
            </div>
          </div>

          <!-- Completed -->
          <div v-show="activeTab === 'completed'">
            <h2 class="text-2xl font-semibold mb-4 text-center text-(--text-primary)">Completed</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="order in grouped.completed"
                :key="order.id"
                class="rounded-2xl p-6 relative transition hover:shadow-lg dark:bg-(--surface) border border-(--border)"
              >
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-semibold text-accent-color">
                    {{ getTranslatedName(order.serviceTitle) || 'Service' }}:
                  </h3>
                  <span class="px-3 py-1 text-sm rounded-full font-medium" :class="statusColor(order.status)">
                    {{ order.status }}
                  </span>
                </div>

                <ul class="space-y-2 text-(--text-muted)">
                  <li><span class="font-semibold text-(--text-primary)">Technician:</span> {{ getTranslatedName(order.technicianName) || '—' }}</li>
                  <li><span class="font-semibold text-(--text-primary)">Price:</span> {{ order.price }} EGP</li>
                  <li><span class="font-semibold text-(--text-primary)">Date:</span> {{ order.date }}</li>
                  <li><span class="font-semibold text-(--text-primary)">Time:</span> {{ order.time }}</li>
                  <li><span class="font-semibold text-(--text-primary)">Location:</span> {{ formatLocation(order.location) }}</li>
                  <li v-if="order.orderCode" class="font-semibold text-green-700 mt-2">🔐 Order Code: <span class="text-accent-color">{{ order.orderCode }}</span></li>
                </ul>

                <div class="mt-5 text-center text-accent-color font-semibold">Service Completed</div>
              </div>
            </div>
          </div>

          <!-- Declined / Cancelled -->
          <div v-show="activeTab === 'declined'">
            <h2 class="text-2xl font-semibold mb-4 text-center text-(--text-primary)">Declined / Cancelled</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="order in [...grouped.declined, ...grouped.cancelled]"
                :key="order.id"
                class="rounded-2xl p-6 relative transition hover:shadow-lg dark:bg-(--surface) border border-(--border)"
              >
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-semibold text-accent-color">
                    {{ getTranslatedName(order.serviceTitle) || 'Service' }}:
                  </h3>
                  <span class="px-3 py-1 text-sm rounded-full font-medium" :class="statusColor(order.status)">
                    {{ order.status }}
                  </span>
                </div>

                <ul class="space-y-2 text-(--text-muted)">
                  <li><span class="font-semibold text-(--text-primary)">Technician:</span> {{ getTranslatedName(order.technicianName) || '—' }}</li>
                  <li><span class="font-semibold text-(--text-primary)">Price:</span> {{ order.price }} EGP</li>
                  <li><span class="font-semibold text-(--text-primary)">Date:</span> {{ order.date }}</li>
                  <li><span class="font-semibold text-(--text-primary)">Time:</span> {{ order.time }}</li>
                  <li><span class="font-semibold text-(--text-primary)">Location:</span> {{ formatLocation(order.location) }}</li>
                  <li v-if="order.orderCode" class="font-semibold text-green-700 mt-2">🔐 Order Code: <span class="text-accent-color">{{ order.orderCode }}</span></li>
                </ul>

                <div class="mt-5 text-center text-red-500 font-semibold">This order was {{ order.status }}.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center text-gray-500 mt-10">No orders found.</div>
    </div>

    <transition name="fade">
      <div v-if="showPopup" class="fixed inset-0 bg-[#000000d0] flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl p-8 w-[90%] max-w-md shadow-lg text-center">
          <h2 class="text-2xl font-semibold text-[#133B5D] mb-4">Confirm Your Payment</h2>

          <p class="text-gray-700 mb-4">
            <span class="font-semibold">Service:</span>
            {{ getTranslatedName(selectedOrder?.serviceTitle) }}
          </p>
          <p class="text-gray-700 mb-4">
            <span class="font-semibold">Technician:</span>
            {{ getTranslatedName(selectedOrder?.technicianName) }}
          </p>
          <p class="text-gray-900 text-xl font-bold mb-6">Total: {{ selectedOrder?.price }} EGP</p>

          <div class="flex justify-center gap-4">
            <button @click="confirmPayment" class="bg-[#133B5D] hover:bg-[#1b5383] text-white px-6 py-2 rounded-lg font-semibold transition">Confirm & Pay</button>
            <button @click="cancelPayment" class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-semibold transition">Cancel</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 🟥 Cancel confirmation popup -->
    <transition name="fade">
      <div v-if="showCancelPopup" class="fixed inset-0 bg-[#000000d0] flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl p-8 w-[90%] max-w-md shadow-lg text-center">
          <h2 class="text-2xl font-semibold text-[#133B5D] mb-4">Are you sure?</h2>
          <p class="text-gray-700 mb-6">Do you really want to cancel this order?</p>
          <div class="flex justify-center gap-4">
            <button
              @click="confirmCancelOrder"
              class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Yes, Cancel
            </button>
            <button
              @click="closeCancelPopup"
              class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-semibold transition"
            >
              No, Keep it
            </button>
          </div>
        </div>
      </div>
    </transition>


    <AlertPopup :show="showPopupMessage" :message="popupMessageContent" @close="closeAlert" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@/firebase/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
// NEW: Import the custom alert popup
import AlertPopup from "../components/AlertPopup.vue"; // <-- Adjust path as needed
// NEW: Added missing import for i18n
import { useI18n } from "vue-i18n";

const orders = ref([]);
const loading = ref(true);
const showPopup = ref(false); // This is for the PAYMENT popup
const selectedOrder = ref(null);
const showCancelPopup = ref(false);
const orderToCancel = ref(null);

// NEW: Refs for the custom alert popup
const showPopupMessage = ref(false);
const popupMessageContent = ref("");

// NEW: Helper functions for custom alert popup
const triggerAlert = (message) => {
  popupMessageContent.value = message;
  showPopupMessage.value = true;
};
const closeAlert = () => {
  showPopupMessage.value = false;
  popupMessageContent.value = "";
};

const formatLocation = (loc) => {
  if (!loc) return "—";
  if (typeof loc === "string") return loc; // في حال اتخزنت كنص
  if (typeof loc === "object") {
    const parts = [loc.street, loc.city, loc.country]
      .filter(Boolean)
      .join(", ");
    return parts || "Location not specified";
  }
  return "—";
};


const { locale } = useI18n(); // *** 2. Initialize locale ***

// *** 3. Add the helper function ***
const getTranslatedName = (nameObject) => {
  const currentLocale = locale.value || "en"; // Get current language
  if (typeof nameObject === "object" && nameObject !== null) {
    return nameObject[currentLocale] || nameObject.en || ""; // Get current lang, fallback to 'en'
  }
  return nameObject || ""; // Return as-is if it's just a string
};

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
        serviceTitle: getTranslatedName(selectedOrder.value.serviceTitle), // <-- FIX
        technicianName: getTranslatedName(selectedOrder.value.technicianName), // <-- FIX
      }),
    });

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url; // 🚀 يروح على صفحة الدفع
    } else {
      // UPDATED
      triggerAlert("Payment request failed.");
      console.error("Payment response:", data);
    }
  } catch (err) {
    console.error("Error updating order or connecting to payment:", err);
    triggerAlert("Error while preparing payment.");
  }
};

// 🟦 Open cancel confirmation
const openCancelPopup = (order) => {
  orderToCancel.value = order;
  showCancelPopup.value = true;
};

// 🟥 Confirm cancel
const confirmCancelOrder = async () => {
  if (!orderToCancel.value) return;
  try {
    const orderRef = doc(db, "orders", orderToCancel.value.id);
    const orderSnap = await getDoc(orderRef);
    const orderData = orderSnap.exists() ? orderSnap.data() : null;

    await updateDoc(orderRef, { status: "cancelled" });

    // 🔔 Notify technician
    if (orderData?.technicianId) {
      const notifCol = collection(db, "technicians", orderData.technicianId, "notifications");
      await addDoc(notifCol, {
        orderId: orderToCancel.value.id,
        message: `⚠️ The client has cancelled the order (${orderData.descreption || "No description"}).`,
        status: "cancelled",
        isRead: false,
        timestamp: serverTimestamp(),
      });
    }

    triggerAlert("Order cancelled successfully.");
    showCancelPopup.value = false;
  } catch (error) {
    console.error("Error cancelling order:", error);
    triggerAlert("Failed to cancel order.");
  }
};

const closeCancelPopup = () => {
  showCancelPopup.value = false;
  orderToCancel.value = null;
};


// 🟨 Status badge colors (unchanged)
const statusColor = (status) => {
  switch ((status || "").toLowerCase()) {
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

// Load orders
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

// grouped BEFORE tabs (important)
const grouped = computed(() => {
  const buckets = {
    unconfirmed: [],
    upcoming: [],
    completed: [],
    declined: [],
    cancelled: [],
    other: [],
  };
  for (const o of orders.value) {
    const st = (o.status || "").toLowerCase();
    if (st in buckets) buckets[st].push(o);
    else buckets.other.push(o);
  }
  return buckets;
});

// tabs control
const activeTab = ref("all");
const tabs = computed(() => [
  { key: "all", label: "All", count: orders.value.length },
  { key: "unconfirmed", label: "Unconfirmed", count: grouped.value.unconfirmed.length },
  { key: "upcoming", label: "Upcoming", count: grouped.value.upcoming.length },
  { key: "completed", label: "Completed", count: grouped.value.completed.length },
  { key: "declined", label: "Declined / Cancelled", count: grouped.value.declined.length + grouped.value.cancelled.length },
]);
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