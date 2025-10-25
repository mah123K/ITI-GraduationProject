<script setup>
import { ref, reactive } from "vue";

defineOptions({ name: "MyAppointments" });

const days = reactive([
  { name: "Monday", selected: false, from: "9:00 AM", to: "5:00 PM" },
  { name: "Tuesday", selected: false, from: "9:00 AM", to: "5:00 PM" },
  { name: "Wednesday", selected: false, from: "9:00 AM", to: "5:00 PM" },
  { name: "Thursday", selected: false, from: "9:00 AM", to: "5:00 PM" },
  { name: "Friday", selected: false, from: "9:00 AM", to: "5:00 PM" },
  { name: "Saturday", selected: false, from: "9:00 AM", to: "5:00 PM" },
  { name: "Sunday", selected: false, from: "9:00 AM", to: "5:00 PM" },
]);

const isSaved = ref(false);

const times = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
  "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"
];

const handleSave = () => {
  isSaved.value = !isSaved.value;
};
</script>

<template>
  <div class="h-[80%] ml-10 mt-6">
    <h2 class="text-3xl font-semibold text-[#133B5D] mb-6">My Appointments</h2>

    <div
      class="flex ml-11 text-2xl mb-2 font-semibold text-[#133B5D] justify-between w-[70%]"
      v-if="!isSaved"
    >
      <p class="w-[30%]">Days:</p>
      <p class="w-[30%] text-center">From:</p>
      <p class="w-[30%] text-center">To:</p>
    </div>

    <ul>
      <li
        v-for="(day, i) in days"
        :key="i"
        :class="[
          'flex items-center justify-between rounded-xl h-[60px] shadow-md my-3 px-4 transition-all',
          day.selected
            ? 'bg-[#00ff5e4b] border-l-4 border-green-400'
            : 'bg-gray-100 opacity-70'
        ]"
      >
        <!-- Edit Mode -->
        <template v-if="!isSaved">
          <div class="flex items-center w-[30%]">
            <div class="relative">
              <input
                type="checkbox"
                v-model="day.selected"
                class="appearance-none w-6 h-6 border-2 border-[#133B5D] rounded-md cursor-pointer"
              />
              <svg
                v-if="day.selected"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="black"
                class="w-4 h-4 absolute top-[3px] left-[3px] pointer-events-none"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <span class="text-2xl ml-3 text-[#133B5D]">{{ day.name }}</span>
          </div>

          <select
            v-model="day.from"
            :disabled="!day.selected"
            class="text-xl rounded-lg border-2 px-2 w-[30%] border-[#133B5D] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <option v-for="t in times" :key="t">{{ t }}</option>
          </select>

          <select
            v-model="day.to"
            :disabled="!day.selected"
            class="text-xl rounded-lg border-2 px-2 w-[30%] border-[#133B5D] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <option v-for="t in times" :key="t">{{ t }}</option>
          </select>
        </template>

        <!-- View Mode -->
        <template v-else>
          <div class="flex items-center justify-between w-full px-4">
            <p class="text-2xl font-semibold text-[#133B5D] w-[30%]">{{ day.name }}</p>
            <p class="text-xl w-[30%] text-center">
              <span v-if="day.selected" class="text-gray-700">{{ day.from }}</span>
              <span v-else class="text-gray-400">—</span>
            </p>
            <p class="text-xl w-[30%] text-center">
              <span v-if="day.selected" class="text-gray-700">{{ day.to }}</span>
              <span v-else class="text-gray-400">—</span>
            </p>
          </div>
        </template>
      </li>
    </ul>

    <!-- Save / Edit Button -->
    <div class="mt-6">
      <button
        @click="handleSave"
        class="px-6 py-2 rounded-xl text-white font-semibold transition-all duration-200"
        :class="isSaved ? 'bg-[#1b5383] hover:bg-[#133B5D]' : 'bg-green-600 hover:bg-green-700'"
      >
        {{ isSaved ? "Edit" : "Save" }}
      </button>
    </div>
  </div>
</template>
