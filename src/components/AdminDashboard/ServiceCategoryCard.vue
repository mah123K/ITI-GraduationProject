<template>
  <div class="bg-white rounded-lg shadow-md p-5 flex flex-col items-center text-center relative">
    <!-- Status Badge -->
    <span :class="{'bg-green-100 text-green-700': category.status === 'Active'}"
          class="absolute top-4 right-4 text-xs font-semibold px-2 py-1 rounded-full">
      {{ category.status }}
    </span>

    <!-- Icon -->
    <div class="text-4xl mb-3 mt-6">
      {{ category.icon }} <!-- Using emoji as icon for simplicity -->
    </div>

    <!-- Category Name -->
    <h3 class="text-lg font-semibold text-gray-800 mb-1">{{ category.name }}</h3>

    <!-- Provider Count -->
    <p class="text-sm text-gray-500 mb-4">{{ category.providers }} providers</p>

    <!-- View Providers Button -->
    <button @click="$emit('view-providers', category.id)"
            class="flex items-center justify-center text-blue-600 hover:text-blue-800 font-medium py-2 px-4 rounded-md border border-blue-600 hover:border-blue-800 transition-colors duration-200">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      View Providers
    </button>
  </div>
</template>

<script>
export default {
  name: 'ServiceCategoryCard',
  props: {
    category: {
      type: Object,
      required: true,
      validator: (value) => {
        return ['id', 'name', 'providers', 'icon', 'status'].every(prop => Object.prototype.hasOwnProperty.call(value, prop));
      },
    },
  },
};
</script>

<style scoped>
/* No specific styles needed if relying on Tailwind for this component */
</style>