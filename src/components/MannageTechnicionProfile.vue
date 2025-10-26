<template>
  <div v-if="isLoading" class="text-center text-gray-500 mt-20">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#133B5D] mx-auto mb-3"></div>
    Loading Profile...
  </div>

  <section v-else class="space-y-6">
    <div class="flex justify-end" v-if="!isEditing">
      <button
        @click="isEditing = true"
        class="bg-[#133B5D] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#1b5383] transition duration-300 flex items-center justify-center gap-2 shadow-md"
      >
        <i class="fa-solid fa-pen-to-square"></i> Edit Profile
      </button>
    </div>

    <div class="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
      <h3 class="text-2xl font-semibold text-[#133B5D] mb-5">Personal Information</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        <div class="md:col-span-2 flex flex-col items-center gap-3 mb-4">
          <div class="relative group">
            <img
              :src="tempTechnician.profileImage || '/images/Ellipse 56.png'"
              class="w-40 h-40 rounded-full object-cover border-4 border-[#133B5D] shadow-lg"
              :class="{ 'group-hover:opacity-70 cursor-pointer': isEditing }"
              @click="isEditing && triggerImageUpload"
            />
            <div
              v-if="isEditing"
              class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
              @click="triggerImageUpload"
            >
              <i class="fa-solid fa-camera text-white text-3xl"></i>
            </div>
            <input
              ref="imageInput"
              type="file"
              class="hidden"
              accept="image/*"
              @change="handleImageUpload"
            />
          </div>
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-1">
            <i class="fa-solid fa-user mr-2 text-[#133B5D]"></i> Name
          </label>
          <input
            v-model="tempTechnician.name"
            type="text"
            :disabled="!isEditing"
            class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#133B5D] focus:outline-none disabled:bg-gray-100"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-1">
            <i class="fa-solid fa-envelope mr-2 text-[#133B5D]"></i> Email
          </label>
          <input
            v-model="tempTechnician.email"
            type="email"
            disabled
            class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#133B5D] focus:outline-none disabled:bg-gray-100 text-gray-500"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-1">
            <i class="fa-solid fa-phone mr-2 text-[#133B5D]"></i> Phone
          </label>
          <input
            v-model="tempTechnician.phone"
            type="text"
            :disabled="!isEditing"
            class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#133B5D] focus:outline-none disabled:bg-gray-100"
          />
        </div>
        
        <div>
          <label class="block text-gray-700 font-medium mb-1">
            <i class="fa-solid fa-star mr-2 text-[#133B5D]"></i> Years of Experience
          </label>
          <input
            v-model.number="tempTechnician.experience"
            type="number"
            min="0"
            placeholder="e.g., 5"
            :disabled="!isEditing"
            class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#133B5D] focus:outline-none disabled:bg-gray-100"
          />
        </div>

        <div class="md:col-span-2">
          <label class="block text-gray-700 font-medium mb-1">
            <i class="fa-solid fa-book-open mr-2 text-[#133B5D]"></i> Bio 
          </label>
          <textarea
            v-model="tempTechnician.bio"
            rows="4"
            :disabled="!isEditing"
            class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#133B5D] focus:outline-none disabled:bg-gray-100"
            placeholder="Tell clients a bit about yourself and your skills..."
          ></textarea>
        </div>

      </div>
    </div>

    <div
      class="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col md:flex-row gap-6"
    >
      <div class="flex-1 space-y-4">
        <h3 class="text-xl font-semibold text-[#133B5D]">Address</h3>
        <div>
            <label class="block text-gray-700 font-medium mb-1">Street</label>
            <input
              v-model="tempTechnician.address.street"
              type="text"
              :disabled="!isEditing"
              class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#133B5D] focus:outline-none disabled:bg-gray-100"
            />
        </div>
        <div>
            <label class="block text-gray-700 font-medium mb-1">City</label>
            <input
              v-model="tempTechnician.address.city"
              type="text"
              :disabled="!isEditing"
              class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#133B5D] focus:outline-none disabled:bg-gray-100"
            />
        </div>
        <div>
            <label class="block text-gray-700 font-medium mb-1">Country</label>
            <input
              v-model="tempTechnician.address.country"
              type="text"
              :disabled="!isEditing"
              class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#133B5D] focus:outline-none disabled:bg-gray-100"
            />
        </div>
      </div>
      <div
        class="flex-1 h-64 w-full rounded-2xl overflow-hidden border border-gray-300 shadow-inner"
      >
        <iframe
          :src="mapSrc"
          width="100%"
          height="100%"
          style="border: 0"
          allowfullscreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>

    <div v-if="isEditing" class="flex justify-center gap-4 mt-6">
      <button
        @click="saveChanges"
        :disabled="isSaving"
        class="bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300 shadow-lg disabled:opacity-50 flex items-center gap-2"
      >
        <svg v-if="isSaving" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        {{ isSaving ? 'Saving...' : 'Save Changes' }}
      </button>

      <button
        @click="cancelEdit"
        class="bg-red-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-600 transition duration-300 shadow-lg"
      >
        <i class="fa-solid fa-xmark"></i> Cancel
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { auth, db } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const emit = defineEmits(['showNotification']);

const isEditing = ref(false);
const isLoading = ref(true);
const isSaving = ref(false);

const technicianId = ref(null);
const imageInput = ref(null);
const newImageFile = ref(null);

// ✅ Helper function to define the default structure
const defaultProfile = () => ({
  name: "",
  email: "",
  phone: "",
  experience: 0,
  bio: "",
  profileImage: "",
  address: { street: "", city: "", country: "", lat: 30.0444, lng: 31.2357 }
});

// ✅ Initialize refs
const originalTechnician = ref(defaultProfile());
const tempTechnician = ref(defaultProfile());

let unsubscribe = null;

// 1. Load data
onMounted(() => {
  unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      technicianId.value = user.uid;
      await loadProfile();
    } else {
      console.log("No user logged in.");
      isLoading.value = false;
    }
  });
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});

// 2. Fetch data
const loadProfile = async () => {
  if (!technicianId.value) return;
  isLoading.value = true;
  try {
    const docRef = doc(db, "technicians", technicianId.value);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const fullProfile = {
        ...defaultProfile(),
        ...data,
        address: {
          ...defaultProfile().address,
          ...(data.address || {})
        }
      };
      originalTechnician.value = JSON.parse(JSON.stringify(fullProfile));
      tempTechnician.value = JSON.parse(JSON.stringify(fullProfile));
    } else {
      emit('showNotification', 'Could not load profile data.', 'error');
    }
  } catch (error) {
    console.error("Error loading profile:", error);
    emit('showNotification', 'Error loading profile.', 'error');
  }
  isLoading.value = false;
};

// 3. Save changes (without overwriting email)
const saveChanges = async () => {
  if (!technicianId.value) return;
  isSaving.value = true;

  try {
    if (newImageFile.value) {
      const storage = getStorage();
      const sRef = storageRef(storage, `technicians/${technicianId.value}/profile.jpg`);
      const snapshot = await uploadBytes(sRef, newImageFile.value);
      const downloadURL = await getDownloadURL(snapshot.ref);
      tempTechnician.value.profileImage = downloadURL;
    }

    const docRef = doc(db, "technicians", technicianId.value);
    await updateDoc(docRef, {
      name: tempTechnician.value.name,
      phone: tempTechnician.value.phone,
      experience: tempTechnician.value.experience,
      bio: tempTechnician.value.bio,
      profileImage: tempTechnician.value.profileImage,
      address: tempTechnician.value.address,
    });

    originalTechnician.value = JSON.parse(JSON.stringify(tempTechnician.value));
    emit('showNotification', 'Profile saved successfully!', 'success');
    isEditing.value = false;
    newImageFile.value = null;
  } catch (error) {
    console.error("Error saving profile:", error);
    emit('showNotification', 'Failed to save profile.', 'error');
  }
  isSaving.value = false;
};

// 4. Cancel edit
const cancelEdit = () => {
  tempTechnician.value = JSON.parse(JSON.stringify(originalTechnician.value));
  newImageFile.value = null;
  isEditing.value = false;
};

// 5. Image upload
const triggerImageUpload = () => {
  imageInput.value.click();
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  newImageFile.value = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    tempTechnician.value.profileImage = e.target.result;
  };
  reader.readAsDataURL(file);
};

// 6. Computed Google Maps link
const mapSrc = computed(() => {
  const street = tempTechnician.value.address?.street || '';
  const city = tempTechnician.value.address?.city || '';
  const country = tempTechnician.value.address?.country || '';
  
  let query = `${street}, ${city}, ${country}`;
  if (!street && !city && !country) query = '30.0444,31.2357';
  
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&hl=en&z=14&output=embed`;
});
</script>
