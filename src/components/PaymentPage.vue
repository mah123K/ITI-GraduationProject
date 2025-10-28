<template>
  <div class="min-h-screen bg-[#f5f8fc] flex flex-col items-center py-10 px-4">
    <div class="bg-white rounded-2xl shadow-lg w-full max-w-lg p-8 text-center">
      <h2 class="text-2xl font-bold text-[#133B5D] mb-4">Confirm Your Payment</h2>

      <div class="border border-gray-200 rounded-lg p-4 mb-6 text-left bg-gray-50">
        <p><strong>Service:</strong> {{ serviceTitle }}</p>
        <p><strong>Technician:</strong> {{ technicianName }}</p>
        <p><strong>Total:</strong> {{ amount }} EGP</p>
      </div>

      <p class="text-gray-600 mb-4">Please enter your card details below to complete the payment:</p>

      <iframe
        v-if="iframeUrl"
        :src="iframeUrl"
        frameborder="0"
        class="w-full h-[550px] rounded-xl shadow-inner"
      ></iframe>

      <p v-else class="text-gray-500 mt-6">Loading payment form...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const iframeUrl = ref("");
const serviceTitle = ref("");
const technicianName = ref("");
const amount = ref("");

onMounted(async () => {
  const { id, price, service, technician } = route.query;

  serviceTitle.value = service;
  technicianName.value = technician;
  amount.value = price;

  const response = await fetch("http://localhost:5000/pay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: price,
      orderId: id,
      serviceTitle: service,
      technicianName: technician,
    }),
  });

  const data = await response.json();
  iframeUrl.value = data.url;
});
</script>
