<script setup>
import { ref, computed } from "vue";
import AlertPopup from "../AlertPopup.vue"; // ✅ import your popup

const props = defineProps({
  order: Object,
});

const emit = defineEmits(["mark-completed", "cancel-order"]);


// 🟩 States for popup input (verification code)
const showCodePopup = ref(false);
const enteredCode = ref("");
const showAlert = ref(false);
const alertMessage = ref("");

// 🟩 NEW: States for cancellation reason popup
const showCancelPopup = ref(false);
const cancelReason = ref("");

// 🟦 Handle mark completed flow
const handleMarkCompleted = () => {
  if (!props.order.orderCode) {
    emit("markCompleted", props.order.id);
    return;
  }
  showCodePopup.value = true;
};

// 🟦 Confirm entered code
const confirmCode = () => {
  if (enteredCode.value.trim() === props.order.orderCode) {
    emit("markCompleted", props.order.id);
    showCodePopup.value = false;
    enteredCode.value = "";
  } else {
    alertMessage.value = "❌ Incorrect code. Please verify with the client.";
    showAlert.value = true;
  }
};

// 🟦 Updated cancel order flow — show reason popup
const handleCancelOrder = () => {
  showCancelPopup.value = true;
};

// 🟦 Confirm cancel with reason
const confirmCancel = () => {
  if (cancelReason.value.trim() !== "") {
    emit("cancel-order", { id: props.order.id, reason: cancelReason.value.trim() });

    showCancelPopup.value = false;
    cancelReason.value = "";
  }
};

// 🟦 Cancel popup (close without submitting)
const cancelPopup = () => {
  showCancelPopup.value = false;
  cancelReason.value = "";
};

// 🟦 Format location helper
const formatLocation = (loc) => {
  if (!loc) return "—";
  if (typeof loc === "string") return loc;
  if (typeof loc === "object") {
    const parts = [loc.street, loc.city, loc.country]
      .filter(Boolean)
      .join(", ");
    return parts || "Location not specified";
  }
  return "—";
};

// 🟦 Short description logic
const shortDescription = computed(() => {
  const desc = (props.order.descreption || "").trim();
  if (!desc) return "";
  const words = desc.split(/\s+/).filter(Boolean);
  if (words.length > 15) return words.slice(0, 15).join(" ") + "...";
  if (words.length === 1 && desc.length > 60) return desc.slice(0, 60) + "...";
  return desc;
});

// 🟦 Full details modal toggle
const showDetails = ref(false);

// 🟦 Check if payment is confirmed
const isConfirmed = computed(() => props.order.status === "upcoming");
</script>


<template> 
  <div
    class="order rounded-2xl shadow-md p-5 w-[31%] bg-white dark:bg-[#16222B] dark:text-white m-2 relative transition duration-200"
  >
    <!-- Details button -->
    <button
      @click="showDetails = true"
      class="cursor-pointer absolute right-4 top-3 bg-[#133B5D] text-white rounded-lg p-1 px-2"
    >
      Details
    </button>

    <!-- Order Info -->
    <div class="element flex m-1 text-lg">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 512" class="w-[25px] h-[25px]">
        <path
          fill="#2574b9"
          d="M384 32c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l320 0zM342 145.7c-10.7-7.8-25.7-5.4-33.5 5.3L189.1 315.2 137 263.1c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l72 72c5 5 11.9 7.5 18.8 7s13.4-4.1 17.5-9.8L347.3 179.2c7.8-10.7 5.4-25.7-5.3-33.5z"
        />
      </svg>
      <p class="mx-1 break-words text-[#133B5D] dark:text-white">
        <span class="font-bold text-[#133B5D] dark:text-white">Order:</span>
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
      <p class="mx-1 text-[#133B5D] dark:text-white">
        <span class="font-bold text-[#133B5D] dark:text-white">Price:</span>
        {{ order.price }} EGP
      </p>
    </div>

    <!-- Date -->
    <div class="element flex m-1 text-lg">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 512" class="w-[25px] h-[25px]">
        <path
          fill="#2574b9"
          d="M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 32 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 128C0 92.7 28.7 64 64 64l32 0 0-32c0-17.7 14.3-32 32-32z"
        />
      </svg>
      <p class="mx-1 text-[#133B5D] dark:text-white">
        <span class="font-bold text-[#133B5D] dark:text-white">Date:</span>
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
      <p class="mx-1 text-[#133B5D] dark:text-white">
        <span class="font-bold text-[#133B5D] dark:text-white">Time:</span>
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
      <p class="mx-1 text-[#133B5D] dark:text-white">
        <span class="font-bold text-[#133B5D] dark:text-white">Location:</span>
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
      <p class="mx-1 text-[#133B5D] dark:text-white">
        <span class="font-bold text-[#133B5D] dark:text-white">Client:</span>
        {{ order.customer }}
      </p>
    </div>

    <!-- Status -->
    <div class="element flex m-1 text-lg">
      <i class="fa-solid fa-circle-info text-[#2574b9] text-xl"></i>
      <p class="mx-2">
        <span class="font-bold text-[#133B5D] dark:text-white">Status:</span>
        <span
          :class="isConfirmed ? 'text-green-600 font-semibold' : 'text-yellow-500 font-semibold'"
        >
          {{ isConfirmed ? 'Confirmed (Paid)' : 'Unconfirmed (Awaiting Payment)' }}
        </span>
      </p>
    </div>

    <!-- Actions -->
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

  <!-- ✅ Popup -->
  <transition name="fade">
    <div
      v-if="showCodePopup"
      class="fixed inset-0 bg-[#0000008a] flex justify-center items-center z-50"
    >
      <div class="bg-white dark:bg-[#16222B] dark:text-white rounded-2xl shadow-xl p-6 w-96 text-center">
        <h3 class="text-xl font-semibold text-[#5984C6] dark:text-white mb-4">
          Enter Order Verification Code
        </h3>
        <p class="text-gray-700 dark:text-white mb-4">
          Ask the client for their 6-digit order code.
        </p>
        <input
          v-model="enteredCode"
          type="text"
          maxlength="6"
          class="border border-gray-300 rounded-lg p-2 w-full text-center tracking-widest text-lg mb-6 focus:ring-2 focus:ring-[#5984C6] outline-none dark:bg-[#16222B] dark:text-white"
          placeholder="••••••"
        />
        <div class="flex justify-end gap-3">
          <button
            @click="showCodePopup = false"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-[#133B5D] dark:text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            Cancel
          </button>
          <button
            @click="confirmCode"
            class="bg-[#5984C6] hover:bg-[#002153] text-white px-5 py-2 rounded-lg font-semibold transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </transition>

  <AlertPopup :show="showAlert" :message="alertMessage" @close="showAlert = false" />

  <!-- Details Modal -->
  <div
    v-if="showDetails"
    class="fixed inset-0 bg-[#0000008a] flex justify-center items-center z-50"
    @click.self="showDetails = false"
  >
    <div
      class="bg-white dark:bg-[#16222B] dark:text-white rounded-2xl p-6 w-[500px] shadow-xl relative border-t-4 border-[#133B5D]"
    >
      <button
        @click="showDetails = false"
        class="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-xl"
      >
        ✕
      </button>

      <h2 class="text-2xl font-semibold text-[#133B5D] dark:text-white mb-4 text-center">
        Order Details
      </h2>

      <div class="mt-4 space-y-2 text-lg">
        <textarea 
          disabled
          class="text-[#133B5D] dark:text-white border-[#133B5D] border-2 p-2 rounded-xl w-full h-[130px] dark:bg-[#16222B] dark:text-white"
        >{{ order.descreption }}</textarea>
        <p class="text-[#133B5D] dark:text-white"><span class="font-bold text-[#133B5D] dark:text-white">Price:</span> {{ order.price }} EGP</p>
        <p class="text-[#133B5D] dark:text-white"><span class="font-bold text-[#133B5D] dark:text-white">Date:</span> {{ order.date }}</p>
        <p class="text-[#133B5D] dark:text-white"><span class="font-bold text-[#133B5D] dark:text-white">Time:</span> {{ order.time }}</p>
        <p class="text-[#133B5D] dark:text-white"><span class="font-bold text-[#133B5D] dark:text-white">Location:</span> {{ formatLocation(order.location) }}</p>
        <p class="text-[#133B5D] dark:text-white"><span class="font-bold text-[#133B5D] dark:text-white">Client:</span> {{ order.customer }}</p>
      </div>
    </div>
  </div>
  <!-- 🟩 Cancel Reason Popup -->
  <transition name="fade">
    <div v-if="showCancelPopup" class="fixed inset-0 bg-[#0000008a] flex justify-center items-center z-50">
      <div class="bg-white dark:bg-[#16222B] dark:text-white p-6 rounded-2xl shadow-xl w-[400px] text-center">
        <h3 class="text-xl font-semibold mb-4 text-[#133B5D] dark:text-white">Enter reason for cancellation</h3>
        <textarea v-model="cancelReason" rows="4" class="w-full border rounded-lg p-2 dark:bg-[#16222B] dark:text-white border-gray-300 focus:ring-2 focus:ring-[#133B5D]" placeholder="Type the reason..."></textarea>
        <div class="flex justify-end gap-3 mt-4">
          <button @click="cancelPopup" class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg">Cancel</button>
          <button @click="confirmCancel" class="bg-[#133B5D] hover:bg-[#1b5383] text-white px-5 py-2 rounded-lg font-semibold">Submit</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.break-words {
  word-break: break-word;
  overflow-wrap: anywhere;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

