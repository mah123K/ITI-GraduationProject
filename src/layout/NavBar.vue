<template >
  <div >
    <div class="navbar bg-white shadow-md fixed top-0 left-0 z-50 w-full">
      <!-- 🏠 Logo -->
      <div class="navbar-start">
        <router-link to="/" class="flex items-center space-x-2">
          <img src="../images/site logo.png" alt="Logo" class="w-[180px] mt-3 ml-5" />
        </router-link>
      </div>

      <!-- 🌐 Center Navigation -->
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal text-black px-1 text-lg">
          <li><router-link to="/" active-class="font-semibold text-black">Home</router-link></li>

          <li class="relative group">
            <a class="cursor-pointer">Services</a>
            <ul class="absolute hidden group-hover:block p-2 bg-white text-accent-color mt-10 rounded-xl">
              <li><router-link :to="{ name: 'ProfilesPage', params: { service: 'Plumbing' } }">Plumbing</router-link></li>
              <li><router-link :to="{ name: 'ProfilesPage', params: { service: 'Electrical' } }">Electrical</router-link></li>
              <li><router-link :to="{ name: 'ProfilesPage', params: { service: 'Finishing' } }">Finishing</router-link></li>
              <li><router-link :to="{ name: 'ProfilesPage', params: { service: 'Carpentry' } }">Carpentry</router-link></li>
            </ul>
          </li>

          <li><router-link to="/offers" active-class="font-semibold text-black">Offers</router-link></li>
          <li><router-link to="/about" active-class="font-semibold text-black">About</router-link></li>
          <li><router-link to="/ContactUs" active-class="font-semibold text-black">Contact Us</router-link></li>
        </ul>
      </div>
     
      <!-- 🌙 Right Side (User Area) -->
      <!-- 🌙 Right Side (User Area) -->
<div class="navbar-end space-x-3 min-w-[250px] flex justify-end items-center">
  <!-- 🌐 Dark Mode + Globe (always visible) -->
  <div class="flex items-center mr-4">
    <i class="fa-solid fa-globe cursor-pointer text-xl text-accent-color mr-3"></i>
    <button @click="toggleDarkMode" class="cursor-pointer">
      <i v-if="isDark" class="fa-solid fa-sun text-yellow-400 text-xl"></i>
      <i v-else class="fa-solid fa-moon text-accent-color text-xl"></i>
    </button>
  </div>

  <!-- 🔄 While user is loading -->
  <div v-if="loadingUser" class="flex items-center space-x-3 animate-pulse">
    <div class="h-5 w-20 bg-gray-200 rounded"></div>
    <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
  </div>

  <!-- 👤 Logged In -->
  <div v-else-if="user" class="relative flex items-center">
    <span class="font-medium text-black hidden sm:block mr-5">Hello, {{ firstName }}</span>

    <div
      ref="profileButton"
      class="w-10 h-10 rounded-full border border-[#daecf6] flex items-center justify-center bg-gray-100 cursor-pointer hover:bg-gray-200 transition"
      @click="toggleUserMenu"
    >
      <i class="bi bi-person text-gray-500 text-xl"></i>
    </div>

    <!-- 🔽 Profile Dropdown -->
    <transition name="fade-slide">
      <div
        v-if="isUserMenuOpen"
        ref="dropdown"
        class="absolute mt-2 top-15 right-0 bg-white w-60 h-fit rounded-2xl shadow-lg transition-all duration-300"
      >
        <div class="flex flex-col">
          <div
            class="w-15 h-15 rounded-full border border-[#daecf6] flex items-center justify-center mx-auto m-2 bg-gray-100 cursor-pointer hover:bg-gray-200 transition"
          >
            <i class="bi bi-person text-gray-500 text-xl"></i>
          </div>

                <div id="content" class="px-4 pb-4">
                  <div class="border-b-2 border-gray-200 my-2 flex items-center space-x-2 p-2">
                    <i class="fa-solid fa-user text-accent-color"></i>
                    <router-link to="/manageuserprofile" @click="closeMenu">
                      <h4 class="cursor-pointer text-accent-color">Manage your Profile</h4>
                    </router-link>
                  </div>

            <div
              class="border-b-2 border-gray-200 my-2 flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-100 rounded-md transition"
              @click="switchAccount"
            >
              <i class="fa-solid fa-repeat text-accent-color"></i>
              <h4 class="text-accent-color">Switch Account</h4>
            </div>

            <div
              @click="handleLogout"
              class="border-b-2 border-gray-200 my-2 flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-100 rounded-md transition"
            >
              <i class="fa-solid fa-arrow-right-from-bracket text-accent-color"></i>
              <h4 class="text-accent-color">Log out</h4>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>

        <!-- 🚫 Not Logged In -->
        <div v-else class="flex items-center space-x-3">
          <div class="flex items-center mr-4"> 
          <i class="fa-solid fa-globe cursor-pointer text-xl text-accent-color mr-3"></i> 
          <button @click="toggleDarkMode" class="cursor-pointer"> 
            <i v-if="isDark" class="fa-solid fa-sun text-yellow-400 text-xl"></i> 
            <i v-else class="fa-solid fa-moon text-accent-color text-xl"></i> 
          </button>
              </div>
          <router-link
            to="/SignUp"
            class="btn btn-white btn-sm rounded-[10px] bg-accent-color text-white"
          >
            Sign Up
          </router-link>
          <router-link
            to="/login"
            class="btn btn-outline btn-sm text-accent-color rounded-[10px] hover:bg-white"
          >
            Login
          </router-link>
        </div>
</div>



      <!-- 🕶️ Sidebar Overlay -->
      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 bg-black/50 z-40"
        @click="isSidebarOpen = false"
      ></div>

      <!-- 📱 Sidebar Content -->
      <aside
        v-if="isSidebarOpen"
        class="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 p-6 flex flex-col space-y-4"
      >
        <button
          class="self-end text-black hover:text-red-500 text-2xl"
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
                <li><router-link :to="{ name: 'ProfilesPage', params: { service: 'Plumbing' } }">Plumbing</router-link></li>
                <li><router-link :to="{ name: 'ProfilesPage', params: { service: 'Electrical' } }">Electrical</router-link></li>
                <li><router-link :to="{ name: 'ProfilesPage', params: { service: 'Finishing' } }">Finishing</router-link></li>
                <li><router-link :to="{ name: 'ProfilesPage', params: { service: 'Carpentry' } }">Carpentry</router-link></li>
              </ul>
            </details>
          </li>
          <li><router-link to="/offers" @click="isSidebarOpen = false">Offers</router-link></li>
          <li><router-link to="/about" @click="isSidebarOpen = false">About</router-link></li>
          <li><router-link to="/ContactUs" @click="isSidebarOpen = false">Contact</router-link></li>
        </ul>
      </aside>
    </div>
    </div>
  
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default {
  name: "NavBar",
  data() {
    return {
      isSidebarOpen: false,
      isUserMenuOpen: false,
      isDark: false,
      user: null,
      firstName: "",
      loadingUser: true,
    };
  },

  methods: {
    toggleUserMenu() {
      this.isUserMenuOpen = !this.isUserMenuOpen;
    },
    closeMenu() {
      this.isUserMenuOpen = false;
    },
    async handleLogout() {
      const auth = getAuth();
      await signOut(auth);
      this.user = null;
      this.firstName = "";
      this.isUserMenuOpen = false;
      this.$router.push("/login");
    },
    async switchAccount() {
      // Logout and go to login page to switch accounts
      const auth = getAuth();
      await signOut(auth);
      this.user = null;
      this.firstName = "";
      this.isUserMenuOpen = false;
      this.$router.push("/login");
    },
  },

  mounted() {
    const auth = getAuth();

    // 👤 Detect Auth State
    onAuthStateChanged(auth, async (currentUser) => {
      this.loadingUser = true;
      if (currentUser) {
        this.user = currentUser;

        const collections = ["clients", "technicians", "companies", "admin"];
        for (const c of collections) {
          const docRef = doc(db, c, currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const fullName = docSnap.data().name || "";
            this.firstName = fullName.split(" ")[0] || "";
            break;
          }
        }
      } else {
        this.user = null;
        this.firstName = "";
      }
      this.loadingUser = false;
    });

    // 🖱️ Close dropdown on outside click
    document.addEventListener("click", (e) => {
      const profileButton = this.$refs.profileButton;
      const dropdown = this.$refs.dropdown;
      if (
        this.isUserMenuOpen &&
        dropdown &&
        !dropdown.contains(e.target) &&
        !profileButton.contains(e.target)
      ) {
        this.isUserMenuOpen = false;
      }
    });
  },
};
</script>

<style scoped>
nav {
  z-index: 50;
}

/* ✨ Smooth Dropdown Animation */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
