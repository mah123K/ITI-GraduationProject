<template>
  <div>
    <div class="navbar bg-white shadow-md fixed top-0 left-0 z-50 w-full">
      <div class="navbar-start">
        <router-link to="/" class="flex items-center space-x-2">
          <img src="../images/site logo.png" alt="Logo" class="w-[180px] mt-3 ml-5" />
        </router-link>
      </div>

      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal text-black px-1 text-lg">
          <li>
            <router-link to="/" class="" active-class="font-semibold text-black">Home</router-link>
          </li>

          <li class="relative group">
            <a class="cursor-pointer">Services</a>
            <ul
              class="absolute hidden group-hover:block p-2 bg-white text-accent-color mt-10 rounded-xl"
            >
              <li>
                <router-link :to="{ name: 'ProfilesPage', params: { service: 'Plumbing' } }">
                  Plumbing
                </router-link>
              </li>
              <li>
                <router-link :to="{ name: 'ProfilesPage', params: { service: 'Electrical' } }">
                  Electrical
                </router-link>
              </li>
              <li>
                <router-link :to="{ name: 'ProfilesPage', params: { service: 'Finishing' } }">
                  Finishing
                </router-link>
              </li>

              <li>
                <router-link :to="{ name: 'ProfilesPage', params: { service: 'Carpentry' } }">
                  Carpentry
                </router-link>
              </li>
            </ul>
          </li>

          <li>
            <router-link to="/offers" class="" active-class="font-semibold text-black"
              >Offers</router-link
            >
          </li>
          <li>
            <router-link
              to="/about"
              active-class="font-semibold text-black"
              @click="isSidebarOpen = false"
              >About</router-link
            >
          </li>
          <li>
            <router-link
              to="/ContactUs"
              active-class="font-semibold text-black"
              @click="isSidebarOpen = false"
              >Contact Us</router-link
            >
          </li>
        </ul>
      </div>

      <div class="navbar-end space-x-3">
        <i class="fa-solid fa-globe cursor-pointer text-xl text-accent-color"></i>
        <button @click="toggleDarkMode" class="cursor-pointer">
          <i v-if="isDark" class="fa-solid fa-sun text-yellow-400 text-xl"></i>
          <i v-else class="fa-solid fa-moon text-accent-color text-xl"></i>
        </button>
        <router-link
          to="/SignUp"
          class="btn btn-white btn-sm rounded-[10px] bg-accent-color text-white"
          >Sign UP</router-link
        >
        <router-link
          to="/login"
          class="btn btn-outline btn-sm text-accent-color rounded-[10px] hover:bg-white"
        >
          Login
        </router-link>
        <button class="btn btn-ghost text-white lg:hidden" @click="isSidebarOpen = true">
          <i class="fa-solid fa-bars text-2xl"></i>
        </button>
      </div>
      <!-- Profile Dropdown -->
      <div class="hidden bg-white w-60 h-fit rounded-2xl fixed top-19 right-2 z-50">
        <div class="flex flex-col">
          <!-- Content for the dropdown can be added here -->
            <div class="border-2 w-20 h-20 mx-auto m-3 rounded-full border-accent-color">
              <img src="https://res.cloudinary.com/dlrgf0myy/image/upload/v1760769725/Screenshot_2025-10-08_002539_lkf3tb.png" alt="" class="w-19 h-19 rounded-full"/>
            </div>
        <div id="content" class="px-4 pb-4">
              <div class="border-b-2 border-gray-200 my-2 flex items-center space-x-2 p-2">
              <i class="fa-solid fa-user text-accent-color"></i>
              <router-link to="/ClientProfile"><h4 class="cursor-pointer text-accent-color">Mange your Profile</h4></router-link>
              </div>
              <div class="border-b-2 border-gray-200 my-2 flex items-center space-x-2 p-2">
              <i class="fa-solid fa-repeat text-accent-color"></i>
              <router-link to="/login"><h4 class="cursor-pointer text-accent-color">Switch Account</h4></router-link>
              </div>
              <div class="border-b-2 border-gray-200 my-2 flex items-center space-x-2 p-2">
              <i class="fa-solid fa-arrow-right-from-bracket text-accent-color"></i>
              <router-link to="/"><h4 class="cursor-pointer text-accent-color">Log out</h4></router-link>
              </div>
        </div>
        </div>
      </div>
      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 bg-black/50 z-40"
        @click="isSidebarOpen = false"
      ></div>

      <aside
        v-if="isSidebarOpen"
        class="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 p-6 flex flex-col space-y-4"
      >
        <button
          class="self-end text-black hover:text-red-500 hover:bg-white hover:rounded-2xl p-2 cursor-pointer text-2xl"
          @click="isSidebarOpen = false"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>

        <ul class="menu text-lg text-first-blue bg-white space-y-2">
          <li><router-link to="/" @click="isSidebarOpen = false">Home</router-link></li>
          <li>
            <details>
              <summary>Services</summary>
              <ul class="pl-4">
                <li><a>Plumbing</a></li>
                <li><a>Electrical</a></li>
                <li><a>Finishing</a></li>
                <li><a>Carpentry</a></li>
              </ul>
            </details>
          </li>
          <li><router-link to="/offers" @click="isSidebarOpen = false">Offers</router-link></li>
          <li><a>About</a></li>
          <li><a>Contact</a></li>
        </ul>
      </aside>
    </div>
  </div>
</template>
<script>
export default {
  name: "NavBar",

  data() {
    return {
      isSidebarOpen: false,

      isDark: false,
    };
  },
  methods: {
    openDropdown() {
      this.dropdownOpen = true;
    },
    closeDropdown() {
      this.dropdownOpen = false;
    },
  },
};
</script>

<style scoped>
nav {
  z-index: 50;
}
</style>
