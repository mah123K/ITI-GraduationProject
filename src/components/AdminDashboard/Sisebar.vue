<template>
  <div class="min-h-screen flex bg-gray-100">
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
      <header class="flex justify-end items-center bg-white shadow-sm p-4 space-x-4 relative">
          <div
    @click.stop="toggleUserMenu"
    class="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-[#5984C6] transition-all duration-300 cursor-pointer overflow-hidden"
  >
    <img v-if="userPhoto" :src="userPhoto" alt="profile" class="w-full h-full object-cover" />
    <i v-else class="bi bi-person text-2xl text-gray-700 hover:text-white"></i>
  </div>


        <!-- 🔽 Profile Dropdown -->
        <transition name="fade-slide">
          <div
            v-if="isUserMenuOpen"
            ref="dropdown"
            class="absolute top-16 right-4 rtl:right-210 rtl:top-20 bg-white w-60 rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
          >
            <div class="flex flex-col items-center py-4 border-b border-gray-200">
              <div
                class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300 overflow-hidden"
              >
                <img v-if="userPhoto" :src="userPhoto" alt="profile" class="w-full h-full object-cover" />
                <i v-else class="bi bi-person text-2xl text-gray-500"></i>
              </div>
              <h3 class="text-gray-800 font-medium mt-2">{{ userName || 'Admin' }}</h3>
              <p class="text-gray-500 text-sm">{{ userEmail }}</p>

            </div>

            <div class="flex flex-col py-2 ">
            <div @click="goToProfile" class="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition cursor-pointer">
  <i class="fa-solid fa-user-gear text-[#5984C6]"></i>
  <span>Profile Settings</span>
</div>


              <div
                @click="switchAccount"
                class="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition cursor-pointer"
              >
                <i class="fa-solid fa-repeat text-[#5984C6]"></i>
                <span>Switch Account</span>
              </div>

              <div
                @click="handleLogout"
                class="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition cursor-pointer"
              >
                <i class="fa-solid fa-arrow-right-from-bracket text-[#5984C6]"></i>
                <span>Logout</span>
              </div>
            </div>
          </div>
        </transition>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-8">
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
  const userEmail = ref('') // ✅ ده اللي هنستخدمه في عرض الإيميل الحقيقي
  const userName = ref('')
  const userPhoto = ref('')

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
                 
                console.error('Failed to load admin profile', err)
              }
            })()
          }
        } else {
          userEmail.value = ''
        }
      })

      // listen to storage changes (in case AdminProfile updates localStorage)
      window.addEventListener('storage', (e) => {
        if (e.key === 'adminName') userName.value = e.newValue || ''
        if (e.key === 'adminPhoto') userPhoto.value = e.newValue || ''
      })

      document.addEventListener('click', handleClickOutside)
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
      userEmail, // ✅ لازم نرجّعه عشان نستخدمه في الـ template
      userName,
      userPhoto,
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
