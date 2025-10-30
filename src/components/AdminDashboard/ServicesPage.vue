<template>
  <div class="services-page p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800">Service Categories</h1>
        <p class="text-gray-500">Manage all service categories available on your platform</p>
      </div>

      <!-- Add Category Button -->
      <button
        @click="showModal = true"
        class="bg-[#5984C6] hover:bg-[#4968a0]  text-white font-semibold px-5 py-2.5 rounded-lg shadow-md transition-colors duration-200 flex items-center"
      >
        Add Category
        <i class="fas fa-plus ml-2"></i>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-500">Loading categories...</p>
    </div>

    <!-- Service Category Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <ServiceCategoryCard
        v-for="category in categories"
        :key="category.id"
        :category="category"
        @view-providers="handleViewProviders"
      />
    </div>

    <!-- Add Category Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm  flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg  shadow-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-semibold mb-4 text-gray-800">Add New Category</h2>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
          <input
            v-model="newCategory.name"
            type="text"
            placeholder="e.g. Painting"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input
            v-model="newCategory.icon"
            type="url"
            placeholder="https://example.com/image.png"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="flex justify-end space-x-3">
          <button
            @click="showModal = false"
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700"
          >
            Cancel
          </button>
          <button
            @click="saveCategory"
            class="px-4 py-2 bg-[#5984C6] hover:bg-[#4968a0]  text-white rounded-lg font-semibold"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ServiceCategoryCard from './ServiceCategoryCard.vue';
import { db } from '@/firebase/firebase';
import { collection, getDocs, addDoc, onSnapshot } from 'firebase/firestore';

export default {
  name: 'ServicesPage',
  components: {
    ServiceCategoryCard,
  },
  data() {
    return {
      categories: [],
      loading: true,
      showModal: false,
      newCategory: { name: '', icon: '' },
      unsubscribeServices: null,
    };
  },
  methods: {
    async fetchProviderCounts() {
      try {
        // Count technicians per skill
        const techniciansRef = collection(db, 'technicians');
        const techSnapshot = await getDocs(techniciansRef);
        const providerCount = {};
        
        techSnapshot.forEach(doc => {
          const data = doc.data();
          const skill = data.skill;
          if (skill) {
            providerCount[skill] = (providerCount[skill] || 0) + 1;
          }
        });

        // Count companies for Finishing
        const companiesRef = collection(db, 'companies');
        const companySnapshot = await getDocs(companiesRef);
        providerCount['Finishing'] = companySnapshot.size;

        return providerCount;
      } catch (error) {
        console.error('Error fetching provider counts:', error);
        return {};
      }
    },

    handleViewProviders(serviceName) {
      this.$router.push(`/dashboard/providers?category=${serviceName}`);
    },

  async saveCategory() {
  if (!this.newCategory.name || !this.newCategory.icon) {
    alert('Please fill in all fields');
    return;
  }

  try {
    // ✅ حساب عدد الفنيين بنفس الـ skill
    const techniciansRef = collection(db, 'technicians');
    const techSnapshot = await getDocs(techniciansRef);
    let providerCount = 0;

    techSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.skill && data.skill.toLowerCase() === this.newCategory.name.toLowerCase()) {
        providerCount++;
      }
    });

    // ✅ حساب عدد الشركات لو الخدمة "Finishing"
    if (this.newCategory.name.toLowerCase() === 'finishing') {
      const companiesRef = collection(db, 'companies');
      const companySnapshot = await getDocs(companiesRef);
      providerCount += companySnapshot.size;
    }

    // ✅ نحفظ الخدمة الجديدة داخل Firestore مع عدد providers فعليًا
  const docRef = await addDoc(collection(db, 'services'), {
  name: this.newCategory.name,
  icon: this.newCategory.icon,
  providers: providerCount,
  status: 'Active',
  createdAt: new Date(),
});

    // No need to push to categories array as it will be handled by the onSnapshot listener
    this.newCategory = { name: '', icon: '' };
    this.showModal = false;
  } catch (error) {
    console.error('Error saving category:', error);
    alert('Error adding category. Please try again.');
  }
}
  },
  mounted() {
    const servicesRef = collection(db, 'services');
    this.unsubscribeServices = onSnapshot(servicesRef, async (snapshot) => {
      try {
        // Get technician counts
        const techniciansRef = collection(db, 'technicians');
        const techSnapshot = await getDocs(techniciansRef);
        const providerCount = {};
        
        techSnapshot.forEach(doc => {
          const data = doc.data();
          const skill = data.skill;
          if (skill) {
            providerCount[skill] = (providerCount[skill] || 0) + 1;
          }
        });

        // Count companies for Finishing
        const companiesRef = collection(db, 'companies');
        const companySnapshot = await getDocs(companiesRef);
        providerCount['Finishing'] = companySnapshot.size;

        // Map services with provider counts
        this.categories = snapshot.docs.map(doc => {
          const service = doc.data();
          return {
            id: doc.id,
            name: service.name,
            icon: service.icon,
            providers: service.providers || providerCount[service.name] || 0,
            status: service.status || 'Active',
          };
        });
      } catch (error) {
        console.error('Error processing categories:', error);
      } finally {
        this.loading = false;
      }
    });
  },
  beforeUnmount() {
    if (this.unsubscribeServices) this.unsubscribeServices();
  },
};
</script>

<style scoped>
/* Specific styles if needed */
</style>
