<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-[#f5f8fc] text-center px-6">
    <div class="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full">
      <div class="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <i class="fa-solid fa-xmark text-red-600 text-5xl"></i>
      </div>

      <h1 class="text-3xl font-bold text-[#133B5D] mb-3">Payment Failed</h1>
      <p class="text-gray-600 mb-6">
        Something went wrong with your payment.  
        Please try again or contact our support team.
      </p>

      <button
        @click="goToOrders"
        class="bg-[#133B5D] hover:bg-[#1b5383] text-white px-6 py-3 rounded-lg font-semibold transition"
      >
        Back to My Orders
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goToOrders = () => {
  router.push("/userorders");
};
</script>
