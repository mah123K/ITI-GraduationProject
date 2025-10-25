<script setup>
import { ref, onMounted, computed } from "vue" // MODIFIED
import { useRoute } from "vue-router" // ADDED
import { db } from "@/firebase/firebase" // ADDED (ensure this path is correct)
import { doc, getDoc } from "firebase/firestore" // ADDED

const showPopup = ref(false)
const uploadedFiles = ref([])
const selectedDay = ref("")
const selectedTime = ref("")
const availableDays = ref([])
const currentIndex = ref(0)

// ADDED: Refs for dynamic data
const route = useRoute()
const technician = ref(null)
const isLoading = ref(true)

const availableTimes = [
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
]

const serviceTitle = ref("")
const servicePrice = ref("")
const isPriceLocked = ref(false)

const feedbacks = ref([
  {
    name: "manar morad",
    image: new URL("../images/Ellipse 47.png", import.meta.url).href,
    text: "I needed a plumber for an urgent leak, and I used Tashtebaty for the first time. The process was incredibly smooth. I loved that all the plumber's info was right there no guessing! The price was fair, and the follow up call after the job was finished was a fantastic touch. I'm definitely a regular customer now! Highly recommend for reliable service",
  },
  {
    name: "mohamed amir",
    image: new URL("../images/Ellipse 46.png", import.meta.url).href,
    text: "I finally decided to get my kitchen cabinets updated, and I booked a carpenter through Tashtebaty. I was so impressed! The quality of the work was top-notch, and the technician's data was transparently provided upfront. The price was great, and they finished ahead of schedule. Knowing they check in after completion shows they really care. This is my new go-to for home maintenance. Highly recommend!",
  },
  {
    name: "samir khaled",
    image: new URL("../images/Ellipse 46.png", import.meta.url).href,
    text: "My main breaker kept tripping, which was a huge hassle. I used Tashtebaty and an electrician was dispatched incredibly fast. I appreciated the clear communication about the fee structure before he started the repair. He fixed the wiring issue quickly and professionally, and the system follow-up was excellent. I feel much safer now. If you need speed and trustworthy help, this is the service to use!",
  },
])

// ADDED: Computed properties to safely access technician data
const technicianName = computed(() => technician.value?.name || "Technician Name")
const technicianSkill = computed(() => technician.value?.skill || "Specialty")
const technicianLocation = computed(
  () => technician.value?.city || "Not Specified"
)
const technicianRating = computed(() => Math.round(technician.value?.rating || 0))
const technicianReviews = computed(() => technician.value?.reviews || 0) // Assuming a 'reviews' field
const technicianProfileImage = computed(
  () =>
    technician.value?.profileImage ||
    new URL("../images/Ellipse 56.png", import.meta.url).href
)

const technicianMemberSince = computed(() => {
  if (!technician.value?.createdAt) return "N/A"
  const date = new Date(technician.value.createdAt)
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
})

const openPopup = (service = null, price = null) => {
  showPopup.value = true
  generateDays()

  if (service && price) {
    serviceTitle.value = service
    servicePrice.value = price
    isPriceLocked.value = true
  } else {
    serviceTitle.value = ""
    servicePrice.value = ""
    isPriceLocked.value = false
  }
}

const closePopup = () => {
  showPopup.value = false
  selectedDay.value = ""
  selectedTime.value = ""
}

const handleFileUpload = (event) => {
  uploadedFiles.value = Array.from(event.target.files)
}

const generateDays = () => {
  const today = new Date()
  availableDays.value = []

  for (let i = 0; i <= 5; i++) {
    const date = new Date()
    date.setDate(today.getDate() + i)
    const formatted = date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    })
    availableDays.value.push(formatted)
  }
}

const nextFeedback = () => {
  currentIndex.value = (currentIndex.value + 1) % feedbacks.value.length
}

const prevFeedback = () => {
  currentIndex.value =
    (currentIndex.value - 1 + feedbacks.value.length) % feedbacks.value.length
}

// ADDED: Fetch technician data on component mount
onMounted(async () => {
  // Assumes your route is set up like /profile/:id
  const technicianId = route.params.id
  if (!technicianId) {
    console.error("No technician ID found in route.")
    isLoading.value = false
    return
  }

  try {
    const docRef = doc(db, "technicians", technicianId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      technician.value = docSnap.data()
    } else {
      console.error("No such technician found!")
    }
  } catch (error) {
    console.error("Error fetching technician:", error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div v-if="isLoading" class="flex justify-center items-center min-h-screen">
    <p class="text-2xl text-accent-color">Loading Profile...</p>
  </div>

  <div
    v-else-if="!technician"
    class="flex justify-center items-center min-h-screen"
  >
    <p class="text-2xl text-red-500">Technician not found.</p>
  </div>

  <div v-else>
    <div class="technichainProfile my-20 w-[80%] mx-auto flex justify-between">
      <div class="card w-[35%] bg-secondry-color rounded-2xl">
        <div class="imgContainer flex flex-col items-center justify-center">
          <img
            :src="technicianProfileImage"
            class="mt-3 w-[200px] h-[200px] rounded-full object-cover"
            alt="Technician Profile Photo"
          />

          <div class="nameContainer flex">
            <h2 class="font-semibold text-[26px]">{{ technicianName }}</h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              class="w-6 h-6 text-[#5984C6] shrink-0 m-2 fill-current"
            >
              <path
                d="M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zM374 145.7c-10.7-7.8-25.7-5.4-33.5 5.3L221.1 315.2 
            169 263.1c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l72 72c5 5 11.8 7.5 
            18.8 7s13.4-4.1 17.5-9.8L379.3 179.2c7.8-10.7 
            5.4-25.7-5.3-33.5z"
              />
            </svg>
          </div>

          <h3 class="text-[22px]">{{ technicianSkill }}</h3>
          <div class="flex justify-center mb-1 text-yellow-400 text-xl">
            <svg
              v-for="n in technicianRating"
              :key="n"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
              class="w-6 h-6 fill-current"
            >
              <path
                d="M316.9 18C311.6 7 300.4 0 288 0s-23.6 7-28.9 18L195 150.3 47.9 171.5c-12.2 1.8-22.3 10.3-26.2 21.9s-.7 24.4 7.9 32.9L150 357.4 129.1 504.6c-1.8 12.2 3 24.5 12.6 32s22.4 9 33.2 4.2L288 439.6l113.1 61.2c10.8 4.8 23.6 3.3 33.2-4.2s14.4-19.8 12.6-32L426 357.4l120.4-131.1c8.6-8.5 11.7-21.3 7.9-32.9s-14-20.1-26.2-21.9L381 150.3 316.9 18z"
              />
            </svg>
            <svg
              v-for="n in 5 - technicianRating"
              :key="'empty-' + n"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
              class="w-6 h-6 fill-current text-gray-300"
            >
              <path
                d="M316.9 18C311.6 7 300.4 0 288 0s-23.6 7-28.9 18L195 150.3 47.9 171.5c-12.2 1.8-22.3 10.3-26.2 21.9s-.7 24.4 7.9 32.9L150 357.4 129.1 504.6c-1.8 12.2 3 24.5 12.6 32s22.4 9 33.2 4.2L288 439.6l113.1 61.2c10.8 4.8 23.6 3.3 33.2-4.2s14.4-19.8 12.6-32L426 357.4l120.4-131.1c8.6-8.5 11.7-21.3 7.9-32.9s-14-20.1-26.2-21.9L381 150.3 316.9 18z"
              />
            </svg>
          </div>
          <p class="text-[18px] mb-2">({{ technicianReviews }} reviews)</p>
          <div class="line w-full h-0.5 bg-black"></div>
        </div>

        <div
          class="dataContainer flex items-center justify-between m-6 text-[18px] font-semibold"
        >
          <div class="dataKey">
            <ul>
              <li class="flex m-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                  class="w-6 h-6"
                >
                  <path
                    fill="#5984c6"
                    d="M0 188.6C0 84.4 86 0 192 0S384 84.4 384 188.6c0 119.3-120.2 262.3-170.4 316.8-11.8 12.8-31.5 12.8-43.3 0-50.2-54.5-170.4-197.5-170.4-316.8zM192 256a64 64 0 1 0 0-128 64 64 0 1 0 0 128z"
                  />
                </svg>
                location
              </li>
              <li class="flex m-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  class="w-6 h-6"
                >
                  <path
                    fill="#5984c6"
                    d="M224 248a120 120 0 1 0 0-240 120 120 0 1 0 0 240zm-29.7 56C95.8 304 16 383.8 16 482.3 16 498.7 29.3 512 45.7 512l356.6 0c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3l-59.4 0z"
                  />
                </svg>
                Member Since
              </li>
              <li class="flex m-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 584 512"
                  class="w-6 h-6"
                >
                  <path
                    fill="#5984c6"
                    d="M256 0a256 256 0 1 1 0 512 256 256 0 1 1 0-512zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"
                  />
                </svg>
                Response time
              </li>
              <li class="flex m-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                  class="w-6 h-6"
                >
                  <path
                    fill="#5984c6"
                    d="M249.9 66.8c10.4-14.3 7.2-34.3-7.1-44.7s-34.3-7.2-44.7 7.1l-106 145.7-37.5-37.5c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c6.6 6.6 15.8 10 25.1 9.3s17.9-5.5 23.4-13.1l128-176zm128 136c10.4-14.3 7.2-34.3-7.1-44.7s-34.3-7.2-44.7 7.1l-170 233.7-69.5-69.5c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l96 96c6.6 6.6 15.8 10 25.1 9.3s17.9-5.5 23.4-13.1l192-264z"
                  />
                </svg>
                Orders Completed
              </li>
            </ul>
          </div>
          <div class="dataValue">
            <ul>
              <li class="m-2">{{ technicianLocation }}</li>
              <li class="m-2">{{ technicianMemberSince }}</li>
              <li class="m-2">35 Minutes</li>
              <li class="m-2">112 orders</li>
            </ul>
          </div>
        </div>
        <div class="flex justify-center mb-6">
          <button
            class="bg-[#5984C6] text-white px-4 py-1 rounded-lg text-lg font-semibold hover:bg-[#4a74b3] transition cursor-pointer"
          >
            <router-link
              :to="{ path: '/chat', query: { uid: route.params.id } }"
              class="bg-[#5984C6] text-white px-4 py-1 rounded-lg text-lg font-semibold hover:bg-[#4a74b3] transition cursor-pointer"
            >
              Chat
            </router-link>
          </button>
        </div>
      </div>

      <div class="descreption w-[60%] flex flex-col">
        <h1 class="font-bold text-5xl text-accent-color text-center mb-10">
          Services
        </h1>

        <div class="cardsContainer flex justify-around flex-wrap">
          <div
            class="serviceCard rounded-2xl shadow-lg text-center p-6 bg-[#f7f7f7] w-[30%] flex flex-col items-center my-5"
          >
            <div class="serviceImg">
              <img src="../images/custom.png" class="w-[120px]" alt="" />
            </div>
            <h2 class="font-bold mb-6">Custom service</h2>
            <button
              @click="openPopup()"
              class="bg-accent-color text-white px-3 rounded-lg text- font-semibold hover:bg-[#4a74b3] transition cursor-pointer"
            >
              Enter details
            </button>
          </div>

          <div
            class="serviceCard rounded-2xl shadow-lg text-center p-6 bg-[#f7f7f7] w-[30%] flex flex-col items-center my-5"
          >
            <div class="serviceImg">
              <img src="/images/tab.png" class="w-[120px]" alt="" />
            </div>
            <h2 class="font-semibold">fix tap leak</h2>
            <h2 class="font-bold text-accent-color">150 EGP</h2>
            <button
              @click="openPopup('fix tap leak', '150 EGP')"
              class="bg-accent-color text-white px-3 rounded-lg text- font-semibold hover:bg-[#4a74b3] transition cursor-pointer"
            >
              Order
            </button>
          </div>

          <div
            class="serviceCard rounded-2xl shadow-lg text-center p-6 bg-[#f7f7f7] w-[30%] flex flex-col items-center my-5"
          >
            <div class="serviceImg">
              <img src="/images/sink.png" class="w-[120px]" alt="" />
            </div>
            <h2 class="font-semibold">fix shower</h2>
            <h2 class="font-bold text-accent-color">250 EGP</h2>
            <button
              @click="openPopup('fix shower', '250 EGP')"
              class="bg-accent-color text-white px-3 rounded-lg text- font-semibold hover:bg-[#4a74b3] transition cursor-pointer"
            >
              Order
            </button>
          </div>

          <div
            class="serviceCard rounded-2xl shadow-lg text-center p-6 bg-[#f7f7f7] w-[30%] flex flex-col items-center my-5"
          >
            <div class="serviceImg">
              <img src="/images/tab.png" class="w-[120px]" alt="" />
            </div>
            <h2 class="font-semibold">fix tap leak</h2>
            <h2 class="font-bold text-accent-color">150 EGP</h2>
            <button
              @click="openPopup('fix tap leak', '150 EGP')"
              class="bg-accent-color text-white px-3 rounded-lg text- font-semibold hover:bg-[#4a74b3] transition cursor-pointer"
            >
              Order
            </button>
          </div>

          <div
            class="serviceCard rounded-2xl shadow-lg text-center p-6 bg-[#f7f7f7] w-[30%] flex flex-col items-center my-5"
          >
            <div class="serviceImg">
              <img src="/images/filter.png" class="w-[120px]" alt="" />
            </div>
            <h2 class="font-semibold">install water filter</h2>
            <h2 class="font-bold text-accent-color">200 EGP</h2>
            <button
              @click="openPopup('install water filter', '200 EGP')"
              class="bg-accent-color text-white px-3 rounded-lg text- font-semibold hover:bg-[#4a74b3] transition cursor-pointer"
            >
              Order
            </button>
          </div>

          <div
            class="serviceCard rounded-2xl shadow-lg text-center p-6 bg-[#f7f7f7] w-[30%] flex flex-col items-center my-5"
          >
            <div class="serviceImg">
              <img src="/images/sink.png" class="w-[120px]" alt="" />
            </div>
            <h2 class="font-semibold">fix shower</h2>
            <h2 class="font-bold text-accent-color">250 EGP</h2>
            <button
              @click="openPopup('fix shower', '250 EGP')"
              class="bg-accent-color text-white px-3 rounded-lg text- font-semibold hover:bg-[#4a74b3] transition cursor-pointer"
            >
              Order
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showPopup"
      class="orderDetails fixed inset-0 bg-[#00000059] flex justify-center items-center z-50"
      @click.self="closePopup"
    >
      <div class="bg-white rounded-2xl p-8 w-[80%] text-center shadow-2xl relative">
        <h2 class="text-2xl font-semibold mb-4 text-accent-color">
          Order Details
        </h2>

        <div class="subContainer flex justify-center">
          <div class="orderDetails w-[50%]">
            <div class="flex flex-col items-start mb-4">
              <label
                for="photoUpload"
                class="font-semibold mb-2 text-lg text-accent-color"
              >
                Upload Photos (optional)
              </label>

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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 612 512"
                  class="w-5 h-5 fill-current"
                >
                  <path
                    fill="#fff"
                    d="M144 480c-79.5 0-144-64.5-144-144 0-63.4 41-117.2 97.9-136.5-1.3-7.7-1.9-15.5-1.9-23.5 0-79.5 64.5-144 144-144 55.4 0 103.5 31.3 127.6 77.1 14.2-8.3 30.8-13.1 48.4-13.1 53 0 96 43 96 96 0 15.7-3.8 30.6-10.5 43.7 44 20.3 74.5 64.7 74.5 116.3 0 70.7-57.3 128-128 128l-304 0zM305 191c-9.4-9.4-24.6-9.4-33.9 0l-72 72c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l31-31 0 102.1c0 13.3 10.7 24 24 24s24-10.7 24-24l0-102.1 31 31c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-72-72z"
                  />
                </svg>
                <span>Select Photos</span>
              </label>
            </div>

            <textarea
              v-model="serviceTitle"
              placeholder="Describe your proplem in details..."
              class="w-full h-32 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-color"
            ></textarea>

            <input
              v-model="servicePrice"
              :disabled="isPriceLocked"
              type="text"
              placeholder="Enter Your Price..."
              class="w-full border border-gray-300 rounded-lg p-3 mt-3 focus:outline-none focus:ring-2 focus:ring-accent-color"
            />

            <button
              @click="closePopup"
              class="absolute top-2 right-5 text-gray-500 hover:text-accent-color text-3xl"
            >
              &times;
            </button>
          </div>

          <div class="orderTime w-[50%] flex flex-col items-center">
            <h3 class="text-xl font-semibold text-accent-color mb-4">
              Choose Appointment
            </h3>

            <label class="font-medium mb-1 text-accent-color">Select Day:</label>
            <select
              v-model="selectedDay"
              class="border border-gray-300 rounded-lg p-2 mb-4 w-[80%] focus:ring-2 focus:ring-accent-color"
            >
              <option
                v-for="(day, index) in availableDays"
                :key="index"
                :value="day"
              >
                {{ day }}
              </option>
            </select>

            <label class="font-medium mb-1 text-accent-color"
              >Select Time:</label
            >
            <select
              v-model="selectedTime"
              class="border border-gray-300 rounded-lg p-2 w-[80%] focus:ring-2 focus:ring-accent-color"
            >
              <option
                v-for="(time, index) in availableTimes"
                :key="index"
                :value="time"
              >
                {{ time }}
              </option>
            </select>

            <div
              v-if="selectedDay && selectedTime"
              class="mt-6 text-gray-700 text-center"
            >
              <p>
                You selected:
                <span class="font-semibold text-accent-color">{{
                  selectedDay
                }}</span
                ><br />
                at
                <span class="font-semibold text-accent-color">{{
                  selectedTime
                }}</span>
              </p>
            </div>
          </div>
        </div>

        <div class="flex justify-center gap-4 mt-6">
          <button
            @click="closePopup"
            class="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            @click="closePopup"
            class="bg-accent-color text-white px-4 py-2 rounded-lg hover:bg-[#4a74b3] transition cursor-pointer shadow-md hover:shadow-lg"
          >
            Submit
          </button>
        </div>
      </div>
    </div>

    <div
      class="WorkGallery flex flex-col items-center justify-center w-[80%] mx-auto"
    >
      <h1 class="font-bold text-5xl text-accent-color text-center mb-10">
        Work Gallery
      </h1>
      <div
        class="galleryContainer flex items-center justify-around flex-wrap w-[100%]"
      >
        <div
          class="imgContainer rounded-2xl w-[32%] my-3 transition-transform duration-500 hover:scale-102"
        >
          <img src="../images/w1.png" alt="" />
        </div>
        <div
          class="imgContainer rounded-2xl w-[32%] my-3 transition-transform duration-500 hover:scale-102"
        >
          <img src="../images/w2.png" alt="" />
        </div>
        <div
          class="imgContainer rounded-2xl w-[32%] my-3 transition-transform duration-500 hover:scale-102"
        >
          <img src="../images/w3.png" alt="" />
        </div>
        <div
          class="imgContainer rounded-2xl w-[32%] my-3 transition-transform duration-500 hover:scale-102"
        >
          <img src="../images/w4.png" alt="" />
        </div>
        <div
          class="imgContainer rounded-2xl w-[32%] my-3 transition-transform duration-500 hover:scale-102"
        >
          <img src="../images/w5.png" alt="" />
        </div>
        <div
          class="imgContainer rounded-2xl w-[32%] my-3 transition-transform duration-500 hover:scale-102"
        >
          <img src="../images/w6.png" alt="" />
        </div>
        <div
          class="imgContainer rounded-2xl w-[32%] my-3 transition-transform duration-500 hover:scale-102"
        >
          <img src="../images/w7.png" alt="" />
        </div>
        <div
          class="imgContainer rounded-2xl w-[32%] my-3 transition-transform duration-500 hover:scale-102"
        >
          <img src="../images/w8.png" alt="" />
        </div>
        <div
          class="imgContainer rounded-2xl w-[32%] my-3 transition-transform duration-500 hover:scale-102"
        >
          <img src="../images/w9.png" alt="" />
        </div>
      </div>
    </div>

    <div
      class="feedback relative flex flex-col items-center justify-between w-[70%] mx-auto my-20 text-center"
    >
      <h1 class="font-bold text-5xl text-accent-color text-center mb-10">
        Customers FeedBack
      </h1>

      <div
        v-if="feedbacks[currentIndex]"
        :key="currentIndex"
        class="feedback-item h-[500px]"
      >
        <div class="imgContainer flex flex-col items-center justify-center">
          <img :src="feedbacks[currentIndex].image" class="w-[170px]" alt="" />
          <p class="text-[20px] font-semibold">
            {{ feedbacks[currentIndex].name }}
          </p>
          <div class="flex justify-center my-4 text-yellow-400 text-xl">
            <svg
              v-for="n in 5"
              :key="n"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
              class="w-6 h-6 mx-1 fill-current"
            >
              <path
                d="M316.9 18C311.6 7 300.4 0 288 0s-23.6 7-28.9 18L195 150.3 
            47.9 171.5c-12.2 1.8-22.3 10.3-26.2 21.9s-.7 24.4 
            7.9 32.9L150 357.4 129.1 504.6c-1.8 12.2 3 24.5 
_
          12.6 32s22.4 9 33.2 4.2L288 439.6l113.1 61.2c10.8 
            4.8 23.6 3.3 33.2-4.2s14.4-19.8 12.6-32L426 
_
          357.4l120.4-131.1c8.6-8.5 11.7-21.3 
            7.9-32.9s-14-20.1-26.2-21.9L381 
_
          150.3 316.9 18z"
              />
            </svg>
          </div>
        </div>

        <div class="reviewText">
          <button
            @click="prevFeedback"
            class="absolute left-0 text-4xl text-accent-color hover:text-[#4a74b3] transition"
          >
            &#10094;
          </button>
          <button
            @click="nextFeedback"
            class="absolute right-0 text-4xl text-accent-color hover:text-[#4a74b3] transition"
          >
            &#10095;
          </button>
          <p class="text-[20px] mx-20">{{ feedbacks[currentIndex].text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>