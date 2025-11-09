<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
      <h2 class="text-3xl font-bold text-[#5984C6] mb-2">Reset Password</h2>
      <p class="text-gray-600 mb-6">
       Enter your email to get a reset link.
      </p>

      <div v-if="message" :class="`mb-4 text-sm font-medium ${messageColor}`">
        {{ message }}
      </div>

      <form @submit.prevent="handleReset">
        <input
          type="email"
          v-model="email"
          placeholder="Enter your email"
          required
          class="w-full border border-gray-300 rounded-lg px-3 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#5984C6]"
        />

        <button
          type="submit"
          class="w-full bg-[#5984C6] text-white py-3 rounded-lg font-semibold hover:bg-[#4a73b1] transition duration-200"
          :disabled="loading"
        >
          <span v-if="!loading">Send Reset Link</span>
          <span v-else><i class="fa fa-spinner fa-spin"></i> Sending...</span>
        </button>
      </form>

      <router-link
        to="/login"
        class="block mt-6 text-[#5984C6] hover:text-blue-500 font-medium"
      >
        Back to Login
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const email = ref("");
const message = ref("");
const messageColor = ref("");
const loading = ref(false);

const handleReset = async () => {
  if (!email.value.trim()) return;

  try {
    loading.value = true;
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email.value);
    message.value = "Password reset link sent! Check your inbox.";
    messageColor.value = "text-green-600";
  } catch (error) {
    console.error(error);
    if (error.code === "auth/user-not-found") {
      message.value = "No account found with this email.";
    } else {
      message.value = "Failed to send reset email.";
    }
    messageColor.value = "text-red-600";
  } finally {
    loading.value = false;
  }
};
</script>
