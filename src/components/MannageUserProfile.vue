<template>
  <div class="min-h-screen bg-white-100 flex flex-col md:flex-row mt-15">
    <!-- Sidebar -->
    <aside
      class="w-full md:w-1/4 bg-[#ffffff] shadow-2xl p-6 dark:bg-dark-blue  flex flex-col items-center relative border dark:border-none border-gray-300"
    >
      <div class="relative group">
        <img
          :src="tempClient.image"
          class="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full object-cover border-4 border-accent-color shadow-xl transition-transform duration-300"
          :class="{ 'group-hover:scale-105 cursor-pointer': isEditing }"
          @click="isEditing && triggerImageUpload"
        />

        <div
          v-if="isEditing"
          class="absolute inset-0  bg-black bg-opacity-40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
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
      <div class="mt-5 text-center break-words">
        <h2 class="text-xl sm:text-2xl font-bold text-black dark:text-white">{{ tempClient.name }}</h2>
        <p class="text-gray-500 text-sm break-all dark:text-white dark:text-white">{{ tempClient.email }}</p>
      </div>

      <div class="flex flex-col gap-3 mt-6 w-full">
        <button
          @click="openEditProfile"
          class="bg-accent-color w-full text-white font-semibold py-2 sm:py-3 rounded-2xl hover:bg-[#002153] transition duration-300 flex items-center justify-center gap-2 shadow-inner text-sm sm:text-base"
        >
          <i class="fa-solid fa-pen-to-square"></i> Edit Profile
        </button>

        <button
          @click="openOrders"
          class="bg-accent-color text-white font-semibold py-2 sm:py-3 px-6 rounded-2xl hover:bg-[#002153] transition duration-300 flex items-center justify-center gap-2 shadow-inner text-sm sm:text-base"
        >
          <i class="fa-solid fa-box"></i> My Recent Orders
        </button>

        <button
          @click="goBack"
          class="bg-accent-color text-[#ffffff] font-semibold py-2 sm:py-3 px-6 rounded-2xl hover:bg-[#002153] transition duration-300 flex items-center justify-center gap-2 shadow-inner text-sm sm:text-base"
        >
          <i class="fa-solid fa-arrow-left"></i> Back
        </button>
      </div>

      <!-- Background Glow Circle -->
      <div class="absolute bottom-0 w-24 h-24 sm:w-32 sm:h-32 bg-accent-color opacity-20 blur-3xl rounded-full"></div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-4 sm:p-6 md:p-8 space-y-8 overflow-x-hidden">
      <!-- Orders Section -->
      <section
        v-if="showOrders"
        class="transition-transform hover:scale-[1.01] duration-300 bg-white/30 backdrop-blur-md shadow-xl rounded-3xl p-4 sm:p-6 border border-white/20 overflow-x-auto"
      >
        <h3 class="text-xl sm:text-2xl font-semibold mb-6 text-accent-color flex items-center gap-2">
          <i class="fa-solid fa-box text-accent-color"></i> Recent Orders
        </h3>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[600px] border-collapse text-sm sm:text-base">
            <thead>
              <tr class="bg-accent-color text-white text-left sticky top-0">
                <th class="p-3">Order ID</th>
                <th class="p-3">Date</th>
                <th class="p-3">Status</th>
                <th class="p-3">Total</th>
                <th class="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="order in sortedOrders"
                :key="order.id"
                class="border-b hover:bg-gray-50 transition"
              >
                <td class="p-3 font-semibold text-gray-700">#{{ order.id }}</td>
                <td class="p-3 text-gray-600">{{ order.date }}</td>
                <td class="p-3">
                  <span
                    :class="statusClass(order.status)"
                    class="px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                  >
                    {{ order.status }}
                  </span>
                  <div class="mt-2 h-2 w-full bg-gray-200 rounded-full">
                    <div
                      :style="{ width: progressWidth(order.status) }"
                      class="h-2 rounded-full bg-gradient-to-r from-accent-color to-[#003481] transition-all"
                    ></div>
                  </div>
                </td>
                <td class="p-3 font-medium text-gray-800">${{ order.total }}</td>
                <td class="p-3 text-center">
                  <button
                    @click="openModal(order)"
                    class="bg-accent-color text-white px-3 py-1 rounded-lg hover:bg-[#002c74] transition-all duration-200 text-sm"
                  >
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-6 text-right text-gray-700 font-semibold text-sm sm:text-base">
          Total Delivered Sales:
          <span class="text-accent-color">${{ totalSales }}</span>
        </div>
      </section>

      <section v-else class="space-y-6">
        <!-- Personal Info Box -->
        <div class="bg-white/30 dark:bg-accent-color backdrop-blur-md p-4 sm:p-6 rounded-3xl shadow-xl border border-white/20">
          <h3 class="text-xl sm:text-2xl font-semibold text-accent-color mb-4">Personal Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
                <i class="fa-solid fa-user mr-2 text-accent-color"></i> Name
              </label>
              <input
                v-model="tempClient.name"
                type="text"
                :disabled="!isEditing"
                class="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent-color focus:outline-none text-sm sm:text-base"
              />
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
                <i class="fa-solid fa-envelope mr-2 text-accent-color"></i> Email
              </label>
              <input
                v-model="tempClient.email"
                type="email"
                :disabled="!isEditing"
                class="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent-color focus:outline-none text-sm sm:text-base"
              />
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
                <i class="fa-solid fa-phone mr-2 text-accent-color"></i> Phone
              </label>
              <input
                v-model="tempClient.phone"
                type="text"
                :disabled="!isEditing"
                class="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent-color focus:outline-none text-sm sm:text-base"
              />
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
                <i class="fa-solid fa-lock mr-2 text-accent-color"></i> Password
              </label>
              <div class="relative">
                <input
                  v-model="tempClient.password"
                  :type="showPassword ? 'text' : 'password'"
                  :disabled="!isEditing"
                  class="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent-color focus:outline-none text-sm sm:text-base"
                />
                <i
                  @click="togglePassword"
                  class="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500"
                  :class="
                    showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'
                  "
                ></i>
              </div>
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
                <i class="fa-solid fa-lock-keyhole mr-2 text-accent-color"></i> Confirm Password
              </label>
              <div class="relative">
                <input
                  v-model="tempClient.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  :disabled="!isEditing"
                  class="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent-color focus:outline-none text-sm sm:text-base"
                />
                <i
                  @click="toggleConfirmPassword"
                  class="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500"
                  :class="
                    showConfirmPassword
                      ? 'fa-solid fa-eye-slash'
                      : 'fa-solid fa-eye'
                  "
                ></i>
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-white/30 dark:bg-accent-color backdrop-blur-md p-4 sm:p-6 rounded-3xl shadow-xl border border-white/20 flex flex-col md:flex-row gap-6"
        >
          <div class="flex-1 space-y-4">
            <h3 class="text-lg sm:text-xl font-semibold text-accent-color mb-4 flex items-center gap-2">
              <i class="fa-solid fa-location-dot"></i> Address
            </h3>

            <div class="space-y-4">
              <div>
                <label class="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                  <i class="fa-solid fa-road text-accent-color mr-2"></i>Street
                </label>
                <input
                  v-model="tempClient.address.street"
                  type="text"
                  :disabled="!isEditing"
                  placeholder="Enter your street address"
                  class="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent-color focus:outline-none text-sm sm:text-base"
                />
              </div>

              <div>
                <label class="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                  <i class="fa-solid fa-city text-accent-color mr-2"></i>City
                </label>
                <input
                  v-model="tempClient.address.city"
                  type="text"
                  :disabled="!isEditing"
                  placeholder="Enter your city"
                  class="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent-color focus:outline-none text-sm sm:text-base"
                />
              </div>

              <div>
                <label class="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                  <i class="fa-solid fa-globe text-accent-color mr-2"></i>Country
                </label>
                <input
                  v-model="tempClient.address.country"
                  type="text"
                  :disabled="!isEditing"
                  placeholder="Enter your country"
                  class="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent-color focus:outline-none text-sm sm:text-base"
                />
              </div>
            </div>
          </div>
          <div class="flex-1 h-56 sm:h-64 w-full rounded-2xl overflow-hidden border border-white/20 shadow-md relative">
            <div v-if="isUpdatingMap" class="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
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
            class="bg-green-500 text-white font-semibold py-2 sm:py-3 px-6 rounded-2xl hover:bg-green-700 transition duration-300 shadow-lg text-sm sm:text-base"
          >
            <i class="fa-solid fa-check"></i> Save
          </button>

          <button
            @click="cancelEdit"
            class="bg-red-500 text-white font-semibold py-2 sm:py-3 px-6 rounded-2xl hover:bg-[#630000] transition duration-300 shadow-lg text-sm sm:text-base"
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
import { useRouter } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
// NEW: Import the new component
import AlertPopup from "../components/AlertPopup.vue"; // <-- Adjust path if needed

const isEditing = ref(false);
const showOrders = ref(false);
const selectedOrder = ref(null);
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

const closePopup = () => {
  showPopup.value = false;
  popupMessage.value = "";
};

const togglePassword = () => (showPassword.value = !showPassword.value);
const toggleConfirmPassword = () =>
  (showConfirmPassword.value = !showConfirmPassword.value);
// router for navigation (used by Back button)
const router = useRouter();

// عرض البروفايل أو الأوردرز
const openEditProfile = () => {
  showOrders.value = false;
  isEditing.value = true;
};

const openOrders = () => {
  showOrders.value = true;
  isEditing.value = false;
};

const goBack = () => {
  // Navigate back to home page from the profile sidebar
  router.push("/");
};

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
      const event = new CustomEvent('userUpdated', {
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

// orders
const sortedOrders = computed(() => {
  if (!client.value?.orders) return [];
  return [...client.value.orders].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
});

const totalSales = computed(() => {
  if (!client.value?.orders) return 0;
  return client.value.orders
    .filter((o) => o.status === "Delivered")
    .reduce((sum, o) => sum + o.total, 0);
});
const statusClass = (status) => {
  if (status === "Delivered") return "bg-green-100 text-green-700";
  if (status === "Pending") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
};
const progressWidth = (status) => {
  if (status === "Pending") return "33%";
  if (status === "Delivered") return "100%";
  return "0%";
};

const nextOrder = () => {
  const idx = client.value.orders.findIndex(
    (o) => o.id === selectedOrder.value.id
  );
  selectedOrder.value =
    client.value.orders[(idx + 1) % client.value.orders.length];
};

const prevOrder = () => {
  const idx = client.value.orders.findIndex(
    (o) => o.id === selectedOrder.value.id
  );
  selectedOrder.value =
    client.value.orders[
      (idx - 1 + client.value.orders.length) % client.value.orders.length
    ];
};

const openModal = (order) => (selectedOrder.value = order);
const closeModal = () => (selectedOrder.value = null);

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
      if (typeof geocodeTimeout !== "undefined" && geocodeTimeout)
        clearTimeout(geocodeTimeout);
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
  background-color: #5984c6;
}
</style>