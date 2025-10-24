<script setup>
  defineOptions({ name: "ServiceCard" })

  const props = defineProps({
    service: {
      type: Object,
      required: true,
    },
  })
</script>
<template>
    <div class="serviceCard rounded-2xl shadow-lg text-center p-6 bg-[#f7f7f7] w-[30%] flex flex-col items-center my-5">
      <img
        :src="service.image"
        alt="service icon"
        class="w-[120px] h-[120px] object-contain"
      />
      <h2 class="font-semibold">{{ service.descreption }}</h2>
      <h2 class="font-bold text-accent-color">{{ service.price }}</h2>
      
  </div>
</template>


<style scoped>

</style>