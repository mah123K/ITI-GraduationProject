<template>
  <div class="flex flex-col items-center justify-center min-h-screen w-full overflow-hidden pt-10">
    <h1 class="text-4xl font-bold text-accent-color mb-2">Sign Up</h1>
    <p class="text-gray-600 mb-8 text-lg">Create your account and get started today</p>
    <!-- Toast -->
    <transition name="fade">
      <div
        v-if="toast.visible"
        class="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md bg-opacity-90 transition-all duration-300"
        :class="{
          'bg-green-600/90 text-white': toast.type === 'success',
          'bg-red-600/90 text-white': toast.type === 'error',
          'bg-yellow-500/90 text-black': toast.type === 'warning',
        }"
      >
        <i v-if="toast.type === 'success'" class="fas fa-check-circle text-2xl"></i>
        <i v-else-if="toast.type === 'error'" class="fas fa-times-circle text-2xl"></i>
        <i v-else class="fas fa-info-circle text-2xl"></i>

        <p class="text-sm font-medium">{{ toast.message }}</p>
      </div>
    </transition>

    <Tabs :tabs="tabs" :activeTab="activeTab" @tab-change="toggleTab" />

    <transition name="fade">
      <div v-if="activeTab" class="w-full flex justify-center">
        <ClientForm
          v-if="activeTab === 'Client'"
          :loginRoute="loginRoute"
          @submit-form="submitClient"
          ref="clientForm"
        />

        <TechnicianForm
          v-else-if="activeTab === 'Technician'"
          :loginRoute="loginRoute"
          @submit-form="submitTechnician"
          ref="technicianForm"
        />

        <CompanyForm
          v-else-if="activeTab === 'Company'"
          :loginRoute="loginRoute"
          @submit-form="submitCompany"
          ref="companyForm"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import { auth, db } from "@/firebase/firebase";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Tabs from "./Tabs.vue";
import ClientForm from "./ClientForm.vue";
import TechnicianForm from "./TechnicianForm.vue";
import CompanyForm from "./CompanyForm.vue";

export default {
  components: {
    Tabs,
    ClientForm,
    TechnicianForm,
    CompanyForm,
  },
  data() {
    return {
      tabs: ["Client", "Technician", "Company"],
      activeTab: "Client",
      loginRoute: "/login",
      toast: { visible: false, message: "", type: "success" },
    };
  },
  methods: {
    toggleTab(tab) {
      this.activeTab = tab;
    },
    showToast(message, type = "success", duration = 3000) {
      this.toast = { visible: true, message, type };
      setTimeout(() => {
        this.toast.visible = false;
      }, duration);
    },
    getFriendlyErrorMessage(code) {
      const messages = {
        "auth/email-already-in-use": "This email is already registered. Please login instead.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/weak-password": "Your password is too weak. Try adding numbers or symbols.",
        "auth/missing-password": "Please enter a password.",
        "auth/network-request-failed": "Network error. Check your connection.",
        "auth/too-many-requests": "Too many attempts. Please try again later.",
      };
      return messages[code] || "An unexpected error occurred. Please try again.";
    },

    // ---- CLIENT ----
    async submitClient(formData) {
      try {
        this.$refs.clientForm.setSubmitting(true);

        const methods = await fetchSignInMethodsForEmail(auth, formData.email);
        if (methods.length > 0) {
          this.showToast("This email is already registered.", "error");
          this.$refs.clientForm.setSubmitting(false);
          return;
        }

        const { uploadImageOnly } = await import("@/composables/useImageUpload");
        let profileUrl = "";

        if (formData.profileImage instanceof File) {
          profileUrl = await uploadImageOnly(formData.profileImage);
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        const user = userCredential.user;

        const payload = {
          uid: user.uid,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          image: profileUrl || "",
          userType: "client",
          status: "active",
          createdAt: new Date().toISOString(),
        };

        await setDoc(doc(db, "clients", user.uid), payload);

        this.showToast("Client registered successfully!", "success");
        setTimeout(() => this.$router.push("/login"), 1500);
      } catch (err) {
        console.error("Client signup error:", err);
        const friendly = this.getFriendlyErrorMessage(err.code);
        this.showToast(friendly, "error");
      } finally {
        this.$refs.clientForm.setSubmitting(false);
      }
    },
    // ---- TECHNICIAN ----
    async submitTechnician(formData) {
      try {
        this.$refs.technicianForm?.setSubmitting(true);

        const methods = await fetchSignInMethodsForEmail(auth, formData.email);
        if (methods.length > 0) {
          this.showToast("This email is already registered.", "error");
          this.$refs.technicianForm?.setSubmitting(false);
          return;
        }

        const { uploadImageOnly } = await import("@/composables/useImageUpload");
        let profileUrl = "";
        let idCardUrl = "";

        if (formData.profileImage instanceof File) {
          profileUrl = await uploadImageOnly(formData.profileImage);
        }
        if (formData.idCardImage instanceof File) {
          idCardUrl = await uploadImageOnly(formData.idCardImage);
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = userCredential.user;

        const payload = {
          uid: user.uid,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || "",
          address: formData.address || "",
          experience: formData.experience || "",
          skill: formData.skill || "",
          bio: formData.bio || "",
          certification: formData.certification || "",
          availability: formData.availability || "",
          portfolio: formData.portfolio || "",
          profileImage: profileUrl,
          idCardImage: idCardUrl,
          userType: "technician",
          status: "Active",
          createdAt: new Date().toISOString(),
        };

        await setDoc(doc(db, "technicians", user.uid), payload);

        this.showToast("Technician registered successfully!", "success");
        setTimeout(() => this.$router.push("/login"), 1500);
      } catch (err) {
        console.error("Technician signup error:", err);
        const friendly = this.getFriendlyErrorMessage(err.code);
        this.showToast(friendly, "error");
      } finally {
        this.$refs.technicianForm?.setSubmitting(false);
      }
    },
    // ---- COMPANY ----
    async submitCompany(formData) {
      try {
        this.$refs.companyForm.setSubmitting(true);

        // ✅ 1. تأكيد إن الإيميل مش مستخدم
        const methods = await fetchSignInMethodsForEmail(auth, formData.email);
        if (methods.length > 0) {
          this.showToast("This email is already registered.", "error");
          this.$refs.companyForm.setSubmitting(false);
          return;
        }

        // ✅ 2. رفع الصور
        const { uploadImageOnly } = await import("@/composables/useImageUpload");
        let logoUrl = "";
        let crnUrl = "";

        if (formData.logoImage instanceof File) {
          logoUrl = await uploadImageOnly(formData.logoImage);
        }
        if (formData.crnImage instanceof File) {
          crnUrl = await uploadImageOnly(formData.crnImage);
        }

        // ✅ 3. إنشاء المستخدم
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = userCredential.user;

        // ✅ 4. حفظ البيانات في Firestore
        const payload = {
          uid: user.uid,
          companyName: formData.companyName,
          username: formData.username || formData.companyName.toLowerCase().replace(/\s+/g, "_"),
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          website: formData.website || "",
          teamSize: formData.teamSize || "",
          crn: formData.crn || "",
          description: formData.description || "",
          logoImage: logoUrl || "",
          crnImage: crnUrl || "",
          userType: "company",
          status: "pending",
          createdAt: new Date().toISOString(),
        };

        await setDoc(doc(db, "companies", user.uid), payload);

        this.showToast("Company registered successfully!", "success");
        setTimeout(() => this.$router.push("/login"), 1500);
      } catch (err) {
        console.error("Company signup error:", err);
        const friendly = this.getFriendlyErrorMessage(err.code);
        this.showToast(friendly, "error");
      } finally {
        this.$refs.companyForm.setSubmitting(false);
      }
    },
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.message-fade-enter-active,
.message-fade-leave-active {
  transition: opacity 0.5s;
}
.message-fade-enter-from,
.message-fade-leave-to {
  opacity: 0;
}
</style>
