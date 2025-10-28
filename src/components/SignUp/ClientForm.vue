<template>
  <div
    class="bg-white shadow-2xl rounded-3xl p-8 pt-4 w-[1200px] min-h-[500px] flex flex-col justify-start animate-fade-in mt-3 mb-3"
  >
    <h2 class="text-3xl font-bold mb-3 text-center text-accent-color">{{ $t('signUpPage.client.title') }}</h2>

    <div class="flex flex-col justify-center items-center mb-4 space-y-2 select-none">
      <div
        class="w-20 h-20 rounded-full shadow-lg bg-[#f5f5ff] overflow-hidden flex items-center justify-center hover:border-[#5984c6] hover:border-2 relative transition cursor-pointer"
        @click="$refs.clientProfileInput.click()"
      >
        </div>

      <p class="text-lg font-semibold text-gray-600">{{ $t('signUpPage.client.profilePic') }}</p>

      <input
        ref="clientProfileInput"
        type="file"
        accept="image/*"
        @change="previewClientProfile"
        class="hidden"
      />
    </div>

    <div class="max-w-6xl mx-auto w-full space-y-6">
      <div class="grid grid-cols-2 gap-8">
        <div>
          <input
            v-model="form.name"
            type="text"
            :placeholder="$t('signUpPage.client.fullName')"
            required
            :class="inputClass(errors.name)"
            @input="clearError('name')"
            class="rtl:text-right"
          />
          <p v-if="errors.name" class="text-red-500 text-sm mt-1 rtl:text-right">{{ errors.name }}</p>
        </div>

        <div>
          <input
            v-model="form.email"
            type="email"
            :placeholder="$t('signUpPage.client.email')"
            required
            :class="inputClass(errors.email)"
            @input="clearError('email')"
            class="rtl:text-right"
          />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1 rtl:text-right">{{ errors.email }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-8">
        <div class="relative">
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="$t('signUpPage.client.password')"
            required
            minlength="6"
            @input="validatePasswordLive"
            :class="inputClass(errors.password, true)"
            class="rtl:text-right"
          />
          <button
            type="button"
            @click="togglePassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none rtl:right-auto rtl:left-3"
            aria-label="Toggle password visibility"
          >
            <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
          </button>
          <p v-if="errors.password" class="absolute text-red-500 text-sm mt-1 left-0 -bottom-5 rtl:text-right">
            {{ errors.password }}
          </p>
        </div>

        <div class="relative">
          <input
            v-model="form.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            :placeholder="$t('signUpPage.client.confirmPassword')"
            required
            minlength="6"
            @input="validatePasswordLive"
            :class="inputClass(errors.confirmPassword, true)"
            class="rtl:text-right"
          />
          <button
            type="button"
            @click="toggleConfirmPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none rtl:right-auto rtl:left-3"
            aria-label="Toggle confirm password visibility"
          >
            <i :class="showConfirmPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
          </button>
          <p v-if="errors.confirmPassword" class="absolute text-red-500 text-sm mt-1 left-0 -bottom-5 rtl:text-right">
            {{ errors.confirmPassword }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-8">
        <div>
          <input
            v-model="form.phone"
            type="tel"
            :placeholder="$t('signUpPage.client.phone')"
            required
            :class="inputClass(errors.phone)"
            @input="clearError('phone')"
            class="rtl:text-right"
          />
          <p v-if="errors.phone" class="text-red-500 text-sm mt-1 rtl:text-right">{{ errors.phone }}</p>
        </div>
        <div>
          <input
            v-model="form.address.country"
            type="text"
            :placeholder="$t('signUpPage.client.country')"
            required
            :class="inputClass(errors.country)"
            @input="clearError('country')"
            class="rtl:text-right"
          />
          <p v-if="errors.country" class="text-red-500 text-sm mt-1 rtl:text-right">{{ errors.country }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-8">
        <div>
          <input
            v-model="form.address.street"
            type="text"
            :placeholder="$t('signUpPage.client.street')"
            required
            :class="inputClass(errors.street)"
            @input="clearError('street')"
            class="rtl:text-right"
          />
          <p v-if="errors.street" class="text-red-500 text-sm mt-1 rtl:text-right">{{ errors.street }}</p>
        </div>
        <div>
          <input
            v-model="form.address.city"
            type="text"
            :placeholder="$t('signUpPage.client.city')"
            required
            :class="inputClass(errors.city)"
            @input="clearError('city')"
            class="rtl:text-right"
          />
          <p v-if="errors.city" class="text-red-500 text-sm mt-1 rtl:text-right">{{ errors.city }}</p>
        </div>
      </div>
    </div>

    <button
      @click="submit"
      class="mt-10 mx-auto bg-accent-color text-white text-[20px] px-3 py-2 rounded-xl font-semibold transition cursor-pointer"
    >
      {{ $t('signUpPage.signUpButton') }}
    </button>

    <p class="text-center mt-4 text-gray-500">
      {{ $t('signUpPage.promptLogin') }}
      <a :href="loginRoute" class="text-accent-color font-semibold hover:underline"> {{ $t('signUpPage.loginLink') }} </a>
    </p>
  </div>
</template>

<script>
export default {
  // ... (props, data, methods.inputClass, toggles remain the same) ...
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
    // ... (inputClass, togglePassword, toggleConfirmPassword, clearError remain the same) ...
    inputClass(error, hasPadding = false) {
      return [
        "w-full p-4 border rounded-xl focus:ring-2 focus:ring-accent-color focus:outline-none rtl:text-right", // Added rtl:text-right
        hasPadding ? "pr-12 rtl:pr-4 rtl:pl-12" : "", // Added RTL padding swap
        error ? "border-red-500" : "border-gray-300",
      ];
    },
    togglePassword() { this.showPassword = !this.showPassword; },
    toggleConfirmPassword() { this.showConfirmPassword = !this.showConfirmPassword; },
    clearError(field) { if (this.errors[field]) this.errors[field] = ""; },

    previewClientProfile(e) {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          // UPDATED
          this.errors.profileImage = this.$t('signUpPage.alerts.imageSize');
          return;
        }
        this.form.profileImage = file;
        this.profileClientPreview = URL.createObjectURL(file);
        this.errors.profileImage = "";
      }
    },
    validatePasswordLive() {
      // ... (logic is fine, but messages will come from validateForm) ...
    },
    validateForm() {
      const newErrors = {};
      let valid = true;

      // 🧍 Name check
      if (!this.form.name.trim()) {
        newErrors.name = this.$t('signUpPage.client.fullName') + ' ' + this.$t('signUpPage.alerts.allFields'); // "Full Name * is required"
        valid = false;
      }
      // ... (rest of validation) ...
      
      // ✉️ Email
      if (!this.form.email.trim()) {
        newErrors.email = this.$t('signUpPage.client.email') + ' ' + this.$t('signUpPage.alerts.allFields');
        valid = false;
      } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(this.form.email)) {
        newErrors.email = this.$t('signUpPage.alerts.invalidEmail');
        valid = false;
      }

      // 🔒 Password
      if (!this.form.password.trim()) {
        newErrors.password = this.$t('signUpPage.client.password') + ' ' + this.$t('signUpPage.alerts.allFields');
        valid = false;
      } 
      // ... (rest of password validation) ...

      if (!this.form.confirmPassword.trim()) {
        newErrors.confirmPassword = this.$t('signUpPage.client.confirmPassword') + ' ' + this.$t('signUpPage.alerts.allFields');
        valid = false;
      } else if (this.form.password !== this.form.confirmPassword) {
        newErrors.confirmPassword = this.$t('signUpPage.alerts.passwordMismatch');
        valid = false;
      }

      // ☎️ Phone
      if (!this.form.phone.trim()) {
        newErrors.phone = this.$t('signUpPage.client.phone') + ' ' + this.$t('signUpPage.alerts.allFields');
        valid = false;
      } else if (!/^(010|011|012|015)\d{8}$/.test(this.form.phone)) {
        newErrors.phone = this.$t('signUpPage.alerts.phoneDigits'); // Using a more generic one
        valid = false;
      }

      // 📍 Address
      if (!this.form.address.street.trim()) {
        newErrors.street = this.$t('signUpPage.client.street') + ' ' + this.$t('signUpPage.alerts.allFields');
        valid = false;
      }
      if (!this.form.address.city.trim()) {
        newErrors.city = this.$t('signUpPage.client.city') + ' ' + this.$t('signUpPage.alerts.allFields');
        valid = false;
      }
      if (!this.form.address.country.trim()) {
        newErrors.country = this.$t('signUpPage.client.country') + ' ' + this.$t('signUpPage.alerts.allFields');
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
/* ... (styles remain the same) ... */
</style>