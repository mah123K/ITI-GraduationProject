<template>
  <div
    class="bg-white shadow-2xl rounded-3xl p-8 pt-4 w-[1200px] min-h-[500px] flex flex-col justify-start animate-fade-in mt-3 mb-3"
  >
    <h2 class="text-3xl font-bold mb-3 text-center text-accent-color">
      {{ $t('signUpPage.technician.title') }}
    </h2>

   <div class="flex justify-between mb-6 max-w-6xl mx-auto w-full rtl:flex-row-reverse">
      <div class="flex flex-col items-start ml-40 rtl:ml-50 rtl:mr-40">
        <label class="font-semibold mb-2">{{ $t('signUpPage.technician.idCard') }}</label>
        <div
          @click.stop="$refs.idCardInput.click()"
          class="w-32 h-32 rounded-full shadow-lg bg-[#f5f5f5] overflow-hidden flex items-center justify-center cursor-pointer hover:border-accent-color relative"
        >
          </div>
        <input ref="idCardInput" type="file" @change="previewIDImage" class="hidden" />
      </div>

      <div class="flex flex-col items-end mr-40 rtl:mr-50 rtl:ml-40">
        <label class="font-semibold mb-2">{{ $t('signUpPage.technician.profilePic') }}</label>
        <div
          @click.stop="$refs.profileInput.click()"
          class="w-32 h-32 rounded-full shadow-lg bg-[#f5f5f5] overflow-hidden flex items-center justify-center cursor-pointer hover:border-accent-color relative"
        >
          </div>
        <input ref="profileInput" type="file" @change="previewTechProfile" class="hidden" />
      </div>
    </div>

    <div class="max-w-6xl mx-auto w-full space-y-6">
      <div class="grid grid-cols-2 gap-8">
        <div>
          <input
            v-model="form.name"
            type="text"
            :placeholder="$t('signUpPage.technician.fullName')"
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
            :placeholder="$t('signUpPage.technician.email')"
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
            :placeholder="$t('signUpPage.technician.password')"
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
            :placeholder="$t('signUpPage.technician.confirmPassword')"
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
            :placeholder="$t('signUpPage.technician.phone')"
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
            placeholder="Country *"
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
            :placeholder="$t('signUpPage.technician.address')"
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
            :placeholder="$t('signUpPage.technician.workArea')"
            required
            :class="inputClass(errors.city)"
            @input="clearError('city')"
            class="rtl:text-right"
          />
          <p v-if="errors.city" class="text-red-500 text-sm mt-1 rtl:text-right">{{ errors.city }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-8">
        <div>
          <input
            v-model="form.workType"
            type="text"
            :placeholder="$t('signUpPage.technician.skill')"
            required
            :class="inputClass(errors.workType)"
            @input="clearError('workType')"
            class="rtl:text-right"
          />
          <p v-if="errors.workType" class="text-red-500 text-sm mt-1 rtl:text-right">{{ errors.workType }}</p>
        </div>
        <div>
          <input
            v-model="form.experience"
            type="number"
            :placeholder="$t('signUpPage.technician.experience')"
            required
            :class="inputClass(errors.experience)"
            @input="clearError('experience')"
            class="rtl:text-right"
          />
          <p v-if="errors.experience" class="text-red-500 text-sm mt-1 rtl:text-right">{{ errors.experience }}</p>
        </div>
      </div>

      <div>
        <textarea
          v-model="form.bio"
          rows="3"
          :placeholder="$t('signUpPage.technician.bio')"
          class="w-full p-4 border rounded-xl border-gray-300 focus:ring-2 focus:ring-accent-color focus:outline-none resize-none rtl:text-right"
        ></textarea>
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
      <a
        :href="loginRoute"
        class="text-accent-color font-semibold hover:underline"
      >
        {{ $t('signUpPage.loginLink') }}
      </a>
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
      profileTechPreview: null,
      idCardPreview: null, // Added this
      errors: {},
      form: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: {
          street: "",
          city: "",
          country: "Egypt",
        },
        workType: "",
        experience: "",
        bio: "",
        profileImage: null,
        idImage: null,
      },
    };
  },
  methods: {
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

    previewTechProfile(e) {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          // UPDATED
          this.errors.profileImage = this.$t('signUpPage.alerts.imageSize');
          return;
        }
        this.form.profileImage = file;
        this.profileTechPreview = URL.createObjectURL(file);
      }
    },
    previewIDImage(e) {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          // UPDATED
          this.errors.idImage = this.$t('signUpPage.alerts.imageSize');
          return;
        }
        this.form.idImage = file;
        this.idCardPreview = URL.createObjectURL(file); // Added preview
        this.errors.idImage = "";
      }
    },
    validatePasswordLive() {
      // ... (validation logic) ...
      // UPDATED
      if (this.form.confirmPassword && this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword = this.$t('signUpPage.alerts.passwordMismatch');
      }
    },
    validateForm() {
      const e = {};
      let valid = true;

      // UPDATED all error messages to use $t
      if (!this.form.name.trim()) {
        e.name = this.$t('signUpPage.technician.fullName') + ' ' + this.$t('signUpPage.alerts.allFields');
        valid = false;
      }
      // ... (rest of validation) ...
      if (!this.form.email.trim()) {
        e.email = this.$t('signUpPage.technician.email') + ' ' + this.$t('signUpPage.alerts.allFields');
        valid = false;
      } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(this.form.email)) {
        e.email = this.$t('signUpPage.alerts.invalidEmail');
        valid = false;
      }
      if (!this.form.password.trim()) {
        e.password = this.$t('signUpPage.technician.password') + ' ' + this.$t('signUpPage.alerts.allFields');
        valid = false;
      }
      // ...
      if (!this.form.confirmPassword.trim()) {
        e.confirmPassword = this.$t('signUpPage.technician.confirmPassword') + ' ' + this.$t('signUpPage.alerts.allFields');
        valid = false;
      } else if (this.form.password !== this.form.confirmPassword) {
        e.confirmPassword = this.$t('signUpPage.alerts.passwordMismatch');
        valid = false;
      }
      if (!this.form.phone.trim()) {
        e.phone = this.$t('signUpPage.technician.phone') + ' ' + this.$t('signUpPage.alerts.allFields');
        valid = false;
      } else if (!/^(010|011|012|015)\d{8}$/.test(this.form.phone)) {
        e.phone = this.$t('signUpPage.alerts.phoneDigits'); // Generic
        valid = false;
      }
      if (!this.form.address.street.trim()) {
        e.street = this.$t('signUpPage.technician.address') + ' ' + this.$t('signUpPage.alerts.allFields');
        valid = false;
      }
      if (!this.form.address.city.trim()) {
        e.city = this.$t('signUpPage.technician.workArea') + ' ' + this.$t('signUpPage.alerts.allFields');
        valid = false;
      }
      if (!this.form.workType.trim()) {
        e.workType = this.$t('signUpPage.technician.skill') + ' ' + this.$t('signUpPage.alerts.allFields');
        valid = false;
      }
      if (!this.form.experience.trim()) {
        e.experience = this.$t('signUpPage.technician.experience') + ' ' + this.$t('signUpPage.alerts.allFields');
        valid = false;
      }
      if (!this.form.idImage) {
        e.idImage = this.$t('signUpPage.technician.idCard') + ' ' + this.$t('signUpPage.alerts.allFields');
        valid = false;
      }

      this.errors = e;
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