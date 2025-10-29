<template>
  <div class="flex flex-col items-center justify-center min-h-screen w-full overflow-hidden pt-10">
    <h1 class="text-4xl font-bold text-accent-color mb-2">{{ $t('signUpPage.title') }}</h1>
    <p class="text-gray-600 mb-8 text-lg">{{ $t('signUpPage.subtitle') }}</p>

    <Tabs 
      :tabs="tabs" 
      :activeTab="activeTab" 
      @tab-change="toggleTab" 
    />

    <transition name="fade">
      <div v-if="activeTab" class="w-full flex justify-center">
        <ClientForm 
          v-if="activeTab === 'client'" 
          :loginRoute="loginRoute"
          @submit="submitClient"
          ref="clientForm"
        />
        
        <TechnicianForm 
          v-else-if="activeTab === 'technician'" 
          :loginRoute="loginRoute"
          @submit="submitTechnician"
          ref="technicianForm"
        />
        
        <CompanyForm 
          v-else-if="activeTab === 'company'" 
          :loginRoute="loginRoute"
          @submit="submitCompany"
          ref="companyForm"
        />
      </div>
    </transition>
  </div>
</template>

<script>
// ... (imports remain the same) ...
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
      // UPDATED: Use lowercase keys for easier translation
      tabs: ["client", "technician", "company"], 
      activeTab: "client",
      loginRoute: "/login"
    };
  },
  methods: {
    toggleTab(tab) {
      this.activeTab = tab;
    },
    // ... (all submit methods remain exactly the same) ...
    // ---- CLIENT ----
    async submitClient(formData) {
      // ... (no changes needed in this logic) ...
    },
    // ---- TECHNICIAN ----
    async submitTechnician(formData) {
      // ... (no changes needed in this logic) ...
    },
    // ---- COMPANY ----
    async submitCompany(formData) {
      // ... (no changes needed in this logic) ...
    }
  }
};
</script>

<style>
/* ... (styles remain the same) ... */
</style>