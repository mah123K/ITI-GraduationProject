<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
  />
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
        class="bg-[#6759FF] hover:bg-[#574ae2] text-white font-semibold px-5 py-2.5 rounded-lg shadow-md transition-colors duration-200 flex items-center"
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
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
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
          <label class="block text-sm font-medium text-gray-700 mb-1">Icon (emoji)</label>
          <input
            v-model="newCategory.icon"
            type="text"
            placeholder="e.g. 🎨"
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
            class="px-4 py-2 bg-[#6759FF] hover:bg-[#574ae2] text-white rounded-lg font-semibold"
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
import { db } from '@/firebase/firebase'; // Your Firebase config
import { collection, getDocs, query, where } from 'firebase/firestore';

export default {
  name: 'ServicesPage',
  components: {
    ServiceCategoryCard,
  },
  data() {
    return {
      categories: [],
      loading: true,
       showModal: false, // ✅ لفتح/إغلاق المودال
      newCategory: { name: '', icon: '' }, // ✅ لت
      allServices: [
        { name: 'Plumbing', icon: '🔧' },
        { name: 'Electrical', icon: '⚡' },
        { name: 'Carpentry', icon: '🔨' },
        { name: 'Finishing', icon: '🛠️' },
       
      ],
    };
  },
  methods: {
  async fetchCategories() {
  try {
    this.loading = true;

    // عد الفنيين
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

    // عد الشركات
    const companiesRef = collection(db, 'companies');
    const companySnapshot = await getDocs(companiesRef);

    companySnapshot.forEach(doc => {
      // كل الشركات نعتبرها Finishing
      providerCount["Finishing"] = (providerCount["Finishing"] || 0) + 1;
    });

   
        // Create categories
        this.categories = this.allServices.map(service => ({
          id: service.name,
          name: service.name,
          icon: service.icon,
          providers: providerCount[service.name] || 0,
          status: 'Active',
        }));
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        this.loading = false;
      }
    },

    handleViewProviders(serviceName) {
      this.$router.push(`/dashboard/providers?category=${serviceName}`);
    },

    saveCategory() {
      if (!this.newCategory.name || !this.newCategory.icon) {
        alert('Please fill in all fields');
        return;
      }

      this.categories.push({
        id: this.newCategory.name,
        name: this.newCategory.name,
        icon: this.newCategory.icon,
        providers: 0,
        status: 'Active',
      });

      this.newCategory = { name: '', icon: '' };
      this.showModal = false;
    },
  },
  created() {
    this.fetchCategories();
  },
};
</script>

<style scoped>
/* Specific styles if needed */
</style>