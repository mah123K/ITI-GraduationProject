<script setup>
const emit = defineEmits(["createService"])

const handleCreate = () => {
  emit("createService")
}
</script>
<template>
  <div
    @click="handleCreate"
    class="createServiceCard rounded-2xl shadow-lg text-center p-6 bg-[#e6eef6] dark:bg-[#16222B] h-full hover:bg-[#d3e1f0] w-full flex flex-col items-center justify-around  mx-2 cursor-pointer transition transform hover:scale-[1.03]"
  >
    <img
      src="/images/create service.png"
      alt="Create service icon"
      class="w-[120px] h-[120px] object-contain mb-3"
    />
    <p class="text-center font-semibold text-2xl text-[#133B5D] dark:text-white">
      Create New Service
    </p>
  </div>
</template>
<style scoped>
.createServiceCard {
  border: 2px dashed #5984c6;
}
</style>