<script setup>
import { ref, computed } from "vue"

const props = defineProps({
  order: Object,
})

const emit = defineEmits(["markCompleted", "cancelOrder"])

const handleMarkCompleted = () => {
  if (!props.order.orderCode) {
    emit("markCompleted", props.order.id)
    return;
  }
  const entered = prompt("Enter the 6-digit code provided by the client:");
  if (!entered) return;
  if (entered.trim() === props.order.orderCode) {
    emit("markCompleted", props.order.id);
  } else {
    alert("❌ Incorrect code. Please verify with the client.");
  }
}

const handleCancelOrder = () => {
  emit("cancelOrder", props.order.id)
}
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



// Short description logic
const shortDescription = computed(() => {
  const desc = (props.order.descreption || "").trim()
  if (!desc) return ""
  const words = desc.split(/\s+/).filter(Boolean)
  if (words.length > 15) return words.slice(0, 15).join(" ") + "..."
  if (words.length === 1 && desc.length > 60) return desc.slice(0, 60) + "..."
  return desc
})

// Full details modal toggle
const showDetails = ref(false)

// Check if payment is confirmed
const isConfirmed = computed(() => props.order.status === "upcoming")
</script>

<template>
  <div
    class="order rounded-2xl shadow-md p-5 w-[31%] bg-white m-2 relative transition duration-200"
  >
    <!-- Details button -->
    <button
      @click="showDetails = true"
      class="cursor-pointer absolute right-4 top-3 bg-[#133B5D] text-white rounded-lg p-1 px-2"
    >
      Details
    </button>

    <!-- Order -->
    <div class="element flex m-1 text-lg">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 512" class="w-[25px] h-[25px]">
        <path
          fill="#2574b9"
          d="M384 32c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l320 0zM342 145.7c-10.7-7.8-25.7-5.4-33.5 5.3L189.1 315.2 137 263.1c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l72 72c5 5 11.9 7.5 18.8 7s13.4-4.1 17.5-9.8L347.3 179.2c7.8-10.7 5.4-25.7-5.3-33.5z"
        />
      </svg>
      <p class="mx-1 break-words">
        <span class="font-bold text-[#133B5D]">Order:</span>
        {{ shortDescription }}
      </p>
    </div>

    <!-- Price -->
    <div class="element flex m-1 text-lg">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 512" class="w-[25px] h-[25px]">
        <path
          fill="#2574b9"
          d="M64 64C28.7 64 0 92.7 0 128L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64L64 64zM296 288l128 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-128 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm-24-88c0-13.3 10.7-24 24-24l128 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-128 0c-13.3 0-24-10.7-24-24z"
        />
      </svg>
      <p class="mx-1">
        <span class="font-bold text-[#133B5D]">Price:</span>
        {{ order.price }} EGP
      </p>
    </div>

    <!-- Date -->
    <div class="element flex m-1 text-lg">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 512" class="w-[25px] h-[25px]">
        <path
          fill="#2574b9"
          d="M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 32 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 128C0 92.7 28.7 64 64 64l32 0 0-32c0-17.7 14.3-32 32-32zM64 240l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm128 0l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM64 368l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16z"
        />
      </svg>
      <p class="mx-1">
        <span class="font-bold text-[#133B5D]">Date:</span>
        {{ order.date }}
      </p>
    </div>

    <!-- Time -->
    <div class="element flex m-1 text-lg">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 550 512" class="w-[25px] h-[25px]">
        <path
          fill="#2574b9"
          d="M256 0a256 256 0 1 1 0 512 256 256 0 1 1 0-512zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"
        />
      </svg>
      <p class="mx-1">
        <span class="font-bold text-[#133B5D]">Time:</span>
        {{ order.time }}
      </p>
    </div>

    <!-- Location -->
    <div class="element flex m-1 text-lg">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 512" class="w-[25px] h-[25px]">
        <path
          fill="#2574b9"
          d="M0 188.6C0 84.4 86 0 192 0S384 84.4 384 188.6c0 119.3-120.2 262.3-170.4 316.8-11.8 12.8-31.5 12.8-43.3 0-50.2-54.5-170.4-197.5-170.4-316.8zM192 256a64 64 0 1 0 0-128 64 64 0 1 0 0 128z"
        />
      </svg>
      <p class="mx-1">
        <span class="font-bold text-[#133B5D]">Location:</span>
        {{ formatLocation(order.location) }}

      </p>
    </div>

    <!-- Client -->
    <div class="element flex m-1 text-lg">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 512" class="w-[25px] h-[25px]">
        <path
          fill="#2574b9"
          d="M224 248a120 120 0 1 0 0-240 120 120 0 1 0 0 240zm-29.7 56C95.8 304 16 383.8 16 482.3 16 498.7 29.3 512 45.7 512l356.6 0c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3l-59.4 0z"
        />
      </svg>
      <p class="mx-1">
        <span class="font-bold text-[#133B5D]">Client:</span>
        {{ order.customer }}
      </p>
    </div>

    <!-- 🟦 Order Status -->
    <div class="element flex m-1 text-lg">
      <i
        class="fa-solid fa-circle-info text-[#2574b9] text-xl"
      ></i>
      <p class="mx-2">
        <span class="font-bold text-[#133B5D]">Status:</span>
        <span
          :class="isConfirmed ? 'text-green-600 font-semibold' : 'text-yellow-500 font-semibold'"
        >
          {{ isConfirmed ? 'Confirmed (Paid)' : 'Unconfirmed (Awaiting Payment)' }}
        </span>
      </p>
    </div>

    <!-- Action -->
    <div class="flex justify-center mt-6">
      <button
        @click="handleMarkCompleted"
        :disabled="!isConfirmed"
        :class="[
          'font-semibold px-6 py-2 rounded-xl transition',
          isConfirmed
            ? 'cursor-pointer bg-[#133B5D] hover:bg-[#0f2d47] text-white'
            : 'cursor-not-allowed bg-gray-300 text-gray-500'
        ]"
      >
        Mark as Completed
      </button>

      <button
        @click="handleCancelOrder"
        class="ml-1 cursor-pointer bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-xl transition"
      >
        Cancel
      </button>
    </div>
  </div>

  <!-- Full details popup -->
  <div
    v-if="showDetails"
    class="fixed inset-0 bg-[#0000008a] flex justify-center items-center z-50"
    @click.self="showDetails = false"
  >
    <div
      class="bg-white rounded-2xl p-6 w-[500px] shadow-xl relative border-t-4 border-[#133B5D]"
    >
      <button
        @click="showDetails = false"
        class="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-xl"
      >
        ✕
      </button>

      <h2 class="text-2xl font-semibold text-[#133B5D] mb-4 text-center">
        Order Details
      </h2>

      <div class="mt-4 space-y-2 text-lg">
        <textarea
          disabled
          class="border-[#133B5D] border-2 p-2 rounded-xl w-full h-[130px]"
        >{{ order.descreption }}</textarea>
        <p><span class="font-bold text-[#133B5D]">Price:</span> {{ order.price }} EGP</p>
        <p><span class="font-bold text-[#133B5D]">Date:</span> {{ order.date }}</p>
        <p><span class="font-bold text-[#133B5D]">Time:</span> {{ order.time }}</p>
        <p><span class="font-bold text-[#133B5D]">Location:</span> {{ formatLocation(order.location) }}</p>
        <p><span class="font-bold text-[#133B5D]">Client:</span> {{ order.customer }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.break-words {
  word-break: break-word;
  overflow-wrap: anywhere;
}
</style>
