<template>
  <div class="theme-bg theme-text text-left rtl:text-right">
    <section class="hero relative w-full h-[90vh] overflow-hidden mt-20">
      <!-- Hero Images -->
      <transition-group name="fade" tag="div" class="absolute inset-0">
        <img
          v-for="(img, index) in heroImages"
          :key="index"
          v-show="currentHeroIndex === index"
          :src="img"
          alt="Hero"
          class="absolute inset-0 h-full w-full object-contain transition-opacity duration-1000"
        />
      </transition-group>

      

      <!-- Indicators -->
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        <span
          v-for="(img, index) in heroImages"
          :key="'dot-' + index"
          @click="goToHero(index)"
          class="w-4 h-4 rounded-full cursor-pointer transition-all duration-500"
          :class="currentHeroIndex === index ? 'bg-accent-color scale-110' : 'bg-white/60 hover:bg-white/90'"
        ></span>
      </div>
    </section>

    <h2 class="text-center main-header">{{ $t('home.services.title') }}</h2>
    <div class="flex justify-center mb-10 p-5 items-center mx-auto">
      <div class="grid grid-cols-1 md:gap-20 gap-8 md:grid-cols-4">
        <div
          class="card dark:bg-white cursor-pointer bg-secondary-blue image-full w-60 rounded-2xl shadow-lg h-70 hover:scale-102 hover:shadow-xl transition duration-600"
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
          class="card dark:bg-white cursor-pointer bg-secondary-blue image-full w-60 rounded-2xl shadow-lg h-70 hover:scale-102 hover:shadow-xl transition duration-600"
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
          class="card dark:bg-white cursor-pointer bg-secondary-blue image-full w-60 rounded-2xl shadow-lg h-70 hover:scale-102 hover:shadow-xl transition duration-600"
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
          class="card dark:bg-white cursor-pointer bg-secondary-blue image-full w-60 rounded-2xl shadow-lg h-70 hover:scale-102 hover:shadow-xl transition duration-600"
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

    <section id="how-it-works" class="relative isolate bg-white py-8 dark:bg-dark-blue">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <header class="text-center ">
          <h2 class="main-header text-accent-color">
            {{ $t('home.howItWorks.title') }}
          </h2>
          <p class="mt-3 text-base sm:text-lg text-gray-600 dark:text-white">
            {{ $t('home.howItWorks.subtitle') }}
          </p>
        </header>

        <div class="relative flex flex-col lg:flex-row items-center justify-center gap-6">
          <!-- Step 1 -->
          <div
            class=" flex flex-col justify-between items-center text-center rounded-2xl bg-white shadow-md border border-gray-200 hover:-translate-y-1 hover:shadow-lg transition p-3 w-full max-w-[250px]"
          >
            <img src="../images/1.png" alt="" class="w-32 h-36 object-contain mb-4" />
            <h3 class="text-xl font-semibold text-accent-color">
              {{ $t('home.howItWorks.step1.title') }}
            </h3>
            <p class="mt-2 text-sm text-gray-600">
              {{ $t('home.howItWorks.step1.text') }}
            </p>
          </div>

          <!-- Arrow -->
          <div class="hidden lg:flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-accent-color" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-4-4l4 4-4 4" />
            </svg>
          </div>

          <!-- Step 2 -->
          <div
            class="mt-8 flex flex-col justify-between items-center text-center rounded-2xl bg-white shadow-md border border-gray-200 hover:-translate-y-1 hover:shadow-lg transition p-3 w-full max-w-[250px]"
          >
            <img src="../images/2.png" alt="" class="w-32 h-36 object-contain mb-4" />
            <h3 class="text-xl font-semibold text-accent-color">
              {{ $t('home.howItWorks.step2.title') }}
            </h3>
            <p class="mt-2 text-sm text-gray-600">
              {{ $t('home.howItWorks.step2.text') }}
            </p>
          </div>

          <!-- Arrow -->
          <div class="hidden lg:flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-accent-color" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-4-4l4 4-4 4" />
            </svg>
          </div>

          <!-- Step 3 -->
          <div
            class="flex flex-col justify-between items-center text-center rounded-2xl bg-white shadow-md border border-gray-200 hover:-translate-y-1 hover:shadow-lg transition p-3 w-full max-w-[250px]"
          >
            <img src="../images/3.png" alt="" class="w-32 h-36 object-contain mb-4" />
            <h3 class="text-xl font-semibold text-accent-color">
              {{ $t('home.howItWorks.step3.title') }}
            </h3>
            <p class="mt-2 text-sm text-gray-600">
              {{ $t('home.howItWorks.step3.text') }}
            </p>
          </div>

          <!-- Arrow -->
          <div class="hidden lg:flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-accent-color" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-4-4l4 4-4 4" />
            </svg>
          </div>

          <!-- Step 4 -->
          <div
            class="mt-8 flex flex-col justify-between items-center text-center rounded-2xl bg-white shadow-md border border-gray-200 hover:-translate-y-1 hover:shadow-lg transition p-3 w-full max-w-[250px]"
          >
            <img src="../images/4.png" alt="" class="w-32 h-36 object-contain mb-4" />
            <h3 class="text-xl font-semibold text-accent-color">
              {{ $t('home.howItWorks.step4.title') }}
            </h3>
            <p class="mt-2 text-sm text-gray-600">
              {{ $t('home.howItWorks.step4.text') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="why choose us">
      <div>
        <h2 class="main-header">{{ $t('home.whyUs.title') }}</h2>
      </div>
      <div class="flex justify-center">
        <div class="grid grid-cols-1 md:grid-cols-[40%_60%] w-[80%] gap-3 items-center">
          <!-- Image Section -->
          <div class="flex justify-center">
            <img
              src="https://res.cloudinary.com/dlrgf0myy/image/upload/v1760705618/image_10_vvoxvo.jpg"
              class="hidden md:block h-[480px] w-full object-contain rounded-2xl"
              alt="Technician at work"
            />
          </div>

          <!-- Text List Section -->
          <ul class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            <li class="bg-secondary-blue dark:bg-white p-3 rounded-xl shadow-lg hover:scale-102 transition transform-900 flex items-center gap-4">
              <div class="text-4xl shrink-0">
                <img
                  class="w-10"
                  src="https://res.cloudinary.com/dlrgf0myy/image/upload/v1760704859/image__9_-removebg-preview_rlbcrt.png"
                  alt="icon"
                />
              </div>
              <p class="text-lg md:text-LG text-gray-800 leading-relaxed">
                {{ $t('home.whyUs.point1') }}
              </p>
            </li>

            <li class="bg-secondary-blue dark:bg-white p-3 rounded-xl shadow-lg hover:scale-102 transition transform-900 flex items-center gap-4">
              <i class="fa-solid fa-people-group text-accent-color text-3xl shrink-0"></i>
              <p class="text-lg md:text-LG text-gray-800 leading-relaxed">
                {{ $t('home.whyUs.point2') }}
              </p>
            </li>

            <li class="bg-secondary-blue dark:bg-white  p-3 rounded-xl shadow-lg hover:scale-102 transition transform-900 flex items-center gap-4">
              <i class="fa-solid fa-address-card text-accent-color text-3xl shrink-0"></i>
              <p class="text-lg md:text-LG text-gray-800 leading-relaxed">
                {{ $t('home.whyUs.point3') }}
              </p>
            </li>

            <li class="bg-secondary-blue dark:bg-white p-3 rounded-xl shadow-lg hover:scale-102 transition transform-900 flex items-center gap-4">
              <i class="fa-solid fa-headphones text-accent-color text-3xl shrink-0"></i>
              <p class="text-lg md:text-LG text-gray-800 leading-relaxed">
                {{ $t('home.whyUs.point4') }}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section class="offers">

        <div v-if="loading" class="flex justify-center mt-10">
          <p class="text-lg">{{ $t('home.offers.loading') }}</p>
        </div>
      
          <div>
        <h2 class="text-center main-header">{{ $t('home.offers.title') }}</h2>
        </div>
        <div class="text-accent-color flex justify-end rtl:justify-end me-20 font-semibold text-xl rtl:ms-10 rtl:me-60">
          <router-link to="/offers">{{ $t('home.offers.seeMore') }}</router-link>
        </div>
        <div v-if="loading" class="flex justify-center mt-10">
          <p class="text-lg">{{ $t('home.offers.loading') }}</p>
        </div>
        
        <div v-else-if="offers.length > 0" class="flex justify-center mt-5">
          <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            
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
                    class="cursor-pointer btn mt-2 text-white px-3 bg-accent-color rounded-[10px] text-lg"
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
    </section>

    <section class="feedback">
      <div class="relative w-[80%] mx-auto">
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
                {{item.name}}
              </h2>
              <div class="flex justify-center text-yellow-300 mb-2">
                <i v-for="n in 5" :key="n" class="fa-solid fa-star"></i>
              </div>
              <p class="text-gray-700 max-w-xl dark:text-white">
                {{ item.text }}
              </p>
            </div>
          </div>
          <button
            @click="prevSlide"
            class="absolute top-[45%] cursor-pointer bg-accent-color text-white rounded-full p-3 shadow-lg hover:bg-[#4a74b3] transition z-30"
          >
          <i class="fas fa-chevron-left inline-flex items-center justify-center"></i>
          
          </button>
        
          <button
          @click="nextSlide"
          class="absolute right-0 top-[45%] cursor-pointer bg-accent-color text-white rounded-full p-3 shadow-lg hover:bg-[#4a74b3] transition z-30 "
          >
            <i class="fas fa-chevron-right inline-flex items-center justify-center"></i>
              
          </button>
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

        
      </div>
    </section>

    <section class="work-gallery py-16 bg-gray-50 dark:bg-dark-blue">
      <div class="text-center mb-10">
        <h2 class="text-3xl md:text-4xl font-semibold text-accent-color mb-2">
          {{ $t('home.gallery.title') }}
        </h2>
        <p class="text-gray-600 max-w-2xl mx-auto text-base dark:text-white">
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
    </section>

    <section class="contactIcons flex justify-center mt-10">
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
    </section>
  </div>
</template>

<script setup>
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

// 🟦 Responsive Hero Images Logic
const heroImagesDesktop = [
  new URL("../images/hero img.png", import.meta.url).href,
  new URL("../images/hero img2.png", import.meta.url).href,
  new URL("../images/hero img3.png", import.meta.url).href,
];

const heroImagesMobile = [
  new URL("../images/hero img mob.png", import.meta.url).href,
  new URL("../images/hero img2 mob.png", import.meta.url).href,
  new URL("../images/hero img3 mob.png", import.meta.url).href,
];

const heroImages = ref(heroImagesDesktop);
const currentHeroIndex = ref(0);
let heroInterval = null;

const updateHeroImages = () => {
  // Use mobile images if width <= 768px (you can adjust breakpoint)
  if (window.innerWidth <= 768) {
    heroImages.value = heroImagesMobile;
  } else {
    heroImages.value = heroImagesDesktop;
  }
};

const goToHero = (index) => {
  currentHeroIndex.value = index;
};

onMounted(() => {
  updateHeroImages();
  window.addEventListener('resize', updateHeroImages);

  heroInterval = setInterval(() => {
    currentHeroIndex.value = (currentHeroIndex.value + 1) % heroImages.value.length;
  }, 7000);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateHeroImages);
  clearInterval(heroInterval);
});


// 🔹 Feedback + Offers logic (unchanged)
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
    const q = query(offersCollection, limit(4)); 
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
      name: "omar mahmoud",
      text: "I used Tashtebaty for the first time. The process was incredibly smooth.",
    },
    {
      image:
        "https://res.cloudinary.com/dlrgf0myy/image/upload/v1760769725/Screenshot_2025-10-08_002635_ny2rnm.png",
      name: "nora tawfiq",
      text: "Great service and quick response. Loved the professionalism!",
    },
    {
      image:
        "https://res.cloudinary.com/dlrgf0myy/image/upload/v1760769725/Screenshot_2025-10-08_002730_y0bkp5.png",
      name: "manar morad",
      text: "Highly recommend Tashtebaty for reliable and quality work.",
    },
    {
      image:
        "https://res.cloudinary.com/dlrgf0myy/image/upload/v1760769725/Screenshot_2025-10-08_002515_zwynbi.png",
      name: "khaled nabil",
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