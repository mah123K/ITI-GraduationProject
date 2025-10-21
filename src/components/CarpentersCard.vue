<template>
  <div>
    <div
      v-if="viewType === 'grid'"
      class="relative group bg-linear-to-b from-[#f5f5f5] to-gray-300 w-full h-100 rounded-2xl overflow-hidden  shadow-xl transition-all duration-200"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <img
        src="../images/carpenter.png"
        alt="Profile photo"
        class="absolute w-full h-[70%] object-contain"
      />

      <svg
        class="absolute bottom-0 left-0 w-full z-10 transition-all duration-500"
        viewBox="0 0 1440 350"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          class="transition-all duration-500"
          :class="{
            'fill-[#0099FF]': isHovered,
            'fill-white': !isHovered,
          }"
          d="
          M0,200
          C240,220,480,180,720,200
          C960,220,1200,180,1440,200
          V350H0Z
        "
        />
      </svg>

      <div
        class="h-15 w-15 rounded-full absolute z-20 top-1/2 right-10 border border-white flex items-center justify-center transition-all duration-500"
        :class="isHovered ? 'bg-[#0B161B]' : 'bg-[#5984C6]'"
      >
        <img src="../images/carpenterIcon.png" alt="" class="transition-all duration-500 p-2">
      </div>

      <div
        class="absolute bottom-0 w-full px-4 py-3 z-20 flex flex-col items-center text-center text-[#0B161B]"
      >
        <h2
          class="text-2xl font-bold transition-colors duration-500"
          :class="isHovered ? 'text-white' : 'text-[#0B161B]'"
        >
          {{ profile.name }}
        </h2>

        <div class="text-m pt-4" :class="isHovered ? 'text-[#0B161B]' : 'text-[#0369F0]'">
          Orders Completed  +45
        </div>

        <div class="flex items-center gap-1">
          <span class="text-sm font-bold" :class="isHovered ? 'text-white' : 'text-[#0B161B]'">
            {{ profile.rating }}
          </span>
          <i class="fa-solid fa-star text-[#FF9529]"></i>
        </div>
        <div class="flex flex-row items-center gap-10">
          <button
            class="mt-4 text-white text-sm font-medium px-5 py-2 rounded-lg shadow transition-all duration-500"
            :class="isHovered ? 'bg-[#0B161B]' : 'bg-[#5984C6]'"
          >
            <router-link to="/technichionProfile">View Profile</router-link>
          </button>

          <div class="flex items-center gap-1 mt-2">
            <i
              class="fa-solid fa-location-dot"
              :class="isHovered ? 'text-white' : 'text-[#0B161B]'"
            ></i>
            <span class="text-sm" :class="isHovered ? 'text-white' : 'text-[#0B161B]'">
              {{ profile.location }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- List View -->
    <div
      v-else
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      class="flex flex-col sm:flex-row items-start bg-white rounded-2xl overflow-hidden border border-[#0B161B] shadow-xl p-4 gap-4 sm:gap-6 hover:shadow-2xl transition-shadow duration-200"
    >
      <img
        src="../images/lamp-big-3.jpg"
        alt="Profile photo"
        class="w-full sm:w-32 sm:h-32 md:w-50 md:h-50 object-cover rounded-xl"
      />
      <div class="flex flex-col flex-1 mt-4 sm:mt-0">
        <div>
          <h2 class="text-lg md:text-xl font-bold text-[#0B161B]">{{ profile.name }}</h2>
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <span class="font-medium text-[#0369F0]">{{ profile.service }}</span>
          </div>
        </div>
        <p class="text-sm md:text-base text-gray-700 mt-2">
          {{ profile.bio }}
        </p>

        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 md:mt-20 gap-4"
        >
          <div class="flex items-center gap-6 text-sm text-[#0B161B]">
            <div class="flex items-center gap-1">
              <i class="fa-solid fa-star text-[#FF9529]"></i>
              <span class="font-bold">{{ profile.rating }}</span>
            </div>
            <div class="flex items-center gap-1">
              <i class="fa-solid fa-location-dot text-[#0369F0]"></i>
              <span>{{ profile.location }}</span>
            </div>
          </div>
          <button
            class="w-full sm:w-auto mx-auto sm:mx-0 text-white text-sm font-medium px-5 py-2 rounded-lg transition duration-300 bg-[#0369F0] hover:bg-[#0B161B]"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CarpentersCard",
  data() {
    return {
      isHovered: false,
    };
  },
  props: {
    profile: Object,
    viewType: {
      type: String,
      default: "grid",
    },
  },
};
</script>

<style scoped>
svg {
  height: 100%;
}
</style>
