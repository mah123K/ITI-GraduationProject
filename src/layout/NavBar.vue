<template>
  <div>
    <div class="navbar bg-white shadow-md fixed top-0 left-0 z-50 w-full">
      <!-- START -->
      <div class="navbar-start items-center gap-2">
       

        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2 rtl:space-x-reverse">
          <img src="../images/site logo.png" alt="Logo" class="w-[180px] mt-3  " />
        </router-link>
      </div>

      <!-- CENTER (desktop only) -->
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal text-black px-1 text-lg space-x-4 rtl:space-x-reverse">
          <li><router-link to="/" active-class="font-semibold text-black">{{ $t('navbar.home') }}</router-link></li>

          <li class="relative group">
            <a class="cursor-pointer flex items-center space-x-1 rtl:space-x-reverse hover:text-accent-color transition-colors duration-200">{{ $t('navbar.services') }}</a>
            <ul class="absolute hidden group-hover:block p-2 bg-white text-accent-color mt-10 rounded-xl">
              <li><router-link :to="{ name: 'ProfilesPage', params: { service: 'Plumbing' } }">{{ $t('navbar.plumbing') }}</router-link></li>
              <li><router-link :to="{ name: 'ProfilesPage', params: { service: 'Electrical' } }">{{ $t('navbar.electrical') }}</router-link></li>
              <li><router-link :to="{ name: 'ProfilesPage', params: { service: 'Finishing' } }">{{ $t('navbar.finishing') }}</router-link></li>
              <li><router-link :to="{ name: 'ProfilesPage', params: { service: 'Carpentry' } }">{{ $t('navbar.carpentry') }}</router-link></li>
            </ul>
          </li>

          <li><router-link to="/offers" active-class="font-semibold text-black">{{ $t('navbar.offers') }}</router-link></li>
          <li><router-link to="/about" active-class="font-semibold text-black">{{ $t('navbar.about') }}</router-link></li>
          <li><router-link to="/ContactUs" active-class="font-semibold text-black">{{ $t('navbar.contact') }}</router-link></li>
        </ul>
      </div>

      <!-- END -->
      <div class="navbar-end gap-x-3 min-w-[250px] flex justify-end items-center">
        <div class="flex items-center me-4 gap-x-3">
          <div class="relative" v-if="user">
            <button @click="toggleNotifications" class="relative cursor-pointer">
              <i class="fa-solid fa-bell text-xl text-accent-color"></i>
              <span
                v-if="unreadCount > 0"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center"
              >
                {{ unreadCount }}
              </span>
            </button>

            <transition name="fade-slide">
              <div
                v-if="showNotifications"
                class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
              >
                <div class="p-3 font-semibold text-[#133B5D] border-b">{{ $t('navbar.notifications') }}</div>
                <ul class="max-h-64 overflow-y-auto">
                  <li
                    v-for="n in notifications"
                    :key="n.id"
                    class="p-3 border-b last:border-none text-sm hover:bg-gray-50"
                  >
                    <p class="text-gray-800">{{ n.message }}</p>
                    <p class="text-xs text-gray-400 mt-1">
                      {{ n.timestamp?.toDate?.().toLocaleString?.() || "Just now" }}
                    </p>
                  </li>
                  <li v-if="!notifications.length" class="p-3 text-gray-400 text-center">
                    {{ $t('navbar.noNotifications') }}
                  </li>
                </ul>
              </div>
            </transition>
          </div>

          <router-link
            v-if="user"
            to="/my-orders"
            class="relative cursor-pointer"
            :title="$t('navbar.myOrdersTitle')"
          >
            <i class="text-accent-color fa-solid fa-cart-shopping"></i>
          </router-link>

          <button @click="toggleLanguage" class="cursor-pointer text-xl text-accent-color">
            <i class="fa-solid fa-globe"></i>
          </button>

          <button @click="toggleDarkMode" class="cursor-pointer">
            <i v-if="isDark" class="fa-solid fa-sun text-yellow-400 text-xl"></i>
            <i v-else class="fa-solid fa-moon text-accent-color text-xl"></i>
          </button>
        </div>

        <div v-if="loadingUser" class="flex items-center gap-x-3 animate-pulse">
          <div class="h-5 w-20 bg-gray-200 rounded"></div>
          <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
        </div>

        <div v-else-if="user" class="relative flex items-center">
          <span class="font-medium text-black hidden sm:block me-5">{{ $t('navbar.hello', { name: firstName }) }}</span>

          <div
              ref="profileButton"
              class="w-10 h-10 rounded-full border border-[#daecf6] flex items-center justify-center bg-gray-100 cursor-pointer hover:bg-gray-200 transition overflow-hidden"
              @click="toggleUserMenu"
            >
        <img
          v-if="userImage"
          :src="userImage"
          alt="User"
          class="w-full h-full object-cover"
          />
        <i v-else class="bi bi-person text-gray-500 text-xl"></i>
        </div>

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
                   <img
          v-if="userImage"
          :src="userImage"
          alt="User"
          class="w-full h-full object-cover  rounded-full"
          />
        <i v-else class="bi bi-person text-gray-500 text-xl"></i>
                </div>

                <div id="content" class="px-4 pb-4">
                  <div class="border-b-2 border-gray-200 my-2 flex items-center space-x-2 p-2">
                    <i class="fa-solid fa-user text-accent-color"></i>
                    <router-link to="/manageuserprofile" @click="closeMenu">
                      <h4 class="cursor-pointer text-accent-color">{{ $t('navbar.manageProfile') }}</h4>
                    </router-link>
                  </div>

                  <div
                    class="border-b-2 border-gray-200 my-2 flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-100 rounded-md transition"
                    @click="switchAccount"
                  >
                    <i class="fa-solid fa-repeat text-accent-color"></i>
                    <h4 class="text-accent-color">{{ $t('navbar.switchAccount') }}</h4>
                  </div>

                  <div
                    @click="handleLogout"
                    class="border-b-2 border-gray-200 my-2 flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-100 rounded-md transition"
                  >
                    <i class="fa-solid fa-arrow-right-from-bracket text-accent-color"></i>
                    <h4 class="text-accent-color">{{ $t('navbar.logout') }}</h4>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <div v-else class="flex items-center gap-x-3">
          <router-link
            to="/signup"
            class="btn btn-white btn-sm rounded-[10px] bg-accent-color text-white"
          >
            {{ $t('navbar.signup') }}
          </router-link>
          <router-link
            to="/login"
            class="btn btn-outline btn-sm text-accent-color rounded-[10px] hover:bg-white"
          >
            {{ $t('navbar.login') }}
          </router-link>
        </div>

        <!-- (Optional) second burger on the right for mobile comfort -->
        <button
          class="lg:hidden p-2 rounded-xl border border-gray-200 hover:bg-gray-100 focus:outline-none focus:ring ml-2"
          @click="isSidebarOpen = true"
          aria-label="Open menu"
        >
          <i class="fa-solid fa-bars text-xl text-accent-color"></i>
        </button>
      </div>

      <!-- Overlay -->
      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        @click="isSidebarOpen = false"
      ></div>

      <!-- Sidebar -->
      <transition name="slide-fade">
        <aside
          v-if="isSidebarOpen"
          class="fixed top-0 right-0 w-64 h-full bg-white/80 backdrop-blur-xl border-l border-[#daecf6] shadow-2xl z-50 p-6 flex flex-col space-y-4 rounded-l-2xl"
        >
          <button
            class="self-end text-[#133B5D] hover:text-red-500 text-2xl transition"
            @click="isSidebarOpen = false"
            aria-label="Close menu"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>

          <ul class="menu text-lg text-[#133B5D] font-medium space-y-3 mt-2">
            <li><router-link to="/" @click="isSidebarOpen = false" class="hover:text-[#5984C6] transition">{{ $t('navbar.home') }}</router-link></li>
            <li>
              <details>
                <summary class="cursor-pointer hover:text-[#5984C6] transition">{{ $t('navbar.services') }}</summary>
                <ul class="pl-4 mt-1 space-y-1 text-[#5984C6]">
                  <li><router-link :to="{ name: 'ProfilesPage', params: { service: 'Plumbing' } }" @click="isSidebarOpen = false">{{ $t('navbar.plumbing') }}</router-link></li>
                  <li><router-link :to="{ name: 'ProfilesPage', params: { service: 'Electrical' } }" @click="isSidebarOpen = false">{{ $t('navbar.electrical') }}</router-link></li>
                  <li><router-link :to="{ name: 'ProfilesPage', params: { service: 'Finishing' } }" @click="isSidebarOpen = false">{{ $t('navbar.finishing') }}</router-link></li>
                  <li><router-link :to="{ name: 'ProfilesPage', params: { service: 'Carpentry' } }" @click="isSidebarOpen = false">{{ $t('navbar.carpentry') }}</router-link></li>
                </ul>
              </details>
            </li>
            <li><router-link to="/offers" @click="isSidebarOpen = false" class="hover:text-[#5984C6] transition">{{ $t('navbar.offers') }}</router-link></li>
            <li><router-link to="/about" @click="isSidebarOpen = false" class="hover:text-[#5984C6] transition">{{ $t('navbar.about') }}</router-link></li>
            <li><router-link to="/ContactUs" @click="isSidebarOpen = false" class="hover:text-[#5984C6] transition">{{ $t('navbar.contact') }}</router-link></li>
          </ul>
        </aside>
      </transition>
    </div>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, collection, query, orderBy, onSnapshot, updateDoc } from "firebase/firestore";
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
      userImage: null,
      loadingUser: true,
      notifications: [],
      unreadCount: 0,
      showNotifications: false,
    };
  },

  watch: {
    isSidebarOpen(v) {
      document.documentElement.classList.toggle("sidebar-open", v);
    },
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
      const auth = getAuth();
      await signOut(auth);
      this.user = null;
      this.firstName = "";
      this.isUserMenuOpen = false;
      this.$router.push("/login");
    },
    toggleDarkMode() {
      this.isDark = !this.isDark;
      const root = document.documentElement;
      if (this.isDark) {
        root.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        root.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    },

    toggleLanguage() {
      const newLang = this.$i18n.locale === "en" ? "ar" : "en";
      this.$i18n.locale = newLang;
      document.documentElement.lang = newLang;
      document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
      localStorage.setItem("lang", newLang);
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
      if (this.showNotifications) {
        this.markNotificationsAsRead();
      }
    },
    async markNotificationsAsRead() {
      if (!this.user || !this.notifications.length) return;
      for (const n of this.notifications) {
        if (!n.isRead) {
          const ref = doc(db, "users", this.user.uid, "notifications", n.id);
          await updateDoc(ref, { isRead: true });
        }
      }
    },
  },

  mounted() {
    const savedTheme = localStorage.getItem("theme");
    const root = document.documentElement;
    if (savedTheme === "dark") {
      this.isDark = true;
      root.classList.add("dark");
    } else {
      this.isDark = false;
      root.classList.remove("dark");
    }


      window.addEventListener("userUpdated", (event) => {
        const updated = event.detail;
        if (updated.image) {
          this.userImage = updated.image;
          localStorage.setItem("userImage", updated.image);
        }
        if (updated.name) {
          this.firstName = updated.name.split(" ")[0];
          localStorage.setItem("userName", updated.name);
        }
      });

    // 2. Load saved language
    // const savedLang = localStorage.getItem('lang') || 'en';
    // this.$i18n.locale = savedLang;
    // document.documentElement.lang = savedLang;
    // document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
    const auth = getAuth();
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
            this.userImage = docSnap.data().image || null;
            break;
          }
        }

        const notifRef = collection(db, "users", currentUser.uid, "notifications");
        const q = query(notifRef, orderBy("timestamp", "desc"));
        onSnapshot(q, (snap) => {
          this.notifications = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          this.unreadCount = this.notifications.filter((n) => !n.isRead).length;
        });
      } else {
        this.user = null;
        this.firstName = "";
      }
      this.loadingUser = false;
    });

    document.addEventListener("click", (e) => {
      const profileButton = this.$refs.profileButton;
      const dropdown = this.$refs.dropdown;
      if (
        this.isUserMenuOpen &&
        dropdown &&
        !dropdown.contains(e.target) &&
        profileButton &&
        !profileButton.contains(e.target)
      ) {
        this.isUserMenuOpen = false;
      }
    });
  },
};
</script>

<style scoped>
/* Sidebar slide animation */
.slide-fade-enter-active {
  transition: all 0.4s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from {
  transform: translateX(100%);
  opacity: 0.3;
}
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

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

[dir="rtl"] aside {
  right: auto;
  left: 0;
}

/* Prevent background scroll */
:root.sidebar-open {
  overflow: hidden;
}
</style>
