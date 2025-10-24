<script setup>
  import { defineProps, defineEmits } from "vue"

  const props = defineProps({
    active: { type: String, default: "orders" } 
  })

  const emit = defineEmits(["changeTab"])

  const handleTabClick = (tabName) => {
    emit("changeTab", tabName)
  }
</script>

<template>
  <div class="navigationAside w-[20%] h-screen bg-[#133B5D] flex flex-col items-center text-white fixed">
    <div class="navContents p-3 flex justify-between">
      <img src="../images/white logo.png" class="w-[200px]" alt="Logo">
    </div>

    <div class="profileImgContainer flex flex-col items-center mb-2">
      <img src="../images/Ellipse 56.png" class="w-[90px]" alt="Technician photo">
      <p class="text-lg">Adel Morad</p>
    </div>

    <p class="text-2xl font-semibold">My Earnings:</p>
    <p class="text-2xl mb-4">4530 EGP</p>

    <div class="navList text-center">
      <ul class="flex flex-col items-center justify-between h-[350px] m-5">
        <li
          class="text-lg font-semibold p-1 rounded-xl my-1 w-[180px] cursor-pointer transition-colors"
          :class="['requests', 'upcoming', 'completed', 'orders'].includes(props.active) 
            ? 'bg-[#1b5383]' : 'bg-[#133B5D]'" 
          @click="handleTabClick('orders')"
        >
          Orders
        </li>
        <li class="text-lg font-semibold bg-[#133B5D] p-1 rounded-xl my-1 w-[180px]">Appoientments</li>
        <li
          class="text-lg font-semibold p-1 rounded-xl my-1 w-[180px] cursor-pointer"
          :class="props.active === 'services' ? 'bg-[#1b5383]' : 'bg-[#133B5D]'"
          @click="handleTabClick('services')"
        >
          My Services
        </li>

        <li class="text-lg font-semibold bg-[#133B5D] p-1 rounded-xl my-1 w-[180px]">My Earnings</li>
        <li class="text-lg font-semibold bg-[#133B5D] p-1 rounded-xl my-1 w-[180px]">Settings</li>
        <button class="border rounded-xl px-3 mt-4">Log Out</button>
      </ul>
    </div>
  </div>
</template>
