<template>
  <div
    class="min-h-screen w-[90%] mx-auto items-center  flex flex-col md:flex-row mt-15"
  >
    <main class="flex-1 p-4 sm:p-6 md:p-8 space-y-8 overflow-x-hidden items-center">
      <!-- Header -->
      <div class="flex justify-end" v-if="!isEditing">
        <button
          @click="isEditing = true"
          class="bg-accent-color text-white font-semibold py-2 px-6 rounded-lg hover:bg-(--accent) transition duration-300 flex items-center justify-center gap-2 shadow-md"
        >
          <i class="fa-solid fa-pen-to-square"></i> Edit Profile
        </button>
      </div>
      <!-- Profile Picture -->
      <div class="flex items-center justify-center flex-col">
        <div class="relative group">
          <img
            :src="tempClient.image"
            class="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full object-cover border-4 border-accent-color shadow-xl transition-transform duration-300"
            :class="{ 'group-hover:scale-105 cursor-pointer': isEditing }"
            @click="isEditing && triggerImageUpload"
          />

          <div
            v-if="isEditing"
            class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            @click="triggerImageUpload"
          >
            <i class="fa-solid fa-camera text-white text-2xl"></i>
          </div>

          <input
            ref="imageInput"
            type="file"
            class="hidden"
            accept="image/*"
            @change="handleImageUpload"
          />
        </div>

        <!-- User Info -->
        <div class="mt-5 text-center wrap-break-word">
          <h2 class="text-xl sm:text-2xl font-bold text-(--text-primary)">{{ tempClient.name }}</h2>
          <p class="text-(--text-muted) text-sm break-all">{{ tempClient.email }}</p>
        </div>
      </div>
      <section class="space-y-6">
        <!-- Personal Info Box -->
        <div
          class="dark:bg-(--surface) backdrop-blur-md p-4 sm:p-6 rounded-3xl shadow-xl border border-(--border)"
        >
          <h3 class="text-xl sm:text-2xl font-semibold text-(--accent) mb-4">
            Personal Information
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-(--text-primary) font-medium mb-1 text-sm sm:text-base">
                <i class="fa-solid fa-user mr-2 text-accent-color"></i> Name
              </label>
              <input
                v-model="tempClient.name"
                type="text"
                :disabled="!isEditing"
                class="w-full p-3 rounded-xl border border-(--border) focus:ring-2 focus:ring-accent-color focus:outline-none text-sm sm:text-base"
              />
            </div>

            <div>
              <label class="block text-(--text-primary) font-medium mb-1 text-sm sm:text-base">
                <i class="fa-solid fa-envelope mr-2 text-accent-color"></i> Email
              </label>
              <input
                v-model="tempClient.email"
                type="email"
                :disabled="!isEditing"
                class="w-full p-3 rounded-xl border border-(--border) focus:ring-2 focus:ring-accent-color focus:outline-none text-sm sm:text-base"
              />
            </div>

            <div>
              <label class="block text-(--text-primary) font-medium mb-1 text-sm sm:text-base">
                <i class="fa-solid fa-phone mr-2 text-accent-color"></i> Phone
              </label>
              <input
                v-model="tempClient.phone"
                type="text"
                :disabled="!isEditing"
                class="w-full p-3 rounded-xl border border-(--border) focus:ring-2 focus:ring-accent-color focus:outline-none text-sm sm:text-base"
              />
            </div>

            <div>
              <label class="block text-(--text-primary) font-medium mb-1 text-sm sm:text-base">
                <i class="fa-solid fa-lock mr-2 text-accent-color"></i> Password
              </label>
              <div class="relative">
                <input
                  v-model="tempClient.password"
                  :type="showPassword ? 'text' : 'password'"
                  :disabled="!isEditing"
                  class="w-full p-3 rounded-xl border border-(--border) focus:ring-2 focus:ring-accent-color focus:outline-none text-sm sm:text-base"
                />
                <i
                  @click="togglePassword"
                  class="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-(--text-muted)"
                  :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"
                ></i>
              </div>
            </div>

            <div>
              <label class="block text-(--text-primary) font-medium mb-1 text-sm sm:text-base">
                <i class="fa-solid fa-lock mr-2 text-accent-color"></i> Confirm Password
              </label>
              <div class="relative">
                <input
                  v-model="tempClient.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  :disabled="!isEditing"
                  class="w-full p-3 rounded-xl border border-(--border) focus:ring-2 focus:ring-accent-color focus:outline-none text-sm sm:text-base"
                />
                <i
                  @click="toggleConfirmPassword"
                  class="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-(--text-muted)"
                  :class="showConfirmPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"
                ></i>
              </div>
            </div>
          </div>
        </div>

        <div
          class="dark:bg-(--surface) backdrop-blur-md p-4 sm:p-6 rounded-3xl shadow-xl border border-(--border) flex flex-col md:flex-row gap-6"
        >
          <div class="flex-1 space-y-4">
            <h3
              class="text-lg sm:text-xl font-semibold text-(--accent) mb-4 flex items-center gap-2"
            >
              <i class="fa-solid fa-location-dot"></i> Address
            </h3>

            <div class="space-y-4">
              <div>
                <label class="block text-(--text-primary) font-medium mb-2 text-sm sm:text-base">
                  <i class="fa-solid fa-road text-accent-color mr-2"></i>Street
                </label>
                <input
                  v-model="tempClient.address.street"
                  type="text"
                  :disabled="!isEditing"
                  placeholder="Enter your street address"
                  class="w-full p-3 rounded-xl border border-(--border) focus:ring-2 focus:ring-accent-color focus:outline-none text-sm sm:text-base"
                />
              </div>

              <div>
                <label class="block text-(--text-primary) font-medium mb-2 text-sm sm:text-base">
                  <i class="fa-solid fa-city text-accent-color mr-2"></i>City
                </label>
                <input
                  v-model="tempClient.address.city"
                  type="text"
                  :disabled="!isEditing"
                  placeholder="Enter your city"
                  class="w-full p-3 rounded-xl border border-(--border) focus:ring-2 focus:ring-accent-color focus:outline-none text-sm sm:text-base"
                />
              </div>

              <div>
                <label class="block text-(--text-primary) font-medium mb-2 text-sm sm:text-base">
                  <i class="fa-solid fa-globe text-accent-color mr-2"></i>Country
                </label>
                <input
                  v-model="tempClient.address.country"
                  type="text"
                  :disabled="!isEditing"
                  placeholder="Enter your country"
                  class="w-full p-3 rounded-xl border border-(--border) focus:ring-2 focus:ring-accent-color focus:outline-none text-sm sm:text-base"
                />
              </div>
            </div>
          </div>
          <div
            class="flex-1 h-56 sm:h-64 w-full rounded-2xl overflow-hidden border border-(--border) shadow-md relative"
          >
            <div
              v-if="isUpdatingMap"
              class="absolute inset-0 bg-(--bg)/80 flex items-center justify-center z-10"
            >
              <div class="text-accent-color flex flex-col items-center">
                <i class="fa-solid fa-map-location-dot animate-bounce text-xl sm:text-2xl"></i>
                <span class="mt-2 text-xs sm:text-sm font-medium">Updating map location...</span>
              </div>
            </div>
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

        <!-- Save / Cancel Buttons -->
        <div v-if="isEditing" class="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <button
            @click="saveChanges"
            class="bg-green-500 text-white font-semibold py-2 sm:py-3 px-6 rounded-2xl hover:bg-green-600 transition duration-300 shadow-lg text-sm sm:text-base"
          >
            <i class="fa-solid fa-check"></i> Save
          </button>

          <button
            @click="cancelEdit"
            class="bg-red-500 text-white font-semibold py-2 sm:py-3 px-6 rounded-2xl hover:bg-red-600 transition duration-300 shadow-lg text-sm sm:text-base"
          >
            <i class="fa-solid fa-xmark"></i> Cancel
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
// NEW: Import the new component
// Removed unused AlertPopup import

const isEditing = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const client = ref(null);
const tempClient = ref(null);
const isUpdatingMap = ref(false);
let geocodeTimeout = null;

// NEW: Refs for custom popup
const showPopup = ref(false);
const popupMessage = ref("");

// NEW: Functions to control the custom popup
const triggerPopup = (message) => {
  popupMessage.value = message;
  showPopup.value = true;
};

// closePopup removed (unused)

const togglePassword = () => (showPassword.value = !showPassword.value);
const toggleConfirmPassword = () => (showConfirmPassword.value = !showConfirmPassword.value);
// removed unused router and order state

// Removed unused view togglers and navigation helpers

// جلب بيانات المستخدم من Firebase
const fetchUserData = async (uid) => {
  try {
    const docRef = doc(db, "clients", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();

      // تحضير بيانات العنوان
      const address = {
        ...defaultClient.address,
        street: userData.address?.street || "",
        city: userData.address?.city || "",
        country: userData.address?.country || "",
        lat: userData.address?.lat || 30.0444,
        lng: userData.address?.lng || 31.2357,
      };

      // Merge all data
      client.value = {
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        image: userData.image || defaultClient.image,
        address: address,
        orders: userData.orders || [],
      };

      // Update tempClient with the merged data
      tempClient.value = JSON.parse(JSON.stringify(client.value));
      console.log("Fetched user data:", client.value); // Debug log
      console.log("Address data:", client.value.address); // Debug log for address

      // If address exists but coordinates are missing or default, try to geocode and update map
      // This will update tempClient.address.lat/lng which mapSrc uses
      try {
        await updateMapCoordinates();
        // ensure client reflects any updated coordinates
        client.value.address.lat = tempClient.value.address.lat;
        client.value.address.lng = tempClient.value.address.lng;
      } catch (err) {
        console.warn("Geocoding after fetch failed:", err);
      }
    } else {
      console.log("No user document found for ID:", uid); // Debug log
      client.value = { ...defaultClient };
      tempClient.value = { ...defaultClient };
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    console.error("Error details:", error.message);
    client.value = { ...defaultClient };
    tempClient.value = { ...defaultClient };
  }
};

// تحميل بيانات المستخدم عند تحميل المكون
onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      fetchUserData(user.uid);
    }
  });
});

const saveChanges = async () => {
  if (tempClient.value.password !== tempClient.value.confirmPassword) {
    // UPDATED
    triggerPopup("Passwords do not match!");
    return;
  }

  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const docRef = doc(db, "clients", user.uid);

      // ensure coordinates are updated from address before saving
      try {
        await updateMapCoordinates();
      } catch (e) {
        console.warn("Geocode before save failed:", e);
      }

      // تحضير البيانات للحفظ
      const updateData = {
        name: tempClient.value.name,
        email: tempClient.value.email,
        phone: tempClient.value.phone,
        image: tempClient.value.image,
        address: {
          street: tempClient.value.address.street || "",
          city: tempClient.value.address.city || "",
          country: tempClient.value.address.country || "",
          lat: tempClient.value.address.lat || 30.0444,
          lng: tempClient.value.address.lng || 31.2357,
        },
      };

      console.log("Saving data:", updateData); // Debug log

      await updateDoc(docRef, updateData);
      client.value = JSON.parse(JSON.stringify(tempClient.value));
      isEditing.value = false;
      // 🔹 بعد حفظ التعديلات بنجاح
      const event = new CustomEvent("userUpdated", {
        detail: {
          image: tempClient.value.image,
          name: tempClient.value.name,
        },
      });
      window.dispatchEvent(event);
      // UPDATED
      triggerPopup("Changes saved successfully!");
    }
  } catch (error) {
    console.error("Error saving changes:", error);
    console.error("Error details:", error.message);
    // UPDATED
    triggerPopup("Failed to save changes. Please try again.");
  }
};

const cancelEdit = () => {
  tempClient.value = JSON.parse(JSON.stringify(client.value));
  isEditing.value = false;
};

// Default values for client
const defaultClient = {
  name: "",
  email: "",
  phone: "",
  image: "https://via.placeholder.com/150",
  address: {
    street: "",
    city: "",
    country: "",
    lat: 30.0444,
    lng: 31.2357,
  },
  orders: [],
};

// Initialize client and tempClient with default values
client.value = { ...defaultClient };
tempClient.value = { ...defaultClient };

// Removed unused orders-related helpers

// الصورة
const imageInput = ref(null);
const triggerImageUpload = () => imageInput.value.click();
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    // UPDATED
    triggerPopup("Image size should be less than 5MB");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    tempClient.value.image = e.target.result;
  };
  reader.readAsDataURL(file);
};

// تحديث الإحداثيات عند تغيير العنوان
watch(
  () => [
    tempClient.value?.address?.street,
    tempClient.value?.address?.city,
    tempClient.value?.address?.country,
  ],
  async () => {
    if (isEditing.value) {
      // debounce geocoding to avoid too many requests while typing
      if (typeof geocodeTimeout !== "undefined" && geocodeTimeout) clearTimeout(geocodeTimeout);
      geocodeTimeout = setTimeout(async () => {
        await updateMapCoordinates();
      }, 700);
    }
  }
);

// الخريطة
const updateMapCoordinates = async () => {
  if (!tempClient.value || !tempClient.value.address) return;

  const { street, city, country } = tempClient.value.address;
  if (!street || !city) return;

  isUpdatingMap.value = true;

  try {
    // Build complete address string
    const address = [street, city, country].filter(Boolean).join(", ");

    // Add delay to respect OpenStreetMap usage policy
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}&limit=1`,
      {
        headers: {
          "Accept-Language": "en", // Prefer English results
          "User-Agent": "TashtebApp/1.0", // Identify our application
        },
      }
    );

    if (!response.ok) throw new Error("Geocoding request failed");

    const data = await response.json();

    if (data && data.length > 0) {
      // Update coordinates
      tempClient.value.address.lat = parseFloat(data[0].lat);
      tempClient.value.address.lng = parseFloat(data[0].lon);
      console.log("Updated coordinates:", {
        lat: data[0].lat,
        lng: data[0].lon,
      });
    } else {
      console.warn("No location found for address:", address);
    }
  } catch (error) {
    console.error("Error updating coordinates:", error);
  } finally {
    // Add a small delay before hiding the loading indicator to ensure
    // the map has time to update
    setTimeout(() => {
      isUpdatingMap.value = false;
    }, 500);
  }
};

const mapSrc = computed(() => {
  if (!tempClient.value?.address) return "";
  const lat = tempClient.value.address.lat || defaultClient.address.lat;
  const lng = tempClient.value.address.lng || defaultClient.address.lng;
  return `https://www.google.com/maps?q=${lat},${lng}&hl=en&z=14&output=embed`;
});
</script>

<style scoped>
.bg-accent-color {
  background-color: var(--accent);
}
</style>
