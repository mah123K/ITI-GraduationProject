<script setup>
import { ref, computed, watch } from "vue";
import Chart from "chart.js/auto";

import ordersCard from "../components/ordersCard.vue";
import UpcomingCard from "../components/UpcomingCard.vue";
import ServiceCard from "../components/ServiceCard.vue";
import TechnicionDashNav from "@/layout/TechnicionDashNav.vue";
import { orders as initialOrders } from "../data/orders.js";
import { services as initialServices } from "../data/services.js";
import CreateServiceCard from "../components/CreateServiceCard.vue";

const orders = ref([...initialOrders]);
const services = ref([...initialServices]);

const mainTab = ref("orders");
const orderTab = ref("requests");

const showPopup = ref(false);
const selectedService = ref(null);
const newImage = ref(null);
const serviceTitle = ref("");
const servicePrice = ref("");

// Tabs
const handleTabChange = (tabName) => {
  mainTab.value = tabName;
};

// Orders handlers
const handleAcceptOrder = (id) => {
  const order = orders.value.find((o) => o.id === id);
  if (order) order.status = "upcoming";
};
const handleDeclineOrder = (id) => {
  const order = orders.value.find((o) => o.id === id);
  if (order) order.status = "declined";
};
const handleMarkCompletedOrder = (id) => {
  const order = orders.value.find((o) => o.id === id);
  if (order) order.status = "completed";
};

// Services handlers
const openEditPopup = (service) => {
  selectedService.value = service;
  serviceTitle.value = service.descreption;
  servicePrice.value = service.price;
  newImage.value = null;
  showPopup.value = true;
};
const openCreatePopup = () => {
  selectedService.value = null;
  serviceTitle.value = "";
  servicePrice.value = "";
  newImage.value = null;
  showPopup.value = true;
};

const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) newImage.value = URL.createObjectURL(file);
};

const deleteImage = () => {
  newImage.value = null;
  if (selectedService.value) selectedService.value.image = null;
};

const saveChanges = () => {
  if (selectedService.value) {
    selectedService.value.descreption = serviceTitle.value;
    selectedService.value.price = servicePrice.value;
    if (newImage.value) selectedService.value.image = newImage.value;
  } else {
    services.value.push({
      id: Date.now(),
      image: newImage.value || "/images/create service.png",
      descreption: serviceTitle.value,
      price: servicePrice.value,
    });
  }
  showPopup.value = false;
};

const closePopup = () => (showPopup.value = false);

// Filter orders
const filteredOrders = computed(() =>
  orders.value.filter((o) => {
    if (orderTab.value === "requests") return o.status === "new";
    if (orderTab.value === "upcoming") return o.status === "upcoming";
    if (orderTab.value === "completed") return o.status === "completed";
    return false;
  })
);

let chartInstance = null;

watch(mainTab, (newTab) => {
  if (newTab === "earnings") {
    setTimeout(() => {
      const ctx = document.getElementById("earningsChart");
      if (!ctx) return;

      if (chartInstance) chartInstance.destroy();

      chartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "Earnings (EGP)",
              data: [500, 1200, 900, 1800, 2300, 2600],
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
    }, 200);
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex">
    <TechnicionDashNav :active="mainTab" @changeTab="handleTabChange" />

    <div class="myOrders ml-[20%] w-[80%] px-8 py-6">
      <template v-if="mainTab === 'orders'">
        <h2 class="text-2xl font-semibold text-[#133B5D] mb-4">Orders</h2>

        <div class="flex space-x-6 mb-6 border-b border-gray-300 text-lg font-medium">
          <button
            @click="orderTab = 'requests'"
            :class="[
              'pb-2 border-b-2 transition-colors duration-200',
              orderTab === 'requests'
                ? 'border-[#133B5D] text-[#133B5D]'
                : 'border-transparent text-gray-500 hover:text-[#133B5D]',
            ]"
          >
            New Requests
          </button>
          <button
            @click="orderTab = 'upcoming'"
            :class="[
              'pb-2 border-b-2 transition-colors duration-200',
              orderTab === 'upcoming'
                ? 'border-[#133B5D] text-[#133B5D]'
                : 'border-transparent text-gray-500 hover:text-[#133B5D]',
            ]"
          >
            Upcoming
          </button>
          <button
            @click="orderTab = 'completed'"
            :class="[
              'pb-2 border-b-2 transition-colors duration-200',
              orderTab === 'completed'
                ? 'border-[#133B5D] text-[#133B5D]'
                : 'border-transparent text-gray-500 hover:text-[#133B5D]',
            ]"
          >
            Completed
          </button>
        </div>

        <div class="ordersContainer flex flex-wrap">
          <template v-if="orderTab === 'requests'">
            <ordersCard
              v-for="order in filteredOrders"
              :key="order.id"
              :order="order"
              @acceptOrder="handleAcceptOrder"
              @declineOrder="handleDeclineOrder"
            />
          </template>

          <template v-else-if="orderTab === 'upcoming'">
            <UpcomingCard
              v-for="order in filteredOrders"
              :key="order.id"
              :order="order"
              @markCompleted="handleMarkCompletedOrder"
            />
          </template>

          <template v-else-if="orderTab === 'completed'">
            <div
              v-for="order in filteredOrders"
              :key="order.id"
              class="order rounded-2xl shadow-md p-5 w-[31%] bg-green-50 m-2 border border-green-300"
            >
              <p class="text-[#133B5D] font-semibold text-lg mb-2">
                {{ order.descreption }}
              </p>
              <p>Price: {{ order.price }} EGP</p>
              <p>Date: {{ order.date }}</p>
              <p>Client: {{ order.customer }}</p>
              <p class="text-green-600 font-semibold mt-2">✅ Completed</p>
            </div>
          </template>
        </div>
      </template>

      <template v-else-if="mainTab === 'services'">
        <h2 class="text-2xl font-semibold text-[#133B5D] mb-6">My Services</h2>
        <div class="ordersContainer flex flex-wrap">
          <CreateServiceCard @createService="openCreatePopup" />
          <ServiceCard
            v-for="service in services"
            :key="service.id"
            :service="service"
            @editService="openEditPopup"
          />
        </div>
      </template>

      <template v-else-if="mainTab === 'earnings'">
        <div class="earningsSection">
          <!-- Header -->
          <h2 class="text-2xl font-semibold text-[#133B5D] mb-6 flex items-center gap-2">
            My Earnings
          </h2>

          <!-- Total Earnings Card -->
          <div
            class="bg-linear-to-r from-[#133B5D] to-[#1b5383] text-white rounded-2xl p-8 mb-6 shadow-lg flex justify-between items-center transition-all duration-300 hover:scale-[1.01] hover:shadow-xl"
          >
            <div>
              <p class="text-lg opacity-90">Total Earnings</p>
              <h1 class="text-5xl font-bold mt-2">4,530 EGP</h1>
              <p class="text-sm text-gray-200 mt-2">Updated today</p>
              <p class="text-sm mt-1 text-green-300 font-medium">
                <img src="../images/increase.png" class="inline-block w-6 h-6 mr-2" alt="" />
                12% this month
              </p>
            </div>
          </div>

          <!-- Chart -->
          <div class="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h3 class="text-xl font-semibold text-[#133B5D] mb-4">Earnings Overview</h3>
            <canvas id="earningsChart" height="120"></canvas>
          </div>

          <!-- Transactions Table -->
          <div class="bg-white rounded-2xl shadow-md p-6">
            <h3 class="text-xl font-semibold text-[#133B5D] mb-4">Recent Orders</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full text-left border-collapse">
                <thead>
                  <tr class="border-b text-gray-600">
                    <th class="pb-2">Date</th>
                    <th class="pb-2">Service</th>
                    <th class="pb-2">Client</th>
                    <th class="pb-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="order in orders"
                    :key="order.id"
                    class="border-b hover:bg-gray-50 transition-colors odd:bg-gray-50/40"
                  >
                    <td class="py-2">{{ order.date }}</td>
                    <td>{{ order.description }}</td>
                    <td>{{ order.customer }}</td>
                    <td class="text-right">
                      <span
                        class="px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold"
                      >
                        {{ order.price }} EGP
                      </span>
                    </td>
                  </tr>
                  <tr v-if="!orders.length">
                    <td colspan="4" class="text-center py-4 text-gray-500">No recent orders yet</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </template>
    </div>

    <div
      v-if="showPopup"
      @click.self="closePopup"
      class="fixed inset-0 bg-[#0000009c] bg-opacity-50 flex justify-center items-center z-50"
    >
      <div class="bg-white rounded-2xl p-8 w-[450px] shadow-xl text-center relative">
        <button
          @click="closePopup"
          class="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-xl"
        >
          ✕
        </button>

        <h2 class="text-2xl font-semibold text-[#133B5D] mb-4">
          {{ selectedService ? "Edit Service" : "Create New Service" }}
        </h2>

        <div class="flex flex-col items-center mb-6">
          <img
            :src="
              newImage || selectedService?.image || '/images/create service.png'
            "
            alt="Service"
            class="w-[140px] h-[140px] object-contain mb-3 border rounded-lg shadow-sm"
          />
          <label
            for="fileUpload"
            class="bg-[#133B5D] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#1b5383] transition"
          >
            Choose File
          </label>
          <input
            id="fileUpload"
            type="file"
            @change="handleImageChange"
            class="hidden"
          />
          <button
            @click="deleteImage"
            class="bg-red-500 text-white rounded-md px-4 py-1 text-sm hover:bg-red-600 mt-2"
          >
            Delete Image
          </button>
        </div>

        <div class="text-center mb-4">
          <label class="block font-semibold text-gray-700 mb-1">Service Title</label>
          <input
            v-model="serviceTitle"
            type="text"
            placeholder="Enter service name"
            class="border border-gray-300 rounded-md w-[90%] p-2 text-center focus:outline-none focus:ring-2 focus:ring-[#133B5D]"
          />
        </div>

        <div class="text-center mb-4">
          <label class="block font-semibold text-gray-700 mb-1">Service Price</label>
          <input
            v-model="servicePrice"
            type="text"
            placeholder="Enter price (e.g. 150 EGP)"
            class="border border-gray-300 rounded-md w-[90%] p-2 text-center focus:outline-none focus:ring-2 focus:ring-[#133B5D]"
          />
        </div>

        <div class="flex justify-center mt-4 space-x-4">
          <button
            @click="saveChanges"
            class="bg-[#133B5D] text-white px-5 py-2 rounded-md hover:bg-[#1b5383]"
          >
            {{ selectedService ? "Save" : "Add Service" }}
          </button>
          <button
            @click="closePopup"
            class="bg-gray-300 text-black px-5 py-2 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
