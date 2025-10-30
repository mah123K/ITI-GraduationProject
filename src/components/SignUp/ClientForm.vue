<template>
  <div
    class="bg-white dark:text-black shadow-2xl rounded-3xl p-8 pt-4 w-[1200px] min-h-[500px] flex flex-col justify-start animate-fade-in mt-3 mb-3"
  >
    <h2 class="text-3xl font-bold mb-3 text-center text-accent-color">Client Registration</h2>

    <!-- Profile Image -->
    <div class="flex flex-col justify-center items-center mb-4 space-y-2 select-none">
      <div
        class="w-20 h-20 rounded-full shadow-lg bg-[#f5f5f5] overflow-hidden flex items-center justify-center hover:border-[#5984c6] hover:border-2 relative transition cursor-pointer"
        @click="$refs.clientProfileInput.click()"
      >
        <img
          v-if="profileClientPreview"
          :src="profileClientPreview"
          alt="profile"
          class="w-full h-full object-cover"
        />
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 450 512"
          class="w-10 h-10 text-[#5984c6] absolute"
        >
          <path
            fill="#5984c6"
            d="M224 248a120 120 0 1 0 0-240 120 120 0 1 0 0 240zM195 304C95.8 304 16 383.8 16 482.3 16 498.7 29.3 512 45.7 512h358.6c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3H195z"
          />
        </svg>
      </div>

      <p class="text-lg font-semibold text-gray-600">Profile Picture (Optional)</p>

      <input
        ref="clientProfileInput"
        type="file"
        accept="image/*"
        @change="previewClientProfile"
        class="hidden"
      />
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
        <!-- Password -->
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

        <!-- Confirm Password -->
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
    </div>

    <button
      @click="submit"
      class="mt-10 mx-auto bg-accent-color text-white text-[20px] px-3 py-2 rounded-xl font-semibold transition cursor-pointer"
    >
      Sign Up
    </button>

    <p class="text-center mt-4 text-gray-500">
      Already have an account?
      <a :href="loginRoute" class="text-accent-color font-semibold hover:underline"> Login here </a>
    </p>
  </div>
</template>

<script>
import { uploadImageOnly } from '@/composables/useImageUpload';

export default {
  props: {
    loginRoute: { type: String, required: true },
  },
  data() {
    return {
      showPassword: false,
      showConfirmPassword: false,
      profileClientPreview: null,
      errors: {},
      form: {
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: {
          street: "",
          city: "",
          country: "Egypt",
          lat: 30.0444,
          lng: 31.2357,
        },
        profileImage: null,
      },
    };
  },
  methods: {
    inputClass(error, hasPadding = false) {
      return [
        "w-full p-4 border rounded-xl focus:ring-2 focus:ring-accent-color focus:outline-none",
        hasPadding ? "pr-12" : "",
        error ? "border-red-500" : "border-gray-300",
      ];
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    clearError(field) {
      if (this.errors[field]) {
        this.errors[field] = "";
      }
    },
   async previewClientProfile(e) {
  const file = e.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      this.errors.profileImage = "Image should be less than 5MB";
      return;
    }

    // عرض معاينة مؤقتة
    this.profileClientPreview = URL.createObjectURL(file);
    this.errors.profileImage = "";

    try {
      // رفع الصورة إلى Cloudinary
      const imageUrl = await uploadImageOnly(file);
      this.form.profileImage = imageUrl; // حفظ اللينك بدلاً من الملف
      console.log("✅ Profile image uploaded:", imageUrl);
    } catch (err) {
      this.errors.profileImage = "Failed to upload image";
      console.error(err);
    }
  }
},

    validatePasswordLive() {
      this.errors.password = "";
      this.errors.confirmPassword = "";

      if (!this.form.password) {
        this.errors.password = "Password is required";
      } else if (this.form.password.length < 6) {
        this.errors.password = "Password must be at least 6 characters";
      }

      if (this.form.confirmPassword && this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword = "Passwords do not match";
      }
    },
    validateForm() {
      const newErrors = {};
      let valid = true;

      // 🧍 Name check
      if (!this.form.name.trim()) {
        newErrors.name = "Full name is required";
        valid = false;
      } else if (!/^[A-Za-z\u0600-\u06FF]+(?:\s+[A-Za-z\u0600-\u06FF]+)+$/.test(this.form.name)) {
        newErrors.name = "Please enter your full name (first and last)";
        valid = false;
      }

      // ✉️ Email
      if (!this.form.email.trim()) {
        newErrors.email = "Email is required";
        valid = false;
      } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(this.form.email)) {
        newErrors.email = "Please enter a valid email address";
        valid = false;
      }

      // 🔒 Password
      if (!this.form.password.trim()) {
        newErrors.password = "Password is required";
        valid = false;
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(this.form.password)) {
        newErrors.password =
          "Password must have uppercase, lowercase, number, and special character";
        valid = false;
      }

      if (!this.form.confirmPassword.trim()) {
        newErrors.confirmPassword = "Confirm password is required";
        valid = false;
      } else if (this.form.password !== this.form.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
        valid = false;
      }

      // ☎️ Phone
      if (!this.form.phone.trim()) {
        newErrors.phone = "Phone number is required";
        valid = false;
      } else if (!/^(010|011|012|015)\d{8}$/.test(this.form.phone)) {
        newErrors.phone =
          "Invalid Egyptian phone (must start with 010, 011, 012, or 015 and be 11 digits)";
        valid = false;
      }

      // 📍 Address
      if (!this.form.address.street.trim()) {
        newErrors.street = "Street address is required";
        valid = false;
      }

      if (!this.form.address.city.trim()) {
        newErrors.city = "City is required";
        valid = false;
      }

      if (!this.form.address.country.trim()) {
        newErrors.country = "Country is required";
        valid = false;
      }

      this.errors = newErrors;
      return valid && Object.keys(newErrors).length === 0;
    },

    submit() {
      if (this.validateForm()) {
        if (!this.form.username) {
          this.form.username = this.form.name.toLowerCase().replace(/\s+/g, "_");
        }
        this.$emit("submit", this.form);
      }
    },
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
</style>
