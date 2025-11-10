<script setup>
import { uploadImageOnly } from "@/composables/useImageUpload";
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { db, auth } from "@/firebase/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc, 
  serverTimestamp,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// 🟩 Import card component
import UserServiceCard from "../components/UserServiceCard.vue";
// NEW: Import the custom alert popup
import AlertPopup from "../components/AlertPopup.vue"; // <-- Adjust path if needed

// NEW: Refs for the custom alert popup
const showPopupMessage = ref(false);
const popupMessageContent = ref("");

// 🟦 Work Gallery images from Firestore
const galleryImages = ref([]);
const isCustomService = ref(false);

// NEW: Helper functions for custom alert popup
const triggerAlert = (message) => {
  popupMessageContent.value = message;
  showPopupMessage.value = true;
};
const closeAlert = () => {
  showPopupMessage.value = false;
  popupMessageContent.value = "";
};

// 🟦 Dynamic service list from Firestore
const serviceList = ref([]);

// Completed orders count for this technician
const completedCount = ref(0);

let _ordersUnsub = null;

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

// Live orders for this technician (to mark booked appointments)
const technicianOrders = ref([]);

// Holds the currently logged-in user (client)
const clientUser = ref(null);
const clientData = ref(null);

const serviceTitle = ref("");
const servicePrice = ref("");
const isPriceLocked = ref(false);
const orderDescription = ref("");

// --- Live Feedbacks from Firestore Ratings ---
const feedbacks = ref([]);

// ===== Carousel for Services =====
const currentSlide = ref(0);
// Hide arrows if there are fewer than 4 real services (custom not counted)
const showArrows = computed(() => serviceList.value.length >= 4);

const chunkedServices = computed(() => {
  const chunkSize = 4; // Always 4 per slide
  const services = [...serviceList.value]; // copy array
  // Add the custom service as the first card
  services.unshift({ id: "custom-service" });
  const chunks = [];
  for (let i = 0; i < services.length; i += chunkSize) {
    chunks.push(services.slice(i, i + chunkSize));
  }
  return chunks;
});

const nextSlide = () => {
  if (currentSlide.value < chunkedServices.value.length - 1) {
    currentSlide.value++;
  }
};

// --- Feedback carousel controls ---
const nextFeedback = () => {
  if (feedbacks.value.length === 0) return;
  currentIndex.value = (currentIndex.value + 1) % feedbacks.value.length;
};

const prevFeedback = () => {
  if (feedbacks.value.length === 0) return;
  currentIndex.value = (currentIndex.value - 1 + feedbacks.value.length) % feedbacks.value.length;
};

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--;
  }
};

// --- Computed Properties ---
const technicianName = computed(() => technician.value?.name || "Technician");
const technicianSkill = computed(() => technician.value?.skill || "Specialty");
const technicianLocation = computed(() => technician.value?.address.city || "Not Specified");
const technicianRating = computed(() => Math.round(technician.value?.ratingAverage || 0));
const technicianReviews = computed(() => technician.value?.ratingCount || 0);
const technicianProfileImage = computed(
  () => technician.value?.profileImage || new URL("../images/Ellipse 56.png", import.meta.url).href
);
const technicianMemberSince = computed(() => {
  const ca = technician.value?.createdAt;
  if (!ca) return "N/A";

  let date;
  // Firestore Timestamp object (has toDate)
  if (ca && typeof ca.toDate === "function") {
    date = ca.toDate();
  }
  // Plain object with seconds (e.g., { seconds, nanoseconds })
  else if (ca && typeof ca === "object" && ("seconds" in ca || "_seconds" in ca)) {
    const seconds = ca.seconds ?? ca._seconds;
    date = new Date(seconds * 1000);
  }
  // ISO string or numeric
  else {
    date = new Date(ca);
  }

  if (!(date instanceof Date) || isNaN(date.getTime())) return "N/A";
  // Return readable full date: e.g. "Oct 24, 2025"
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
});


// 🧠 Analyze uploaded image using Google Gemini Vision API
const analyzeImageWithAI = async () => {
  try {
    if (uploadedFiles.value.length === 0) {
      triggerAlert("Please upload a photo first.");
      return;
    }

    const file = uploadedFiles.value[0];
    if (!file.type.startsWith("image/")) {
      triggerAlert("Invalid file type. Please select an image.");
      return;
    }

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // ✳️ تأكد إنك ضايفها في .env
    if (!apiKey) throw new Error("Missing Gemini API key");

    // 🔹 حوّل الصورة Base64
    const reader = new FileReader();
    const base64Image = await new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    triggerAlert("Analyzing image, please wait...");

    // 🔹 استدعاء Gemini API
    const response = await fetch("http://localhost:5000/gemini/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        base64: base64Image,
        mimeType: file.type,
        prompt: "صف المشكلة الموجودة في الصورة بجملة قصيرة وواضحة بالعربية.",
      }),
    });



    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "تعذر تحليل الصورة، حاول مرة أخرى.";
    orderDescription.value = aiText;
    triggerAlert("AI description generated successfully!");
  } catch (err) {
    console.error("AI analysis error:", err);
    triggerAlert("Failed to analyze image.");
  }
};




// ✅ Converts "09:00 AM" → "09:00 PM" into 12-hour slot list (every 30 mins)
const generateTimeSlots = (startStr, endStr, intervalMinutes = 30) => {
  const slots = [];
  if (!startStr || !endStr) return slots;

  try {
    // parse 12h strings with AM/PM
    const parse12h = (str) => {
      const [time, period] = str.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
      return { hours, minutes };
    };

    const { hours: startH, minutes: startM } = parse12h(startStr);
    const { hours: endH, minutes: endM } = parse12h(endStr);

    const current = new Date();
    current.setHours(startH, startM, 0, 0);
    const end = new Date();
    end.setHours(endH, endM, 0, 0);

    // if end < start (invalid), skip
    if (end <= current) return slots;

    while (current <= end) {
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
    const schedule = availabilitySchedule.value.find((d) => d.name === dayName && d.active);
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
  const schedule = availabilitySchedule.value.find((d) => d.name === dayName && d.active);
  if (schedule && schedule.start && schedule.end) {
    return generateTimeSlots(schedule.start, schedule.end, 30);
  }
  return [];
});

// Set of booked times for currently selected day (based on existing orders)
const bookedTimesForSelectedDay = computed(() => {
  if (!selectedDayInfo.value || technicianOrders.value.length === 0) return new Set();
  const dayDisplay = selectedDayInfo.value.display;
  const times = technicianOrders.value
    .filter((o) => o.appointmentDay === dayDisplay)
    .map((o) => o.appointmentTime)
    .filter(Boolean);
  return new Set(times);
});

// --- Popup, Form & Order Submission ---
const openPopup = (service = null, price = null) => {
  if (!clientUser.value) {
    triggerAlert("Please select an available day and time.");
    router.push("/login");
    return;
  }

  showPopup.value = true;
  selectedDayInfo.value = null;
  selectedTime.value = "";
  uploadedFiles.value = [];
  orderDescription.value = "";

  if (service && price) {
    // 🔹 Predefined technician service
    serviceTitle.value = service;
    servicePrice.value = price;
    orderDescription.value = service;
    isPriceLocked.value = true;
    isCustomService.value = false; // hide AI button
  } else {
    // 🔹 Custom service
    serviceTitle.value = "Custom Service Request";
    servicePrice.value = "";
    orderDescription.value = "";
    isPriceLocked.value = false;
    isCustomService.value = true; // show AI button
  }
};


const closePopup = () => {
  showPopup.value = false;
};

// ✅ Add below your existing uploadedFiles ref
const previewUrls = ref([]);
const uploadStatus = ref("");

const handleFileUpload = async (event) => {
  const files = Array.from(event.target.files || []);
  uploadedFiles.value = files;
  previewUrls.value = [];
  uploadStatus.value = "";

  // 🟦 Step 1: show previews first
  for (const file of files) {
    if (file && file.type && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewUrls.value.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  // 🟦 Step 2: upload (after short wait to render previews)
  if (files.length > 0) {
    uploadStatus.value = "Uploading image...";
    await new Promise((resolve) => setTimeout(resolve, 200)); // let DOM render
    try {
      const urls = await uploadImagesToCloudinary(files);
      uploadStatus.value = "Image uploaded successfully!";
      console.log("✅ Uploaded URLs:", urls);
    } catch (err) {
      console.error("Upload failed:", err);
      uploadStatus.value = "Upload failed. Please try again.";
    }
  }
};




// 🟩 Upload images using Cloudinary (same as WorkGallery)
const uploadImagesToCloudinary = async (files) => {
  const urls = [];
  for (const file of files) {
    const imageUrl = await uploadImageOnly(file); // ✅ same Cloudinary method
    urls.push(imageUrl);
  }
  return urls;
};




const submitOrder = async () => {
  if (!selectedDayInfo.value || !selectedTime.value || !clientUser.value || !technician.value) {
    triggerAlert("Please select an available day and time.");
    return;
  }

  if (isCustomService.value) {
  if (!orderDescription.value.trim()) {
    triggerAlert("Please provide a description for your custom service.");
    isSubmitting.value = false;
    return;
  }
  if (!servicePrice.value.trim()) {
    triggerAlert("Please enter an estimated price or budget.");
    isSubmitting.value = false;
    return;
  }
} 
  isSubmitting.value = true;

  try {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const selectedDate = new Date(selectedDayInfo.value.date);
    const [time, period] = selectedTime.value.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    selectedDate.setHours(hours, minutes, 0, 0);

    const orderData = {
      clientId: clientUser.value.uid,
      clientName: clientData.value?.name || clientUser.value.email.split("@")[0],
      clientEmail: clientUser.value.email,
      technicianId: route.params.id,
      technicianName: technician.value.name || "Technician",
      technicianSkill: technician.value.skill || "General",
      serviceTitle: serviceTitle.value || "Custom Service Request",
      description: orderDescription.value || serviceTitle.value || "",
      price: servicePrice.value || "Pending Quote",
      appointmentDate: selectedDate,
      appointmentDay: selectedDayInfo.value.display,
      appointmentTime: selectedTime.value,
      status: "new",
      createdAt: serverTimestamp(),

      descreption: orderDescription.value || serviceTitle.value || "",
      date: selectedDayInfo.value.display || "",
      time: selectedTime.value || "",
      location: clientData.value?.address || "Not Specified",
      customer: clientData.value?.name || clientUser.value.email.split("@")[0],
      orderCode: verificationCode,
    };

    // Add order first
    const docRef = await addDoc(collection(db, "orders"), orderData);

    // 🔹 Upload any attached images to Firebase
    // 🔹 Upload any attached images to Firebase (same logic as WorkGallery)
    if (uploadedFiles.value.length > 0) {
      const imageUrls = await uploadImagesToCloudinary(uploadedFiles.value);
      await updateDoc(docRef, { imageUrls });
    }



    console.log("Order submitted with ID:", docRef.id);
    triggerAlert("Order submitted successfully!");
    closePopup();
  } catch (error) {
    console.error("Error submitting order:", error);
    triggerAlert("Failed to submit order. Please try again.");
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

// 🟩 NEW: Fetch Technician Gallery
const fetchTechnicianGallery = async (technicianId) => {
  try {
    const galleryRef = collection(db, "technicians", technicianId, "gallery");
    const snapshot = await getDocs(galleryRef);
    galleryImages.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching technician gallery:", error);
    galleryImages.value = [];
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

      if (technician.value.availability && Array.isArray(technician.value.availability)) {
        availabilitySchedule.value = technician.value.availability;
      } else {
        availabilitySchedule.value = [];
      }

      // 🟩 Fetch technician services dynamically
      await fetchTechnicianServices(technicianIdParam);

      // 🟩 Fetch technician gallery dynamically
      await fetchTechnicianGallery(technicianIdParam);

      // 🟩 Listen for completed orders count (live)
      try {
        const ordersRef = collection(db, "orders");
        const q = query(
          ordersRef,
          where("technicianId", "==", technicianIdParam),
          where("status", "==", "completed")
        );
        _ordersUnsub = onSnapshot(q, (snap) => {
          completedCount.value = snap.size;
        });
      } catch (e) {
        console.error("Error listening for completed orders:", e);
      }

      // 🔹 Listen to all orders for this technician to disable booked slots
      try {
        const allOrdersRef = collection(db, "orders");
        const qAll = query(allOrdersRef, where("technicianId", "==", technicianIdParam));
        onSnapshot(qAll, (snap) => {
          technicianOrders.value = snap.docs.map((d) => d.data());
        });
      } catch (e) {
        console.error("Error listening for technician orders:", e);
      }
      
      // 🟩 Listen for Ratings for this technician (no orderBy; sort client-side)
      try {
        const mapRatings = (docs) =>
          docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .filter((r) => {
              const techId = technicianIdParam;
              return (
                r.technicianId === techId ||
                r.technicianID === techId ||
                r.providerId === techId ||
                r.providerID === techId
              );
            })
            .map((r) => ({
              id: r.id,
              name: r.clientName || "Client",
              image:
                r.clientImageUrl || new URL("../images/Ellipse 56.png", import.meta.url).href,
              text: r.comment || "",
              stars: Number(r.stars || r.rating || 0),
              createdAt: r.createdAt || null,
            }));

        const mergeAndSort = (arrA, arrB) => {
          const merged = [...arrA, ...arrB];
          merged.sort((a, b) => {
            const toMillis = (t) =>
              t && typeof t.toDate === "function"
                ? t.toDate().getTime()
                : t && typeof t === "object" && (t.seconds || t._seconds)
                ? (t.seconds || t._seconds) * 1000
                : 0;
            return toMillis(b.createdAt) - toMillis(a.createdAt);
          });
          return merged;
        };

        // 'Ratings' collection
        const ratingsRefA = collection(db, "Ratings");
        const rqAFallback = query(ratingsRefA, where("technicianId", "==", technicianIdParam));
        onSnapshot(rqAFallback, (snapA) => {
          const itemsA = mapRatings(snapA.docs).map((x) => ({ ...x, __src: "ratingsA" }));
          feedbacks.value = mergeAndSort(itemsA, feedbacks.value.filter((x) => x.__src !== "ratingsA"));
          if (currentIndex.value >= feedbacks.value.length) currentIndex.value = 0;
        });

        // 'ratings' (lowercase) for backward compatibility
        const ratingsRefB = collection(db, "ratings");
        const rqBFallback = query(ratingsRefB, where("technicianId", "==", technicianIdParam));
        onSnapshot(rqBFallback, (snapB) => {
          const itemsB = mapRatings(snapB.docs).map((x) => ({ ...x, __src: "ratingsB" }));
          feedbacks.value = mergeAndSort(feedbacks.value.filter((x) => x.__src !== "ratingsB"), itemsB);
          if (currentIndex.value >= feedbacks.value.length) currentIndex.value = 0;
        });
      } catch (e) {
        console.error("Error listening for ratings:", e);
      }
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

onUnmounted(() => {
  if (_ordersUnsub) _ordersUnsub();
});

watch(selectedDayInfo, () => {
  selectedTime.value = "";
});
</script>


<template>
  <!-- Loading State -->
  <div v-if="isLoading" class="flex justify-center items-center min-h-screen">
    <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-accent-color"></div>
    <p class="ml-4 text-2xl text-accent-color">Loading Profile...</p>
  </div>

  <!-- Not Found State -->
  <div v-else-if="!technician" class="flex justify-center items-center min-h-screen">
    <p class="text-2xl text-red-500">Technician not found.</p>
  </div>

  <!-- Profile Content -->
  <div v-else>
    <div
      class="technichainProfile my-10 md:my-20 w-[90%] md:w-[80%] mx-auto flex flex-col lg:flex-row justify-between gap-8 lg:gap-12"
    >
      <!-- Left Card (Technician Info) -->
      <div class="card w-full lg:w-[35%] bg-gray-50 dark:bg-[#16222B] rounded-2xl shadow-lg self-start p-6">
        <div class="imgContainer flex flex-col items-center justify-center">
          <img
            :src="technicianProfileImage"
            class="mt-3 w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-white shadow-md"
            alt="Technician Profile Photo"
          />
          <div class="nameContainer flex items-center mt-4">
            <h2 class="font-semibold text-2xl md:text-3xl text-gray-800 dark:text-white">
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
          <h3 class="text-lg md:text-xl text-gray-600 dark:text-white mt-1">
            {{ technicianSkill }}
          </h3>
          <div class="flex justify-center my-2 text-yellow-400 text-lg md:text-xl">
            <i v-for="n in technicianRating" :key="n" class="fas fa-star fill-current"></i>
            <i
              v-for="n in 5 - technicianRating"
              :key="'empty-' + n"
              class="far fa-star text-gray-300"
            ></i>
          </div>
          <p class="text-sm md:text-base mb-3 text-gray-500 dark:text-white">({{ technicianReviews }} reviews)</p>
          <div class="line w-full h-px bg-gray-300 my-4"></div>
        </div>

        <div
          class="dataContainer flex justify-between px-2 md:px-6 pb-4 text-sm md:text-base font-medium text-gray-700 dark:text-white"
        >
          <div class="dataKey space-y-3">
            <div class="flex items-center gap-2">
              <i class="fas fa-map-marker-alt w-5 text-center text-accent-color"></i>
              Location
            </div>
            <div class="flex items-center gap-2">
              <i class="fas fa-user-check w-5 text-center text-accent-color"></i>
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
          <div class="dataValue space-y-3 text-right text-gray-600 dark:text-white font-normal">
            <div>{{ technicianLocation }}</div>
            <div>{{ technicianMemberSince }}</div>
            <div>~35 Minutes</div>
            <div>{{ completedCount }}</div>
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
        <h1 class="main-header m-0">Services Offered</h1>

        <!-- ✅ Fixed Carousel (2 rows × 2 columns, 4 cards per slide) -->
        <div class="relative w-full flex justify-center">
          <!-- Outer Wrapper (allows arrows to show fully) -->
          <div class="relative w-[90%] overflow-hidden rounded-2xl">
            <!-- Inner Slides -->
            <div
              class="flex transition-transform duration-700 ease-in-out"
              :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
            >
              <!-- Each slide contains exactly 4 cards (2x2 grid) -->
              <div
                v-for="(chunk, index) in chunkedServices"
                :key="index"
                class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full shrink-0"
              >
                <div
                  v-for="(service, i) in chunk"
                  :key="service.id"
                  class="serviceCard rounded-2xl text-center p-6 bg-white dark:bg-[#16222B] flex flex-col items-center justify-between transition-shadow h-80"
                >
                  <!-- ✅ Custom Service (First Card in First Slide Only) -->
                  <template v-if="index === 0 && i === 0">
                    <div
                      class="serviceCard rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 bg-white dark:bg-[#16222B]  flex flex-col items-center justify-between h-80 w-full"
                    >
                      <div class="serviceImg mb-4">
                        <img
                          src="../images/custom.png"
                          class="w-28 h-28 md:w-32 md:h-32 object-contain"
                          alt="Custom Service"
                        />
                      </div>
                      <h2 class="font-bold mb-4 text-lg md:text-xl text-gray-800 dark:text-white">
                        Custom Service
                      </h2>
                      <button
                        @click="openPopup()"
                        class="w-full bg-accent-color text-white px-4 py-2 mt-auto rounded-lg font-semibold hover:bg-[#4a74b3] transition cursor-pointer"
                      >
                        Enter Details
                      </button>
                    </div>
                  </template>

                  <!-- ✅ Dynamic Services -->
                  <template v-else>
                    <UserServiceCard
                      :service="service"
                      class="h-full w-full"
                      @order="(srv) => openPopup(srv.descreption, srv.price)"
                    />
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!-- ✅ Navigation Arrows (moved outside overflow) -->
          <button
            v-if="showArrows"
            @click="prevSlide"
            class="absolute left-2 md:left-[-30px] top-1/2 -translate-y-1/2 bg-accent-color text-white rounded-full p-3 shadow-lg hover:bg-[#4a74b3] transition z-30"
          >
            <i class="fas fa-chevron-left"></i>
          </button>

          <button
            v-if="showArrows"
            @click="nextSlide"
            class="absolute right-2 md:right-[-30px] top-1/2 -translate-y-1/2 bg-accent-color text-white rounded-full p-3 shadow-lg hover:bg-[#4a74b3] transition z-30"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Order Popup -->
    <div
      v-if="showPopup"
      class="orderDetails fixed inset-0 bg-[#00000084] flex justify-center items-center z-50 p-4"
      @click.self="closePopup"
    >
      <div
        class="bg-white dark:bg-[#16222B]  rounded-2xl p-6 md:p-8 w-full max-w-3xl text-center shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        <button
          @click="closePopup"
          class="absolute top-3 right-4 text-gray-500 dark:text-white hover:text-red-600 text-2xl z-10"
        >
          &times;
        </button>
        <h2 class="text-2xl font-semibold mb-6 text-accent-color">Order Details</h2>
        <div class="subContainer flex flex-col md:flex-row gap-6">
          <div class="orderDetails w-full md:w-1/2 space-y-4">
            <div class="flex flex-col items-start">
              <label for="photoUpload" class="font-semibold mb-2 text-lg text-accent-color dark:text-white"
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
              <div v-if="uploadedFiles.length > 0" class="mt-2 text-sm text-gray-600 w-full">
                <p
                    v-for="(file, i) in uploadedFiles"
                    :key="i"
                    v-if="file && file.type && file.type.startsWith('image/')"
                    class="truncate"
                  >
                    {{ file.name }}
                  </p>

                <!-- ✅ New: small image preview -->
                <div class="flex flex-wrap gap-3 mt-3">
                  <img
                    v-for="(src, i) in previewUrls"
                    :key="i"
                    :src="src"
                    alt="Preview"
                    class="w-20 h-20 object-cover rounded-lg border border-gray-300 shadow-sm"
                  />
                </div>

                <!-- ✅ New: upload status -->
                <p
                  v-if="uploadStatus"
                  class="mt-2 text-sm font-medium"
                  :class="uploadStatus.includes('success') ? 'text-green-600' : uploadStatus.includes('Uploading') ? 'text-blue-600' : 'text-red-600'"
                >
                  {{ uploadStatus }}
                </p>
              </div>


            </div>
            <div>
              <label class="block text-left font-semibold text-gray-700 mb-1 dark:text-white">Description</label>
              <textarea
                v-model="orderDescription"
                placeholder="Describe your problem or custom request..."
                class="w-full h-32 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-color "
                :disabled="isPriceLocked"
              ></textarea>
              <button
                v-if="isCustomService"
                @click="analyzeImageWithAI"
                class="mt-2 bg-accent-color text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#4a74b3] transition cursor-pointer flex items-center gap-2"
              >
                <i class="fa-solid fa-magic-wand-sparkles"></i>
                Generate with AI
              </button>

            </div>
            <div>
              <label class="block text-left font-semibold text-gray-700 mb-1 dark:text-white">Price</label>
              <input
                v-model="servicePrice"
                :disabled="isPriceLocked"
                type="text"
                :placeholder="
                  isPriceLocked ? 'Price set by service' : 'Enter Your Budget (Optional)...'
                "
                class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-color disabled:bg-gray-100 dark:disabled:bg-transparent"
              />
            </div>
          </div>
          <div class="orderTime w-full md:w-1/2 flex flex-col items-center">
            <h3 class="text-xl font-semibold text-accent-color mb-4 dark:text-white">Choose Appointment</h3>
            <div class="w-[90%] md:w-[80%] space-y-4">
              <div>
                <label class="block text-left font-medium mb-1 text-accent-color dark:text-white"
                  >Select Available Day:</label
                >
                <select
                  v-model="selectedDayInfo"
                  class="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-accent-color dark:text-black dark:bg-white"
                  :disabled="activeAvailableDays.length === 0"
                >
                  <option :value="null" disabled>
                    {{
                      activeAvailableDays.length === 0
                        ? "Technician not available"
                        : "-- Select Day --"
                    }}
                  </option>
                  <option v-for="day in activeAvailableDays" :key="day.display" :value="day">
                    {{ day.display }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-left font-medium mb-1 text-accent-color dark:text-white"
                  >Select Time:</label
                >
                <select
                  v-model="selectedTime"
                  class="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-accent-color dark:text-black dark:bg-white"
                  :disabled="!selectedDayInfo || availableTimeSlots.length === 0"
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
                    :disabled="bookedTimesForSelectedDay.has(time)"
                  >
                    {{ time }}
                    {{ bookedTimesForSelectedDay.has(time) ? "(Booked)" : "" }}
                  </option>
                </select>
              </div>
            </div>
            <div v-if="selectedDayInfo && selectedTime" class="mt-6 text-gray-700 dark:text-white text-center">
              <p>
                You selected: <br /><span class="font-semibold text-accent-color dark:text-white ">{{
                  selectedDayInfo.display
                }}</span>
                at
                <span class="font-semibold text-accent-color dark:text-white">{{ selectedTime }}</span>
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

    <!-- 🟦 Safe Dynamic Work Gallery -->
    <div
      v-if="technician && Array.isArray(galleryImages)"
      class="WorkGallery flex flex-col items-center justify-center w-[90%] md:w-[80%] mx-auto mt-16 md:mt-24"
    >
      <h1 class="main-header">Work Gallery</h1>

      <div
        v-if="galleryImages.length > 0"
        class="galleryContainer grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full"
      >
        <div
          v-for="(img, index) in galleryImages"
          :key="img.id || index"
          class="imgContainer rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 aspect-square"
        >
          <img
            :src="img.url"
            :alt="`Work photo ${index + 1}`"
            class="w-full h-full object-cover"
          />
        </div>
      </div>

      <div v-else class="text-gray-500 mt-6 italic">
        This technician has not uploaded any work photos yet.
      </div>
    </div>

    <!-- Feedback Slider (Static) -->
    <div
      class="feedback relative flex flex-col items-center justify-center w-[90%] md:w-[70%] mx-auto my-16 md:my-24 text-center px-4"
    >
      <h1 class="main-header">Customer Feedback</h1>
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
          <div class="flex justify-center my-2 text-yellow-400 text-lg md:text-xl">
            <i v-for="n in (feedbacks[currentIndex].stars || 0)" :key="'f'+n" class="fas fa-star fill-current mx-0.5"></i>
            <i v-for="n in Math.max(0, 5 - (feedbacks[currentIndex].stars || 0))" :key="'e'+n" class="far fa-star text-gray-300 mx-0.5"></i>
          </div>
          <p class="text-base md:text-lg text-gray-600 leading-relaxed mt-4 italic px-4">
            "{{ feedbacks[currentIndex].text }}"`
          </p>
        </div>
      </div>
      <div v-else class="text-gray-500 mt-10">No feedback available yet.</div>

      <AlertPopup :show="showPopupMessage" :message="popupMessageContent" @close="closeAlert" />
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

