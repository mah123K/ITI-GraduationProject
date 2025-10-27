<template>
  <div class="flex flex-col items-center justify-center min-h-screen w-full overflow-hidden pt-10">
    <h1 class="text-4xl font-bold text-accent-color mb-2">Sign Up</h1>
    <p class="text-gray-600 mb-8 text-lg">Create your account and get started today</p>

    <Tabs 
      :tabs="tabs" 
      :activeTab="activeTab" 
      @tab-change="toggleTab" 
    />

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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import Tabs from './Tabs.vue';
import ClientForm from './ClientForm.vue';
import TechnicianForm from './TechnicianForm.vue';
import CompanyForm from './CompanyForm.vue';

export default {
  components: {
    Tabs,
    ClientForm,
    TechnicianForm,
    CompanyForm
  },
  data() {
    return {
      tabs: ["Client", "Technician", "Company"],
      activeTab: "Client",
      loginRoute: "/login"
    };
  },
  methods: {
    toggleTab(tab) {
      this.activeTab = tab;
    },

    // ---- CLIENT ----
    async submitClient(formData) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        let profileUrl = "";
        if (formData.profileImage) {
          try {
            const pRef = storageRef(storage, `clients/${user.uid}/profile.jpg`);
            await uploadBytes(pRef, formData.profileImage);
            profileUrl = await getDownloadURL(pRef);
          } catch (imgErr) {
            console.error("Profile image upload failed:", imgErr);
          }
        }

        const payload = {
          uid: user.uid,
          name: formData.name,
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          address: {
            street: formData.address.street,
            city: formData.address.city,
            country: formData.address.country || "Egypt",
            lat: formData.address.lat,
            lng: formData.address.lng,
          },
          image: profileUrl || "https://via.placeholder.com/150",
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
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        let profileUrl = "";
        let idCardUrl = "";

        if (formData.profileImage) {
          const pRef = storageRef(storage, `technicians/${user.uid}/profile.jpg`);
          await uploadBytes(pRef, formData.profileImage);
          profileUrl = await getDownloadURL(pRef);
        }
        if (formData.idCardImage) {
          const idRef = storageRef(storage, `technicians/${user.uid}/idCard.jpg`);
          await uploadBytes(idRef, formData.idCardImage);
          idCardUrl = await getDownloadURL(idRef);
        }

        const payload = {
          uid: user.uid,
          name: formData.name,
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          experience: formData.experience,
          skill: formData.skill,
          description: formData.description || "",
          certification: formData.certification || "",
          availability: formData.availability || "",
          portfolio: formData.portfolio || "",
          profileImage: profileUrl,
          idCardImage: idCardUrl,
          userType: "technician",
          status: "active",
          createdAt: new Date().toISOString(),
        };

        await setDoc(doc(db, "technicians", user.uid), payload);
        this.$router.push("/technician-dashboard");
      } catch (err) {
        console.error("Technician signup error:", err);
        // Firebase errors will be handled by the form component
      }
    },

    // ---- COMPANY ----
    async submitCompany(formData) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
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
          address: formData.address,
          city: formData.city,
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
        this.$router.push("/technician-dashboard");
      } catch (err) {
        console.error("Company signup error:", err);
        // Firebase errors will be handled by the form component
      }
    }
  }
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