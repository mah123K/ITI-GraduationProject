<script setup>
const props = defineProps({
  service: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(["order"])
</script>
<template>
  <div
    class="serviceCard rounded-2xl shadow-lg text-center p-6 bg-white flex flex-col items-center justify-between hover:shadow-xl transition-shadow"
  >
    <div class="serviceImg mb-4">
      <img
        :src="service.image"
        :alt="service.descreption"
        class="w-28 h-28 md:w-32 md:h-32 object-contain"
      />
    </div>

    <h2 class="font-semibold text-gray-700">{{ service.descreption }}</h2>
    <h2 class="font-bold text-accent-color text-lg md:text-xl">
      {{ service.price }}
    </h2>

    <button
      @click="emit('order', service)"
      class="w-full bg-accent-color text-white px-4 py-2 mt-auto rounded-lg font-semibold hover:bg-[#4a74b3] transition cursor-pointer"
    >
      Order Now
    </button>
  </div>
</template>


<style scoped>

</style>