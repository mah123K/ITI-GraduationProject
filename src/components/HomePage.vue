<template>
  <div class="theme-bg theme-text text-left rtl:text-right">
    <section class="hero relative w-full">
      <img
        src="https://res.cloudinary.com/dlrgf0myy/image/upload/v1760692341/image_jmqili.jpg"
        alt="Hero"
        class="h-screen w-full"
      />
    </section>
    <!--cards-->
    <h2 class="text-center main-header">Our Services</h2>
    <div class="flex justify-center">
      <div class="grid grid-cols-2 gap-10 md:grid-cols-4">
        <div
          class="card cursor-pointer bg-[#DAECF6] image-full w-45 rounded-2xl shadow-sm h-55 hover:scale-105 transition duration-300"
        >
          <router-link :to="{ name: 'ProfilesPage', params: { service: 'Plumbing' } }">
            <div>
              <img
                src="https://res.cloudinary.com/dlrgf0myy/image/upload/v1760695818/image__1_-removebg-preview_spqrzh.png"
                class=""
              />
              <span class="text-center block text-accent-color text-xl font-medium"
                >{{ $t('home.services.plumbing') }}</span
              >
            </div>
          </router-link>
        </div>
        <div
          class="card cursor-pointer bg-[#DAECF6] image-full w-45 rounded-2xl shadow-sm h-55 hover:scale-105 transition duration-300"
        >
          <router-link :to="{ name: 'ProfilesPage', params: { service: 'Finishing' } }">
            <div>
              <img
                src="https://res.cloudinary.com/dlrgf0myy/image/upload/v1760696039/image__2_-removebg-preview_qlbzwa.png"
                class="w-full"
              />
              <span class="text-center block text-accent-color text-xl font-medium"
                >{{ $t('home.services.finishing') }}</span
              >
            </div>
          </router-link>
        </div>
        <div
          class="card cursor-pointer bg-[#DAECF6] image-full w-45 rounded-2xl shadow-sm h-55 hover:scale-105 transition duration-300"
        >
          <router-link :to="{ name: 'ProfilesPage', params: { service: 'Electrical' } }">
            <div>
              <img
                src="https://res.cloudinary.com/dlrgf0myy/image/upload/v1760696039/image__3_-removebg-preview_ko98nb.png"
                class=""
              />
              <span class="text-center block text-accent-color text-xl font-medium"
                >{{ $t('home.services.electrical') }}</span
              >
            </div>
          </router-link>
        </div>
        <div
          class="card cursor-pointer bg-[#DAECF6] image-full w-45 rounded-2xl shadow-sm h-55 hover:scale-105 transition duration-300"
        >
          <router-link :to="{ name: 'ProfilesPage', params: { service: 'Carpentry' } }">
            <div>
              <img
                src="https://res.cloudinary.com/dlrgf0myy/image/upload/v1760696039/image__4_-removebg-preview_ihc9at.png"
                class=""
              />
              <span class="text-center block text-accent-color text-xl font-medium"
                >{{ $t('home.services.carpentry') }}</span
              >
            </div>
          </router-link>
        </div>
      </div>
    </div>

   
    <div v-if="loading" class="flex justify-center mt-10">
      <p class="text-lg">{{ $t('home.offers.loading') }}</p>
    </div>

   <div>
  <h2 class="text-center main-header">{{ $t('home.offers.title') }}</h2>
</div>
<div class="text-accent-color flex justify-end rtl:justify-end me-60 rtl:ms-10 rtl:me-60">
  <router-link to="/offers">{{ $t('home.offers.seeMore') }}</router-link>
</div>
<div v-if="loading" class="flex justify-center mt-10">
  <p class="text-lg">{{ $t('home.offers.loading') }}</p>
</div>

<div v-else-if="offers.length > 0" class="flex justify-center mt-5">
  <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
    
    <div
      v-for="offer in offers"
      :key="offer.id"
      class="card bg-secondry-color rounded-2xl h-fit w-70 shadow-lg relative"
    >
      <div class="offer absolute">
        <img
          src="../images/offerdisc.png"
          class="w-15 rounded-b-full"
          alt="Offer discount"
        />
      </div>

      <img
        :src="offer.imageUrl"
        :alt="offer.title"
        class="w-full rounded-t-2xl h-48 object-cover" 
        />

      <div class="card-body mt-2 items-center text-center">
        <h2 class="card-title text-red-600 font-bold">{{ offer.title }}</h2> 
        
        <p class="text-lg">{{ offer.description }}</p>
        
        <div class="card-actions pb-3">
          <button
            class="btn mt-2 text-white px-3 cursor-pointer bg-accent-color rounded-[10px] text-lg"
          >
            {{ $t('home.offers.claim') }}
          </button>
        </div>
      </div>
    </div>
    
  </div>
</div>

<div v-else class="flex justify-center mt-10">
  <p class="text-lg">{{ $t('home.offers.noOffers') }}</p>
</div>

    <div>
      <h2 class="main-header">{{ $t('home.whyUs.title') }}</h2>
    </div>
    <div class="flex justify-center">
      <div class="grid grid-cols-1 md:grid-cols-2">
        <div class="card w-70 rounded-2xl h-full">
          <img
            src="https://res.cloudinary.com/dlrgf0myy/image/upload/v1760705618/image_10_vvoxvo.jpg"
            class="hidden h-92 md:block"
            alt="Movie"
          />
        </div>
        <ul class="space-y-12 mt-6">
          <li class="flex items-start gap-3">
            <div class="text-4xl font-thin flex-shrink-0 me-5">
              <img
                class="w-10"
                src="https://res.cloudinary.com/dlrgf0myy/image/upload/v1760704859/image__9_-removebg-preview_rlbcrt.png"
                alt=""
              />
            </div>
            <div class="list-col-grow">
              <div class="w-80">
                {{ $t('home.whyUs.point1') }}
              </div>
            </div>
          </li>

          <li class="flex items-start gap-3">
            <div class="text-4xl font-thin flex-shrink-0 me-5">
              <i class="fa-solid fa-people-group text-accent-color w-10"></i>
            </div>
            <div class="list-col-grow">
              <div class="w-80">
                {{ $t('home.whyUs.point2') }}
              </div>
            </div>
          </li>

          <li class="flex items-start gap-3">
            <div class="text-4xl font-thin flex-shrink-0 me-5">
              <i class="fa-solid fa-address-card text-accent-color w-10"></i>
            </div>
            <div class="list-col-grow">
              <div class="w-80">
                {{ $t('home.whyUs.point3') }}
              </div>
            </div>
          </li>

          <li class="flex items-start gap-3">
            <div class="text-4xl font-thin flex-shrink-0 me-5">
              <i class="fa-solid fa-headphones text-accent-color w-10"></i>
            </div>
            <div class="list-col-grow">
              <div class="w-80">
                {{ $t('home.whyUs.point4') }}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="relative w-full">
      <h2 class="main-header">{{ $t('home.feedback.title') }}</h2>

      <div class="relative h-80 overflow-hidden rounded-lg">
        <div
          v-for="(item, index) in slides"
          :key="index"
          class="absolute inset-0 transition-all duration-700 ease-in-out"
          :class="{
            'translate-x-0 opacity-100 z-10': currentSlide === index,
            'translate-x-full opacity-0 z-0': currentSlide < index,
            '-translate-x-full opacity-0 z-0': currentSlide > index,
          }"
        >
          <div
            class="flex flex-col items-center justify-center h-full px-4 text-center"
          >
            <img
              :src="item.image"
              class="w-24 h-24 mb-5 rounded-full object-cover"
              alt="client"
            />
            <h2 class="text-accent-color text-2xl mb-2 font-medium">
              {{ $t('home.feedback.name') }}
            </h2>
            <div class="flex justify-center text-yellow-300 mb-2">
              <i v-for="n in 5" :key="n" class="fa-solid fa-star"></i>
            </div>
            <p class="text-gray-700 max-w-xl">
              {{ item.text }}
            </p>
          </div>
        </div>
      </div>

      <div
        class="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-3 z-20"
      >
        <button
          v-for="(item, index) in slides"
          :key="'dot-' + index"
          @click="goToSlide(index)"
          class="w-3 h-3 rounded-full transition-colors"
          :class="currentSlide === index ? 'bg-accent-color' : 'bg-gray-300'"
        ></button>
      </div>

      <button
        @click="prevSlide"
        class="absolute top-0 left-0 rtl:right-0 rtl:left-auto z-30 flex items-center justify-center h-full px-4 group focus:outline-none"
      >
        <span
          class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/40 group-hover:bg-white/70"
        >
          <svg
            class="w-4 h-4 text-gray-800 rtl:rotate-180"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
        </span>
      </button>

      <button
        @click="nextSlide"
        class="absolute top-0 right-0 rtl:left-0 rtl:right-auto z-30 flex items-center justify-center h-full px-4 group focus:outline-none"
      >
        <span
          class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/40 group-hover:bg-white/70"
        >
          <svg
            class="w-4 h-4 text-gray-800 rtl:rotate-180"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
        </span>
      </button>
    </div>

    <div class="work-gallery py-16 bg-gray-50">
      <div class="text-center mb-10">
        <h2 class="text-3xl md:text-4xl font-semibold text-accent-color mb-2">
          {{ $t('home.gallery.title') }}
        </h2>
        <p class="text-gray-600 max-w-2xl mx-auto text-base">
          {{ $t('home.gallery.description') }}
        </p>
      </div>

      <div class="flex justify-center">
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 w-11/12 md:w-4/5"
        >
          <div
            v-for="(image, index) in works"
            :key="index"
            class="relative group overflow-hidden rounded-2xl cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
          >
            <img
              :src="image.src"
              :alt="image.alt"
              class="w-full h-48 sm:h-56 md:h-64 lg:h-62 object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
            <div
              class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
            >
              <p class="text-white text-sm md:text-base font-medium">
                {{ image.alt }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center mt-10">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          class="flex cursor-pointer items-center gap-4 bg-white shadow-md border border-gray-200 rounded-2xl px-6 py-4 hover:shadow-lg transition-all duration-300 w-64"
        >
          <div
            class="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full text-xl"
          >
            <i class="fa-solid fa-phone"></i>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-800">{{ $t('home.contactInfo.phone') }}</h3>
            <span class="text-gray-500 text-sm">+2025895623</span>
          </div>
        </div>

        <div
          class="flex cursor-pointer items-center gap-4 bg-white shadow-md border border-gray-200 rounded-2xl px-6 py-4 hover:shadow-lg transition-all duration-300 w-64"
        >
          <div
            class="flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full text-xl"
          >
            <i class="fa-solid fa-envelope"></i>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-800">{{ $t('home.contactInfo.email') }}</h3>
            <span class="text-gray-500 text-sm">tashtebaty12@gmail.com</span>
          </div>
        </div>

        <div
          class="flex cursor-pointer items-center gap-4 bg-white shadow-md border border-gray-200 rounded-2xl px-6 py-4 hover:shadow-lg transition-all duration-300 w-64"
        >
          <div
            class="flex items-center justify-center w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full text-xl"
          >
            <i class="fa-solid fa-location-dot"></i>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-800">{{ $t('home.contactInfo.address') }}</h3>
            <span class="text-gray-500 text-sm">XYZ Street</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// --- YOUR SCRIPT IS UNCHANGED AND CORRECT ---
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { db } from '@/firebase/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';

defineOptions({
  name: 'HomePage'
});

const currentSlide = ref(0);
const slides = ref([]); 
const works = ref([]);
let interval = null;
const offers = ref([]);
const loading = ref(true);

const nextSlide = () => {
  if (slides.value.length === 0) return; 
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
};

const prevSlide = () => {
  if (slides.value.length === 0) return; 
  currentSlide.value =
    (currentSlide.value - 1 + slides.value.length) % slides.value.length;
};

const goToSlide = (index) => {
  currentSlide.value = index;
};

const fetchOffers = async () => {
  try {
    const offersCollection = collection(db, 'offers');
    const q = query(offersCollection, limit(3)); 
    const querySnapshot = await getDocs(q);
    const fetchedOffers = [];
    querySnapshot.forEach((doc) => {
      fetchedOffers.push({
        id: doc.id,
        ...doc.data()
      });
    });
    offers.value = fetchedOffers; 
  } catch (error) {
    console.error("Error fetching offers: ", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  slides.value = [
    {
      image:
        "https://res.cloudinary.com/dlrgf0myy/image/upload/v1760769725/Screenshot_2025-10-08_002515_zwynbi.png",
      name: "Client 1",
      text: "I used Tashtebaty for the first time. The process was incredibly smooth.",
    },
    {
      image:
        "https://res.cloudinary.com/dlrgf0myy/image/upload/v1760769725/Screenshot_2025-10-08_002635_ny2rnm.png",
      name: "Client 2",
      text: "Great service and quick response. Loved the professionalism!",
    },
    {
      image:
        "https://res.cloudinary.com/dlrgf0myy/image/upload/v1760769725/Screenshot_2025-10-08_002730_y0bkp5.png",
      name: "Client 3",
      text: "Highly recommend Tashtebaty for reliable and quality work.",
    },
    {
      image:
        "https://res.cloudinary.com/dlrgf0myy/image/upload/v1760769725/Screenshot_2025-10-08_002515_zwynbi.png",
      name: "Client 4",
      text: "Very smooth process, fair pricing and great communication!",
    },
  ];
  works.value = [
    {
      src: "https://res.cloudinary.com/dlrgf0myy/image/upload/v1760888695/service-maintenance-worker-repairing_slghmb.jpg",
      alt: "Work 1",
      size: "large",
    },
    {
      src: "https://res.cloudinary.com/dlrgf0myy/image/upload/v1760702374/image_6_y3qk8x.jpg",
      alt: "Work 2",
      size: "small",
    },
    {
      src: "https://res.cloudinary.com/dlrgf0myy/image/upload/v1760888695/service-maintenance-worker-repairing_slghmb.jpg",
      alt: "Work 3",
      size: "small",
    },
    {
      src: "https://res.cloudinary.com/dlrgf0myy/image/upload/v1760702374/image_6_y3qk8x.jpg",
      alt: "Work 4",
      size: "large",
    },
    {
      src: "https://res.cloudinary.com/dlrgf0myy/image/upload/v1760888695/service-maintenance-worker-repairing_slghmb.jpg",
      alt: "Work 5",
      size: "small",
    },
    {
      src: "https://res.cloudinary.com/dlrgf0myy/image/upload/v1760702374/image_6_y3qk8x.jpg",
      alt: "Work 6",
      size: "large",
    },
  ];

  interval = setInterval(nextSlide, 5000);
  fetchOffers();
});

onBeforeUnmount(() => {
  clearInterval(interval);
});
</script>

<style scoped>
.offer {
  z-index: 20;
}
/* Ensure Why Choose Us list items align correctly */
ul li > div:first-child {
  padding-top: 0.125rem; /* Small adjustment for icon alignment */
}
</style>