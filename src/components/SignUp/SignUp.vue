<template>
  <div class="flex flex-col items-center justify-center min-h-screen w-full overflow-hidden pt-10">
    <h1 class="text-4xl font-bold text-accent-color mb-2">Sign Up</h1>
    <p class="text-gray-600 mb-8 text-lg">Create your account and get started today</p>

    <!-- Toast (global for this parent component) -->
    <transition name="fade">
      <div
        v-if="toast.visible"
        :class="[
          'fixed top-6 right-6 px-4 py-2 rounded-lg shadow-lg text-white z-50',
          toast.type === 'error' ? 'bg-red-500' : 'bg-green-500',
        ]"
      >
        {{ toast.message }}
      </div>
    </transition>

    <Tabs :tabs="tabs" :activeTab="activeTab" @tab-change="toggleTab" />

    <transition name="fade">
      <div v-if="activeTab" class="w-full flex justify-center">
        <ClientForm
          v-if="activeTab === 'Client'"
          :loginRoute="loginRoute"
          @submit="submitClient"
          ref="clientForm"
        />

        <TechnicianForm
          v-else-if="activeTab === 'Technician'"
          :loginRoute="loginRoute"
          @submit="submitTechnician"
          ref="technicianForm"
        />

        <CompanyForm
          v-else-if="activeTab === 'Company'"
          :loginRoute="loginRoute"
          @submit="submitCompany"
          ref="companyForm"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import { auth, db, storage } from "@/firebase/firebase";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
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

    // ---- CLIENT ----
    async submitClient(formData) {
      try {
        // Ensure username fallback
        if (!formData.username && formData.name) {
          formData.username = formData.name.toLowerCase().replace(/\s+/g, "_");
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = userCredential.user;

        // let profileUrl = ;
        // if (formData.profileImage) {
        //   try {
        //     const pRef = storageRef(storage, `clients/${user.uid}/profile.jpg`);
        //     await uploadBytes(pRef, formData.profileImage);
        //     profileUrl = await getDownloadURL(pRef);
        //   } catch (imgErr) {
        //     console.error("Profile image upload failed:", imgErr);
        //   }
        // }

        const payload = {
          uid: user.uid,
          name: formData.name,
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          address: {
            street: formData.address?.street || "",
            city: formData.address?.city || "",
            country: formData.address?.country || "Egypt",
            lat: formData.address?.lat,
            lng: formData.address?.lng,
          },
          image: formData.profileImage || "",
          userType: "client",
          status: "active",
          createdAt: new Date().toISOString(),
          orders: [],
          lastLogin: new Date().toISOString(),
          notifications: [],
          settings: {
            emailNotifications: true,
            language: "ar",
          },
        };

        await setDoc(doc(db, "clients", user.uid), payload);
        this.$router.push("/login");
      } catch (err) {
        console.error("Client signup error:", err);
        // Firebase errors will be handled by the form component
      }
    },

    // ---- TECHNICIAN ----
    async submitTechnician(formData) {
      try {
        // Ensure username fallback
        if (!formData.username && formData.name) {
          const base = formData.name.toLowerCase().replace(/\s+/g, "_");
          formData.username = formData.skill
            ? `${base}_${formData.skill.toLowerCase().replace(/\s+/g, "_")}`
            : base;
        }

        // Basic validation
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          return;
        }
        // Tell child form to show submitting state (immediate UX feedback)
        if (
          this.$refs.technicianForm &&
          typeof this.$refs.technicianForm.setSubmitting === "function"
        ) {
          this.$refs.technicianForm.setSubmitting(true);
        }

        // Check email exists first (optional but gives nicer UX)
        try {
          const methods = await fetchSignInMethodsForEmail(auth, formData.email);
          if (methods.length > 0) {
            // show toast for already registered email
            this.showToast("This email is already registered. Please login.", "error");
            // ensure child button re-enabled
            if (
              this.$refs.technicianForm &&
              typeof this.$refs.technicianForm.setSubmitting === "function"
            ) {
              this.$refs.technicianForm.setSubmitting(false);
            }
            return;
          }
        } catch (fetchErr) {
          // fetchSignInMethodsForEmail failed — we'll try to continue (or it will be caught below)
          console.warn("Could not pre-check email methods:", fetchErr);
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = userCredential.user;
        let profileUrl = formData.profileImage || "";
        let idCardUrl = formData.idCardImage || "";
        const payload = {
          uid: user.uid,
          name: formData.name,
          username: formData.username,
          email: formData.email,
          phone: formData.phone || "",
          address: formData.address || "",
          city: formData.city || "",
          experience: formData.experience || "",
          skill: formData.skill || "",
          bio: formData.bio || "",
          certification: formData.certification || "",
          availability: formData.availability || "",
          portfolio: formData.portfolio || "",
          profileImage: profileUrl || "",
          idCardImage: idCardUrl || "",
          userType: "technician",
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        await setDoc(doc(db, "technicians", user.uid), payload);

        // show success toast (instead of alert)
        // this.showToast("Technician registered successfully!", "success");

        // tell child form to show success state (immediate UX feedback)
        if (
          this.$refs.technicianForm &&
          typeof this.$refs.technicianForm.setSuccess === "function"
        ) {
          this.$refs.technicianForm.setSuccess(true);
        } else {
          // show success toast (instead of alert)
          this.showToast("Technician registered successfully!", "success");
        }

        // ensure child button re-enabled before routing
        if (
          this.$refs.technicianForm &&
          typeof this.$refs.technicianForm.setSubmitting === "function"
        ) {
          this.$refs.technicianForm.setSubmitting(false);
        }

        setTimeout(() => {
          this.$router.push("/technician-dashboard");
        }, 2000);
      } catch (err) {
        console.error("Technician signup error:", err);
        // specific Firebase email already in use case (defensive)
        if (err && err.code === "auth/email-already-in-use") {
          this.showToast("This email is already registered.", "error");
        } else {
          // show general error toast
          this.showToast(err.message || "Registration failed. Please try again.", "error");
        }

        // ensure child button re-enabled
        if (
          this.$refs.technicianForm &&
          typeof this.$refs.technicianForm.setSubmitting === "function"
        ) {
          this.$refs.technicianForm.setSubmitting(false);
        }

        // keep alert fallback (you had alerts in the original)
        // alert(err.message || "Registration failed. Please try again.");
      }
    },

    // ---- COMPANY ----
    async submitCompany(formData) {
      try {
        // Ensure username fallback
        if (!formData.username && formData.companyName) {
          formData.username = formData.companyName.toLowerCase().replace(/\s+/g, "_");
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = userCredential.user;

        let logoUrl = "";
        let crnUrl = "";

        if (formData.logoImage) {
          const lRef = storageRef(storage, `companies/${user.uid}/logo.jpg`);
          await uploadBytes(lRef, formData.logoImage);
          logoUrl = await getDownloadURL(lRef);
        }
        if (formData.crnImage) {
          const cRef = storageRef(storage, `companies/${user.uid}/crn.jpg`);
          await uploadBytes(cRef, formData.crnImage);
          crnUrl = await getDownloadURL(cRef);
        }

        const payload = {
          uid: user.uid,
          companyName: formData.companyName,
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          address: formData.address || "",
          city: formData.city || "",
          website: formData.website || "",
          teamSize: formData.teamSize || "",
          crn: formData.crn || "",
          description: formData.description || "",
          portfolio: formData.portfolio || "",
          logo: logoUrl,
          crnImage: crnUrl,
          userType: "company",
          status: "active",
          createdAt: new Date().toISOString(),
        };

        await setDoc(doc(db, "companies", user.uid), payload);
        setTimeout(() => {
          this.$router.push("/technician-dashboard");
        }, 2000);
      } catch (err) {
        console.error("Company signup error:", err);
        // Firebase errors will be handled by the form component
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
