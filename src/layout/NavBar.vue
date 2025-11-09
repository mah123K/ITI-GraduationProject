<template>
  <div>
    <div
      class="navbar fixed top-0 left-0 z-50 w-full shadow-md transition-colors duration-300"
      :style="{
        backgroundColor: 'var(--nav-bg)',
        color: 'var(--nav-text)',
        borderColor: 'var(--nav-border)',
      }"
    >
      <!-- START -->
      <div class="navbar-start items-center gap-2">
        <router-link to="/" class="flex items-center space-x-2 rtl:space-x-reverse">
          <img :src="logoSrc" alt="Logo" class="w-[180px] mt-3" />
        </router-link>
      </div>

      <!-- CENTER (desktop only) -->
      <div class="navbar-center hidden lg:flex">
        <ul
          class="menu menu-horizontal px-1 text-lg space-x-4 rtl:space-x-reverse transition-colors"
          :style="{ color: 'var(--nav-text)' }"
        >
          <li>
            <router-link to="/" active-class="font-semibold" class="hover:text-(--nav-hover)">
              {{ $t('navbar.home') }}
            </router-link>
          </li>

          <li class="relative group">
            <a class="cursor-pointer flex items-center space-x-1 rtl:space-x-reverse transition-colors duration-200 hover:text-(--nav-hover)">
              {{ $t('navbar.services') }}
            </a>
            <ul
              class="absolute hidden group-hover:block p-2 mt-10 rounded-xl border shadow-md"
              :style="{
                backgroundColor: 'var(--bg)',
                borderColor: 'var(--nav-border)',
                color: 'var(--nav-text)',
              }"
            >
              <li><router-link :to="{ name: 'ProfilesPage', params: { service: 'Plumbing' } }" class="hover:text-(--nav-hover)">{{ $t('navbar.plumbing') }}</router-link></li>
              <li><router-link :to="{ name: 'ProfilesPage', params: { service: 'Electrical' } }" class="hover:text-(--nav-hover)">{{ $t('navbar.electrical') }}</router-link></li>
              <li><router-link :to="{ name: 'ProfilesPage', params: { service: 'Finishing' } }" class="hover:text-(--nav-hover)">{{ $t('navbar.finishing') }}</router-link></li>
              <li><router-link :to="{ name: 'ProfilesPage', params: { service: 'Carpentry' } }" class="hover:text-(--nav-hover)">{{ $t('navbar.carpentry') }}</router-link></li>
            </ul>
          </li>

          <li><router-link to="/offers" active-class="font-semibold" class="hover:text-(--nav-hover)">{{ $t('navbar.offers') }}</router-link></li>
          <li><router-link to="/about" active-class="font-semibold" class="hover:text-(--nav-hover)">{{ $t('navbar.about') }}</router-link></li>
          <li><router-link to="/ContactUs" active-class="font-semibold" class="hover:text-(--nav-hover)">{{ $t('navbar.contact') }}</router-link></li>
        </ul>
      </div>

      <!-- END -->
      <div class="navbar-end gap-x-3 min-w-[250px] flex justify-end items-center">
        <div class="flex items-center me-4 gap-x-3">
          <!-- Notifications -->
          <div class="relative" v-if="user">
            <button @click="toggleNotifications" class="relative cursor-pointer">
              <i class="fa-solid fa-bell text-xl" :style="{ color: 'var(--accent)' }"></i>
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
                class="absolute right-0 mt-2 w-80 rounded-lg shadow-xl border z-50"
                :style="{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }"
              >
                <div class="p-3 font-semibold border-b" :style="{ borderColor: 'var(--border)' }">
                  {{ $t('navbar.notifications') }}
                </div>
                <ul class="max-h-64 overflow-y-auto">
                  <li
                    v-for="n in notifications"
                    :key="n.id"
                    class="p-3 border-b last:border-none text-sm hover:bg-(--secondary-blue) transition"
                    :style="{ borderColor: 'var(--border)' }"
                  >
                    <p class="text-muted">{{ n.message }}</p>
                    <p class="text-xs text-gray-400 mt-1">
                      {{ n.timestamp?.toDate?.().toLocaleString?.() || 'Just now' }}
                    </p>
                  </li>
                  <li v-if="!notifications.length" class="p-3 text-gray-400 text-center">
                    {{ $t('navbar.noNotifications') }}
                  </li>
                </ul>
              </div>
            </transition>
          </div>

          <button @click="toggleLanguage" class="cursor-pointer text-xl text-accent-color">
            <i class="fa-solid fa-globe "></i>
          </button>

          <!-- Dark Mode -->
          <button @click="toggleDarkMode" class="cursor-pointer" :title="isDark ? 'Light mode' : 'Dark mode'">
            <i v-if="isDark" class="fa-solid fa-sun text-yellow-400 text-xl"></i>
            <i v-else class="fa-solid fa-moon text-xl" :style="{ color: 'var(--accent)' }"></i>
          </button>
        </div>

        <!-- Loading User -->
        <div v-if="loadingUser" class="flex items-center gap-x-3 animate-pulse">
          <div class="h-5 w-20 bg-gray-200 rounded"></div>
          <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
        </div>

        <!-- User Menu -->
        <div v-else-if="user" class="relative flex items-center">
          <span class="font-medium text-black dark:text-white hidden sm:block me-5">{{ $t('navbar.hello', { name: firstName }) }}</span>

          <div
            ref="profileButton"
            class="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 cursor-pointer transition overflow-hidden border"
            :style="{ borderColor: 'var(--nav-border)' }"
            @click="toggleUserMenu"
          >
            <img v-if="userImage" :src="userImage" alt="User" class="w-full h-full object-cover" />
            <i v-else class="bi bi-person text-gray-500 text-xl"></i>
          </div>

          <transition name="fade-slide">
            <div
              v-if="isUserMenuOpen"
              ref="dropdown"
              class="absolute mt-2 top-15 right-0 rounded-2xl shadow-lg border w-60 bg-white dark:bg-(--surface) transition-all duration-300"
              :style="{ borderColor: 'var(--nav-border)' }"
            >
              <div class="flex flex-col">
                <div class="w-15 h-15 rounded-full mx-auto m-2 border flex items-center justify-center bg-gray-100">
                  <img v-if="userImage" :src="userImage" alt="User" class="w-full h-full object-cover rounded-full" />
                  <i v-else class="bi bi-person text-gray-500 text-xl"></i>
                </div>

                <div id="content" class="px-4 pb-4">
                  <div
                    class="border-b-2 my-2 flex items-center space-x-2 p-2 cursor-pointer hover:bg-(--secondary-blue) rounded-md transition" :style="{ borderColor: 'var(--border)' }"
                  >
                    <router-link
                      v-if="user"
                      to="/my-orders"
                      class="relative cursor-pointer"  :style="{ color: 'var(--accent)' }"
                      :title="$t('navbar.myOrdersTitle')"
                    >
                    <i class="fa-solid fa-cart-shopping " :style="{ color: 'var(--accent)' }"></i>
                    {{ $t('navbar.myOrdersTitle') }}
                    </router-link>
                  </div>
                  <div class="border-b-2 my-2 flex items-center space-x-2 p-2 cursor-pointer hover:bg-(--secondary-blue) rounded-md transition" :style="{ borderColor: 'var(--border)' }">
                    <i class="fa-solid fa-user" :style="{ color: 'var(--accent)' }"></i>
                    <router-link to="/manageuserprofile" @click="closeMenu">
                      <h4 class="cursor-pointer" :style="{ color: 'var(--accent)' }">{{ $t('navbar.manageProfile') }}</h4>
                    </router-link>
                  </div>

                  <div class="border-b-2 my-2 flex items-center space-x-2 p-2 cursor-pointer hover:bg-(--secondary-blue) rounded-md transition"
                       @click="switchAccount" :style="{ borderColor: 'var(--border)' }">
                    <i class="fa-solid fa-repeat" :style="{ color: 'var(--accent)' }"></i>
                    <h4 :style="{ color: 'var(--accent)' }">{{ $t('navbar.switchAccount') }}</h4>
                  </div>

                  <div @click="handleLogout"
                       class="border-b-2 my-2 flex items-center space-x-2 p-2 cursor-pointer hover:bg-(--secondary-blue) rounded-md transition"
                       :style="{ borderColor: 'var(--border)' }">
                    <i class="fa-solid fa-arrow-right-from-bracket" :style="{ color: 'var(--accent)' }"></i>
                    <h4 :style="{ color: 'var(--accent)' }">{{ $t('navbar.logout') }}</h4>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <!-- Login/Signup -->
        <div v-else class="hidden lg:flex items-center gap-x-3">
          <router-link
            to="/signup"
            class="btn btn-sm rounded-[10px] text-white border-none transition"
            :style="{ backgroundColor: 'var(--accent)' }"
          >
            {{ $t('navbar.signup') }}
          </router-link>
          <router-link
            to="/login"
            class="btn btn-outline btn-sm rounded-[10px] border-2 transition"
            :style="{ color: 'var(--accent)', borderColor: 'var(--accent)' }"
          >
            {{ $t('navbar.login') }}
          </router-link>
        </div>

        <!-- Burger -->
        <button
          class="lg:hidden p-2 rounded-xl border hover:bg-(--secondary-blue) transition ml-2"
          @click="isSidebarOpen = true"
          :style="{ borderColor: 'var(--nav-border)' }"
        >
          <i class="fa-solid fa-bars text-xl" :style="{ color: 'var(--accent)' }"></i>
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
          class="fixed top-0 right-0 w-64 h-full shadow-2xl z-50 p-6 flex flex-col space-y-4 rounded-l-2xl"
          :style="{ backgroundColor: 'var(--bg)', borderColor: 'var(--nav-border)' }"
        >
          <button
            class="self-end text-2xl transition hover:text-red-500"
            @click="isSidebarOpen = false"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>

          <ul class="menu text-lg font-medium space-y-3 mt-2">
            <li><router-link to="/" @click="isSidebarOpen = false" class="hover:text-(--nav-hover) transition">{{ $t('navbar.home') }}</router-link></li>
            <li>
              <details>
                <summary class="cursor-pointer hover:text-(--nav-hover) transition">{{ $t('navbar.services') }}</summary>
                <ul class="pl-4 mt-1 space-y-1 text-(--accent)">
                  <li><router-link :to="{ name: 'ProfilesPage', params: { service: 'Plumbing' } }" @click="isSidebarOpen = false">{{ $t('navbar.plumbing') }}</router-link></li>
                  <li><router-link :to="{ name: 'ProfilesPage', params: { service: 'Electrical' } }" @click="isSidebarOpen = false">{{ $t('navbar.electrical') }}</router-link></li>
                  <li><router-link :to="{ name: 'ProfilesPage', params: { service: 'Finishing' } }" @click="isSidebarOpen = false">{{ $t('navbar.finishing') }}</router-link></li>
                  <li><router-link :to="{ name: 'ProfilesPage', params: { service: 'Carpentry' } }" @click="isSidebarOpen = false">{{ $t('navbar.carpentry') }}</router-link></li>
                </ul>
              </details>
            </li>
            <li><router-link to="/offers" @click="isSidebarOpen = false" class="hover:text-(--nav-hover) transition">{{ $t('navbar.offers') }}</router-link></li>
            <li><router-link to="/about" @click="isSidebarOpen = false" class="hover:text-(--nav-hover) transition">{{ $t('navbar.about') }}</router-link></li>
            <li><router-link to="/ContactUs" @click="isSidebarOpen = false" class="hover:text-(--nav-hover) transition">{{ $t('navbar.contact') }}</router-link></li>
          </ul>

          <!-- Sidebar Login/Signup -->
          <div v-if="!user" class="flex flex-col items-center gap-3 mt-6">
            <router-link
              to="/signup"
              @click="isSidebarOpen = false"
              class="btn w-full rounded-[10px] text-white transition"
              :style="{ backgroundColor: 'var(--accent)' }"
            >
              {{ $t('navbar.signup') }}
            </router-link>
            <router-link
              to="/login"
              @click="isSidebarOpen = false"
              class="btn btn-outline w-full rounded-[10px] transition"
              :style="{ color: 'var(--accent)', borderColor: 'var(--accent)' }"
            >
              {{ $t('navbar.login') }}
            </router-link>
          </div>
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
      isDark: false, // reactive theme flag
      user: null,
      firstName: "",
      userImage: null,
      loadingUser: true,
      notifications: [],
      unreadCount: 0,
      showNotifications: false,
      mql: null, // media query listener reference
      lightLogo: new URL('../images/site logo.png', import.meta.url).href,
      darkLogo: new URL('../images/white logo.png', import.meta.url).href,

    };
  },
  computed: {
    logoSrc() {
      return this.isDark ? this.darkLogo : this.lightLogo;
    },
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

    applyTheme(theme) {
      // theme: 'dark' or 'light'
      const root = document.documentElement;
      if (theme === 'dark') {
        root.setAttribute('data-theme', 'dark'); // recommended data-attribute approach
        root.classList.add('dark'); // keep compatibility with Tailwind setups that rely on .dark
        this.isDark = true;
      } else {
        root.removeAttribute('data-theme');
        root.classList.remove('dark');
        this.isDark = false;
      }
    },

    toggleDarkMode() {
      // Toggle and persist
      const next = this.isDark ? 'light' : 'dark';
      this.applyTheme(next);
      try {
        localStorage.setItem('theme', next);
      } catch (e) {
        // ignore
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
    // THEME: initialize from saved choice or system preference
    try {
      const saved = localStorage.getItem('theme'); // 'light' | 'dark' | null
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (saved === 'dark' || (!saved && prefersDark)) {
        this.applyTheme('dark');
      } else {
        this.applyTheme('light');
      }

      // Listen to system changes only if user hasn't manually selected a theme
      if (window.matchMedia) {
        this.mql = window.matchMedia('(prefers-color-scheme: dark)');
        this.mqlListener = (e) => {
          try {
            const savedNow = localStorage.getItem('theme');
            if (!savedNow) {
              this.applyTheme(e.matches ? 'dark' : 'light');
            }
          } catch (err) {}
        };
        if (this.mql.addEventListener) {
          this.mql.addEventListener('change', this.mqlListener);
        } else if (this.mql.addListener) {
          this.mql.addListener(this.mqlListener);
        }
      }
    } catch (e) {
      // ignore localStorage errors
    }

    // existing user updated event listener
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

    // Auth listener + notifications (unchanged)
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

    // close dropdowns if click outside
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

  beforeUnmount() {
    // cleanup matchMedia listener
    if (this.mql) {
      try {
        if (this.mql.removeEventListener) {
          this.mql.removeEventListener('change', this.mqlListener);
        } else if (this.mql.removeListener) {
          this.mql.removeListener(this.mqlListener);
        }
      } catch (e) {}
    }
  },
  onUnmounted() {
    window.removeEventListener('userUpdated');
  }
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

/* 🎯 روابط النافبار */
.navbar .menu a {
  color: var(--nav-text);
  background: transparent !important;
  transition: color 0.25s ease;
}

/* hover */
.navbar .menu a:hover {
  color: var(--nav-hover-color);
  background-color: var(--nav-hover-bg) !important;
}

/* active */
.navbar .menu .router-link-exact-active {
  color: var(--nav-active-color);
  font-weight: 600;
}

/* 🔹 الاتجاه الافتراضي (الإنجليزي): من اليمين لليسار */
.slide-fade-enter-from {
  transform: translateX(100%);
  opacity: 0.3;
}
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* 🔹 في اللغة العربية (dir='rtl'): نعكس الاتجاه — من الشمال لليمين */
[dir="rtl"] .slide-fade-enter-from {
  transform: translateX(-100%) !important;
  opacity: 0.3;
}
[dir="rtl"] .slide-fade-leave-to {
  transform: translateX(-100%) !important;
  opacity: 0;
}

/* باقي الحركات */
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
.logo-light { display: inline-block; }
.logo-dark  { display: none; }

/* الوضع الحالي للـ aside */
[dir="rtl"] aside {
  right: auto;
  left: 0;
}

/* Prevent background scroll */
:root.sidebar-open {
  overflow: hidden;
}
</style>