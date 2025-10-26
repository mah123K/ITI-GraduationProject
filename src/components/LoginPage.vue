<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
  />

  <div class="min-h-screen flex flex-col lg:flex-row bg-white mt-2">
    <!-- Left Section -->
    <div
      class="relative lg:w-1/2 w-full flex items-center justify-center overflow-hidden min-h-[45vh] md:min-h-[50vh] lg:min-h-screen"
    >
      <div
        class="absolute left-[10%] md:left-[15%] lg:left-[20%] top-5 md:top-8 lg:top-10 bottom-5 md:bottom-8 lg:bottom-20 w-[80%] md:w-[75%] lg:w-[70%] bg-[#5984C6] rounded-l-3xl"
      ></div>

      <img
        src="https://res.cloudinary.com/dhmzl1tb0/image/upload/v1760978847/worker.png_siviza.png"
        alt="Worker"
        class="absolute bottom-5 md:bottom-8 lg:bottom-20 left-[20px] md:left-[50px] lg:left-[70px] h-[40vh] md:h-[45vh] lg:h-[80vh] object-contain z-10"
      />
      <div
        class="absolute text-white text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] z-20 left-1/2 top-[30%] md:top-[28%] lg:top-[30%] transform -translate-y-1/2"
      >
        Your home,<br />our care
      </div>
    </div>

    <!-- Right Section -->
    <div
      class="w-full lg:w-1/2 xl:w-1/3 flex flex-col justify-center lg:justify-start p-6 md:p-8 lg:p-8 lg:mt-10"
    >
      <div class="w-full max-w-md mx-auto">
        <h2 class="text-2xl md:text-3xl font-semibold text-black mb-6">
          Welcome back to<br />
          <span class="text-[#5984C6]">T</span>ashteebaty
        </h2>

        <!-- Error Message -->
        <div
          v-if="errorMessage"
          class="text-center text-red-600 py-2 px-3 mb-5 font-medium"
        >
          {{ errorMessage }}
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSignIn" class="space-y-5">
          <!-- Email -->
          <div class="mb-6 lg:mb-8">
            <label for="email" class="block text-sm font-medium text-black mb-2"
              >Email</label
            >
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <i class="fas fa-envelope text-gray-400"></i>
              </div>
              <input
                type="email"
                id="email"
                v-model="email"
                placeholder="Enter your email"
                required
                class="block w-full pl-10 pr-3 py-3 border border-[#5984C6] rounded-lg shadow-sm placeholder-gray-400 
                      focus:outline-none focus:ring-2 focus:ring-[#3d68b1] focus:border-[#3d68b1] transition duration-200"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-black mb-2">
              Password
            </label>

            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <i class="fas fa-lock text-gray-400"></i>
              </div>

              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                placeholder="Enter your password"
                required
                class="block w-full pl-10 pr-10 py-3 border border-[#5984C6] rounded-lg shadow-sm placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-[#3d68b1] focus:border-[#3d68b1] transition duration-200"
              />
            </div>
          </div>

          <!-- Forgot password -->
          <div class="flex justify-end mb-4 lg:mb-6">
            <button
              type="button"
              @click="showForgotModal = true"
              class="text-sm text-[#5984C6] hover:text-blue-500"
            >
              Forgot password?
            </button>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            class="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-[#5984C6] hover:bg-[#4a73b1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5984C6]"
          >
            Sign In
          </button>
        </form>

        <p class="mt-6 text-center text-gray-600 text-sm">
          Don't have an account?
          <router-link
            to="/signup"
            class="ml-1 font-medium text-[#5984C6] hover:text-blue-500"
            >Sign up</router-link
          >
        </p>

        <!-- Forgot Password Modal -->
       <!-- Forgot Password Modal -->
<transition name="fade">
  <div
    v-if="showForgotModal"
    class="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 transition-all duration-300"
    @click.self="showForgotModal = false"
  >
    <div
      class="bg-white rounded-2xl p-6 w-96 shadow-2xl transform transition-all duration-300 scale-100 hover:scale-105"
    >
      <h3 class="text-xl font-semibold mb-4 text-center text-[#5984C6]">
        Reset Password
      </h3>

      <input
        type="email"
        v-model="forgotEmail"
        placeholder="Enter your email"
        class="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#5984C6]"
      />

      <div class="flex justify-end space-x-2">
        <button
          @click="showForgotModal = false"
          class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          :disabled="isSending"
        >
          Cancel
        </button>
        <button
          @click="handleForgotPasswordModal"
          class="px-4 py-2 rounded-lg bg-[#5984C6] text-white hover:bg-[#4a73b1] flex items-center justify-center min-w-[90px]"
          :disabled="isSending"
        >
          <span v-if="!isSending">Send</span>
          <span v-else><i class="fa fa-spinner fa-spin"></i> Sending...</span>
        </button>
      </div>
    </div>
  </div>
</transition>


        <!-- Toast -->
        <div
          v-if="showToast"
          :class="[toastColor, 'fixed top-5 right-5 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300']"
        >
          {{ toastMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const router = useRouter();
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const showForgotModal = ref(false);
const forgotEmail = ref("");
const showPassword = ref(false);
const isSending = ref(false);
const toastMessage = ref("");
const toastColor = ref("bg-green-500");
const showToast = ref(false);

// show toast function
const showToastMessage = (message, type) => {
  toastMessage.value = message;
  toastColor.value = type === "success" ? "bg-green-500" : "bg-red-500";
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 5000);
};

// handle sign in
const handleSignIn = async () => {
  errorMessage.value = "";

  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    const user = userCredential.user;

    const collections = [
      { name: "admin", route: "/dashboard" },
      { name: "clients", route: "/" },
      { name: "technicians", route: "/TechncionDashboard" },
      { name: "companies", route: "/TechncionDashboard" },
    ];

    let found = false;

    for (const c of collections) {
      const docRef = doc(db, c.name, user.uid);
      const userDoc = await getDoc(docRef);

      if (userDoc.exists()) {
        found = true;
        router.push(c.route);
        break;
      }
    }

    if (!found) {
      errorMessage.value = "User not found in database.";
    }
  } catch (error) {
    console.error("Login error:", error);
    if (error.code === "auth/user-not-found") {
      errorMessage.value = "No user found with this email.";
    } else if (error.code === "auth/wrong-password") {
      errorMessage.value = "Incorrect password.";
    } else {
      errorMessage.value = "Login failed. Please check your credentials.";
    }
  }
};

// handle forgot password
const handleForgotPasswordModal = async () => {
  if (!forgotEmail.value.trim()) {
    showToastMessage("Please enter your email.", "error");
    return;
  }

  try {
    isSending.value = true;
    const auth = getAuth();
    await sendPasswordResetEmail(auth, forgotEmail.value);
    showToastMessage("Password reset email sent! Check your inbox.", "success");
    showForgotModal.value = false;
    forgotEmail.value = "";
  } catch (error) {
    console.error(error);
    if (error.code === "auth/user-not-found") {
      showToastMessage("No account found with this email.", "error");
    } else {
      showToastMessage("Failed to send reset email.", "error");
    }
  } finally {
    isSending.value = false;
  }
};
</script>

<style scoped></style>
