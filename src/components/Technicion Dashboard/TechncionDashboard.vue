<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import Chart from "chart.js/auto";
import { auth, db } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import ChatPage from "../ChatPage.vue";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

import ordersCard from "./ordersCard.vue";
import UpcomingCard from "./UpcomingCard.vue";
import ServiceCard from "./ServiceCard.vue";
import TechnicionDashNav from "@/layout/TechnicionDashNav.vue";
import CreateServiceCard from "./CreateServiceCard.vue";
import ManageTechnicianProfile from "./MannageTechnicionProfile.vue";
import TechnicianWorkGallery from "./TechnicianWorkGallery.vue";
// NEW: Import the AlertPopup component
import AlertPopup from "../AlertPopup.vue"; // <-- Adjust path if needed
// ✅ NEW: use the same Cloudinary uploader used elsewhere
import { uploadImageOnly } from "@/composables/useImageUpload";

// 🟦 Refs & states
const technicianId = ref(null);
const orders = ref([]);
const services = ref([]);
const unreadChatCount = ref(0);
const mainTab = ref("orders");
const orderTab = ref("requests");

const showPopup = ref(false);
const selectedService = ref(null);
// NOTE: now this will hold a **Cloudinary HTTPS URL** (not blob:)
const newImage = ref(null);
const serviceTitle = ref("");
const servicePrice = ref("");

const availabilityLoading = ref(true);
const availabilitySaving = ref(false);
const days = ref([
  { name: "Monday", active: false, start: "09:00", end: "17:00" },
  { name: "Tuesday", active: false, start: "09:00", end: "17:00" },
  { name: "Wednesday", active: false, start: "09:00", end: "17:00" },
  { name: "Thursday", active: false, start: "09:00", end: "17:00" },
  { name: "Friday", active: false, start: "09:00", end: "17:00" },
  { name: "Saturday", active: false, start: "09:00", end: "17:00" },
  { name: "Sunday", active: false, start: "09:00", end: "17:00" },
]);
const timeOptions = ref([]);
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 30) {
    const hour = h.toString().padStart(2, "0");
    const minute = m.toString().padStart(2, "0");
    timeOptions.value.push(`${hour}:${minute}`);
  }
}

// 🟩 Notification system (REPLACED)
const showPopupMessage = ref(false);
const popupMessageContent = ref("");

const triggerAlert = (message) => {
  popupMessageContent.value = message;
  showPopupMessage.value = true;
};
const closeAlert = () => {
  showPopupMessage.value = false;
  popupMessageContent.value = "";
};

// 🟩 Tab switch
const handleTabChange = (tabName) => {
  mainTab.value = tabName;
};

// 🟩 Auth & Firestore listeners
onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      technicianId.value = user.uid;
      loadAvailability();
      listenForOrders();
      listenForServices();
      listenForUnreadChats();
    } else {
      technicianId.value = null;
      orders.value = [];
      services.value = [];
      days.value.forEach((d) => (d.active = false));
      availabilityLoading.value = false;
    }
  });
});

// 🟩 Listen for unread chats
const listenForUnreadChats = () => {
  if (!technicianId.value) return;
  const q = query(
    collection(db, "users", technicianId.value, "active_chats"),
    where("isRead", "==", false)
  );

  onSnapshot(q, (snapshot) => {
    unreadChatCount.value = snapshot.size;
  });
};

// 🟩 Load & Save Availability
const loadAvailability = async () => {
  if (!technicianId.value) return;
  availabilityLoading.value = true;
  try {
    const docRef = doc(db, "technicians", technicianId.value);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (Array.isArray(data.availability)) {
        days.value = days.value.map((day) => {
          const saved = data.availability.find((d) => d.name === day.name);
          return saved ? { ...day, ...saved } : day;
        });
      }
    }
  } catch (err) {
    console.error("Error loading availability:", err);
  }
  availabilityLoading.value = false;
};

const saveAvailability = async () => {
  if (!technicianId.value) return;
  availabilitySaving.value = true;
  try {
    const docRef = doc(db, "technicians", technicianId.value);
    const anyActive = days.value.some((d) => d.active);
    await updateDoc(docRef, {
      availability: anyActive ? days.value : [],
    });
    // UPDATED
    triggerAlert("Availability saved successfully!");
  } catch (error) {
    console.error("Error saving availability:", error);
    // UPDATED
    triggerAlert("Failed to save availability.");
  }
  availabilitySaving.value = false;
};

// 🟩 Live Firestore listeners
const listenForOrders = () => {
  if (!technicianId.value) return;
  const ordersRef = collection(db, "orders");
  const q = query(ordersRef, where("technicianId", "==", technicianId.value));
  onSnapshot(q, (snapshot) => {
    const fetched = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    orders.value = fetched.sort(
      (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
    );
  });
};

const listenForServices = () => {
  if (!technicianId.value) return;
  const servicesCol = collection(
    db,
    "technicians",
    technicianId.value,
    "services"
  );
  onSnapshot(servicesCol, (snap) => {
    services.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  });
};

// 🟩 Orders helpers (updated flow)
const updateOrderStatus = async (id, status, reason = "") => {
  try {
    const orderRef = doc(db, "orders", id);
    const orderSnap = await getDoc(orderRef);
    const orderData = orderSnap.data();

    await updateDoc(orderRef, { status });

    if (orderData?.clientId) {
      const notifCol = collection(db, "users", orderData.clientId, "notifications");

      const clientRef = doc(db, "users", orderData.clientId);
      const clientSnap = await getDoc(clientRef);
      const clientData = clientSnap.exists() ? clientSnap.data() : null;
      const clientEmail = clientData?.email;

      const messages = {
        unconfirmed: "تم قبول الأوردر ✅ الفني وافق على طلبك، برجاء إتمام الدفع لتأكيد الحجز.",
        upcoming: "✅ تم استلام الدفع بنجاح! الأوردر الخاص بك تم تأكيده.",
        completed: "🎉 تم إتمام الأوردر بنجاح! شكرًا لاستخدامك موقع Tashtebaty.",
        declined: reason
          ? `❌ الفني اعتذر عن تنفيذ الأوردر الخاص بك.\n\nالسبب: "${reason}"`
          : "❌ الفني اعتذر عن تنفيذ الأوردر الخاص بك.",
        cancelled: reason
          ? `⚠️ تم إلغاء الأوردر من قبل الفني.\n\nالسبب: "${reason}"`
          : "⚠️ تم إلغاء الأوردر من قبل الفني.",
      };

      await addDoc(notifCol, {
        orderId: id,
        title: "Order Status Update",
        message: messages[status] || `Order status updated to ${status}`,
        status,
        email: orderData?.clientEmail || clientEmail || "noemail@tashtebaty.com",
        isRead: false,
        timestamp: serverTimestamp(),
      });
    }

    triggerAlert(`Order marked as ${status}`);
  } catch (error) {
    console.error("Error updating order:", error);
    triggerAlert("Failed to update order.");
  }
};

// 🟩 Technician actions
const handleAcceptOrder = (id) => updateOrderStatus(id, "unconfirmed");
const handleConfirmPayment = (id) => updateOrderStatus(id, "upcoming"); // after client pays
const handleMarkCompletedOrder = (id) => updateOrderStatus(id, "completed");
const handleDeclineOrder = ({ id, reason }) =>
  updateOrderStatus(id, "declined", reason);
const handleCancelOrder = ({ id, reason }) =>
  updateOrderStatus(id, "cancelled", reason);

// 🟩 Services popups
const openEditPopup = (service) => {
  selectedService.value = service;
  serviceTitle.value = service.descreption;
  servicePrice.value = service.price;
  newImage.value = null; // will be replaced by Cloudinary URL if user uploads
  showPopup.value = true;
};

const openCreatePopup = () => {
  selectedService.value = null;
  serviceTitle.value = "";
  servicePrice.value = "";
  newImage.value = null;
  showPopup.value = true;
};

// ✅ REPLACED: upload to Cloudinary instead of using object URL
const handleImageChange = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    if (!file.type.startsWith("image/")) {
      triggerAlert("Please select an image file.");
      return;
    }
    triggerAlert("Uploading image...");
    const url = await uploadImageOnly(file); // Cloudinary HTTPS URL
    newImage.value = url;
    triggerAlert("Image uploaded successfully ✅");
  } catch (err) {
    console.error("Service image upload failed:", err);
    triggerAlert("Image upload failed. Please try again.");
  }
};

const deleteImage = () => {
  newImage.value = null;
  if (selectedService.value) selectedService.value.image = null;
};

// 🟩 Firestore Service CRUD
const saveChanges = async () => {
  if (!technicianId.value) return;

  try {
    const servicesCol = collection(
      db,
      "technicians",
      technicianId.value,
      "services"
    );

    const payload = {
      descreption: serviceTitle.value,
      price: servicePrice.value,
      // ✅ always store a permanent URL (prefer Cloudinary URL if uploaded in this session)
      image:
        newImage.value ||
        selectedService.value?.image ||
        "/images/create service.png",
    };

    if (selectedService.value?.id) {
      await updateDoc(doc(servicesCol, selectedService.value.id), payload);
      triggerAlert("Service updated.");
    } else {
      await addDoc(servicesCol, { ...payload, createdAt: serverTimestamp() });
      triggerAlert("Service created.");
    }
  } catch (e) {
    console.error("saveChanges error:", e);
    triggerAlert("Failed to save service.");
  }

  closePopup();
};

const handleDeleteService = async (serviceId) => {
  if (!technicianId.value || !serviceId) return;
  try {
    await deleteDoc(
      doc(db, "technicians", technicianId.value, "services", serviceId)
    );
    triggerAlert("Service deleted.");
  } catch (e) {
    console.error("delete service error:", e);
    triggerAlert("Failed to delete service.");
  }
};

const closePopup = () => {
  showPopup.value = false;
  selectedService.value = null;
  serviceTitle.value = "";
  servicePrice.value = "";
  newImage.value = null;
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

// 🟩 Filtered Orders
const filteredOrders = computed(() =>
  orders.value.filter((o) => {
    if (orderTab.value === "requests") return o.status === "new";
    if (orderTab.value === "upcoming")
      return o.status === "unconfirmed" || o.status === "upcoming";
    if (orderTab.value === "completed") return o.status === "completed";
    if (orderTab.value === "cancelled") return o.status === "cancelled";
    return false;
  })
);

const completedCount = computed(() =>
  orders.value.filter((o) => o.status === "completed").length
);

// 🔹 Calculate total and monthly earnings dynamically
const totalEarnings = computed(() => {
  return orders.value
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + (parseFloat(o.price) || 0), 0);
});

// 🔹 Earnings grouped by month (for chart)
const monthlyEarnings = computed(() => {
  const monthly = Array(12).fill(0); // Jan–Dec
  orders.value.forEach((order) => {
    if (order.status === "completed" && order.date) {
      const dateObj = new Date(order.date);
      const monthIndex = dateObj.getMonth();
      monthly[monthIndex] += parseFloat(order.price) || 0;
    }
  });
  return monthly;
});

const earningsGrowth = computed(() => {
  const m = monthlyEarnings.value;
  const activeMonths = m
    .map((v, i) => ({ value: v, month: i }))
    .filter((x) => x.value > 0);

  if (activeMonths.length === 0) return 0;
  if (activeMonths.length === 1) return "first";

  const last = activeMonths[activeMonths.length - 1].value;
  const prev = activeMonths[activeMonths.length - 2].value;

  if (prev === 0) return 100;
  const growth = ((last - prev) / prev) * 100;
  return parseFloat(growth.toFixed(1));
});

// 🟩 Chart
let chartInstance = null;
watch(
  [mainTab, monthlyEarnings],
  ([newTab], [_, oldMonthly]) => {
    if (newTab === "earnings") {
      nextTick(() => {
        const ctx = document.getElementById("earningsChart");
        if (!ctx) return;

        const data = monthlyEarnings.value;
        const labels = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        if (chartInstance) chartInstance.destroy();
        chartInstance = new Chart(ctx, {
          type: "line",
          data: {
            labels,
            datasets: [
              {
                label: "Earnings (EGP)",
                data,
                backgroundColor: "rgba(19, 59, 93, 0.2)",
                borderColor: "#133B5D",
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: "#1b5383",
                pointRadius: 5,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: "#133B5D",
                titleColor: "#fff",
                bodyColor: "#fff",
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: { color: "#e0e0e0" },
                ticks: { color: "#133B5D" },
              },
              x: {
                grid: { display: false },
                ticks: { color: "#133B5D" },
              },
            },
          },
        });
      });
    }
  },
  { immediate: true }
);
</script>








<template>
  <div class="min-h-screen bg-gray-100 dark:bg-[#0B1217] flex">
    <TechnicionDashNav :active="mainTab" @changeTab="handleTabChange" />

    <div class="myOrders ml-[20%] w-[80%] px-8 py-6 relative">
      <template v-if="mainTab === 'orders'">
        <h2 class="text-2xl font-semibold text-[#133B5D] dark:text-white mb-4">Orders</h2>
        <div
          class="flex space-x-6 mb-6 border-b border-gray-300 text-lg font-medium"
        >
          <button
            @click="orderTab = 'requests'"
            :class="[
              'pb-2 border-b-2 transition-colors duration-200 cursor-pointer',
              orderTab === 'requests'
                ? 'border-[#133B5D] text-[#133B5D] dark:border-white dark:text-white'
                : 'border-transparent text-gray-500 dark:text-white hover:text-[#133B5D] dark:hover:text-white cursor-pointer',
            ]"
          >
            New Requests
          </button>
          <button
            @click="orderTab = 'upcoming'"
            :class="[
              'pb-2 border-b-2 transition-colors duration-200',
              orderTab === 'upcoming'
                ? 'border-[#133B5D] text-[#133B5D] dark:border-white dark:text-white'
                : 'border-transparent text-gray-500 dark:text-white hover:text-[#133B5D] dark:hover:text-white cursor-pointer',
            ]"
          >
            Upcoming
          </button>
          <button
            @click="orderTab = 'completed'"
            :class="[
              'pb-2 border-b-2 transition-colors duration-200',
              orderTab === 'completed'
                ? 'border-[#133B5D] text-[#133B5D] dark:border-white dark:text-white'
                : 'border-transparent text-gray-500 dark:text-white hover:text-[#133B5D] dark:hover:text-white cursor-pointer',
            ]"
          >
            Completed
            <span
              v-if="completedCount"
              class="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full"
            >
              {{ completedCount }}
            </span>
          </button>
          <button
            @click="orderTab = 'cancelled'"
            :class="[
              'pb-2 border-b-2 transition-colors duration-200',
              orderTab === 'cancelled'
                ? 'border-[#133B5D] text-[#133B5D] dark:border-white dark:text-white'
                : 'border-transparent text-gray-500 dark:text-white hover:text-[#133B5D] dark:hover:text-white cursor-pointer',
            ]"
          >
            Cancelled Orders
          </button>
        </div>
        <div
          v-if="!filteredOrders.length"
          class="text-center text-gray-500 dark:text-white mt-10"
        >
          No orders found in this category.
        </div>
        <div class="ordersContainer flex flex-wrap -mx-2">
          <template v-if="orderTab === 'requests'">
            <ordersCard
              v-for="order in filteredOrders"
              :key="order.id"
              :order="order"
              @accept-order="handleAcceptOrder"
              @decline-order="handleDeclineOrder"
            />
          </template>
          <template v-else-if="orderTab === 'upcoming'">
            <UpcomingCard
              v-for="order in filteredOrders"
              :key="order.id"
              :order="order"
              @mark-completed="handleMarkCompletedOrder"
              @cancel-order="handleCancelOrder"
            />
          </template>
          <template v-else-if="orderTab === 'completed'">
            <div
              v-for="order in filteredOrders"
              :key="order.id"
              class="order rounded-2xl shadow-md p-5 w-[31%] bg-green-50 dark:bg-[#16222B] dark:text-white m-2 border border-green-300 relative transition duration-200"
            >
              <button
                @click="order.showDetails = true"
                class="cursor-pointer absolute right-2 top-3 bg-[#133B5D] text-white rounded-lg p-1 px-2"
              >
                Details
              </button>

              <p
                class="text-[#133B5D] dark:text-white font-semibold text-lg mb-2 break-words"
              >
                <span class="font-bold">Order:</span>
                {{
                  (order.descreption || "")
                    .split(/\s+/)
                    .slice(0, 15)
                    .join(" ") +
                  ((order.descreption || "").split(/\s+/).length > 15 ? "..." : "")
                }}
              </p>

              <p class="text-[#133B5D] dark:text-white">
                <span class="font-semibold text-[#133B5D] dark:text-white">Price:</span>
                {{ order.price }} EGP
              </p>
              <p class="text-[#133B5D] dark:text-white">
                <span class="font-semibold text-[#133B5D] dark:text-white">Date:</span>
                {{ order.date }}
              </p>
              <p class="text-[#133B5D] dark:text-white">
                <span class="font-semibold text-[#133B5D] dark:text-white">Time:</span>
                {{ order.time }}
              </p>
              <p class="text-[#133B5D] dark:text-white">
                <span class="font-semibold text-[#133B5D] dark:text-white">Location:</span>
                {{ formatLocation(order.location) }}
              </p>
              <p class="text-[#133B5D] dark:text-white">
                <span class="font-semibold text-[#133B5D] dark:text-white">Client:</span>
                {{ order.customer }}
              </p>

              <p class="text-green-600 dark:text-green-400 font-semibold mt-2">✅ Completed</p>

              <div
                v-if="order.showDetails"
                @click.self="order.showDetails = false"
                class="fixed inset-0 bg-[#0000008a] flex justify-center items-center z-50"
              >
                <div
                  class="bg-white dark:bg-[#16222B] dark:text-white rounded-2xl p-6 w-[500px] shadow-xl relative border-t-4 border-[#133B5D]"
                >
                  <button
                    @click="order.showDetails = false"
                    class="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-xl"
                  >
                    ✕
                  </button>

                  <h2
                    class="text-2xl font-semibold text-[#133B5D] dark:text-white mb-4 text-center"
                  >
                    Completed Order Details
                  </h2>

                  <div class="mt-4 space-y-2 text-lg">
                    <textarea
                      disabled
                      class="border-[#133B5D] border-2 p-2 rounded-xl w-full h-[130px] dark:bg-[#16222B] dark:text-white"
                    >{{ order.descreption }}</textarea>
                    <p>
                      <span class="font-bold text-[#133B5D] dark:text-white">Price:</span>
                      {{ order.price }} EGP
                    </p>
                    <p>
                      <span class="font-bold text-[#133B5D] dark:text-white">Date:</span>
                      {{ order.date }}
                    </p>
                    <p>
                      <span class="font-bold text-[#133B5D] dark:text-white">Time:</span>
                      {{ order.time }}
                    </p>
                    <p>
                      <span class="font-bold text-[#133B5D] dark:text-white">Location:</span>
                      {{ formatLocation(order.location) }}
                    </p>
                    <p>
                      <span class="font-bold text-[#133B5D] dark:text-white">Client:</span>
                      {{ order.customer }}
                    </p>
                    <p class="text-green-600 dark:text-green-400 font-semibold mt-2">
                      ✅ Completed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <template v-else-if="orderTab === 'cancelled'"> 
            <div
              v-for="order in filteredOrders"
              :key="order.id"
              class="order rounded-2xl shadow-md p-5 w-[31%] bg-red-50 dark:bg-[#16222B] dark:text-white m-2 border border-red-300 relative transition duration-200"
            >
              <button
                @click="order.showDetails = true"
                class="cursor-pointer absolute right-2 top-3 bg-[#133B5D] text-white rounded-lg p-1 px-2"
              >
                Details
              </button>

              <p class="text-[#133B5D] dark:text-white font-semibold text-lg mb-2 break-words">
                <span class="font-bold">Order:</span>
                {{ order.descreption || "No description" }}
              </p>

              <p class="text-[#133B5D] dark:text-white">
                <span class="font-semibold text-[#133B5D] dark:text-white">Price:</span>
                {{ order.price }} EGP
              </p>

              <p class="text-[#133B5D] dark:text-white">
                <span class="font-semibold text-[#133B5D] dark:text-white">Date:</span>
                {{ order.date }}
              </p>

              <p class="text-[#133B5D] dark:text-white">
                <span class="font-semibold text-[#133B5D] dark:text-white">Time:</span>
                {{ order.time }}
              </p>

              <p class="text-[#133B5D] dark:text-white">
                <span class="font-semibold text-[#133B5D] dark:text-white">Location:</span>
                {{ formatLocation(order.location) }}
              </p>

              <p class="text-[#133B5D] dark:text-white">
                <span class="font-semibold text-[#133B5D] dark:text-white">Client:</span>
                {{ order.customer }}
              </p>

              <p class="text-red-600 dark:text-red-400 font-semibold mt-2">
                ❌ Cancelled by client
              </p>
            </div>
          </template>


        </div>
      </template>

      <template v-else-if="mainTab === 'services'">
        <h2 class="text-2xl font-semibold text-[#133B5D] dark:text-white mb-6">My Services</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <CreateServiceCard @createService="openCreatePopup" />
          <ServiceCard
            v-for="service in services"
            :key="service.id"
            :service="service"
            @editService="openEditPopup"
            @deleteService="handleDeleteService"
          />
        </div>
      </template>

      <template v-else-if="mainTab === 'earnings'">
        <div class="earningsSection">
          <h2
            class="text-2xl font-semibold text-[#133B5D] dark:text-white mb-6 flex items-center gap-2"
          >
            My Earnings
          </h2>

          <div
            class="bg-linear-to-r from-[#133B5D] to-[#1b5383] text-white rounded-2xl p-8 mb-6 shadow-lg flex justify-between items-center"
          >
            <div>
              <p class="text-lg opacity-90">Total Earnings</p>
              <h1 class="text-5xl font-bold mt-2">{{ totalEarnings }} EGP</h1>
              <p class="text-sm text-gray-200 mt-2">Updated today</p>
              <p
                class="text-sm mt-1 font-medium flex items-center"
                :class="{
                  'text-green-300': earningsGrowth === 'first' || earningsGrowth > 0,
                  'text-red-300': earningsGrowth < 0,
                  'text-gray-300': earningsGrowth === 0,
                }"
              >
                <img
                  v-if="earningsGrowth === 'first'"
                  src="../images/increase.png"
                  class="w-5 h-5 mr-1"
                  alt=""
                />
                <img
                  v-else
                  :src="
                    earningsGrowth > 0
                      ? '../images/increase.png'
                      : '../images/decrease.png'
                  "
                  class="w-5 h-5 mr-1"
                  alt=""
                />

                <span v-if="earningsGrowth === 'first'">
                  New earnings this month
                </span>
                <span v-else>
                  {{ earningsGrowth > 0 ? '+' : '' }}{{ earningsGrowth }}% this month
                </span>
              </p>
            </div>
          </div>

          <div class="bg-white dark:bg-[#16222B] rounded-2xl shadow-md p-6 mb-6">
            <h3 class="text-xl font-semibold text-[#133B5D] dark:text-white mb-4">
              Earnings Overview
            </h3>
            <div class="h-[300px]">
              <canvas id="earningsChart"></canvas>
            </div>
          </div>

          <div class="bg-white dark:bg-[#16222B] rounded-2xl shadow-md p-6">
            <h3 class="text-xl font-semibold text-[#133B5D] dark:text-white mb-4">
              Recent Orders
            </h3>
            <div class="overflow-x-auto">
              <table class="min-w-full text-left border-collapse dark:text-gray-200">
                <thead>
                  <tr class="border-b text-gray-600 dark:text-gray-300">
                    <th class="py-2 px-3">Date</th>
                    <th class="py-2 px-3">Service</th>
                    <th class="py-2 px-3">Client</th>
                    <th class="py-2 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="order in orders"
                    :key="order.id"
                    class="border-b hover:bg-gray-50 dark:hover:bg-[#1E2A33] text-sm transition"
                  >
                    <td class="py-3 px-3">{{ order.date }}</td>
                    <td class="py-3 px-3">{{ order.descreption }}</td>
                    <td class="py-3 px-3">{{ order.customer }}</td>
                    <td class="py-3 px-3 text-right">
                      <div class="flex flex-col items-end">
                        <span
                          class="px-2 py-1 rounded text-xs font-semibold mb-1"
                          :class="{
                            'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300':
                              order.status === 'completed',
                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300':
                              order.status === 'pending',
                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200':
                              order.status === 'in-progress',
                            'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300':
                              order.status === 'cancelled',
                          }"
                        >
                          {{
                            order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)
                          }}
                        </span>
                        <span class="text-sm text-[#133B5D] dark:text-gray-100 font-medium">
                          {{ order.price }} EGP
                        </span>
                      </div>
                    </td>
                  </tr>

                  <tr v-if="!orders.length">
                    <td
                      colspan="4"
                      class="text-center py-4 text-gray-500 dark:text-gray-300"
                    >
                      No recent orders yet
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </template>


      <template v-else-if="mainTab === 'appointments'">
        <div
          v-if="!technicianId"
          class="text-center text-gray-500 mt-10 p-6 bg-white dark:bg-[#16222B] rounded-lg shadow"
        >
          <p>Loading user information...</p>
        </div>
        <div v-else class="p-6 bg-white dark:bg-[#16222B] rounded-2xl shadow-md">
          <h2 class="text-2xl font-semibold text-[#133B5D] mb-6 dark:text-white ">
            My Availability
          </h2>

          <div
            v-if="availabilityLoading"
            class="text-center text-gray-500 py-10"
          >
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#133B5D] mx-auto mb-3"
            ></div>
            Loading availability...
          </div>

          <div v-else class="space-y-6">
            <div
              v-for="day in days"
              :key="day.name"
              class="flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-lg shadow-sm bg-gray-50 dark:bg-[#16222B]  hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors d "
            >
              <div
                class="flex items-center space-x-3 flex-shrink-0 w-full md:w-1/4"
              >
                <input
                  type="checkbox"
                  :id="`avail-${day.name}`"
                  v-model="day.active"
                  class="h-5 w-5 text-[#133B5D] dark:text-white rounded focus:ring-[#133B5D] border-gray-300 cursor-pointer"
                />
                <label
                  :for="`avail-${day.name}`"
                  class="text-lg font-semibold text-gray-800 dark:text-white cursor-pointer"
                  >{{ day.name }}</label
                >
              </div>

              <transition name="fade-fast">
                <div
                  v-if="day.active"
                  class="flex flex-col sm:flex-row items-center gap-4 flex-1 w-full md:w-3/4"
                >
                  <div class="flex-1 w-full sm:w-auto">
                    <label
                      :for="`start-${day.name}`"
                      class="block text-sm font-medium text-gray-600 mb-1 dark:text-white"
                      >Start Time</label
                    >
                    <select
                      :id="`start-${day.name}`"
                      v-model="day.start"
                      class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#133B5D] focus:border-[#133B5D] text-black bg-white"
                    >
                      <option
                        v-for="time in timeOptions"
                        :key="`start-${time}`"
                        :value="time"
                      >
                        {{ time }}
                      </option>
                    </select>
                  </div>
                  <span class="text-gray-500 hidden sm:block pt-6">—</span>
                  <div class="flex-1 w-full sm:w-auto">
                    <label
                      :for="`end-${day.name}`"
                      class="block text-sm font-medium text-gray-600 mb-1 dark:text-white"
                      >End Time</label
                    >
                    <select
                      :id="`end-${day.name}`"
                      v-model="day.end"
                      class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#133B5D] focus:border-[#133B5D] text-black bg-white"
                    >
                      <option
                        v-for="time in timeOptions"
                        :key="`end-${time}`"
                        :value="time"
                      >
                        {{ time }}
                      </option>
                    </select>
                  </div>
                </div>
              </transition>

              <transition name="fade-fast">
                <div
                  v-if="!day.active"
                  class="flex-1 w-full md:w-3/4"
                >
                  <p
                    class="text-gray-500 italic p-2 rounded bg-gray-200 text-center"
                  >
                    Not available
                  </p>
                </div>
              </transition>
            </div>

            <div class="mt-8 flex justify-end">
              <button
                @click="saveAvailability"
                :disabled="availabilitySaving || !technicianId"
                class="bg-[#133B5D] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1b5383] transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg
                  v-if="availabilitySaving"
                  class="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {{ availabilitySaving ? "Saving..." : "Save Availability" }}
              </button>
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="mainTab === 'Techsettings'">
        <h2 class="text-2xl font-semibold text-[#133B5D] dark:text-white mb-6">Settings</h2>

        <ManageTechnicianProfile @showNotification="triggerAlert" />
      </template>

      <template v-else-if="mainTab === 'chat'">
        <h2 class="text-2xl font-semibold text-[#133B5D]  dark:text-white mb-6">Chat</h2>
        <ChatPage />
      </template>

      <template v-else-if="mainTab === 'workGallery'">
        <TechnicianWorkGallery />
      </template>

    </div>

    <div
      v-if="showPopup"
      @click.self="closePopup"
      class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
    >
      <div
        class="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl text-center relative"
      >
        <button
          @click="closePopup"
          class="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-2xl"
        >
          &times;
        </button>
        <h2 class="text-2xl font-semibold text-[#133B5D] mb-6">
          {{ selectedService ? "Edit Service" : "Create New Service" }}
        </h2>
        <div class="flex flex-col items-center mb-6">
          <img
            :src="
              newImage ||
              selectedService?.image ||
              '/images/create service.png'
            "
            alt="Service"
            class="w-32 h-32 object-contain mb-3 border rounded-lg bg-gray-100"
          />
          <label
            for="fileUpload"
            class="bg-[#133B5D] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#1b5383] transition text-sm"
            >Choose File</label
          >
          <input
            id="fileUpload"
            type="file"
            @change="handleImageChange"
            class="hidden"
            accept="image/*"
          />
          <button
            v-if="newImage || selectedService?.image"
            @click="deleteImage"
            class="bg-red-500 text-white rounded px-3 py-1 text-xs hover:bg-red-600 mt-2"
          >
            Delete Image
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label
              class="block text-left font-semibold text-gray-700 mb-1 text-sm"
              >Service Title</label
            >
            <input
              v-model="serviceTitle"
              type="text"
              placeholder="Enter service name"
              class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-[#133B5D]"
            />
          </div>
          <div>
            <label
              class="block text-left font-semibold text-gray-700 mb-1 text-sm"
              >Service Price</label
            >
            <input
              v-model="servicePrice"
              type="text"
              placeholder="Enter price (e.g. 150 EGP)"
              class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-[#133B5D]"
            />
          </div>
        </div>
        <div class="flex justify-center mt-6 space-x-4">
          <button
            @click="saveChanges"
            class="bg-[#133B5D] text-white px-5 py-2 rounded-md hover:bg-[#1b5383] font-medium"
          >
            {{ selectedService ? "Save Changes" : "Add Service" }}
          </button>
          <button
            @click="closePopup"
            class="bg-gray-300 text-gray-700 px-5 py-2 rounded-md hover:bg-gray-400 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showPopup" @click.self="closePopup" class="fixed inset-0 ..."></div>

  <button
    v-if="technicianId && mainTab !== 'chat'"
    @click="handleTabChange('chat')"
    class="cursor-pointer sticky bottom-5 left-360 z-50 bg-[#133B5D] text-white rounded-full p-4 shadow-lg hover:bg-[#1b5383] transition-transform hover:scale-110 "
  >
    <i class="fa-solid fa-comments text-3xl"></i>

    <span
      v-if="unreadChatCount > 0"
      class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white"
      aria-label="New messages"
    >
      {{ unreadChatCount }}
    </span>
  </button>

  <AlertPopup
    :show="showPopupMessage"
    :message="popupMessageContent"
    @close="closeAlert"
  />

  </template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-fast-enter-active,
.fade-fast-leave-active {
  transition: opacity 0.3s ease;
}
.fade-fast-enter-from,
.fade-fast-leave-to {
  opacity: 0;
}
</style>