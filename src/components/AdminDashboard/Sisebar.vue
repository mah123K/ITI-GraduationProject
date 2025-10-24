<template>
  <div class="min-h-screen flex bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-[#344767] text-white flex flex-col p-5">
      <div class="flex flex-col items-center mb-6">
        <img
          src="https://res.cloudinary.com/dlrgf0myy/image/upload/v1760784552/image__11_-removebg-preview_ev3uvd.png"
          alt="Logo"
          class="h-16 mb-3"
        />
        <h2 class="text-lg font-semibold tracking-wide">Tashtibaty Admin</h2>
        <div class="w-full h-px bg-gray-400 mt-3"></div>
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
        <router-link
          to="/dashboard/settings"
          class="flex items-center space-x-2 p-2 rounded-md transition-colors duration-200"
          :class="{ 'bg-[#5984C6]': $route.path === '/dashboard/settings' }"
        >
          <i class="bi bi-gear"></i><span>Settings</span>
        </router-link>
      </nav>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col">
      
      <!-- Header -->
      <header class="flex justify-end items-center bg-white shadow-sm p-4 space-x-4">
        <i class="bi bi-person text-xl text-gray-700 cursor-pointer hover:text-[#5984C6]"></i>
        <i class="bi bi-bell text-xl text-gray-700 cursor-pointer hover:text-[#5984C6]"></i>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-8">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from "../../firebase/firebase";

const router = useRouter();
const email = ref('');
const password = ref('');

const handleSignIn = async () => {
  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;

    // Fetch user data from Firestore to check role
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const role = userDoc.data().role;
      if (role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/home"); // Redirect non-admin users to a different page
      }
    } else {
      alert("⚠️ User not found in database.");
    }
  } catch (error: any) {
    console.error("Login error:", error);
    if (error.code === "auth/user-not-found") {
      alert("❌ No user found with this email.");
    } else if (error.code === "auth/wrong-password") {
      alert("❌ Incorrect password.");
    } else {
      alert("❌ Login failed: " + error.message);
    }
  }
};
</script>