<template>
  <div class="flex rounded-2xl overflow-hidden h-[50px] w-full max-w-[1200px] mb-0">
    <button
      v-for="tab in tabs"
      :key="tab"
      @click="$emit('tab-change', tab)"
      :class="[
        'flex-1  px-8 py-3 font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300',
        activeTab === tab
          ? 'bg-accent-color text-white'
          : 'bg-[#DAECF6] text-gray-700 ',
      ]"
    >
      <span v-if="tab === 'Client'"><i class="fa-solid fa-user"></i></span>
      <span v-else-if="tab === 'Technician'"><i class="fa-solid fa-screwdriver-wrench"></i></span>
      <span v-else><i class="fa-solid fa-building"></i></span>
      {{ tab }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Array,
      required: true
    },
    activeTab: {
      type: String,
      required: true
    }
  },
  emits: ['tab-change']
};
</script>