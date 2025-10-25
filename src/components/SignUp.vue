<template>
  <div class="flex flex-col items-center justify-center min-h-screen w-full overflow-hidden pt-10">
    <h1 class="text-4xl font-bold text-accent-color mb-2">Sign Up</h1>
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
            ? 'bg-accent-color text-white'
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
          <h2 class="text-3xl font-bold mb-3 text-center text-accent-color">Client Registration</h2>

          <div class="grid grid-cols-2 gap-8 max-w-6xl mx-auto w-full">
            <div class="flex flex-col gap-5">
              <input v-model="formClient.name" type="text" placeholder="Full Name" class="p-4 border border-gray-300 rounded-xl" />
              <input v-model="formClient.email" type="email" placeholder="Email" class="p-4 border border-gray-300 rounded-xl" />
              <input v-model="formClient.password" type="password" placeholder="Password" class="p-4 border border-gray-300 rounded-xl" />
              <input v-model="formClient.confirmPassword" type="password" placeholder="Confirm Password" class="p-4 border border-gray-300 rounded-xl" />
            </div>
            <div class="flex flex-col gap-5">
              <input v-model="formClient.phone" type="text" placeholder="Phone Number" class="p-4 border border-gray-300 rounded-xl" />
              <input v-model="formClient.address" type="text" placeholder="Address" class="p-4 border border-gray-300 rounded-xl" />
              <input v-model="formClient.city" type="text" placeholder="City" class="p-4 border border-gray-300 rounded-xl" />
            </div>
          </div>

          <button
            @click="submitClient"
            class="mt-10 mx-auto  bg-accent-color text-white text-[20px] px-3 py-2 rounded-xl font-semibold transition cursor-pointer"
          >
            Sign Up
          </button>

       

          <p class="text-center mt-4 text-gray-500">
            Already have an account?
            <a :href="loginRoute" class="text-accent-color font-semibold hover:underline">Login here</a>
          </p>
        </div>

        <!-- Technician Form -->
        <div
          v-else-if="activeTab === 'Technician'"
          class="bg-white shadow-2xl rounded-3xl p-8 pt-4 w-[1200px] min-h-[550px] flex flex-col justify-start animate-fade-in mt-3 mb-3"
        >
          <h2 class="text-3xl font-bold mb-8 text-center text-accent-color ">Technician Registration</h2>

          <div class="flex justify-between mb-6 max-w-6xl mx-auto w-full">
            <div class="flex flex-col items-start ml-40">
              <label class="font-semibold mb-2">ID Card</label>
              <div
                @click="$refs.idCardInput.click()"
                class="w-32 h-32 rounded-full shadow-lg bg-[#f5f5f5] overflow-hidden flex items-center justify-center cursor-pointer hover:border-accent-color relative"
              >
                <!-- icon -->
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 512" class="w-[60px] h-[60px]">
                  <path fill="#5984c6" d="M0 96C0 60.7 28.7 32 64 32l448 0c35.3 0 64 28.7 64 64L0 96zm0 48l576 0 0 272c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 144zM247.3 416c20.2 0 35.3-19.4 22.4-35-14.7-17.7-36.9-29-61.7-29l-64 0c-24.8 0-47 11.3-61.7 29-12.9 15.6 2.2 35 22.4 35l142.5 0zM176 312a56 56 0 1 0 0-112 56 56 0 1 0 0 112zM360 208c-13.3 0-24 10.7-24 24s10.7 24 24 24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-112 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-112 0z"/>
                </svg>
                <div class="absolute bottom-6 left-5 z-50">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 512" class="w-[20px] h-[20px] ">
                    <path fill="#5984c6" d="M256 109.3L256 320c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-210.7-41.4 41.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l96-96c12.5-12.5 32.8-12.5 45.3 0l96 96c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 109.3zM224 400c44.2 0 80-35.8 80-80l80 0c35.3 0 64 28.7 64 64l0 32c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64l0-32c0-35.3 28.7-64 64-64l80 0c0 44.2 35.8 80 80 80zm144 24a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/>
                  </svg>
                </div>
              </div>
              <input ref="idCardInput" type="file" @change="previewIdCard" class="hidden" />
            </div>

            <div class="flex flex-col items-end mr-40">
              <label class="font-semibold mb-2">Profile Picture</label>
              <div
                @click="$refs.profileInput.click()"
                class="w-32 h-32 rounded-full shadow-lg bg-[#f5f5f5] overflow-hidden flex items-center justify-center cursor-pointer hover:border-accent-color relative"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 512" class="w-[60px] h-[60px]">
                  <path fill="#5984c6" d="M224 248a120 120 0 1 0 0-240 120 120 0 1 0 0 240zm-29.7 56C95.8 304 16 383.8 16 482.3 16 498.7 29.3 512 45.7 512l356.6 0c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3l-59.4 0z"/>
                </svg>
                <div class="absolute bottom-6 left-5 z-50">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 512" class="w-[20px] h-[20px] ">
                    <path fill="#5984c6" d="M256 109.3L256 320c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-210.7-41.4 41.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l96-96c12.5-12.5 32.8-12.5 45.3 0l96 96c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 109.3zM224 400c44.2 0 80-35.8 80-80l80 0c35.3 0 64 28.7 64 64l0 32c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64l0-32c0-35.3 28.7-64 64-64l80 0c0 44.2 35.8 80 80 80zm144 24a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/>
                  </svg>
                </div>
              </div>
              <input ref="profileInput" type="file" @change="previewProfile" class="hidden" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-8 max-w-6xl mx-auto w-full">
            <div class="flex flex-col gap-5">
              <input v-model="formTechnician.name" type="text" placeholder="Full Name" class=" text-[#000000] p-4 border border-gray-300 rounded-xl" />
              <input v-model="formTechnician.email" type="email" placeholder="Email" class="p-4 border border-gray-300 rounded-xl" />
              <input v-model="formTechnician.password" type="password" placeholder="Password" class="p-4 border border-gray-300 rounded-xl" />
              <input v-model="formTechnician.confirmPassword" type="password" placeholder="Confirm Password" class="p-4 border border-gray-300 rounded-xl" />
              <input v-model="formTechnician.phone" type="text" placeholder="Phone Number" class="p-4 border border-gray-300 rounded-xl" />
            </div>
            <div class="flex flex-col gap-5">
              <input v-model="formTechnician.skill" type="text" placeholder="Work type" class="p-4 border border-gray-300 rounded-xl" />
              <input v-model="formTechnician.city" type="text" placeholder="Work Area (City / Region)" class="p-4 border border-gray-300 rounded-xl" />
              <input v-model="formTechnician.experience" type="text" placeholder="Years of Experience" class="p-4 border border-gray-300 rounded-xl" />
              <input v-model="formTechnician.address" type="text" placeholder="Address" class="p-4 border border-gray-300 rounded-xl" />
              <input v-model="formTechnician.description" placeholder="Bio" class="p-4 border border-gray-300 rounded-2xl resize-none"/>
            </div>
          </div>

          <button
            @click="submitTechnician"
            class="mt-10 mx-auto  bg-accent-color text-white text-[20px] px-3 py-2 rounded-xl font-semibold transition cursor-pointer"
          >
            Sign Up
          </button>

     
          <p class="text-center mt-4 text-gray-500">
            Already have an account?
            <a :href="loginRoute" class="text-accent-color font-semibold hover:underline">Login here</a>
          </p>
        </div>

        <!-- Company Form -->
        <div
          v-else-if="activeTab === 'Company'"
          class="bg-white shadow-2xl rounded-3xl p-8 pt-6 w-[1200px] min-h-[600px] flex flex-col justify-start animate-fade-in mt-3 mb-3"
        >
          <h2 class="text-3xl font-bold mb-8 text-center text-accent-color">Company Registration</h2>

          <div class="flex justify-between mb-6 max-w-6xl mx-auto w-full">
            <div class="flex flex-col items-start ml-40">
              <label class="font-semibold mb-2">Tax Card</label>
              <div
                @click="$refs.crnInput.click()"
                class="w-32 h-32 rounded-full shadow-lg bg-[#f5f5f5] overflow-hidden flex items-center justify-center cursor-pointer hover:border-accent-color relative"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 512" class="w-[60px] h-[60px]">
                  <path fill="#5984c6" d="M0 96C0 60.7 28.7 32 64 32l448 0c35.3 0 64 28.7 64 64L0 96zm0 48l576 0 0 272c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 144zM247.3 416c20.2 0 35.3-19.4 22.4-35-14.7-17.7-36.9-29-61.7-29l-64 0c-24.8 0-47 11.3-61.7 29-12.9 15.6 2.2 35 22.4 35l142.5 0zM176 312a56 56 0 1 0 0-112 56 56 0 1 0 0 112zM360 208c-13.3 0-24 10.7-24 24s10.7 24 24 24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-112 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-112 0z"/>
                </svg>
                <div class="absolute bottom-6 left-5 z-50">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 512" class="w-[20px] h-[20px] ">
                    <path fill="#5984c6" d="M256 109.3L256 320c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-210.7-41.4 41.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l96-96c12.5-12.5 32.8-12.5 45.3 0l96 96c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 109.3zM224 400c44.2 0 80-35.8 80-80l80 0c35.3 0 64 28.7 64 64l0 32c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64l0-32c0-35.3 28.7-64 64-64l80 0c0 44.2 35.8 80 80 80zm144 24a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/>
                  </svg>
                </div>
              </div>
              <input ref="crnInput" type="file" @change="previewCrn" class="hidden" />
            </div>

            <div class="flex flex-col items-end mr-40">
              <label class="font-semibold mb-2">Company Logo</label>
              <div
                @click="$refs.logoInput.click()"
                class="w-32 h-32 rounded-full  shadow-lg bg-[#f5f5f5] overflow-hidden flex items-center justify-center cursor-pointer hover:border-accent-color relative"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 512" class="w-[60px] h-[60px]">
                  <path fill="#5984c6" d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-384c0-35.3-28.7-64-64-64L64 0zM176 352l32 0c17.7 0 32 14.3 32 32l0 80-96 0 0-80c0-17.7 14.3-32 32-32zM96 112c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM240 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zM96 240c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zm144-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0 8.8 7.2-16 16-16z"/>
                </svg>
                <div class="absolute bottom-6 left-5 z-50">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 512" class="w-[20px] h-[20px] ">
                    <path fill="#5984c6" d="M256 109.3L256 320c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-210.7-41.4 41.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l96-96c12.5-12.5 32.8-12.5 45.3 0l96 96c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 109.3zM224 400c44.2 0 80-35.8 80-80l80 0c35.3 0 64 28.7 64 64l0 32c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64l0-32c0-35.3 28.7-64 64-64l80 0c0 44.2 35.8 80 80 80zm144 24a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/>
                  </svg>
                </div>
              </div>
              <input ref="logoInput" type="file" @change="previewLogo" class="hidden" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-8 max-w-6xl mx-auto w-full">
            <div class="flex flex-col gap-5">
              <input v-model="formCompany.companyName" type="text" placeholder="Company Name" class="p-4 border border-gray-300 rounded-xl" />
              <input v-model="formCompany.email" type="email" placeholder="Email" class="p-4 border border-gray-300 rounded-xl" />
              <input v-model="formCompany.password" type="password" placeholder="Password" class="p-4 border border-gray-300 rounded-xl" />
              <input v-model="formCompany.confirmPassword" type="password" placeholder="Confirm Password" class="p-4 border border-gray-300 rounded-xl" />
              <input v-model="formCompany.phone" type="text" placeholder="Phone" class="p-4 border border-gray-300 rounded-xl" />
              <textarea v-model="formCompany.description" placeholder="Bio" class="p-4 border border-gray-300 rounded-2xl resize-none"></textarea>
            </div>
            <div class="flex flex-col gap-5">
              <input v-model="formCompany.address" type="text" placeholder="Address" class="p-4 border border-gray-300 rounded-xl" />
              <input v-model="formCompany.city" type="text" placeholder="City" class="p-4 border border-gray-300 rounded-xl" />
              <input v-model="formCompany.website" type="text" placeholder="Website / Social Links" class="p-4 border border-gray-300 rounded-xl" />
              <input v-model="formCompany.teamSize" type="text" placeholder="Team Size" class="p-4 border border-gray-300 rounded-xl" />
              <input v-model="formCompany.crn" type="text" placeholder="Company Registration Number (CRN)" class="p-4 border border-gray-300 rounded-xl" />
            </div>
          </div>

          <button
            @click="submitCompany"
            class="mt-10 mx-auto  bg-accent-color text-white text-[20px] px-3 py-2 rounded-xl font-semibold transition cursor-pointer"
          >
            Sign Up
          </button>

      

          <p class="text-center mt-4 text-gray-500">
            Already have an account?
            <a :href="loginRoute" class="text-accent-color font-semibold hover:underline">Login here</a>
          </p>
        </div>

      </div>
    </transition>
  </div>
</template>

<script>

import { auth, db, storage } from "@/firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

export default {
  data() {
    return {
      tabs: ["Client", "Technician", "Company"],
      activeTab: "Client",
      loginRoute: "/login",

      // forms
      formClient: {
        name: "", email: "", password: "", confirmPassword: "", phone: "", address: "", city: ""
      },
      formTechnician: {
        name: "", email: "", password: "", confirmPassword: "", phone: "", address: "",
        city: "", experience: "", skill: "", certification: "", availability: "", portfolio: "", description: "", profileImage: null, idCardImage: null
      },
      formCompany: {
        companyName: "", email: "", password: "", confirmPassword: "", phone: "", address: "",
        city: "", website: "", teamSize: "", crn: "", portfolio: "", description: "", logoImage: null, crnImage: null
      },

      // messages & previews
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

    // preview handlers (store File + create preview)
    previewProfile(e) {
      const file = e.target.files[0];
      if (file) { this.formTechnician.profileImage = file; this.profilePreview = URL.createObjectURL(file); }
    },
    previewIdCard(e) {
      const file = e.target.files[0];
      if (file) { this.formTechnician.idCardImage = file; this.idCardPreview = URL.createObjectURL(file); }
    },
    previewLogo(e) {
      const file = e.target.files[0];
      if (file) { this.formCompany.logoImage = file; this.logoPreview = URL.createObjectURL(file); }
    },
    previewCrn(e) {
      const file = e.target.files[0];
      if (file) { this.formCompany.crnImage = file; this.crnPreview = URL.createObjectURL(file); }
    },

    validateEmail(email) { return /\S+@\S+\.\S+/.test(email); },
    validatePhone(phone) { return phone === "" || /^\d+$/.test(phone); },

    // ---- CLIENT ----
    async submitClient() {
      const f = this.formClient;
      if (!f.name || !f.email || !f.password || !f.confirmPassword) { alert("Please fill required fields."); return; }
      if (!this.validateEmail(f.email)) { alert("Invalid email."); return; }
      if (f.password !== f.confirmPassword) { alert("Passwords do not match."); return; }
      if (!this.validatePhone(f.phone)) { alert("Phone must contain digits only."); return; }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, f.email, f.password);
        const user = userCredential.user;

        // Save only the form data (without password) to Firestore
        const payload = {
          uid: user.uid,
          name: f.name,
          email: f.email,
          phone: f.phone,
          address: f.address,
          city: f.city,
          userType: "client",
          status: "active",
          createdAt: new Date().toISOString()
        };

        await setDoc(doc(db, "clients", user.uid), payload);
     

        
        // clear
        Object.keys(f).forEach(k => (f[k] = ""));
        setTimeout(() => (this.successMessageClient = ""), 3000);
      } catch (err) {
        console.error("Client signup error:", err);
        alert(err.message || "Signup failed.");
      }
    },

    // ---- TECHNICIAN ----
    async submitTechnician() {
      const f = this.formTechnician;
      if (!f.name || !f.email || !f.password || !f.confirmPassword) { alert("Please fill required fields."); return; }
      if (!this.validateEmail(f.email)) { alert("Invalid email."); return; }
      if (f.password !== f.confirmPassword) { alert("Passwords do not match."); return; }
      if (!this.validatePhone(f.phone)) { alert("Phone must contain digits only."); return; }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, f.email, f.password);
        const user = userCredential.user;

        // upload images if present
        let profileUrl = "";
        let idCardUrl = "";

        if (f.profileImage) {
          const pRef = storageRef(storage, `technicians/${user.uid}/profile.jpg`);
          await uploadBytes(pRef, f.profileImage);
          profileUrl = await getDownloadURL(pRef);
        }
        if (f.idCardImage) {
          const idRef = storageRef(storage, `technicians/${user.uid}/idCard.jpg`);
          await uploadBytes(idRef, f.idCardImage);
          idCardUrl = await getDownloadURL(idRef);
        }

        const payload = {
          uid: user.uid,
          name: f.name,
          email: f.email,
          phone: f.phone,
          address: f.address,
          city: f.city,
          experience: f.experience,
          skill: f.skill,
          description: f.description || "",
          certification: f.certification || "",
          availability: f.availability || "",
          portfolio: f.portfolio || "",
          profileImage: profileUrl,
          idCardImage: idCardUrl,
          userType: "technician",
          status: "active",
          createdAt: new Date().toISOString()
        };

        await setDoc(doc(db, "technicians", user.uid), payload);
   
        this.$route.push('/login');
        
        // clear
        Object.keys(f).forEach(k => (f[k] = ""));
        this.profilePreview = null;
        this.idCardPreview = null;
        setTimeout(() => (this.successMessageTechnician = ""), 3000);
      } catch (err) {
        console.error("Technician signup error:", err);
        alert(err.message || "Signup failed.");
      }
    },

    // ---- COMPANY ----
    async submitCompany() {
      const f = this.formCompany;
      if (!f.companyName || !f.email || !f.password || !f.confirmPassword) { alert("Please fill required fields."); return; }
      if (!this.validateEmail(f.email)) { alert("Invalid email."); return; }
      if (f.password !== f.confirmPassword) { alert("Passwords do not match."); return; }
      if (!this.validatePhone(f.phone)) { alert("Phone must contain digits only."); return; }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, f.email, f.password);
        const user = userCredential.user;

        // upload images if present
        let logoUrl = "";
        let crnUrl = "";

        if (f.logoImage) {
          const lRef = storageRef(storage, `companies/${user.uid}/logo.jpg`);
          await uploadBytes(lRef, f.logoImage);
          logoUrl = await getDownloadURL(lRef);
        }
        if (f.crnImage) {
          const cRef = storageRef(storage, `companies/${user.uid}/crn.jpg`);
          await uploadBytes(cRef, f.crnImage);
          crnUrl = await getDownloadURL(cRef);
        }

        const payload = {
          uid: user.uid,
          companyName: f.companyName,
          email: f.email,
          phone: f.phone,
          address: f.address,
          city: f.city,
          website: f.website || "",
          teamSize: f.teamSize || "",
          crn: f.crn || "",
          description: f.description || "",
          portfolio: f.portfolio || "",
          logo: logoUrl,
          crnImage: crnUrl,
          userType: "company",
          status: "active",
          createdAt: new Date().toISOString()
        };

        await setDoc(doc(db, "companies", user.uid), payload);

      
        Object.keys(f).forEach(k => (f[k] = ""));
        this.logoPreview = null;
        this.crnPreview = null;
        setTimeout(() => (this.successMessageCompany = ""), 3000);
      } catch (err) {
        console.error("Company signup error:", err);
        alert(err.message || "Signup failed.");
      }
    }
  }
};
</script>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.message-fade-enter-active, .message-fade-leave-active { transition: opacity 0.5s; }
.message-fade-enter-from, .message-fade-leave-to { opacity: 0; }
</style>
