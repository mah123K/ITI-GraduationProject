<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 bg-[#0000008a] flex items-center justify-center z-50"
      @click.self="close"
    >
      <div
        class="bg-white rounded-2xl shadow-xl w-11/12 md:w-96 p-6 relative border border-white/20"
      >
        <h3 class="text-xl font-semibold mb-4 text-[#5984C6]">Notification</h3>
        <p class="text-gray-700 mb-6">{{ message }}</p>
        <div class="flex justify-end">
          <button
            @click="close"
            class="bg-[#5984c6] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#002153] transition duration-300"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  message: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>