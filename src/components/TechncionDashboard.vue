<script setup>
import { ref, computed } from "vue"
import ordersCard from "../components/ordersCard.vue"
import UpcomingCard from "../components/UpcomingCard.vue"
import ServiceCard from "../components/ServiceCard.vue"
import TechnicionDashNav from "@/layout/TechnicionDashNav.vue"
import { orders as initialOrders } from "../data/orders.js"
import { services as initialServices } from "../data/services.js"

const orders = ref([...initialOrders])
const services = ref([...initialServices])
const activeTab = ref("requests") 

const handleAcceptOrder = (id) => {
  const order = orders.value.find((o) => o.id === id)
  if (order) order.status = "upcoming"
}

const handleDeclineOrder = (id) => {
  const order = orders.value.find((o) => o.id === id)
  if (order) order.status = "declined"
}

const handleMarkCompletedOrder = (id) => {
  const order = orders.value.find((o) => o.id === id)
  if (order) order.status = "completed"
}

const handleTabChange = (tabName) => {
  activeTab.value = tabName
}

const filteredOrders = computed(() =>
  orders.value.filter((o) => {
    if (activeTab.value === "requests") return o.status === "new"
    if (activeTab.value === "upcoming") return o.status === "upcoming"
    if (activeTab.value === "completed") return o.status === "completed"
    return false
  })
)
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex">
    <TechnicionDashNav
      :active="activeTab"
      @changeTab="handleTabChange"
    />

    <div class="myOrders ml-[20%] w-[80%] px-8 py-6">
      <h2 class="text-2xl font-semibold text-[#133B5D] mb-6">
        {{
          activeTab === "requests"
            ? "Orders Requests"
            : activeTab === "upcoming"
            ? "Upcoming Orders"
            : "Completed Orders"
        }}
      </h2>

      <div class="ordersContainer flex flex-wrap">
        <template v-if="activeTab === 'requests'">
          <ordersCard
            v-for="order in filteredOrders"
            :key="order.id"
            :order="order"
            @acceptOrder="handleAcceptOrder"
            @declineOrder="handleDeclineOrder"
          />
        </template>

        <template v-else-if="activeTab === 'upcoming'">
          <UpcomingCard
            v-for="order in filteredOrders"
            :key="order.id"
            :order="order"
            @markCompleted="handleMarkCompletedOrder"
          />
        </template>

        <template v-else-if="activeTab === 'completed'">
          <div
            v-for="order in filteredOrders"
            :key="order.id"
            class="order rounded-2xl shadow-md p-5 w-[31%] bg-green-50 m-2 border border-green-300"
          >
            <p class="text-[#133B5D] font-semibold text-lg mb-2">{{ order.title }}</p>
            <p>Price: {{ order.price }} EGP</p>
            <p>Date: {{ order.date }}</p>
            <p>Client: {{ order.customer }}</p>
            <p class="text-green-600 font-semibold mt-2">✅ Completed</p>
          </div>
        </template>
        <template v-else-if="activeTab === 'services'">
          <ServiceCard
            v-for="service in services"
            :key="service.id"
            :service="service"
          />
        </template>
      </div>
    </div>
  </div>
</template>
