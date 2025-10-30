<template>
  <div
    class="bg-white shadow-2xl rounded-3xl p-8 pt-4 w-[1200px] min-h-[500px] flex flex-col justify-start animate-fade-in mt-3 mb-3"
  >
    <h2 class="text-3xl font-bold mb-3 text-center text-accent-color">Technician Registration</h2>

    <div class="flex justify-center gap-40 mb-6 w-full">
      <!-- ID Card -->
      <div class="flex flex-col items-center mr-40">
        <label class="font-semibold mb-2">ID Card</label>
        <div
          @click.stop="$refs.idCardInput.click()"
          class="w-32 h-32 rounded-full shadow-lg bg-[#f5f5f5] overflow-hidden flex items-center justify-center cursor-pointer hover:border-accent-color relative"
        >
          <img
            v-if="idCardPreview"
            :src="idCardPreview"
            alt="ID Preview"
            class="w-full h-full object-cover"
          />
          <template v-else>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 512" class="w-[60px] h-[60px]">
              <path
                fill="#5984c6"
                d="M0 96C0 60.7 28.7 32 64 32l448 0c35.3 0 64 28.7 64 64L0 96zm0 48l576 0 0 272c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 144zM247.3 416c20.2 0 35.3-19.4 22.4-35-14.7-17.7-36.9-29-61.7-29l-64 0c-24.8 0-47 11.3-61.7 29-12.9 15.6 2.2 35 22.4 35l142.5 0zM176 312a56 56 0 1 0 0-112 56 56 0 1 0 0 112zM360 208c-13.3 0-24 10.7-24 24s10.7 24 24 24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-112 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-112 0z"
              />
            </svg>
          </template>
        </div>
        <input ref="idCardInput" type="file" @change="previewIdCard" class="hidden" />
        <p v-if="errors.idCardImage" class="text-red-500 text-sm mt-1">
          {{ errors.idCardImage }}
        </p>
      </div>

      <!-- Profile Picture -->
      <div class="flex flex-col items-center ml-40">
        <label class="font-semibold mb-2">Profile Picture</label>
        <div
          @click.stop="$refs.profileInput.click()"
          class="w-32 h-32 rounded-full shadow-lg bg-[#f5f5f5] overflow-hidden flex items-center justify-center cursor-pointer hover:border-accent-color relative"
        >
          <img
            v-if="profilePreview"
            :src="profilePreview"
            alt="Profile Preview"
            class="w-full h-full object-cover"
          />
          <template v-else>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 512" class="w-[60px] h-[60px]">
              <path
                fill="#5984c6"
                d="M224 248a120 120 0 1 0 0-240 120 120 0 1 0 0 240zm-29.7 56C95.8 304 16 383.8 16 482.3 16 498.7 29.3 512 45.7 512l356.6 0c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3l-59.4 0z"
              />
            </svg>
          </template>
        </div>
        <input ref="profileInput" type="file" @change="previewProfile" class="hidden" />
        <p v-if="errors.profileImage" class="text-red-500 text-sm mt-1">
          {{ errors.profileImage }}
        </p>
      </div>
    </div>

    <!-- Form -->
    <div class="max-w-6xl mx-auto w-full space-y-6">
      <!-- Name & Email -->
      <div class="grid grid-cols-2 gap-8">
        <div>
          <input
            v-model="form.name"
            type="text"
            placeholder="Full Name *"
            required
            :class="inputClass(errors.name)"
            @input="clearError('name')"
          />
          <p v-if="errors.name" class="text-red-500 text-sm mt-1">
            {{ errors.name }}
          </p>
        </div>

        <div>
          <input
            v-model="form.email"
            type="email"
            placeholder="Email *"
            required
            :class="inputClass(errors.email)"
            @input="clearError('email')"
          />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1">
            {{ errors.email }}
          </p>
        </div>
      </div>

      <!-- Password & Confirm Password -->
      <div class="grid grid-cols-2 gap-8">
        <div class="relative">
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password *"
            required
            minlength="6"
            @input="validatePasswordLive"
            :class="inputClass(errors.password, true)"
          />
          <button
            type="button"
            @click="togglePassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
            aria-label="Toggle password visibility"
          >
            <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
          </button>
          <p v-if="errors.password" class="absolute text-red-500 text-sm mt-1 left-0 -bottom-5">
            {{ errors.password }}
          </p>
        </div>

        <div class="relative">
          <input
            v-model="form.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Confirm Password *"
            required
            minlength="6"
            @input="validatePasswordLive"
            :class="inputClass(errors.confirmPassword, true)"
          />
          <button
            type="button"
            @click="toggleConfirmPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
            aria-label="Toggle confirm password visibility"
          >
            <i :class="showConfirmPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
          </button>
          <p
            v-if="errors.confirmPassword"
            class="absolute text-red-500 text-sm mt-1 left-0 -bottom-5"
          >
            {{ errors.confirmPassword }}
          </p>
        </div>
      </div>

      <!-- Phone & Country -->
      <div class="grid grid-cols-2 gap-8">
        <div>
          <input
            v-model="form.phone"
            type="tel"
            placeholder="Phone Number *"
            required
            :class="inputClass(errors.phone)"
            @input="clearError('phone')"
          />
          <p v-if="errors.phone" class="text-red-500 text-sm mt-1">
            {{ errors.phone }}
          </p>
        </div>

        <div>
          <input
            v-model="form.address.country"
            type="text"
            placeholder="Country *"
            required
            :class="inputClass(errors.country)"
            @input="clearError('country')"
          />
          <p v-if="errors.country" class="text-red-500 text-sm mt-1">
            {{ errors.country }}
          </p>
        </div>
      </div>

      <!-- Address -->
      <div class="grid grid-cols-2 gap-8">
        <div>
          <input
            v-model="form.address.street"
            type="text"
            placeholder="Street Address *"
            required
            :class="inputClass(errors.street)"
            @input="clearError('street')"
          />
          <p v-if="errors.street" class="text-red-500 text-sm mt-1">
            {{ errors.street }}
          </p>
        </div>
        <div>
          <input
            v-model="form.address.city"
            type="text"
            placeholder="City *"
            required
            :class="inputClass(errors.city)"
            @input="clearError('city')"
          />
          <p v-if="errors.city" class="text-red-500 text-sm mt-1">
            {{ errors.city }}
          </p>
        </div>
      </div>
      <!-- Technician Fields -->
      <div class="grid grid-cols-2 gap-8">
        <div>
          <select
            v-model="form.skill"
            required
            :class="inputClass(errors.skill)"
            @change="clearError('skill')"
          >
            <option value="" disabled>Select Work Type *</option>
            <option value="Plumbing">🔧 Plumbing</option>
            <option value="Electrical">⚡ Electrical</option>
            <option value="Carpentry">🔨 Carpentry</option>
            <option value="Finishing">🛠️ Finishing</option>
          </select>
          <p v-if="errors.skill" class="text-red-500 text-sm mt-1">
            {{ errors.skill }}
          </p>
        </div>

        <div>
          <input
            v-model="form.experience"
            type="text"
            placeholder="Years of Experience *"
            required
            :class="inputClass(errors.experience)"
            @input="clearError('experience')"
          />
          <p v-if="errors.experience" class="text-red-500 text-sm mt-1">
            {{ errors.experience }}
          </p>
        </div>
      </div>

      <div>
        <textarea
          v-model="form.bio"
          rows="3"
          placeholder="Bio (Optional)"
          class="w-full p-4 border rounded-xl border-gray-300 focus:ring-2 focus:ring-accent-color focus:outline-none resize-none"
        ></textarea>
      </div>
    </div>

    <button
      @click="handleSubmit"
      :disabled="isSubmitting"
      class="mt-10 mx-auto bg-accent-color text-white text-[20px] px-3 py-2 rounded-xl font-semibold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
  props: {
    loginRoute: { type: String, required: true },
  },
  data() {
    return {
      showPassword: false,
      showConfirmPassword: false,
      profilePreview: null,
      idCardPreview: null,
      isSubmitting: false,
      errors: {},
      form: {
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        address: {
          street: "",
          city: "",
          country: "Egypt",
          lat: 30.0444,
          lng: 31.2357,
        },
        skill: "",
        bio: "",
        experience: "",
        profileImage: null,
        idCardImage: null,
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
    setSubmitting(value) {
      this.isSubmitting = value;
    },

    handleSubmit() {
      const isValid = this.validateForm();
      if (isValid) {
        this.$emit("submit-form", this.form);
      } else {
        this.$forceUpdate(); 
      }
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    clearError(field) {
      if (this.errors[field]) this.errors[field] = "";
    },

    async previewProfile(e) {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024)
          return (this.errors.profileImage = "Image must be under 5MB");
        this.profilePreview = URL.createObjectURL(file);
        this.form.profileImage = file; // نحفظ الملف نفسه، مش URL
      }
    },

    async previewIdCard(e) {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024)
          return (this.errors.idCardImage = "Image must be under 5MB");
        this.idCardPreview = URL.createObjectURL(file);
        this.form.idCardImage = file; // نحفظ الملف نفسه، مش URL
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
      const e = {};
      let valid = true;

      if (!this.form.name.trim()) {
        e.name = "Full name is required";
        valid = false;
      } else if (!/^[A-Za-z\u0600-\u06FF]+(?:\s+[A-Za-z\u0600-\u06FF]+)+$/.test(this.form.name)) {
        e.name = "Please enter your full name (first and last)";
        valid = false;
      }

      if (!this.form.email.trim()) {
        e.email = "Email is required";
        valid = false;
      } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(this.form.email)) {
        e.email = "Enter a valid email address";
        valid = false;
      }

      if (!this.form.password.trim()) {
        e.password = "Password is required";
        valid = false;
      }

      if (!this.form.confirmPassword.trim()) {
        e.confirmPassword = "Confirm your password";
        valid = false;
      } else if (this.form.password !== this.form.confirmPassword) {
        e.confirmPassword = "Passwords do not match";
        valid = false;
      }

      if (!this.form.phone.trim()) {
        e.phone = "Phone number is required";
        valid = false;
      } else if (!/^(010|011|012|015)\d{8}$/.test(this.form.phone)) {
        e.phone = "Invalid Egyptian phone format";
        valid = false;
      }

      if (!this.form.address.street.trim()) {
        e.street = "Street address is required";
        valid = false;
      }
      if (!this.form.address.city.trim()) {
        e.city = "City is required";
        valid = false;
      }
      if (!this.form.address.country.trim()) {
        e.country = "Country is required";
        valid = false;
      }

      if (!this.form.skill.trim()) {
        e.skill = "Work type is required";
        valid = false;
      }
      if (!this.form.experience.trim()) {
        e.experience = "Experience is required";
        valid = false;
      }
      if (!this.form.idCardImage) {
        e.idCardImage = "ID card image is required";
        valid = false;
      }

      this.errors = e;
      return valid;
    },

    // async submit() {
    //   if (this.validateForm()) {
    //     this.isSubmitting = true;
    //     this.$emit("submit", this.form);

    //     setTimeout(() => {
    //       this.isSubmitting = false;
    //     }, 3000);
    //   }
    // },
  },
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
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
