<template>
 <div class="flex bg-gray-100 dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 h-screen">

    <!-- Sidebar -->
    <aside class="w-64 bg-[#344767] text-white flex flex-col p-5 justify-between">
      <div>
        <div class="flex flex-col items-center mb-6">
          <img
            src="https://res.cloudinary.com/dlrgf0myy/image/upload/v1760784552/image__11_-removebg-preview_ev3uvd.png"
            alt="Logo"
            class="h-16 mb-3"
          />
          <h2 class="text-lg font-semibold tracking-wide">Tashtibaty Admin</h2>
          <div class="w-full h-px bg-gray-400 mt-5"></div>
        </div>

        <nav class="flex flex-col space-y-3">
          <router-link
            to="/dashboard"
            class="flex items-center space-x-2 p-2 rounded-md transition-colors duration-200"
            :class="{ 'bg-[#5984C6]': $route.path === '/dashboard' }"
          >
            <i class="bi bi-house"></i><span>Dashboard</span>
          </router-link>

          <router-link
            to="/dashboard/users"
            class="flex items-center space-x-2 p-2 rounded-md transition-colors duration-200"
            :class="{ 'bg-[#5984C6]': $route.path === '/dashboard/users' }"
          >
            <i class="bi bi-people"></i><span>Users</span>
          </router-link>

          <router-link
            to="/dashboard/services"
            class="flex items-center space-x-2 p-2 rounded-md transition-colors duration-200"
            :class="{ 'bg-[#5984C6]': $route.path === '/dashboard/services' }"
          >
            <i class="bi bi-briefcase"></i><span>Services</span>
          </router-link>

          <router-link
            to="/dashboard/providers"
            class="flex items-center space-x-2 p-2 rounded-md transition-colors duration-200"
            :class="{ 'bg-[#5984C6]': $route.path === '/dashboard/providers' }"
          >
            <i class="bi bi-building"></i><span>Providers</span>
          </router-link>

          <router-link
            to="/dashboard/orders"
            class="flex items-center space-x-2 p-2 rounded-md transition-colors duration-200"
            :class="{ 'bg-[#5984C6]': $route.path === '/dashboard/orders' }"
          >
            <i class="bi bi-receipt"></i><span>Orders</span>
          </router-link>

          <router-link
            to="/dashboard/payments"
            class="flex items-center space-x-2 p-2 rounded-md transition-colors duration-200"
            :class="{ 'bg-[#5984C6]': $route.path === '/dashboard/payments' }"
          >
            <i class="bi bi-credit-card"></i><span>Payments</span>
          </router-link>

          <router-link
            to="/dashboard/support"
            class="flex items-center space-x-2 p-2 rounded-md transition-colors duration-200"
            :class="{ 'bg-[#5984C6]': $route.path === '/dashboard/support' }"
          >
            <i class="bi bi-question-circle"></i><span>Support</span>
          </router-link>

          <!-- <router-link
            to="/dashboard/settings"
            class="flex items-center space-x-2 p-2 rounded-md transition-colors duration-200"
            :class="{ 'bg-[#5984C6]': $route.path === '/dashboard/settings' }"
          >
            <i class="bi bi-gear"></i><span>Settings</span>
          </router-link> -->

          
          <router-link
            to="/dashboard/addoffer"
            class="flex items-center space-x-2 p-2 rounded-md transition-colors duration-200"
            :class="{ 'bg-[#5984C6]': $route.path === '/dashboard/addoffer' }"
          >
              <i class="bi bi-tags"></i><span>Offers</span>
          </router-link>
        </nav>
      </div>

      <!-- Logout Button -->
    <div class="flex justify-center mb-4">
    <button
      @click="handleLogout"
      class="flex items-center justify-center space-x-1 text-white font-medium text-sm py-1 px-3 rounded-xl transition-all duration-500 border border-white hover:bg-white hover:text-[#133B5D]"
    >
      <i class="bi bi-box-arrow-right text-lg"></i>
      <span>Logout</span>
    </button>
  </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <header class="flex justify-end items-center bg-white dark:bg-[#111827] shadow-sm p-4 space-x-4 relative">
        <button 
          @click="toggleDarkMode"
          class="group relative h-9 w-9 rounded-full border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-[#5984C6] dark:hover:border-[#5984C6] transition-colors duration-200"
          :title="isDark ? 'Light mode' : 'Dark mode'"
        >
          <i class="fa-solid fa-sun absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-600 transition-all duration-500 rotate-0 scale-100 dark:rotate-90 dark:scale-0 group-hover:text-[#5984C6] dark:group-hover:text-yellow-300"></i>
          <i class="fa-solid fa-moon absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-100 transition-all duration-500 -rotate-90 scale-0 dark:rotate-0 dark:scale-100 group-hover:text-[#5984C6] dark:group-hover:text-white"></i>
          <span class="sr-only">Toggle theme</span>
        </button>

        <div
          @click.stop="toggleUserMenu"
          class="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-[#5984C6] transition-all duration-300 cursor-pointer overflow-hidden"
        >
          <img 
            v-if="userPhoto && userPhoto !== 'null' && !userPhoto.startsWith('undefined')" 
            :src="userPhoto" 
            alt="profile" 
            class="w-full h-full object-cover"
            @error="handleImageError" 
          />
          <i v-else class="bi bi-person text-2xl text-gray-700 hover:text-white"></i>
        </div>


        <!-- 🔽 Profile Dropdown -->
        <transition name="fade-slide">
          <div
            v-if="isUserMenuOpen"
            ref="dropdown"
            class="absolute top-16 right-4 bg-white dark:bg-[#1f2937] w-60 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50"
          >
            <div class="flex flex-col items-center py-4 border-b border-gray-200">
              <div
                class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-300 dark:border-gray-600 overflow-hidden"
              >
                <img 
                  v-if="userPhoto && userPhoto !== 'null' && !userPhoto.startsWith('undefined')" 
                  :src="userPhoto" 
                  alt="profile" 
                  class="w-full h-full object-cover"
                  @error="handleImageError" 
                />
                <i v-else class="bi bi-person text-2xl text-gray-500"></i>
              </div>
              <h3 class="text-gray-800 dark:text-gray-100 font-medium mt-2">{{ userName || 'Admin' }}</h3>
              <p class="text-gray-500 dark:text-gray-300 text-sm">{{ userEmail }}</p>

            </div>

            <div class="flex flex-col py-2">
            <div @click="goToProfile" class="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer">
  <i class="fa-solid fa-user-gear text-[#5984C6]"></i>
  <span>Profile Settings</span>
</div>


              <div
                @click="switchAccount"
                class="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
              >
                <i class="fa-solid fa-repeat text-[#5984C6]"></i>
                <span>Switch Account</span>
              </div>

              <div
                @click="handleLogout"
                class="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
              >
                <i class="fa-solid fa-arrow-right-from-bracket text-[#5984C6]"></i>
                <span>Logout</span>
              </div>
            </div>
          </div>
        </transition>
      </header>

      <!-- Page Content -->
    <main class="flex-1 p-8 overflow-y-auto bg-gray-50 dark:bg-[#0b1220]">

        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase/firebase'

export default {
  setup() {
    const router = useRouter()
    const email = ref('')
    const password = ref('')
    const isUserMenuOpen = ref(false)
    const dropdown = ref(null)
    const userEmail = ref('')
    const userName = ref('')
    const userPhoto = ref('')
    const isDark = ref(false)

    const auth = getAuth()

    // ✅ نجيب المستخدم الحالي لو موجود
    onMounted(() => {
      const currentUser = auth.currentUser
      if (currentUser) {
        userEmail.value = currentUser.email
        // try to load cached name/photo from localStorage
        userName.value = localStorage.getItem('adminName') || currentUser.displayName || ''
        userPhoto.value = localStorage.getItem('adminPhoto') || currentUser.photoURL || ''
      }

      // ✅ نتابع التغييرات في تسجيل الدخول (مثلاً بعد تسجيل الدخول مباشرة)
      onAuthStateChanged(auth, (user) => {
        if (user) {
          userEmail.value = user.email
          // refresh name/photo from Firestore if not in localStorage
          const cachedName = localStorage.getItem('adminName')
          const cachedPhoto = localStorage.getItem('adminPhoto')
          if (cachedName) userName.value = cachedName
          if (cachedPhoto) userPhoto.value = cachedPhoto
          if (!cachedName || !cachedPhoto) {
            // fetch from Firestore admin doc
            (async () => {
              try {
                const ref = doc(db, 'admin', user.uid)
                const snap = await getDoc(ref)
                if (snap.exists()) {
                  const data = snap.data()
                  if (data.name) {
                    userName.value = data.name
                    localStorage.setItem('adminName', data.name)
                  }
                  if (data.photoURL) {
                    userPhoto.value = data.photoURL
                    localStorage.setItem('adminPhoto', data.photoURL)
                  }
                }
              } catch (err) {
                // eslint-disable-next-line no-console
                console.error('Failed to load admin profile', err)
              }
            })()
          }
        } else {
          userEmail.value = ''
        }
      })

      // Listen for admin profile changes
      window.addEventListener('adminProfileChanged', (e) => {
        console.log('Received adminProfileChanged event:', e.detail);
        
        // Handle name updates
        if (e.detail.name) {
          userName.value = e.detail.name;
          localStorage.setItem('adminName', e.detail.name);
        }
        
        // Handle photo updates (including null)
        if (e.detail.hasOwnProperty('photoURL')) {
          if (e.detail.photoURL === null) {
            // Clear photo
            userPhoto.value = null;
            localStorage.removeItem('adminPhoto');
            
            // Force update all profile images
            document.querySelectorAll('img[alt="profile"]').forEach(img => {
              img.style.display = 'none';
            });
          } else if (e.detail.photoURL) {
            userPhoto.value = e.detail.photoURL;
            localStorage.setItem('adminPhoto', e.detail.photoURL);
            
            // Show images if they were hidden
            document.querySelectorAll('img[alt="profile"]').forEach(img => {
              img.style.display = '';
            });
          }
        }
        
        // Force immediate UI update if requested
        if (e.detail.forceUpdate) {
          // Force Vue to re-render the profile elements
          userPhoto.value = e.detail.photoURL;
        }
      });

      // listen to storage changes (in case AdminProfile updates localStorage)
      window.addEventListener('storage', (e) => {
        if (e.key === 'adminName') userName.value = e.newValue || ''
        if (e.key === 'adminPhoto') userPhoto.value = e.newValue || ''
      })

      document.addEventListener('click', handleClickOutside)

      // Initialize theme on dashboard mount from saved choice or system
      try {
        const saved = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const target = saved ? saved : (prefersDark ? 'dark' : 'light');
        applyTheme(target);
      } catch (e) {}
    })

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    // Toggle User Menu
    const toggleUserMenu = () => {
      isUserMenuOpen.value = !isUserMenuOpen.value
    }

    //  Close Menu
    const closeMenu = () => {
      isUserMenuOpen.value = false
    }

    //  Detect click outside to close menu
    const handleClickOutside = (event) => {
      if (dropdown.value && !dropdown.value.contains(event.target)) {
        isUserMenuOpen.value = false
      }
    }

    //  Go to Profile
    const goToProfile = () => {
      router.push('/dashboard/adminprofile')
      isUserMenuOpen.value = false
    }

    // Switch Account
    const switchAccount = async () => {
      await handleLogout()
      router.push('/login')
    }

    //  Logout Function
    const handleLogout = async () => {
      try {
        await signOut(auth)
        router.push('/login')
      } catch (error) {
        console.error('Logout error:', error)
        alert(' Failed to log out. Please try again.')
      }
    }

    // 
    const handleSignIn = async () => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
        const user = userCredential.user

        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          const role = userDoc.data().role
          if (role === 'admin') {
            router.push('/dashboard')
          } else {
            router.push('/home')
          }
        } else {
          alert('⚠️ User not found in database.')
        }
      } catch (error) {
        console.error('Login error:', error)
        alert('❌ Login failed. Please check your credentials.')
      }
    }

    // Handle image load errors
    const handleImageError = (event) => {
      console.log('Image load error in sidebar');
      userPhoto.value = null;
      localStorage.removeItem('adminPhoto');
      event.target.style.display = 'none';
      
      // Show default icon
      const parentDiv = event.target.parentElement;
      if (parentDiv) {
        const icon = parentDiv.querySelector('i.bi-person');
        if (icon) {
          icon.style.display = 'block';
        }
      }
    }

    const applyTheme = (theme) => {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.setAttribute('data-theme', 'dark');
        root.classList.add('dark');
        isDark.value = true;
      } else {
        root.removeAttribute('data-theme');
        root.classList.remove('dark');
        isDark.value = false;
      }
    }

    const toggleDarkMode = () => {
      const next = isDark.value ? 'light' : 'dark';
      applyTheme(next);
      try {
        localStorage.setItem('theme', next);
      } catch (e) {
        // ignore
      }
    }

    // Validate photo URL
    const validatePhotoURL = (url) => {
      return url && url !== 'null' && !url.startsWith('undefined');
    }

    // Update photo with validation
    const updateUserPhoto = (newPhotoURL) => {
      console.log('Updating user photo:', newPhotoURL);
      if (validatePhotoURL(newPhotoURL)) {
        userPhoto.value = newPhotoURL;
        localStorage.setItem('adminPhoto', newPhotoURL);
        
        // Show all profile images
        document.querySelectorAll('img[alt="profile"]').forEach(img => {
          img.style.display = '';
        });
      } else {
        userPhoto.value = null;
        localStorage.removeItem('adminPhoto');
        
        // Hide all profile images and show icons
        document.querySelectorAll('img[alt="profile"]').forEach(img => {
          img.style.display = 'none';
          const parentDiv = img.parentElement;
          if (parentDiv) {
            const icon = parentDiv.querySelector('i.bi-person');
            if (icon) {
              icon.style.display = 'block';
            }
          }
        });
      }
    }

    // Update initial photo URL with validation
    onMounted(() => {
      const storedPhoto = localStorage.getItem('adminPhoto');
      if (validatePhotoURL(storedPhoto)) {
        userPhoto.value = storedPhoto;
      } else {
        userPhoto.value = null;
        localStorage.removeItem('adminPhoto');
      }
    });

    return {
      email,
      password,
      handleSignIn,
      handleLogout,
      switchAccount,
      toggleUserMenu,
      closeMenu,
      isUserMenuOpen,
      dropdown,
      goToProfile,
      userEmail,
      userName,
      userPhoto,
      handleImageError,
      isDark,
      toggleDarkMode
    }
  },
}
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
