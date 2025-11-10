<template>
  <div class="p-6 bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 min-h-screen">
    <h1 class="text-3xl font-bold text-[#133B5D] dark:text-[#8db4ff] mb-6">{{ $t('adminDashboard.offers.title') }}</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- 1. Add New Offer Form -->
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-[#1f2937] dark:text-gray-100 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{{ $t('adminDashboard.offers.addNewOffer') }}</h2>
          <form @submit.prevent="addOffer" class="space-y-4">
            <div>
              <label class="block text-gray-700 dark:text-gray-200 font-medium mb-1">{{ $t('adminDashboard.offers.titleLabel') }}</label>
              <input
                v-model="newOffer.title"
                type="text"
                placeholder="e.g., 20% OFF"
                required
                class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#133B5D] focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-gray-700 dark:text-gray-200 font-medium mb-1">{{ $t('adminDashboard.offers.descriptionLabel') }}</label>
              <input
                v-model="newOffer.description"
                type="text"
                placeholder="e.g., On all plumbing services"
                required
                class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#133B5D] focus:outline-none"
              />
            </div>
            <!-- <div>
              <label class="block text-gray-700 font-medium mb-1">Image URL</label>
              <input
                v-model="newOffer.image"
                type="url"
                placeholder="https://your-image-url.com/image.png"
                required
                class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#133B5D] focus:outline-none"
              />
            </div> -->
            <div>
            <label class="block text-gray-700 dark:text-gray-200 font-medium mb-1">{{ $t('adminDashboard.offers.uploadImage') }}</label>
            <input
            type="file"
            accept="image/*"
            @change="handleFileChange"
            class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#133B5D] focus:outline-none"
            />
          </div>

            <button
              type="submit"
              :disabled="isSaving"
              class="w-full bg-accent-color text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#1b5383] transition duration-300 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <svg v-if="isSaving" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ isSaving ? $t('adminDashboard.offers.saving') : $t('adminDashboard.offers.addOffer') }}
            </button>
          </form>
        </div>
      </div>

      <!-- 2. Existing Offers List -->
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-[#1f2937] dark:text-gray-100 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{{ $t('adminDashboard.offers.currentOffers') }}</h2>

          <!-- Loading State -->
          <div v-if="isLoading" class="text-center text-gray-500 dark:text-gray-300 py-10">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#133B5D] mx-auto mb-3"></div>
            {{ $t('adminDashboard.offers.loading') }}
          </div>

          <!-- Empty State -->
          <div v-else-if="offers.length === 0" class="text-center text-gray-500 dark:text-gray-300 py-10">
            <i class="fa-solid fa-tags text-3xl mb-3"></i>
            <p>{{ $t('adminDashboard.offers.noOffers') }}</p>
          </div>

          <!-- Offers List -->
          <div v-else class="space-y-4">
            <div
              v-for="offer in offers"
              :key="offer.id"
              class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800"
            >
              <div class="flex items-center gap-4">
                <img :src="offer.image" alt="offer image" class="w-16 h-16 rounded-lg object-cover">
                <div>
                  <h3 class="font-semibold text-gray-800 dark:text-gray-100">{{ offer.title }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-300">{{ offer.description }}</p>
                </div>
              </div>
              <button
                @click="deleteOffer(offer.id)"
                class="text-red-500 hover:text-red-700 transition duration-300"
                :title="$t('adminDashboard.offers.delete')"
              >
                <i class="fa-solid fa-trash-can text-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// ✅ 'db' must be imported from your local firebase config file
import { db } from "../../firebase/firebase"; 
// ✅ Firestore functions are imported from 'firebase/firestore'
// The error means 'db' was incorrectly added to this line.
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { uploadImageOnly } from '@/composables/useImageUpload';

// --- Reactive State ---
const offers = ref([]);
const isLoading = ref(true);
const isSaving = ref(false);
const selectedFile = ref(null);

const newOffer = ref({
  title: '',
  description: '',
  image: ''
});

// --- Firestore Collection Reference ---
const offersCollection = collection(db, 'offers');

/**
 * Fetches all offers from the 'offers' collection.
 */
const fetchOffers = async () => {
  isLoading.value = true;
  try {
    const querySnapshot = await getDocs(offersCollection);
    offers.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching offers: ", error);
  } finally {
    isLoading.value = false;
  }
};
const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0];
};


/**
 * Adds a new offer document to Firestore.
 */
const addOffer = async () => {
  if (!newOffer.value.title || !newOffer.value.description || !newOffer.value.image) {
    // Replaced alert with confirm for consistency
    if (!confirm($t('adminDashboard.offers.fillAllFields'))) {
      return;
    }
  }
  
  isSaving.value = true;
  try {
    newOffer.value.image = await uploadImageOnly(selectedFile.value);
    await addDoc(offersCollection, {
      title: newOffer.value.title,
      description: newOffer.value.description,
      image: newOffer.value.image
    });
    
    // Reset form
    newOffer.value = { title: '', description: '', image: '' };
    // Refresh list
    await fetchOffers(); 
  } catch (error) {
    console.error("Error adding offer: ", error);
  } finally {
    isSaving.value = false;
  }
};

/**
 * Deletes an offer document from Firestore by its ID.
 */
const deleteOffer = async (id) => {
  if (!confirm($t('adminDashboard.offers.deleteConfirm'))) {
    return;
  }
  
  try {
    await deleteDoc(doc(db, 'offers', id));
    // Refresh list
    await fetchOffers();
  } catch (error) {
    console.error("Error deleting offer: ", error);
  }
};

// --- Lifecycle Hook ---
onMounted(() => {
  fetchOffers();
});
</script>

