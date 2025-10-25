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
      
  
       <!-- logout button
      <button
      @click="handleLogout"
      class="text-sm text-red-500 hover:text-red-700 font-medium"
    >
      Logout
    </button>
  -->
      
    <div class="navbar-end space-x-3">
    
     <div v-if="user" class="relative flex items-center space-x-6">

       <span class="font-medium text-black">Hello, {{ firstName }}</span>
  <div
    class="w-10 h-10 rounded-full border border-[#daecf6] flex items-center justify-center bg-gray-100 cursor-pointer hover:bg-gray-200 transition"
    @click="toggleUserMenu"
  >
    <i class="bi bi-person text-gray-500 text-xl"></i>

   
  </div>




         

     
     
        </div>

        
        <div v-else class="flex items-center space-x-3">
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

        <!-- Sidebar for mobile -->
        <button class="btn btn-ghost text-gray-700 lg:hidden" @click="isSidebarOpen = true">
          <i class="fa-solid fa-bars text-2xl"></i>
        </button>
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
                <li><a>Plumbing</a></li>
                <li><a>Electrical</a></li>
                <li><a>Finishing</a></li>
                <li><a>Carpentry</a></li>
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
    async handleLogout() {
      const auth = getAuth();
      await signOut(auth);
      this.user = null;
      this.firstName = "";
      this.isUserMenuOpen = false;
      this.$router.push("/login");
    },
    toggleDarkMode() {
      this.isDark = !this.isDark;
    },
  },

  mounted() {
    const auth = getAuth();

    onAuthStateChanged(auth, async (currentUser) => {
      this.loadingUser = true;
      if (currentUser) {
        this.user = currentUser;

        // ✅ نحاول نجيب بيانات المستخدم من أي كولكشن
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
  },
};
</script>

<style scoped>
nav {
  z-index: 50;
}
</style>
