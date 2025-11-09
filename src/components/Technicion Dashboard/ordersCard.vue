<script setup>
import { ref, computed } from "vue"

const props = defineProps({
  order: Object,
})

const emit = defineEmits(["accept-order", "decline-order"]);
const showDetails = ref(false)

// 🟩 NEW refs for decline reason popup
const showReasonPopup = ref(false)
const declineReason = ref("")

const handleAccept = () => {
  emit("acceptOrder", props.order.id)
}

const handleDecline = () => {
  // show popup instead of direct emit
  showReasonPopup.value = true
}

const confirmDecline = () => {
  if (declineReason.value.trim() !== "") {
    emit("decline-order", { id: props.order.id, reason: declineReason.value.trim() });
    showReasonPopup.value = false
    declineReason.value = ""
  }
}

const cancelDecline = () => {
  showReasonPopup.value = false
  declineReason.value = ""
}

const formatLocation = (loc) => {
  if (!loc) return "—";
  if (typeof loc === "string") return loc;
  if (typeof loc === "object") {
    const parts = [loc.street, loc.city, loc.country].filter(Boolean).join(", ");
    return parts || "Location not specified";
  }
  return "—";
};

const shortDescription = computed(() => {
  const desc = props.order.descreption || ""
  return desc.length > 15 ? desc.slice(0, 15) + "..." : desc
})
</script>
<template>
  <div class="order rounded-2xl shadow-md p-5 w-[31%] bg-white dark:bg-[#16222B] m-2 relative">
    <button @click="showDetails = true" class="cursor-pointer absolute right-4 top-3 bg-[#133B5D] text-white rounded-lg p-1 px-2">Details</button>
    <div class="element flex m-1 text-lg">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 450 512"
        class="w-[25px] h-[25px]"
      >
        <path fill="#2574b9" d="M384 32c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l320 0zM342 145.7c-10.7-7.8-25.7-5.4-33.5 5.3L189.1 315.2 137 263.1c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l72 72c5 5 11.9 7.5 18.8 7s13.4-4.1 17.5-9.8L347.3 179.2c7.8-10.7 5.4-25.7-5.3-33.5z"/>
      </svg>
      <p class="mx-1 text-[#133B5D] dark:text-white"><span class="font-bold text-[#133B5D] dark:text-white ">Order: </span> {{ shortDescription }}</p>
    </div>

    <div class="element flex m-1 text-lg">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 580 512"
        class="w-[25px] h-[25px]"
      >
        <path fill="#2574b9" d="M64 64C28.7 64 0 92.7 0 128L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64L64 64zM296 288l128 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-128 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm-24-88c0-13.3 10.7-24 24-24l128 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-128 0c-13.3 0-24-10.7-24-24zM148 144c11 0 20 9 20 20l0 4 8 0c11 0 20 9 20 20s-9 20-20 20l-47.5 0c-6.9 0-12.5 5.6-12.5 12.5 0 6.1 4.4 11.3 10.4 12.3l41.7 7c25.3 4.2 43.9 26.1 43.9 51.8 0 26.1-19 47.7-44 51.8l0 4.7c0 11-9 20-20 20s-20-9-20-20l0-4-24 0c-11 0-20-9-20-20s9-20 20-20l55.5 0c6.9 0 12.5-5.6 12.5-12.5 0-6.1-4.4-11.3-10.4-12.3l-41.7-7C94.5 268 76 246.1 76 220.5 76 191.7 99.2 168.3 128 168l0-4c0-11 9-20 20-20z"/>
      </svg>
      <p class="mx-1 text-[#133B5D] dark:text-white"><span class="font-bold text-[#133B5D] dark:text-white">Price: </span> {{ order.price }} EGP</p>
    </div>

    
    <div class="element flex m-1 text-lg">
      <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 450 512"
      class="w-[25px] h-[25px]"
      >
      <path fill="#2574b9" d="M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 32 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 128C0 92.7 28.7 64 64 64l32 0 0-32c0-17.7 14.3-32 32-32zM64 240l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm128 0l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM64 368l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zm112 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16z"/>
      </svg>
      <p class="mx-1 text-[#133B5D] dark:text-white"><span class="font-bold text-[#133B5D] dark:text-white">Date: </span>{{ order.date }}</p>
    </div>

    <div class="element flex m-1 text-lg">
      <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 550 512"
      class="w-[25px] h-[25px]"
      >
      <path fill="#2574b9" d="M256 0a256 256 0 1 1 0 512 256 256 0 1 1 0-512zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/>
      </svg>
      <p class="mx-1 text-[#133B5D] dark:text-white"><span class="font-bold text-[#133B5D] dark:text-white">Time: </span>{{ order.time }}</p>
    </div>

    <div class="element flex m-1 text-lg">
      <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 450 512"
      class="w-[25px] h-[25px]"
      >
        <path fill="#2574b9" d="M0 188.6C0 84.4 86 0 192 0S384 84.4 384 188.6c0 119.3-120.2 262.3-170.4 316.8-11.8 12.8-31.5 12.8-43.3 0-50.2-54.5-170.4-197.5-170.4-316.8zM192 256a64 64 0 1 0 0-128 64 64 0 1 0 0 128z"/>              </svg>
      <p class="mx-1 text-[#133B5D] dark:text-white"><span class="font-bold text-[#133B5D] dark:text-white">Location: </span>{{ formatLocation(order.location) }}</p>
    </div>

    <div class="element flex m-1 text-lg">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 450 512"
        class="w-[25px] h-[25px]"
      >
        <path fill="#2574b9" d="M224 248a120 120 0 1 0 0-240 120 120 0 1 0 0 240zm-29.7 56C95.8 304 16 383.8 16 482.3 16 498.7 29.3 512 45.7 512l356.6 0c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3l-59.4 0z"/>              
      </svg>
      <p class="mx-1 text-[#133B5D] dark:text-white"><span class="font-bold text-[#133B5D] dark:text-white">Client: </span> {{ order.customer }}</p>
    </div>

    <div class="buttonsContainer flex w-[50%] mx-auto justify-between mt-5">
      <div @click="handleAccept" class="cursor-pointer acceptIcon rounded-full w-[60px] h-[60px] bg-green-500 flex flex-col items-center justify-center text-white">
        <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 390 512"
        class="w-[27px] h-[27px]"
        >
          <path fill="white" d="M434.8 70.1c14.3 10.4 17.5 30.4 7.1 44.7l-256 352c-5.5 7.6-14 12.3-23.4 13.1s-18.5-2.7-25.1-9.3l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l101.5 101.5 234-321.7c10.4-14.3 30.4-17.5 44.7-7.1z"/>
        </svg>
        <p class="text-[10px] font-bold">Accept</p>
      </div>

      <div @click="handleDecline" class="cursor-pointer declineIcon rounded-full w-[60px] h-[60px] bg-red-500 flex flex-col items-center justify-center text-white">
        <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 390 512"
        class="w-[27px] h-[27px]"
        >
          <path fill="white" d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"/>          
        </svg>
        <p class="text-[10px] font-bold">Decline</p>
      </div>
    </div>
  </div>
  <transition name="fade">
    <div v-if="showReasonPopup" class="fixed inset-0 bg-[#0000008a] flex justify-center items-center z-50">
      <div class="bg-white dark:bg-[#16222B] dark:text-white p-6 rounded-2xl shadow-xl w-[400px] text-center">
        <h3 class="text-xl font-semibold mb-4 text-[#133B5D] dark:text-white">Enter reason for cancellation</h3>
        <textarea v-model="declineReason" rows="4" class="w-full border rounded-lg p-2 dark:bg-[#16222B] dark:text-white border-gray-300 focus:ring-2 focus:ring-[#133B5D]" placeholder="Type the reason..."></textarea>
        <div class="flex justify-end gap-3 mt-4">
          <button @click="cancelDecline" class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg">Cancel</button>
          <button @click="confirmDecline" class="bg-[#133B5D] hover:bg-[#1b5383] text-white px-5 py-2 rounded-lg font-semibold">Submit</button>
        </div>
      </div>
    </div>
  </transition>
  <div
    v-if="showDetails"
    class="fixed inset-0 bg-[#0000008a]  flex justify-center items-center z-50" @click.self="showDetails = false"
  >
    <div
      class="bg-white dark:bg-[#16222B] rounded-2xl p-6 w-[500px] shadow-xl relative border-t-4 border-[#133B5D]"
    >
      <button
        @click="showDetails = false"
        class="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-xl"
      >
        ✕
      </button>

      <h2 class="text-2xl font-semibold text-[#133B5D] mb-4 text-center dark:text-white">
        Order Details
      </h2>

      <div class="mt-4 space-y-2 text-lg">
        <textarea disabled class="text-[#133B5D] dark:text-white border-[#133B5D] border-2 p-2 rounded-xl w-full h-[130px] disabled"> {{ order.descreption }} </textarea>
        <p class="text-[#133B5D] dark:text-white"><span class="font-bold text-[#133B5D] dark:text-white">Price:</span> {{ order.price }} EGP</p>
        <p class="text-[#133B5D] dark:text-white"><span class="font-bold text-[#133B5D] dark:text-white">Date:</span> {{ order.date }}</p>
        <p class="text-[#133B5D] dark:text-white"><span class="font-bold text-[#133B5D] dark:text-white">Time:</span> {{ order.time }}</p>
        <p class="text-[#133B5D] dark:text-white"><span class="font-bold text-[#133B5D] dark:text-white">Location:</span> {{ formatLocation(order.location) }}</p>
        <p class="text-[#133B5D] dark:text-white"><span class="font-bold text-[#133B5D] dark:text-white">Client:</span> {{ order.customer }}</p>
        <!-- 🖼️ Display attached photos if exist -->
      <div v-if="order.imageUrls && order.imageUrls.length" class="mt-4">
        <p class="font-bold text-[#133B5D] dark:text-white mb-2">Attached Photos:</p>
        <div class="grid grid-cols-2 gap-3">
          <img
            v-for="(url, index) in order.imageUrls"
            :key="index"
            :src="url"
            class="w-full h-32 object-cover rounded-lg shadow-md hover:scale-105 transition-transform"
            alt="Uploaded photo"
          />
        </div>
      </div>

      </div>
    </div>
  </div>
</template>
