<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
  />

  <div class="min-h-screen flex flex-col lg:flex-row bg-white mt-2 rtl:lg:flex-row-reverse">
    <div
      class="relative lg:w-1/2 w-full flex items-center justify-center overflow-hidden min-h-[45vh] md:min-h-[50vh] lg:min-h-screen"
    >
      <div
        class="absolute left-[10%] md:left-[15%] lg:left-[20%] top-5 md:top-8 lg:top-10 bottom-5 md:bottom-8 lg:bottom-20 w-[80%] md:w-[75%] lg:w-[70%] bg-[#5984C6] rounded-l-3xl rtl:rounded-l-none rtl:rounded-r-3xl rtl:left-auto rtl:right-[10%] md:rtl:right-[15%] lg:rtl:right-[20%]"
      ></div>

      <img
        src="https://res.cloudinary.com/dhmzl1tb0/image/upload/v1760978847/worker.png_siviza.png"
        alt="Worker"
        class="absolute bottom-5 md:bottom-8 lg:bottom-20 left-[20px] md:left-[50px] lg:left-[70px] h-[40vh] md:h-[45vh] lg:h-[80vh] object-contain z-10 rtl:left-auto rtl:right-[20px] md:rtl:right-[50px] lg:rtl:right-[70px]"
      />
      <div
        class="absolute text-white text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] z-20 left-1/2 top-[30%] md:top-[28%] lg:top-[30%] transform -translate-y-1/2 rtl:left-auto rtl:right-1/2 rtl:translate-x-1/2 rtl:text-right"
        v-html="$t('loginPage.heroTitle')"
      >
      </div>
    </div>

    <div
      class="w-full lg:w-1/2 xl:w-1/3 flex flex-col justify-center lg:justify-start p-6 md:p-8 lg:p-8 lg:mt-10"
    >
      <div class="w-full max-w-md mx-auto">
        <h2 class="text-2xl md:text-3xl font-semibold text-black mb-6 rtl:text-right" v_html="$t('loginPage.welcome')">
        </h2>

        <div
          v-if="errorMessage"
          class="text-center text-red-600 py-2 px-3 mb-5 font-medium"
        >
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleSignIn" class="space-y-5">
          <div class="mb-6 lg:mb-8 text-left rtl:text-right">
            <label for="email" class="block text-sm font-medium text-black mb-2"
              >{{ $t('loginPage.emailLabel') }}</label
            >
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none rtl:left-auto rtl:right-0 rtl:pl-0 rtl:pr-3"
              >
                <i class="fas fa-envelope text-gray-400"></i>
              </div>
              <input
                type="email"
                id="email"
                v-model="email"
                :placeholder="$t('loginPage.emailPlaceholder')"
                required
                class="block w-full pl-10 pr-3 py-3 border border-[#5984C6] rounded-lg shadow-sm placeholder-gray-400 
                      focus:outline-none focus:ring-2 focus:ring-[#3d68b1] focus:border-[#3d68b1] transition duration-200
                      rtl:pl-3 rtl:pr-10 rtl:text-right"
              />
            </div>
          </div>

          <div class="text-left rtl:text-right">
            <label for="password" class="block text-sm font-medium text-black mb-2">
              {{ $t('loginPage.passwordLabel') }}
            </label>

            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none rtl:left-auto rtl:right-0 rtl:pl-0 rtl:pr-3"
              >
                <i class="fas fa-lock text-gray-400"></i>
              </div>

              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                :placeholder="$t('loginPage.passwordPlaceholder')"
                required
                class="block w-full pl-10 pr-10 py-3 border border-[#5984C6] rounded-lg shadow-sm placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-[#3d68b1] focus:border-[#3d68b1] transition duration-200
                       rtl:pl-10 rtl:pr-10 rtl:text-right"
              />
            </div>
          </div>

          <div class="flex justify-end rtl:justify-start mb-4 lg:mb-6">
           <router-link
              to="/forgot-password"
              class="text-sm text-[#5984C6] hover:text-blue-500"
            >
              {{ $t('loginPage.forgotPassword') }}
            </router-link>
          </div>

          <button
            type="submit"
            class="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-[#5984C6] hover:bg-[#4a73b1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5984C6]"
          >
            {{ $t('loginPage.signInButton') }}
          </button>
        </form>
        
        <div class="flex items-center my-6">
          <hr class="flex-grow border-gray-300" />
          <span class="mx-3 text-gray-400 text-sm">{{ $t('loginPage.divider') }}</span>
          <hr class="flex-grow border-gray-300" />
        </div>

        <button
          @click="handleGoogleSignIn"
          type="button"
          class="w-full flex items-center justify-center border border-gray-300 rounded-lg py-3 hover:bg-gray-100 transition duration-200"
        >
          <img
            src="https://res.cloudinary.com/dhmzl1tb0/image/upload/v1761736435/search_1_kmka0a.png"
            alt="Google"
            class="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2"
          />
          <span class="text-gray-700 font-medium">{{ $t('loginPage.googleButton') }}</span>
        </button>

        <p class="mt-6 text-center text-gray-600 text-sm">
          {{ $t('loginPage.promptSignup') }}
          <router-link
            to="/signup"
            class="ml-1 rtl:ml-0 rtl:mr-1 font-medium text-[#5984C6] hover:text-blue-500"
            >{{ $t('loginPage.signupLink') }}</router-link
          >
        </p>
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
  GoogleAuthProvider, signInWithPopup 
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useI18n } from "vue-i18n"; // 1. IMPORT useI18n

const { t } = useI18n(); // 2. INITIALIZE the 't' function
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
      { name: "technicians", route: "/technician-dashboard" },
      { name: "companies", route: "/technician-dashboard" },
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
      // 3. USE 't' function for errors
      errorMessage.value = t('loginPage.errors.notFoundDB');
    }
  } catch (error) {
    console.error("Login error:", error);
    if (error.code === "auth/user-not-found") {
      errorMessage.value = t('loginPage.errors.notFoundEmail');
    } else if (error.code === "auth/wrong-password") {
      errorMessage.value = t('loginPage.errors.wrongPassword');
    } else {
      errorMessage.value = t('loginPage.errors.generic');
    }
  }
};

// handle forgot password
const handleForgotPasswordModal = async () => {
  if (!forgotEmail.value.trim()) {
    // 3. USE 't' function for toasts
    showToastMessage(t('loginPage.errors.reset.enterEmail'), "error");
    return;
  }

  try {
    isSending.value = true;
    const auth = getAuth();
    await sendPasswordResetEmail(auth, forgotEmail.value);
    showToastMessage(t('loginPage.errors.reset.sent'), "success");
    showForgotModal.value = false;
    forgotEmail.value = "";
  } catch (error) {
    console.error(error);
    if (error.code === "auth/user-not-found") {
      showToastMessage(t('loginPage.errors.reset.noAccount'), "error");
    } else {
      showToastMessage(t('loginPage.errors.reset.failed'), "error");
    }
  } finally {
    isSending.value = false;
  }
};
const handleGoogleSignIn = async () => {
  try {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    const user = result.user;

    const collections = [
      { name: "admin", route: "/dashboard" },
      { name: "clients", route: "/" },
      { name: "technicians", route: "/technician-dashboard" },
      { name: "companies", route: "/technician-dashboard" },
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
      router.push("/signup");
    }
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    // 3. USE 't' function for toasts
    showToastMessage(t('loginPage.errors.googleFailed'), "error");
  }
};
</script>

<style scoped></style>