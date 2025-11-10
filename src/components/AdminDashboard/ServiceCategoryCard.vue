<template>
  <div class="bg-white dark:bg-[#1f2937] dark:text-gray-100 rounded-lg shadow-md p-5 flex flex-col items-center text-center relative">
    <!-- Status Badge -->
    <span
      :class="{
        'bg-green-100 text-green-700': category.status === 'Active',
        'bg-gray-100 text-gray-500': category.status !== 'Active'
      }"
      class="absolute top-4 right-4 text-xs font-semibold px-2 py-1 rounded-full"
    >
      {{ category.status === 'Active' ? $t('adminDashboard.serviceCategoryCard.active') : $t('adminDashboard.serviceCategoryCard.inactive') }}
    </span>

    <!-- Action Buttons -->
    <div class="absolute top-4 left-4 flex gap-2">
      <button
        @click="openEditModal(category)"
        class="text-blue-500 hover:text-blue-700"
        :title="$t('adminDashboard.serviceCategoryCard.edit')"
      >
        <i class="fas fa-edit"></i>
      </button>

      <button
        @click="openDeleteModal(category)"
        class="text-red-500 hover:text-red-700"
        :title="$t('adminDashboard.serviceCategoryCard.delete')"
      >
        <i class="fas fa-trash"></i>
      </button>
    </div>

    <!-- Icon/Image -->
    <div class="mb-3 mt-6">
      <img v-if="isImage(category.icon)" :src="category.icon" alt="category icon" class="w-12 h-12 object-contain rounded" />
      <div v-else class="text-4xl">{{ category.icon }}</div>
    </div>

  <!-- Category Name -->
  <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">{{ $t(`home.services.${category.name.toLowerCase()}`) }}</h3>

    <!-- Provider Count -->
    <p class="text-sm text-gray-500 dark:text-gray-300 mb-4">
      {{ category.providers > 0 ? category.providers + ' ' + $t('adminDashboard.serviceCategoryCard.providersCount') : $t('adminDashboard.serviceCategoryCard.noProvidersYet') }}
    </p>

    <!-- View Providers Button -->
    <button
      @click="showProviders = true"
      class="bg-[#5984C6] text-white px-4 py-2 rounded-lg hover:bg-[#4968a0] transition-colors duration-200 flex items-center gap-2"
    >
      <i class="fas fa-eye"></i>
      {{ $t('adminDashboard.serviceCategoryCard.viewProviders') }}
    </button>

    <!-- Providers Modal -->
    <div v-if="showProviders" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-[#111827] dark:text-gray-100 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-semibold text-gray-800">
              {{ $t(`home.services.${category.name.toLowerCase()}`) }} {{ $t('adminDashboard.serviceCategoryCard.providersTitle') }}
            </h2>
            <button @click="showProviders = false" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <div class="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div v-if="loading" class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5984C6] mx-auto"></div>
            <p class="mt-4 text-gray-600 dark:text-gray-300">{{ $t('adminDashboard.serviceCategoryCard.loadingProviders') }}</p>
          </div>

          <div v-else-if="!providers.length" class="text-center py-8">
            <i class="fas fa-user-slash text-4xl text-gray-400 mb-4"></i>
            <p class="text-gray-600 dark:text-gray-300">{{ $t('adminDashboard.serviceCategoryCard.noProviders') }}</p>
          </div>

          <div v-else class="grid gap-6">
            <div v-for="provider in providers" :key="provider.id" 
                class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <img 
                :src="provider.profileImage || provider.logoImage || defaultAvatar" 
                :alt="provider.userType === 'company' ? (provider.companyName || provider.name) : provider.name"
                class="w-12 h-12 rounded-full object-cover"
                @error="onImgError"
              >
              <div class="flex-1">
                <h3 class="font-semibold text-gray-800 dark:text-gray-100">{{ provider.userType === 'company' ? (provider.companyName || provider.name) : provider.name }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  {{ provider.userType === 'company' ? $t('adminDashboard.services.company') : $t('adminDashboard.services.technician') }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  <i class="fas fa-map-marker-alt text-xs mr-1"></i>
                  {{ formatAddress(provider) }}
                </p>
              </div>
              <div class="flex items-center gap-2">
                <span :class="{
                  'bg-green-100 text-green-700': provider.status === 'active',
                  'bg-red-100 text-red-700': provider.status === 'suspended',
                  'bg-gray-100 text-gray-700': !provider.status
                }" class="px-2 py-1 rounded-full text-xs font-semibold capitalize">
                  {{ provider.status || 'Active' }}
                </span>
                <button 
                  @click="viewProviderDetails(provider)"
                  class="text-[#5984C6] hover:text-[#4968a0]"
                >
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Provider Details Modal -->
    <div v-if="selectedProvider" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-[#111827] dark:text-gray-100 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-100">{{ $t('adminDashboard.serviceCategoryCard.providerDetails') }}</h2>
          <button @click="selectedProvider = null" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <div class="p-6 overflow-y-auto">
          <div class="flex items-center gap-4 mb-6">
            <img 
              :src="selectedProvider.profileImage || selectedProvider.logoImage || defaultAvatar" 
              :alt="selectedProvider.name"
              class="w-24 h-24 rounded-full object-cover"
              @error="onImgError"
            >
            <div>
              <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {{ selectedProvider.userType === 'company' ? (selectedProvider.companyName || selectedProvider.name) : selectedProvider.name }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300">{{ selectedProvider.userType === 'company' ? $t('adminDashboard.services.company') : $t('adminDashboard.services.technician') }}</p>
            </div>
          </div>

          <div class="grid gap-4">
            <div v-if="selectedProvider.description" class="space-y-2">
              <h4 class="font-semibold text-gray-700 dark:text-gray-200">{{ $t('adminDashboard.serviceCategoryCard.about') }}</h4>
              <p class="text-gray-600 dark:text-gray-300">{{ selectedProvider.description }}</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <h4 class="font-semibold text-gray-700 dark:text-gray-200">{{ $t('adminDashboard.serviceCategoryCard.contact') }}</h4>
                <p class="text-gray-600 dark:text-gray-300">
                  <i class="fas fa-envelope mr-2"></i>{{ selectedProvider.email }}
                </p>
                <p v-if="selectedProvider.phone" class="text-gray-600 dark:text-gray-300">
                  <i class="fas fa-phone mr-2"></i>{{ selectedProvider.phone }}
                </p>
              </div>

              <div class="space-y-2">
                <h4 class="font-semibold text-gray-700 dark:text-gray-200">
                  <i class="fas fa-map-marker-alt mr-2"></i>{{ $t('adminDashboard.serviceCategoryCard.location') }}
                </h4>
                <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2">
                  <p class="text-gray-600 dark:text-gray-300">{{ formatAddress(selectedProvider) }}</p>
                </div>
              </div>
            </div>

            <div v-if="selectedProvider.userType !== 'company'" class="space-y-2">
              <h4 class="font-semibold text-gray-700 dark:text-gray-200">{{ $t('adminDashboard.serviceCategoryCard.experience') }}</h4>
              <p class="text-gray-600 dark:text-gray-300">{{ selectedProvider.experience }} years</p>
            </div>

            <div v-if="selectedProvider.portfolio" class="space-y-2">
              <h4 class="font-semibold text-gray-700 dark:text-gray-200">{{ $t('adminDashboard.serviceCategoryCard.portfolio') }}</h4>
              <a :href="selectedProvider.portfolio" target="_blank"
                class="text-[#5984C6] hover:text-[#4968a0] inline-flex items-center gap-2">
                <i class="fas fa-external-link-alt"></i>
                {{ $t('adminDashboard.serviceCategoryCard.viewPortfolio') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Service Modal -->
    <div
      v-if="editModal"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white dark:bg-[#111827] dark:text-gray-100 rounded-lg max-w-md w-full p-6">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{{ $t('adminDashboard.serviceCategoryCard.editService') }}</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200">{{ $t('adminDashboard.serviceCategoryCard.name') }}</label>
            <input v-model="editableService.name" type="text" class="w-full border dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200">{{ $t('adminDashboard.serviceCategoryCard.status') }}</label>
            <select v-model="editableService.status" class="w-full border dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
              <option value="Active">{{ $t('adminDashboard.serviceCategoryCard.active') }}</option>
              <option value="Inactive">{{ $t('adminDashboard.serviceCategoryCard.inactive') }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200">{{ $t('adminDashboard.serviceCategoryCard.image') }}</label>
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-full p-1 flex items-center justify-center overflow-hidden cursor-pointer" @click="triggerCategoryFile">
                <div class="w-full h-full rounded-full bg-white dark:bg-white/5 flex items-center justify-center overflow-hidden">
                  <img v-if="editablePreview" :src="editablePreview" alt="Category preview" class="block w-full h-full object-contain" @error="handlePreviewError" />
                  <i v-else class="fa-solid fa-image text-xl text-gray-500"></i>
                </div>
              </div>

              <div class="flex-1">
                <input ref="categoryFileInput" type="file" accept="image/*" class="hidden" @change="onCategoryFileChange" />
                <div class="flex items-center gap-2">
                  <button type="button" @click="triggerCategoryFile" class="px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm">{{ $t('adminDashboard.serviceCategoryCard.chooseImage') }}</button>
                  <p class="text-xs text-gray-500 dark:text-gray-300"> <span v-if="uploading" class="text-[#5984C6] ml-1">{{ $t('adminDashboard.serviceCategoryCard.uploading') }}</span></p>
                </div>
                <p v-if="uploadError" class="text-xs text-red-600 mt-1">{{ uploadError }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end mt-6 gap-3">
          <button @click="editModal = false" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
            {{ $t('adminDashboard.serviceCategoryCard.cancel') }}
          </button>
          <button @click="updateService" class="px-4 py-2 bg-[#5984C6] text-white rounded-lg hover:bg-[#4968a0]">
            {{ $t('adminDashboard.serviceCategoryCard.saveChanges') }}
          </button>
        </div>
      </div>
    </div>

    <!--  Delete Service Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
    >
      <div class="bg-white dark:bg-[#111827] dark:text-gray-100 rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
        <h3 class="text-xl font-semibold text-red-600 mb-4">{{ $t('adminDashboard.serviceCategoryCard.deleteService') }}</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          {{ $t('adminDashboard.serviceCategoryCard.deleteConfirm') }} "<strong>{{ selectedDeleteService?.name }}</strong>"?
        </p>
        <div class="flex justify-center space-x-4">
          <button @click="confirmDelete" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">{{ $t('adminDashboard.serviceCategoryCard.delete') }}</button>
          <button @click="closeDeleteModal" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">{{ $t('adminDashboard.serviceCategoryCard.cancel') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { db } from '@/firebase/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default {
  name: 'ServiceCategoryCard',
  props: { category: Object },
  setup(props, { emit }) {
    const isImage = (value) => {
      if (typeof value !== 'string') return false;
      if (!/^https?:\/\//i.test(value)) return false;
      return /(\.png|\.jpe?g|\.gif|\.webp|\.svg)(\?.*)?$/i.test(value) || true;
    };
    // Edit modal upload state
    const categoryFileInput = ref(null);
    const editablePreview = ref('');
    const uploading = ref(false);
    const uploadError = ref('');
    const showProviders = ref(false);
    const providers = ref([]);
    const loading = ref(false);
    const selectedProvider = ref(null);
    const defaultAvatar =
      'data:image/svg+xml;utf8,\
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">\
  <circle cx="32" cy="32" r="32" fill="%23e5e7eb"/>\
  <circle cx="32" cy="24" r="12" fill="%239ca3af"/>\
  <path d="M12 54c4-10 12-16 20-16s16 6 20 16" fill="%239ca3af"/>\
</svg>';

    const onImgError = (event) => {
      if (event && event.target) {
        event.target.src = defaultAvatar;
      }
    };

    const editModal = ref(false);
    const editableService = ref({});
    const showDeleteModal = ref(false);
    const selectedDeleteService = ref(null);

    const openEditModal = (service) => {
      editableService.value = { ...service };
      // set preview from existing icon if available
      editablePreview.value = service.icon || '';
      uploadError.value = '';
      editModal.value = true;
    };

    const updateService = async () => {
      try {
        const docRef = doc(db, 'services', editableService.value.id);
        await updateDoc(docRef, editableService.value);
        editModal.value = false;
        emit('updated');
      } catch (e) {
        console.error(e);
      }
    };

    const triggerCategoryFile = () => {
      if (categoryFileInput.value) categoryFileInput.value.click();
    };

    const onCategoryFileChange = async (e) => {
      const file = e.target?.files?.[0];
      uploadError.value = '';
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        uploadError.value = 'Please select a valid image file.';
        e.target.value = '';
        return;
      }
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        uploadError.value = 'Image size should be less than 5MB.';
        e.target.value = '';
        return;
      }

      const tempURL = URL.createObjectURL(file);
      editablePreview.value = tempURL;
      try {
        uploading.value = true;
        const { uploadImageOnly } = await import('@/composables/useImageUpload');
        const uploadedUrl = await uploadImageOnly(file);
        editableService.value.icon = uploadedUrl;
        editablePreview.value = uploadedUrl;
      } catch (err) {
        console.error('Image upload failed:', err);
        uploadError.value = 'Failed to upload image. Please try again.';
      } finally {
        uploading.value = false;
        URL.revokeObjectURL(tempURL);
        if (categoryFileInput.value) categoryFileInput.value.value = '';
      }
    };

    const handlePreviewError = (event) => {
      editablePreview.value = '';
      if (event && event.target) event.target.style.display = 'none';
    };

    // Delete modal logic
    const openDeleteModal = (service) => {
      selectedDeleteService.value = service;
      showDeleteModal.value = true;
    };

    const closeDeleteModal = () => {
      showDeleteModal.value = false;
      selectedDeleteService.value = null;
    };

    const confirmDelete = async () => {
      try {
        await deleteDoc(doc(db, 'services', selectedDeleteService.value.id));
        emit('deleted', selectedDeleteService.value.id);
        closeDeleteModal();
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    };

    const fetchProviders = async () => {
      loading.value = true;
      try {
        const allProviders = [];
        if (props.category.name.toLowerCase() === 'finishing') {
          const companiesSnap = await getDocs(collection(db, 'companies'));
          companiesSnap.forEach(doc => {
            allProviders.push({ id: doc.id, userType: 'company', ...doc.data() });
          });
        } else {
          const techniciansSnap = await getDocs(collection(db, 'technicians'));
          techniciansSnap.forEach(doc => {
            const data = doc.data();
            if (data.skill?.toLowerCase() === props.category.name.toLowerCase()) {
              allProviders.push({ id: doc.id, userType: 'technician', ...data });
            }
          });
        }
        providers.value = allProviders;
      } catch (error) {
        console.error(error);
      } finally {
        loading.value = false;
      }
    };

    const viewProviderDetails = (provider) => (selectedProvider.value = provider);

    watch(showProviders, async (val) => val && fetchProviders());

    const formatAddress = (provider) => {
      if (!provider) return 'Location N/A';
      const parts = new Set();
      if (typeof provider.address === 'object' && provider.address)
        ['street', 'city', 'country'].forEach(f => provider.address[f] && parts.add(provider.address[f]));
      else if (typeof provider.address === 'string' && provider.address.trim()) parts.add(provider.address.trim());
      if (provider.city) parts.add(provider.city);
      return parts.size ? [...parts].join(', ') : 'Cairo, Egypt';
    };

    return {
      showProviders,
      providers,
      loading,
      selectedProvider,
      viewProviderDetails,
      formatAddress,
      isImage,
      defaultAvatar,
      onImgError,
      editModal,
      editableService,
      openEditModal,
      updateService,
      categoryFileInput,
      triggerCategoryFile,
      onCategoryFileChange,
      editablePreview,
      uploading,
      uploadError,
      handlePreviewError,
      showDeleteModal,
      openDeleteModal,
      closeDeleteModal,
      confirmDelete,
      selectedDeleteService,
    };
  },
};
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}
</style>
