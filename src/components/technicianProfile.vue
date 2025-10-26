<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { db, auth } from "@/firebase/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// 🟩 Import card component
import UserServiceCard from "../components/UserServiceCard.vue";

// 🟦 Dynamic service list from Firestore
const serviceList = ref([]);

const showPopup = ref(false);
const uploadedFiles = ref([]);
const selectedDayInfo = ref(null);
const selectedTime = ref("");
const currentIndex = ref(0);

const route = useRoute();
const router = useRouter();
const technician = ref(null);
const isLoading = ref(true);
const isSubmitting = ref(false);

// Stores the fetched availability schedule from Firebase
const availabilitySchedule = ref([]);

// Holds the currently logged-in user (client)
const clientUser = ref(null);
const clientData = ref(null);

const serviceTitle = ref("");
const servicePrice = ref("");
const isPriceLocked = ref(false);
const orderDescription = ref("");

// --- Static Feedbacks ---
const feedbacks = ref([
  {
    name: "manar morad",
    image: new URL("../images/Ellipse 47.png", import.meta.url).href,
    text: "I needed a plumber for an urgent leak...",
  },
  {
    name: "mohamed amir",
    image: new URL("../images/Ellipse 46.png", import.meta.url).href,
    text: "I finally decided to get my kitchen cabinets updated...",
  },
  {
    name: "samir khaled",
    image: new URL("../images/Ellipse 46.png", import.meta.url).href,
    text: "My main breaker kept tripping...",
  },
]);

// --- Computed Properties ---
const technicianName = computed(() => technician.value?.name || "Technician");
const technicianSkill = computed(() => technician.value?.skill || "Specialty");
const technicianLocation = computed(
  () => technician.value?.city || "Not Specified"
);
const technicianRating = computed(() =>
  Math.round(technician.value?.rating || 0)
);
const technicianReviews = computed(() => technician.value?.reviews || 0);
const technicianProfileImage = computed(
  () =>
    technician.value?.profileImage ||
    new URL("../images/Ellipse 56.png", import.meta.url).href
);
const technicianMemberSince = computed(() => {
  if (!technician.value?.createdAt) return "N/A";
  const date = technician.value.createdAt.toDate
    ? technician.value.createdAt.toDate()
    : new Date(technician.value.createdAt);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
});

// --- Availability Logic ---
const generateTimeSlots = (startStr, endStr, intervalMinutes = 30) => {
  const slots = [];
  if (!startStr || !endStr) return slots;
  try {
    const [startH, startM] = startStr.split(":").map(Number);
    const [endH, endM] = endStr.split(":").map(Number);
    let current = new Date();
    current.setHours(startH, startM, 0, 0);
    const end = new Date();
    end.setHours(endH, endM, 0, 0);
    if (end <= current) return slots;
    while (current < end) {
      slots.push(
        current.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
      current.setMinutes(current.getMinutes() + intervalMinutes);
    }
  } catch (e) {
    console.error("Error generating time slots:", e);
  }
  return slots;
};

const activeAvailableDays = computed(() => {
  const available = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    const schedule = availabilitySchedule.value.find(
      (d) => d.name === dayName && d.active
    );
    if (schedule) {
      available.push({
        date: date,
        name: dayName,
        display: date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
        }),
      });
    }
  }
  return available;
});

const availableTimeSlots = computed(() => {
  if (!selectedDayInfo.value) return [];
  const dayName = selectedDayInfo.value.name;
  const schedule = availabilitySchedule.value.find(
    (d) => d.name === dayName && d.active
  );
  if (schedule && schedule.start && schedule.end) {
    return generateTimeSlots(schedule.start, schedule.end, 60);
  }
  return [];
});

// --- Popup, Form & Order Submission ---
const openPopup = (service = null, price = null) => {
  if (!clientUser.value) {
    alert("Please log in as a client to place an order.");
    router.push("/login");
    return;
  }
  showPopup.value = true;
  selectedDayInfo.value = null;
  selectedTime.value = "";
  uploadedFiles.value = [];
  orderDescription.value = "";

  if (service && price) {
    serviceTitle.value = service;
    servicePrice.value = price;
    orderDescription.value = service;
    isPriceLocked.value = true;
  } else {
    serviceTitle.value = "Custom Service Request";
    servicePrice.value = "";
    orderDescription.value = "";
    isPriceLocked.value = false;
  }
};

const closePopup = () => {
  showPopup.value = false;
};

const handleFileUpload = (event) => {
  uploadedFiles.value = Array.from(event.target.files);
};

const submitOrder = async () => {
  if (
    !selectedDayInfo.value ||
    !selectedTime.value ||
    !clientUser.value ||
    !technician.value
  ) {
    alert("Please select an available day and time.");
    return;
  }
  isSubmitting.value = true;

  try {
    const selectedDate = selectedDayInfo.value.date;
    const [time, period] = selectedTime.value.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    selectedDate.setHours(hours, minutes, 0, 0);

    const orderData = {
      clientId: clientUser.value.uid,
      clientName:
        clientData.value?.name || clientUser.value.email.split("@")[0],
      clientEmail: clientUser.value.email,
      technicianId: route.params.id,
      technicianName: technician.value.name,
      technicianSkill: technician.value.skill,
      serviceTitle: serviceTitle.value,
      description: orderDescription.value,
      price: servicePrice.value || "Pending Quote",
      appointmentDate: selectedDate,
      status: "new",
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, "orders"), orderData);
    alert("Order submitted successfully!");
    closePopup();
  } catch (error) {
    console.error("Error submitting order: ", error);
    alert("Failed to submit order. Please try again.");
  } finally {
    isSubmitting.value = false;
  }
};

// --- Fetch Technician, Client, and Services ---
const fetchTechnicianServices = async (technicianId) => {
  try {
    const servicesRef = collection(db, "technicians", technicianId, "services");
    const snapshot = await getDocs(servicesRef);
    serviceList.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching technician services:", error);
  }
};

onMounted(async () => {
  isLoading.value = true;

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      clientUser.value = user;
      const clientDocRef = doc(db, "clients", user.uid);
      const clientDocSnap = await getDoc(clientDocRef);
      if (clientDocSnap.exists()) {
        clientData.value = clientDocSnap.data();
      } else {
        clientData.value = { name: user.email.split("@")[0] };
      }
    } else {
      clientUser.value = null;
      clientData.value = null;
    }
  });

  const technicianIdParam = route.params.id;
  if (!technicianIdParam) {
    console.error("No technician ID found in route.");
    isLoading.value = false;
    return;
  }
  try {
    const docRef = doc(db, "technicians", technicianIdParam);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      technician.value = docSnap.data();

      if (
        technician.value.availability &&
        Array.isArray(technician.value.availability)
      ) {
        availabilitySchedule.value = technician.value.availability;
      } else {
        availabilitySchedule.value = [];
      }

      // 🟩 Fetch technician services dynamically
      await fetchTechnicianServices(technicianIdParam);
    } else {
      technician.value = null;
    }
  } catch (error) {
    console.error("Error fetching technician:", error);
    technician.value = null;
  } finally {
    isLoading.value = false;
  }
});

watch(selectedDayInfo, () => {
  selectedTime.value = "";
});
</script>



<template>
  <!-- Loading State -->
  <div v-if="isLoading" class="flex justify-center items-center min-h-screen">
    <div
      class="animate-spin rounded-full h-16 w-16 border-b-4 border-accent-color"
    ></div>
    <p class="ml-4 text-2xl text-accent-color">Loading Profile...</p>
  </div>

  <!-- Not Found State -->
  <div
    v-else-if="!technician"
    class="flex justify-center items-center min-h-screen"
  >
    <p class="text-2xl text-red-500">Technician not found.</p>
  </div>

  <!-- Profile Content -->
  <div v-else>
    <div
      class="technichainProfile my-10 md:my-20 w-[90%] md:w-[80%] mx-auto flex flex-col lg:flex-row justify-between gap-8 lg:gap-12"
    >
      <!-- Left Card (Technician Info) -->
      <div
        class="card w-full lg:w-[35%] bg-gray-50 rounded-2xl shadow-lg self-start p-6"
      >
        <div class="imgContainer flex flex-col items-center justify-center">
          <img
            :src="technicianProfileImage"
            class="mt-3 w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-white shadow-md"
            alt="Technician Profile Photo"
          />
          <div class="nameContainer flex items-center mt-4">
            <h2 class="font-semibold text-2xl md:text-3xl text-gray-800">
              {{ technicianName }}
            </h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              class="w-5 h-5 md:w-6 md:h-6 text-accent-color shrink-0 ml-2 fill-current"
            >
              <path
                d="M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zM374 145.7c-10.7-7.8-25.7-5.4-33.5 5.3L221.1 315.2 169 263.1c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l72 72c5 5 11.8 7.5 18.8 7s13.4-4.1 17.5-9.8L379.3 179.2c7.8-10.7 5.4-25.7-5.3-33.5z"
              />
            </svg>
          </div>
          <h3 class="text-lg md:text-xl text-gray-600 mt-1">
            {{ technicianSkill }}
          </h3>
          <div
            class="flex justify-center my-2 text-yellow-400 text-lg md:text-xl"
          >
            <i
              v-for="n in technicianRating"
              :key="n"
              class="fas fa-star fill-current"
            ></i>
            <i
              v-for="n in 5 - technicianRating"
              :key="'empty-' + n"
              class="far fa-star text-gray-300"
            ></i>
          </div>
          <p class="text-sm md:text-base mb-3 text-gray-500">
            ({{ technicianReviews }} reviews)
          </p>
          <div class="line w-full h-px bg-gray-300 my-4"></div>
        </div>

        <div
          class="dataContainer flex justify-between px-2 md:px-6 pb-4 text-sm md:text-base font-medium text-gray-700"
        >
          <div class="dataKey space-y-3">
            <div class="flex items-center gap-2">
              <i
                class="fas fa-map-marker-alt w-5 text-center text-accent-color"
              ></i>
              Location
            </div>
            <div class="flex items-center gap-2">
              <i
                class="fas fa-user-check w-5 text-center text-accent-color"
              ></i>
              Member Since
            </div>
            <div class="flex items-center gap-2">
              <i class="fas fa-clock w-5 text-center text-accent-color"></i>
              Response time
            </div>
            <div class="flex items-center gap-2">
              <i class="fas fa-briefcase w-5 text-center text-accent-color"></i>
              Orders Completed
            </div>
          </div>
          <div class="dataValue space-y-3 text-right text-gray-600 font-normal">
            <div>{{ technicianLocation }}</div>
            <div>{{ technicianMemberSince }}</div>
            <div>~35 Minutes</div>
            <div>112+</div>
          </div>
        </div>
        <div class="flex justify-center mb-6 px-6">
          <router-link
            :to="{ path: '/chat', query: { uid: route.params.id } }"
            class="w-full bg-accent-color text-white text-center px-6 py-3 rounded-lg text-lg font-semibold hover:bg-[#4a74b3] transition cursor-pointer shadow-md"
          >
            Chat with {{ technicianName.split(" ")[0] }}
          </router-link>
        </div>
      </div>

      <!-- Right Section (Services) -->
      <div class="w-full lg:w-[60%] flex flex-col">
        <h1
          class="font-bold text-3xl md:text-4xl lg:text-5xl text-accent-color text-center mb-10"
        >
          Services Offered
        </h1>

        <!-- ✅ Service Cards Grid (Dynamic + Custom) -->
        <div class="cardsContainer grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Custom Service -->
          <div
            class="serviceCard rounded-2xl shadow-lg text-center p-6 bg-white flex flex-col items-center justify-between hover:shadow-xl transition-shadow"
          >
            <div class="serviceImg mb-4">
              <img
                src="../images/custom.png"
                class="w-28 h-28 md:w-32 md:h-32 object-contain"
                alt="Custom Service"
              />
            </div>
            <h2 class="font-bold mb-4 text-lg md:text-xl text-gray-800">
              Custom Service
            </h2>
            <button
              @click="openPopup()"
              class="w-full bg-accent-color text-white px-4 py-2 mt-auto rounded-lg font-semibold hover:bg-[#4a74b3] transition cursor-pointer"
            >
              Enter Details
            </button>
          </div>

          <!-- Dynamic Services -->
          <UserServiceCard
            v-for="service in serviceList"
            :key="service.id"
            :service="service"
            @order="(srv) => openPopup(srv.descreption, srv.price)"
          />
        </div>
      </div>
    </div>

    <!-- Order Popup -->
    <div
      v-if="showPopup"
      class="orderDetails fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      @click.self="closePopup"
    >
      <div
        class="bg-white rounded-2xl p-6 md:p-8 w-full max-w-3xl text-center shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        <button
          @click="closePopup"
          class="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-2xl z-10"
        >
          &times;
        </button>
        <h2 class="text-2xl font-semibold mb-6 text-accent-color">
          Order Details
        </h2>
        <div class="subContainer flex flex-col md:flex-row gap-6">
          <div class="orderDetails w-full md:w-1/2 space-y-4">
            <div class="flex flex-col items-start">
              <label
                for="photoUpload"
                class="font-semibold mb-2 text-lg text-accent-color"
                >Upload Photos (optional)</label
              >
              <input
                id="photoUpload"
                type="file"
                multiple
                accept="image/*"
                class="hidden"
                @change="handleFileUpload"
              />
              <label
                for="photoUpload"
                class="flex items-center gap-2 bg-accent-color text-white px-4 py-2 rounded-lg shadow-md cursor-pointer hover:bg-[#4a74b3] transition"
              >
                <i class="fas fa-upload"></i><span>Select Photos</span>
              </label>
              <div
                v-if="uploadedFiles.length > 0"
                class="mt-2 text-sm text-gray-600"
              >
                <p
                  v-for="file in uploadedFiles"
                  :key="file.name"
                  class="truncate"
                >
                  {{ file.name }}
                </p>
              </div>
            </div>
            <div>
              <label class="block text-left font-semibold text-gray-700 mb-1"
                >Description</label
              >
              <textarea
                v-model="orderDescription"
                placeholder="Describe your problem or custom request..."
                class="w-full h-32 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-color"
                :disabled="isPriceLocked"
              ></textarea>
            </div>
            <div>
              <label class="block text-left font-semibold text-gray-700 mb-1"
                >Price</label
              >
              <input
                v-model="servicePrice"
                :disabled="isPriceLocked"
                type="text"
                :placeholder="
                  isPriceLocked
                    ? 'Price set by service'
                    : 'Enter Your Budget (Optional)...'
                "
                class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-color disabled:bg-gray-100"
              />
            </div>
          </div>
          <div class="orderTime w-full md:w-1/2 flex flex-col items-center">
            <h3 class="text-xl font-semibold text-accent-color mb-4">
              Choose Appointment
            </h3>
            <div class="w-[90%] md:w-[80%] space-y-4">
              <div>
                <label
                  class="block text-left font-medium mb-1 text-accent-color"
                  >Select Available Day:</label
                >
                <select
                  v-model="selectedDayInfo"
                  class="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-accent-color"
                  :disabled="activeAvailableDays.length === 0"
                >
                  <option :value="null" disabled>
                    {{
                      activeAvailableDays.length === 0
                        ? "Technician not available"
                        : "-- Select Day --"
                    }}
                  </option>
                  <option
                    v-for="day in activeAvailableDays"
                    :key="day.display"
                    :value="day"
                  >
                    {{ day.display }}
                  </option>
                </select>
              </div>
              <div>
                <label
                  class="block text-left font-medium mb-1 text-accent-color"
                  >Select Time:</label
                >
                <select
                  v-model="selectedTime"
                  class="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-accent-color"
                  :disabled="
                    !selectedDayInfo || availableTimeSlots.length === 0
                  "
                >
                  <option value="" disabled>
                    {{
                      !selectedDayInfo
                        ? "Select day first"
                        : availableTimeSlots.length === 0
                        ? "No slots"
                        : "-- Select Time --"
                    }}
                  </option>
                  <option
                    v-for="time in availableTimeSlots"
                    :key="time"
                    :value="time"
                  >
                    {{ time }}
                  </option>
                </select>
              </div>
            </div>
            <div
              v-if="selectedDayInfo && selectedTime"
              class="mt-6 text-gray-700 text-center"
            >
              <p>
                You selected: <br /><span
                  class="font-semibold text-accent-color"
                  >{{ selectedDayInfo.display }}</span
                >
                at
                <span class="font-semibold text-accent-color">{{
                  selectedTime
                }}</span>
              </p>
            </div>
            <div
              v-else-if="selectedDayInfo && availableTimeSlots.length === 0"
              class="mt-6 text-red-600 text-center"
            >
              <p>No available time slots for the selected day.</p>
            </div>
          </div>
        </div>
        <div class="flex justify-center gap-4 mt-8">
          <button
            @click="closePopup"
            class="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            @click="submitOrder"
            :disabled="!selectedDayInfo || !selectedTime || isSubmitting"
            class="bg-accent-color text-white px-6 py-2 rounded-lg hover:bg-[#4a74b3] transition cursor-pointer shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? "Submitting..." : "Submit Order" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Work Gallery (Static) -->
    <div
      class="WorkGallery flex flex-col items-center justify-center w-[90%] md:w-[80%] mx-auto mt-16 md:mt-24"
    >
      <h1
        class="font-bold text-3xl md:text-4xl lg:text-5xl text-accent-color text-center mb-10"
      >
        Work Gallery
      </h1>
      <div
        class="galleryContainer grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full"
      >
        <div
          class="imgContainer rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 aspect-square"
        >
          <img
            src="../images/w1.png"
            alt="Work sample 1"
            class="w-full h-full object-cover"
          />
        </div>
        <div
          class="imgContainer rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 aspect-square"
        >
          <img
            src="../images/w2.png"
            alt="Work sample 2"
            class="w-full h-full object-cover"
          />
        </div>
        <div
          class="imgContainer rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 aspect-square"
        >
          <img
            src="../images/w3.png"
            alt="Work sample 3"
            class="w-full h-full object-cover"
          />
        </div>
        <div
          class="imgContainer rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 aspect-square"
        >
          <img
            src="../images/w4.png"
            alt="Work sample 4"
            class="w-full h-full object-cover"
          />
        </div>
        <div
          class="imgContainer rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 aspect-square"
        >
          <img
            src="../images/w5.png"
            alt="Work sample 5"
            class="w-full h-full object-cover"
          />
        </div>
        <div
          class="imgContainer rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 aspect-square"
        >
          <img
            src="../images/w6.png"
            alt="Work sample 6"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>

    <!-- Feedback Slider (Static) -->
    <div
      class="feedback relative flex flex-col items-center justify-center w-[90%] md:w-[70%] mx-auto my-16 md:my-24 text-center px-4"
    >
      <h1
        class="font-bold text-3xl md:text-4xl lg:text-5xl text-accent-color text-center mb-10"
      >
        Customer Feedback
      </h1>
      <div
        v-if="feedbacks.length > 0"
        :key="currentIndex"
        class="feedback-item w-full relative pt-12 min-h-[350px] flex flex-col items-center"
      >
        <button
          @click="prevFeedback"
          class="absolute left-[-20px] md:left-0 top-1/2 -translate-y-1/2 text-3xl md:text-4xl text-accent-color hover:text-[#4a74b3] transition z-10 p-2 md:p-4 opacity-70 hover:opacity-100"
        >
          &#10094;
        </button>
        <button
          @click="nextFeedback"
          class="absolute right-[-20px] md:right-0 top-1/2 -translate-y-1/2 text-3xl md:text-4xl text-accent-color hover:text-[#4a74b3] transition z-10 p-2 md:p-4 opacity-70 hover:opacity-100"
        >
          &#10095;
        </button>

        <div class="flex flex-col items-center max-w-2xl">
          <img
            :src="feedbacks[currentIndex].image"
            class="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-lg mb-4 border-4 border-white"
            alt="Customer photo"
          />
          <p class="text-xl md:text-2xl font-semibold text-gray-800">
            {{ feedbacks[currentIndex].name }}
          </p>
          <div
            class="flex justify-center my-2 text-yellow-400 text-lg md:text-xl"
          >
            <i
              v-for="n in 5"
              :key="n"
              class="fas fa-star fill-current mx-0.5"
            ></i>
          </div>
          <p
            class="text-base md:text-lg text-gray-600 leading-relaxed mt-4 italic px-4"
          >
            "{{ feedbacks[currentIndex].text }}"`
          </p>
        </div>
      </div>
      <div v-else class="text-gray-500 mt-10">No feedback available yet.</div>
    </div>
  </div>
</template>


<style scoped>
/* Add any specific styles if needed */
.feedback-item {
  min-height: 350px; /* Adjust as needed */
}
/* Basic styling for Font Awesome icons if not globally included */
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");
</style>





