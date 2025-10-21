<script>
export default {
  data() {
    return {
      tabs: ["Client", "Technician", "Company"],
      activeTab: "Client",
      loginRoute: "/login",

      formClient: { name: "", email: "", password: "", confirmPassword: "", phone: "", address: "", city: "" },
      formTechnician: { name: "", email: "", password: "", confirmPassword: "", phone: "", address: "", city: "", experience: "", skill: "", certification: "", availability: "", portfolio: "", description: "", profileImage: null, idCardImage: null },
      formCompany: { companyName: "", email: "", password: "", confirmPassword: "", phone: "", address: "", city: "", website: "", teamSize: "", crn: "", portfolio: "", description: "", logoImage: null, crnImage: null },

      successMessageClient: "",
      successMessageTechnician: "",
      successMessageCompany: "",

      profilePreview: null,
      idCardPreview: null,
      logoPreview: null,
      crnPreview: null
    };
  },
  methods: {
    toggleTab(tab) { this.activeTab = tab; },

    previewProfile(event) {
      const file = event.target.files[0];
      if (file) { this.formTechnician.profileImage = file; this.profilePreview = URL.createObjectURL(file); }
    },
    previewIdCard(event) {
      const file = event.target.files[0];
      if (file) { this.formTechnician.idCardImage = file; this.idCardPreview = URL.createObjectURL(file); }
    },
    previewLogo(event) {
      const file = event.target.files[0];
      if (file) { this.formCompany.logoImage = file; this.logoPreview = URL.createObjectURL(file); }
    },
    previewCrn(event) {
      const file = event.target.files[0];
      if (file) { this.formCompany.crnImage = file; this.crnPreview = URL.createObjectURL(file); }
    },

    validateEmail(email) { return /\S+@\S+\.\S+/.test(email); },
    validatePhone(phone) { return /^\d+$/.test(phone); },

    submitClient() {
      if (!this.formClient.name || !this.formClient.email || !this.formClient.password || !this.formClient.confirmPassword) { alert("Please fill all required fields!"); return; }
      if (!this.validateEmail(this.formClient.email)) { alert("Invalid email!"); return; }
      if (this.formClient.password !== this.formClient.confirmPassword) { alert("Passwords do not match!"); return; }
      if (!this.validatePhone(this.formClient.phone)) { alert("Phone number should contain digits only!"); return; }

      console.log("Client Data:", this.formClient);
      this.successMessageClient = "Client data submitted!";
      setTimeout(() => (this.successMessageClient = ""), 3000);
      Object.keys(this.formClient).forEach(k => (this.formClient[k] = ""));
    },

    submitTechnician() {
      if (!this.formTechnician.name || !this.formTechnician.email || !this.formTechnician.password || !this.formTechnician.confirmPassword) { alert("Please fill all required fields!"); return; }
      if (!this.validateEmail(this.formTechnician.email)) { alert("Invalid email!"); return; }
      if (this.formTechnician.password !== this.formTechnician.confirmPassword) { alert("Passwords do not match!"); return; }
      if (!this.validatePhone(this.formTechnician.phone)) { alert("Phone number should contain digits only!"); return; }
      if (!this.formTechnician.profileImage || !this.formTechnician.idCardImage) { alert("Please upload profile and ID card images!"); return; }

      console.log("Technician Data:", this.formTechnician);
      this.successMessageTechnician = "Technician data submitted!";
      setTimeout(() => (this.successMessageTechnician = ""), 3000);
      Object.keys(this.formTechnician).forEach(k => this.formTechnician[k] = "");
      this.profilePreview = null;
      this.idCardPreview = null;
    },

    submitCompany() {
      if (!this.formCompany.companyName || !this.formCompany.email || !this.formCompany.password || !this.formCompany.confirmPassword) { alert("Please fill all required fields!"); return; }
      if (!this.validateEmail(this.formCompany.email)) { alert("Invalid email!"); return; }
      if (this.formCompany.password !== this.formCompany.confirmPassword) { alert("Passwords do not match!"); return; }
      if (!this.validatePhone(this.formCompany.phone)) { alert("Phone number should contain digits only!"); return; }

      console.log("Company Data:", this.formCompany);
      this.successMessageCompany = "Company data submitted!";
      setTimeout(() => (this.successMessageCompany = ""), 3000);
      Object.keys(this.formCompany).forEach(k => (this.formCompany[k] = ""));
      this.logoPreview = null;
      this.crnPreview = null;
    }
  }
};
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen w-full overflow-hidden pt-25">
    <h1 class="text-4xl font-bold text-[#5984C6] mb-2">Sign Up</h1>
    <p class="text-gray-600 mb-8 text-lg">Create your account and get started today</p>

    <!-- Tabs -->
    <div class="flex rounded-2xl overflow-hidden h-[50px] w-full max-w-[1200px] mb-0">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="toggleTab(tab)"
        :class="[
          'flex-1 px-8 py-3 font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300',
          activeTab === tab
            ? 'bg-[#5984C6] text-white'
            : 'bg-[#DAECF6] text-gray-700 hover:bg-gray-200'
        ]"
      >
        <span v-if="tab === 'Client'"><i class="fa-solid fa-user"></i></span>
        <span v-else-if="tab === 'Technician'"><i class="fa-solid fa-screwdriver-wrench"></i></span>
        <span v-else><i class="fa-solid fa-building"></i></span>
        {{ tab }}
      </button>
    </div>

    <transition name="fade">
      <div v-if="activeTab" class="w-full flex justify-center">

        <!-- Client Form -->
        <div
          v-if="activeTab === 'Client'"
          class="bg-white shadow-2xl rounded-3xl p-8 pt-4 w-[1200px] min-h-[500px] flex flex-col justify-start animate-fade-in mt-3 mb-3"
        >
          <h2 class="text-3xl font-bold mb-3 text-center">Client Registration</h2>

          <div class="grid grid-cols-2 gap-8 max-w-6xl mx-auto w-full">
            <div class="flex flex-col gap-5">
              <input v-model="formClient.name" type="text" placeholder="Full Name" class="p-4 border border-gray-300 rounded-full" />
              <input v-model="formClient.email" type="email" placeholder="Email" class="p-4 border border-gray-300 rounded-full" />
              <input v-model="formClient.password" type="password" placeholder="Password" class="p-4 border border-gray-300 rounded-full" />
              <input v-model="formClient.confirmPassword" type="password" placeholder="Confirm Password" class="p-4 border border-gray-300 rounded-full" />
            </div>
            <div class="flex flex-col gap-5">
              <input v-model="formClient.phone" type="text" placeholder="Phone Number" class="p-4 border border-gray-300 rounded-full" />
              <input v-model="formClient.address" type="text" placeholder="Address" class="p-4 border border-gray-300 rounded-full" />
              <input v-model="formClient.city" type="text" placeholder="City" class="p-4 border border-gray-300 rounded-full" />
            </div>
          </div>

          <button
            @click="submitClient"
            class="mt-10 mx-auto w-[200px] bg-[#5984C6] text-white text-[26px] py-4 rounded-full font-semibold hover:bg-blue-700 transition"
          >
            Sign Up
          </button>

          <transition name="message-fade">
            <p v-if="successMessageClient" class="text-green-600 text-center mt-4 font-semibold flex items-center justify-center gap-2">
              <i class="fa-solid fa-circle-check"></i> {{ successMessageClient }}
            </p>
          </transition>

          <p class="text-center mt-4 text-gray-500">
            Already have an account?
            <a :href="loginRoute" class="text-[#5984C6] font-semibold hover:underline">Login here</a>
          </p>
        </div>

        <!-- Technician Form -->
        <div
          v-else-if="activeTab === 'Technician'"
          class="bg-white shadow-2xl rounded-3xl p-8 pt-4 w-[1200px] min-h-[550px] flex flex-col justify-start animate-fade-in mt-3 mb-3"
        >
          <h2 class="text-3xl font-bold mb-8 text-center">Technician Registration</h2>


          <div class="flex justify-between mb-6 max-w-6xl mx-auto w-full">

            <div class="flex flex-col items-start ml-40">
              <label class="font-semibold mb-2">ID Card</label>
              <div
                @click="$refs.idCardInput.click()"
                class="w-32 h-32 rounded-full border-2 border-gray-300 overflow-hidden flex items-center justify-center cursor-pointer hover:border-[#5984C6] relative"
              >
                <img v-if="idCardPreview" :src="idCardPreview" class="w-full h-full object-cover" />
                <i v-else class="fa-solid fa-id-card text-gray-400 text-3xl"></i>
              </div>
              <input ref="idCardInput" type="file" @change="previewIdCard" class="hidden" />
            </div>


            <div class="flex flex-col items-end mr-40">
              <label class="font-semibold mb-2">Profile Picture</label>
              <div
                @click="$refs.profileInput.click()"
                class="w-32 h-32 rounded-full border-2 border-gray-300 overflow-hidden flex items-center justify-center cursor-pointer hover:border-[#5984C6] relative"
              >
                <img v-if="profilePreview" :src="profilePreview" class="w-full h-full object-cover" />
                <i v-else class="fa-solid fa-user text-gray-400 text-3xl"></i>
              </div>
              <input ref="profileInput" type="file" @change="previewProfile" class="hidden" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-8 max-w-6xl mx-auto w-full">
            <div class="flex flex-col gap-5">
              <input v-model="formTechnician.name" type="text" placeholder="Full Name" class="p-4 border border-gray-300 rounded-full" />
              <input v-model="formTechnician.email" type="email" placeholder="Email" class="p-4 border border-gray-300 rounded-full" />
              <input v-model="formTechnician.password" type="password" placeholder="Password" class="p-4 border border-gray-300 rounded-full" />
              <input v-model="formTechnician.confirmPassword" type="password" placeholder="Confirm Password" class="p-4 border border-gray-300 rounded-full" />
              <input v-model="formTechnician.phone" type="text" placeholder="Phone Number" class="p-4 border border-gray-300 rounded-full" />
              <textarea v-model="formTechnician.description" placeholder="Description / Bio" class="p-4 border border-gray-300 rounded-2xl resize-none"></textarea>
            </div>
            <div class="flex flex-col gap-5">
              <input v-model="formTechnician.skill" type="text" placeholder="Work type" class="p-4 border border-gray-300 rounded-full" />
              <input v-model="formTechnician.availability" type="text" placeholder="Hourly Rate / Price Range" class="p-4 border border-gray-300 rounded-full" />
              <input v-model="formTechnician.city" type="text" placeholder="Work Area (City / Region)" class="p-4 border border-gray-300 rounded-full" />
              <input v-model="formTechnician.experience" type="text" placeholder="Years of Experience" class="p-4 border border-gray-300 rounded-full" />
              <input v-model="formTechnician.address" type="text" placeholder="Address" class="p-4 border border-gray-300 rounded-full" />
              <textarea v-model="formTechnician.portfolio" placeholder="Portfolio (Upload or links)" class="p-4 border border-gray-300 rounded-2xl resize-none"></textarea>
            </div>
          </div>

          <button
            @click="submitTechnician"
            class="mt-10 mx-auto w-[200px] bg-[#5984C6] text-white text-[26px] py-4 rounded-full font-semibold hover:bg-blue-700 transition"
          >
            Sign Up
          </button>

          <transition name="message-fade">
            <p v-if="successMessageTechnician" class="text-green-600 text-center mt-4 font-semibold flex items-center justify-center gap-2">
              <i class="fa-solid fa-circle-check"></i> {{ successMessageTechnician }}
            </p>
          </transition>

          <p class="text-center mt-4 text-gray-500">
            Already have an account?
            <a :href="loginRoute" class="text-[#5984C6] font-semibold hover:underline">Login here</a>
          </p>
        </div>

        <!-- Company Form -->
        <div
          v-else-if="activeTab === 'Company'"
          class="bg-white shadow-2xl rounded-3xl p-8 pt-6 w-[1200px] min-h-[600px] flex flex-col justify-start animate-fade-in mt-3 mb-3"
        >
          <h2 class="text-3xl font-bold mb-8 text-center ">Company Registration</h2>


          <div class="flex justify-between mb-6 max-w-6xl mx-auto w-full">

            <div class="flex flex-col items-start ml-40">
              <label class="font-semibold mb-2">Company Registration</label>
              <div
                @click="$refs.crnInput.click()"
                class="w-32 h-32 rounded-full border-2 border-gray-300 overflow-hidden flex items-center justify-center cursor-pointer hover:border-[#5984C6] relative"
              >
                <img v-if="crnPreview" :src="crnPreview" class="w-full h-full object-cover" />
                <i v-else class="fa-solid fa-file text-gray-400 text-3xl"></i>
              </div>
              <input ref="crnInput" type="file" @change="previewCrn" class="hidden" />
            </div>


            <div class="flex flex-col items-end mr-40">
              <label class="font-semibold mb-2">Company Logo</label>
              <div
                @click="$refs.logoInput.click()"
                class="w-32 h-32 rounded-full border-2 border-gray-300 overflow-hidden flex items-center justify-center cursor-pointer hover:border-[#5984C6] relative"
              >
                <img v-if="logoPreview" :src="logoPreview" class="w-full h-full object-cover" />
                <i v-else class="fa-solid fa-building text-gray-400 text-3xl"></i>
              </div>
              <input ref="logoInput" type="file" @change="previewLogo" class="hidden" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-8 max-w-6xl mx-auto w-full">
            <div class="flex flex-col gap-5">
              <input v-model="formCompany.companyName" type="text" placeholder="Company Name" class="p-4 border border-gray-300 rounded-full" />
              <input v-model="formCompany.email" type="email" placeholder="Email" class="p-4 border border-gray-300 rounded-full" />
              <input v-model="formCompany.password" type="password" placeholder="Password" class="p-4 border border-gray-300 rounded-full" />
              <input v-model="formCompany.confirmPassword" type="password" placeholder="Confirm Password" class="p-4 border border-gray-300 rounded-full" />
              <input v-model="formCompany.phone" type="text" placeholder="Phone" class="p-4 border border-gray-300 rounded-full" />
              <textarea v-model="formCompany.description" placeholder="Description / Bio" class="p-4 border border-gray-300 rounded-2xl resize-none"></textarea>
            </div>
            <div class="flex flex-col gap-5">
              <input v-model="formCompany.address" type="text" placeholder="Address" class="p-4 border border-gray-300 rounded-full" />
              <input v-model="formCompany.city" type="text" placeholder="City" class="p-4 border border-gray-300 rounded-full" />
              <input v-model="formCompany.website" type="text" placeholder="Website / Social Links" class="p-4 border border-gray-300 rounded-full" />
              <input v-model="formCompany.teamSize" type="text" placeholder="Team Size" class="p-4 border border-gray-300 rounded-full" />
              <input v-model="formCompany.crn" type="text" placeholder="Company Registration Number (CRN)" class="p-4 border border-gray-300 rounded-full" />
              <textarea v-model="formCompany.portfolio" placeholder="Portfolio (Upload or links)" class="p-4 border border-gray-300 rounded-2xl resize-none"></textarea>
            </div>
          </div>

          <button
            @click="submitCompany"
            class="mt-10 mx-auto w-[200px] bg-[#5984C6] text-white text-[26px] py-4 rounded-full font-semibold hover:bg-blue-700 transition"
          >
            Sign Up
          </button>

          <transition name="message-fade">
            <p v-if="successMessageCompany" class="text-green-600 text-center mt-4 font-semibold flex items-center justify-center gap-2">
              <i class="fa-solid fa-circle-check"></i> {{ successMessageCompany }}
            </p>
          </transition>

          <p class="text-center mt-4 text-gray-500">
            Already have an account?
            <a :href="loginRoute" class="text-[#5984C6] font-semibold hover:underline">Login here</a>
          </p>
        </div>

      </div>
    </transition>
  </div>
</template>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.message-fade-enter-active, .message-fade-leave-active { transition: opacity 0.5s; }
.message-fade-enter-from, .message-fade-leave-to { opacity: 0 }
</style>