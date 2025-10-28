<template>
  <div
    class="bg-white shadow-2xl rounded-3xl p-8 pt-6 w-[1200px] min-h-[600px] flex flex-col justify-start animate-fade-in mt-3 mb-3"
  >
    <h2 class="text-3xl font-bold mb-8 text-center text-accent-color ">{{ $t('signUpPage.company.title') }}</h2>

    <div class="flex justify-between mb-6 max-w-6xl mx-auto w-full rtl:flex-row-reverse">
      <div class="flex flex-col items-start ml-40 rtl:ml-50 rtl:mr-40">
        <label class="font-semibold mb-2">{{ $t('signUpPage.company.taxCard') }}</label>
        <div
          @click="$refs.crnInput.click()"
          class="w-32 h-32 rounded-full shadow-lg bg-[#f5f5f5] overflow-hidden flex items-center justify-center cursor-pointer hover:border-accent-color relative"
        >
          </div>
        <input ref="crnInput" type="file" @change="previewCrn" class="hidden" />
      </div>

      <div class="flex flex-col items-end mr-40 rtl:mr-50 rtl:ml-40">
        <label class="font-semibold mb-2">{{ $t('signUpPage.company.logo') }}</label>
        <div
          @click="$refs.logoInput.click()"
          class="w-32 h-32 rounded-full shadow-lg bg-[#f5f5f5] overflow-hidden flex items-center justify-center cursor-pointer hover:border-accent-color relative"
        >
          </div>
        <input ref="logoInput" type="file" @change="previewLogo" class="hidden" />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-8 max-w-6xl mx-auto w-full">
      <div class="flex flex-col gap-5">
        <div>
          <input
            v-model="form.companyName"
            type="text"
            :placeholder="$t('signUpPage.company.companyName')"
            :class="inputClass(errors.companyName)"
            @input="clearError('companyName')"
            class="rtl:text-right"
          />
          <p v-if="errors.companyName" class="text-red-500 text-sm mt-1 rtl:text-right">{{ errors.companyName }}</p>
        </div>
        <div>
          <input
            v-model="form.username"
            type="text"
            :placeholder="$t('signUpPage.company.username')"
            :class="inputClass(errors.username)"
            @input="clearError('username')"
            class="rtl:text-right"
          />
          <p v-if="errors.username" class="text-red-500 text-sm mt-1 rtl:text-right">{{ errors.username }}</p>
        </div>
        <div>
          <input
            v-model="form.email"
            type="email"
            :placeholder="$t('signUpPage.company.email')"
            :class="inputClass(errors.email)"
            @input="clearError('email')"
            class="rtl:text-right"
          />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1 rtl:text-right">{{ errors.email }}</p>
        </div>
        <div class="relative">
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="$t('signUpPage.company.password')"
            :class="inputClass(errors.password, true)"
            @input="validatePasswordLive"
            class="rtl:text-right"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 rtl:right-auto rtl:left-3"
          >
            <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
          </button>
          <p v-if="errors.password" class="text-red-500 text-sm mt-1 rtl:text-right">{{ errors.password }}</p>
        </div>
        <div class="relative">
          <input
            v-model="form.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            :placeholder="$t('signUpPage.company.confirmPassword')"
            :class="inputClass(errors.confirmPassword, true)"
            @input="validatePasswordLive"
            class="rtl:text-right"
          />
          <button
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 rtl:right-auto rtl:left-3"
          >
            <i :class="showConfirmPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
          </button>
          <p v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1 rtl:text-right">
            {{ errors.confirmPassword }}
          </p>
        </div>
        <div>
          <input
            v-model="form.phone"
            type="text"
            :placeholder="$t('signUpPage.company.phone')"
            :class="inputClass(errors.phone)"
            @input="clearError('phone')"
            class="rtl:text-right"
          />
          <p v-if="errors.phone" class="text-red-500 text-sm mt-1 rtl:text-right">{{ errors.phone }}</p>
        </div>
      </div>

      <div class="flex flex-col gap-5">
        <div>
          <input
            v-model="form.address"
            type="text"
            :placeholder="$t('signUpPage.company.address')"
            :class="inputClass(errors.address)"
            @input="clearError('address')"
            class="rtl:text-right"
          />
          <p v-if="errors.address" class="text-red-500 text-sm mt-1 rtl:text-right">{{ errors.address }}</p>
        </div>
        <div>
          <input
            v-model="form.city"
            type="text"
            :placeholder="$t('signUpPage.company.city')"
            :class="inputClass(errors.city)"
            @input="clearError('city')"
            class="rtl:text-right"
          />
          <p v-if="errors.city" class="text-red-500 text-sm mt-1 rtl:text-right">{{ errors.city }}</p>
        </div>
        <input
          v-model="form.website"
          type="text"
          :placeholder="$t('signUpPage.company.website')"
          class="p-4 border border-gray-300 rounded-xl rtl:text-right"
        />
        <input
          v-model="form.teamSize"
          type="text"
          :placeholder="$t('signUpPage.company.teamSize')"
          class="p-4 border border-gray-300 rounded-xl rtl:text-right"
        />
        <input
          v-model="form.crn"
          type="text"
          :placeholder="$t('signUpPage.company.crn')"
          class="p-4 border border-gray-300 rounded-xl rtl:text-right"
        />
        <input
          v-model="form.description"
          :placeholder="$t('signUpPage.company.bio')"
          class="p-4 border border-gray-300 rounded-2xl resize-none rtl:text-right"
        />
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
  props: { loginRoute: { type: String, required: true } },
  data() {
    return {
      showPassword: false,
      showConfirmPassword: false,
      logoPreview: null,
      crnPreview: null,
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
    inputClass(error, pad = false) {
      return [
        "p-4 border rounded-xl w-full focus:ring-2 focus:ring-accent-color focus:outline-none transition rtl:text-right", // Added rtl
        pad ? "pr-12 rtl:pr-4 rtl:pl-12" : "", // Added rtl
        error ? "border-red-500" : "border-gray-300",
      ];
    },
    clearError(field) { this.errors[field] = ""; },
    previewLogo(e) {
      // ... (logic) ...
      // UPDATED
      if (file.size > 5 * 1024 * 1024) return (this.errors.logoImage = this.$t('signUpPage.alerts.imageSize'));
      // ... (rest of logic) ...
    },
    previewCrn(e) {
      // ... (logic) ...
      // UPDATED
      if (file.size > 5 * 1024 * 1024) return (this.errors.crnImage = this.$t('signUpPage.alerts.imageSize'));
      // ... (rest of logic) ...
    },
    validatePasswordLive() {
      // ... (logic) ...
      // UPDATED
      if (this.form.confirmPassword && this.form.password !== this.form.confirmPassword)
        this.errors.confirmPassword = this.$t('signUpPage.alerts.passwordMismatch');
      // ... (rest of logic) ...
    },
    validateForm() {
      this.errors = {};
      let valid = true;
      // UPDATED all error messages to use $t
      if (!this.form.companyName.trim()) {
        this.errors.companyName = this.$t('signUpPage.company.companyName') + ' ' + this.$t('signUpPage.alerts.allFields');
        valid = false;
      }
      if (!this.form.email.match(/^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[A-Za-z]{2,}$/)) {
        this.errors.email = this.$t('signUpPage.alerts.invalidEmail');
        valid = false;
      }
      // ... (password validation) ...
      if (this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword = this.$t('signUpPage.alerts.passwordMismatch');
        valid = false;
      }
      if (!this.form.phone.match(/^(010|011|012|015)\d{8}$/)) {
        this.errors.phone = this.$t('signUpPage.alerts.phoneDigits'); // Generic
        valid = false;
      }
      if (!this.form.city.trim()) {
        this.errors.city = this.$t('signUpPage.company.city') + ' ' + this.$t('signUpPage.alerts.allFields');
        valid = false;
      }
      return valid;
    },
    submit() {
      if (this.validateForm()) this.$emit("submit", this.form);
    },
  },
};
</script>

<style scoped>
/* ... (styles remain the same) ... */
</style>