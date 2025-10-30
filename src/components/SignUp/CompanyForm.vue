<template>
  <div
    class="bg-white shadow-2xl dark:text-black rounded-3xl p-8 pt-6 w-[1200px] min-h-[600px] flex flex-col justify-start animate-fade-in mt-3 mb-3"
  >
    <h2 class="text-3xl font-bold mb-8 text-center text-accent-color">Company Registration</h2>

    <!-- 🔹 Logo + Tax Card -->
    <div class="flex justify-between mb-6 max-w-6xl mx-auto w-full">
      <div class="flex flex-col items-start ml-40">
        <label class="font-semibold mb-2">Tax Card</label>
        <div
          @click="$refs.crnInput.click()"
          class="w-32 h-32 rounded-full shadow-lg bg-[#f5f5f5] overflow-hidden flex items-center justify-center cursor-pointer hover:border-accent-color relative"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 512" class="w-[60px] h-[60px]">
            <path
              fill="#5984c6"
              d="M0 96C0 60.7 28.7 32 64 32l448 0c35.3 0 64 28.7 64 64L0 96zm0 48l576 0 0 272c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 144zM247.3 416c20.2 0 35.3-19.4 22.4-35-14.7-17.7-36.9-29-61.7-29l-64 0c-24.8 0-47 11.3-61.7 29-12.9 15.6 2.2 35 22.4 35l142.5 0zM176 312a56 56 0 1 0 0-112 56 56 0 1 0 0 112zM360 208c-13.3 0-24 10.7-24 24s10.7 24 24 24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-112 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-112 0z"
            />
          </svg>
          <div class="absolute bottom-6 left-5 z-50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 512" class="w-5 h-5">
              <path
                fill="#5984c6"
                d="M256 109.3L256 320c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-210.7-41.4 41.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l96-96c12.5-12.5 32.8-12.5 45.3 0l96 96c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 109.3zM224 400c44.2 0 80-35.8 80-80l80 0c35.3 0 64 28.7 64 64l0 32c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64l0-32c0-35.3 28.7-64 64-64l80 0c0 44.2 35.8 80 80 80zm144 24a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"
              />
            </svg>
          </div>
        </div>
        <input ref="crnInput" type="file" @change="previewCrn" class="hidden" />
      </div>

      <div class="flex flex-col items-end mr-40">
        <label class="font-semibold mb-2">Company Logo</label>
        <div
          @click="$refs.logoInput.click()"
          class="w-32 h-32 rounded-full shadow-lg bg-[#f5f5f5] overflow-hidden flex items-center justify-center cursor-pointer hover:border-accent-color relative"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 512" class="w-[60px] h-[60px]">
            <path
              fill="#5984c6"
              d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-384c0-35.3-28.7-64-64-64L64 0zM176 352l32 0c17.7 0 32 14.3 32 32l0 80-96 0 0-80c0-17.7 14.3-32 32-32zM96 112c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zm144-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zM96 240c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zm144-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0 8.8 7.2-16 16-16z"
            />
          </svg>
          <div class="absolute bottom-6 left-5 z-50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 512" class="w-5 h-5">
              <path
                fill="#5984c6"
                d="M256 109.3L256 320c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-210.7-41.4 41.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l96-96c12.5-12.5 32.8-12.5 45.3 0l96 96c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 109.3zM224 400c44.2 0 80-35.8 80-80l80 0c35.3 0 64 28.7 64 64l0 32c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64l0-32c0-35.3 28.7-64 64-64l80 0c0 44.2 35.8 80 80 80zm144 24a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"
              />
            </svg>
          </div>
        </div>
        <input ref="logoInput" type="file" @change="previewLogo" class="hidden" />
      </div>
    </div>

    <!-- 🔹 Form Fields -->
    <div class="grid grid-cols-2 gap-8 max-w-6xl mx-auto w-full">
      <div class="flex flex-col gap-5">
        <div>
          <input
            v-model="form.companyName"
            type="text"
            placeholder="Company Name *"
            :class="inputClass(errors.companyName)"
            @input="clearError('companyName')"
          />
          <p v-if="errors.companyName" class="text-red-500 text-sm mt-1">
            {{ errors.companyName }}
          </p>
        </div>

        <div>
          <input
            v-model="form.username"
            type="text"
            placeholder="Username *"
            :class="inputClass(errors.username)"
            @input="clearError('username')"
          />
          <p v-if="errors.username" class="text-red-500 text-sm mt-1">{{ errors.username }}</p>
        </div>

        <div>
          <input
            v-model="form.email"
            type="email"
            placeholder="Email *"
            :class="inputClass(errors.email)"
            @input="clearError('email')"
          />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
        </div>

        <div class="relative">
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password *"
            :class="inputClass(errors.password, true)"
            @input="validatePasswordLive"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
          </button>
          <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
        </div>

        <div class="relative">
          <input
            v-model="form.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Confirm Password *"
            :class="inputClass(errors.confirmPassword, true)"
            @input="validatePasswordLive"
          />
          <button
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            <i :class="showConfirmPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
          </button>
          <p v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1">
            {{ errors.confirmPassword }}
          </p>
        </div>

        <div>
          <input
            v-model="form.phone"
            type="text"
            placeholder="Phone Number *"
            :class="inputClass(errors.phone)"
            @input="clearError('phone')"
          />
          <p v-if="errors.phone" class="text-red-500 text-sm mt-1">{{ errors.phone }}</p>
        </div>
      </div>

      <div class="flex flex-col gap-5">
        <div>
          <input
            v-model="form.address"
            type="text"
            placeholder="Street Address *"
            :class="inputClass(errors.address)"
            @input="clearError('address')"
          />
          <p v-if="errors.address" class="text-red-500 text-sm mt-1">{{ errors.address }}</p>
        </div>

        <div>
          <input
            v-model="form.city"
            type="text"
            placeholder="City *"
            :class="inputClass(errors.city)"
            @input="clearError('city')"
          />
          <p v-if="errors.city" class="text-red-500 text-sm mt-1">{{ errors.city }}</p>
        </div>
        <div>
          <input
            v-model="form.website"
            type="text"
            placeholder="Website *"
            :class="inputClass(errors.website)"
            @input="clearError('website')"
          />
          <p v-if="errors.website" class="text-red-500 text-sm mt-1">{{ errors.country }}</p>
        </div>
        <!-- <input
          v-model="form.teamSize"
          type="text"
          placeholder="Team Size"
          class="p-4 border border-gray-300 rounded-xl"
        /> -->
        <div>
          <input
            v-model="form.teamSize"
            type="text"
            placeholder="Team Size *"
            :class="inputClass(errors.teamSize)"
            @input="clearError('teamSize')"
          />
          <p v-if="errors.teamSize" class="text-red-500 text-sm mt-1">{{ errors.teamSize }}</p>
        </div>
        <div>
          <input
            v-model="form.crn"
            type="text"
            placeholder="Company Registration Number (CRN) *"
            :class="inputClass(errors.crn)"
            @input="clearError('crn')"
          />
          <p v-if="errors.crn" class="text-red-500 text-sm mt-1">{{ errors.crn }}</p>
        </div>

        <input
          v-model="form.description"
          placeholder="Bio"
          class="p-4 border border-gray-300 rounded-2xl resize-none"
        />
      </div>
    </div>

    <!-- 🔹 Submit -->
    <button
      @click="handleSubmit"
      class="mt-10 mx-auto bg-accent-color text-white text-[20px] px-3 py-2 rounded-xl font-semibold transition cursor-pointer"
      :disabled="isSubmitting"
    >
      {{ isSubmitting ? "Submitting..." : "Sign Up" }}
    </button>

    <p class="text-center mt-4 text-gray-500">
      Already have an account?
      <a :href="loginRoute" class="text-accent-color font-semibold hover:underline"> Login here </a>
    </p>
  </div>
</template>

<script>
export default {
  props: { loginRoute: { type: String, required: true } },
  data() {
    return {
      showPassword: false,
      showConfirmPassword: false,
      logoPreview: null,
      crnPreview: null,
      isSubmitting: false,
      errors: {},
      form: {
        companyName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: "",
        city: "",
        website: "",
        teamSize: "",
        crn: "",
        description: "",
        logoImage: null,
        crnImage: null,
      },
    };
  },
  methods: {
    inputClass(error, hasPadding = false) {
      return [
        "w-full p-4 border rounded-xl focus:outline-none focus:ring-1 transition-all duration-200",
        hasPadding ? "pr-12" : "",
        error ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-[#5984C6]",
      ];
    },
    clearError(field) {
      this.errors[field] = "";
    },
    previewLogo(e) {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) return (this.errors.logoImage = "Image must be under 5MB");
        this.form.logoImage = file;
        this.logoPreview = URL.createObjectURL(file);
      }
    },
    previewCrn(e) {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) return (this.errors.crnImage = "Image must be under 5MB");
        this.form.crnImage = file;
        this.crnPreview = URL.createObjectURL(file);
      }
    },
    validatePasswordLive() {
      this.errors.password = "";
      this.errors.confirmPassword = "";
      if (!this.form.password) {
        this.errors.password = "Password is required";
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(this.form.password)) {
        this.errors.password = "Password must include uppercase, lowercase, number, and symbol";
      }
      if (this.form.confirmPassword && this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword = "Passwords do not match";
      }
    },
    validateForm() {
      this.errors = {};
      let valid = true;
      if (!this.form.companyName.trim()) {
        this.errors.companyName = "Company name is required";
        valid = false;
      }
      if (!this.form.email.match(/^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[A-Za-z]{2,}$/)) {
        this.errors.email = "Invalid email";
        valid = false;
      }
      if (!this.form.password.trim()) {
        this.errors.password = "Password is required";
        valid = false;
      }

      if (!this.form.confirmPassword.trim()) {
        this.errors.confirmPassword = "Confirm your password";
        valid = false;
      } else if (this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword = "Passwords do not match";
        valid = false;
      }
      if (!this.form.phone.match(/^(010|011|012|015)\d{8}$/)) {
        this.errors.phone = "Invalid Egyptian phone number";
        valid = false;
      }
      if (!this.form.city.trim()) {
        this.errors.city = "City is required";
        valid = false;
      }
      if (!this.form.address.trim()) {
        this.errors.address = "Address is required";
        valid = false;
      }
      if (!this.form.website.trim()) {
        this.errors.website = "Website is required";
        valid = false;
      }
      if (!this.form.teamSize.trim()) {
        this.errors.teamSize = "Team size is required";
        valid = false;
      }
      if (!this.form.crn.trim()) {
        this.errors.crn = "CRN is required";
        valid = false;
      }
      return valid;
    },
    handleSubmit() {
      const isValid = this.validateForm();
      if (isValid) {
        this.$emit("submit-form", this.form);
      } else {
        this.$forceUpdate();
      }
    },
  },
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
/* ✅ يمنع أي أيقونات تلقائية داخل حقول الباسورد */
input[type="password"]::-ms-reveal,
input[type="password"]::-ms-clear {
  display: none !important;
}

input[type="password"] {
  background-image: none !important;
  background-position: right !important;
  background-repeat: no-repeat !important;
}
</style>
