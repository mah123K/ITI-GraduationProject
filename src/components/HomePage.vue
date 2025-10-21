<template>
  <div>
    <!--hero section-->
    <section class="hero relative w-full">
      <img
        src="https://res.cloudinary.com/dlrgf0myy/image/upload/v1760692341/image_jmqili.jpg"
        alt="Hero"
        class=""
      />
    </section>
    <!--cards-->
    <div class="flex justify-center">
      <div class="grid grid-cols-2 gap-10 mt-10 mb-10 md:grid-cols-4">
        <div
          class="card cursor-pointer bg-[#DAECF6] image-full w-45 rounded-2xl shadow-sm h-55 hover:scale-105 transition duration-300"
        >
          <router-link to="/PlumbersPage">
            <div>
              <img
                src="https://res.cloudinary.com/dlrgf0myy/image/upload/v1760695818/image__1_-removebg-preview_spqrzh.png"
                class=""
              />
              <span class="text-center block text-[#5984C6] text-xl font-medium"
                >Plumbing</span
              >
            </div>
          </router-link>
        </div>
        <div
          class="card cursor-pointer bg-[#DAECF6] image-full w-45 rounded-2xl shadow-sm h-55 hover:scale-105 transition duration-300"
        >
          <router-link to="/FinishingCompanies">
            <div>
              <img
                src="https://res.cloudinary.com/dlrgf0myy/image/upload/v1760696039/image__2_-removebg-preview_qlbzwa.png"
                class="w-full"
              />
              <span class="text-center block text-[#5984C6] text-xl font-medium"
                >Finishing</span
              >
            </div>
          </router-link>
        </div>
        <div
          class="card cursor-pointer bg-[#DAECF6] image-full w-45 rounded-2xl shadow-sm h-55 hover:scale-105 transition duration-300"
        >
          <router-link to="/ElectrectionsPage">
            <div>
              <img
                src="https://res.cloudinary.com/dlrgf0myy/image/upload/v1760696039/image__3_-removebg-preview_ko98nb.png"
                class=""
              />
              <span class="text-center block text-[#5984C6] text-xl font-medium"
                >Electrical</span
              >
            </div>
          </router-link>
        </div>
        <div
          class="card cursor-pointer bg-[#DAECF6] image-full w-45 rounded-2xl shadow-sm h-55 hover:scale-105 transition duration-300"
        >
          <router-link to="/CarpentersPage">
            <div>
              <img
                src="https://res.cloudinary.com/dlrgf0myy/image/upload/v1760696039/image__4_-removebg-preview_ihc9at.png"
                class=""
              />
              <span class="text-center block text-[#5984C6] text-xl font-medium"
                >Carpentry</span
              >
            </div>
          </router-link>
        </div>
      </div>
    </div>
    <!--offer cards-->
    <div>
      <h2 class="text-center main-header">Exclusive Offers</h2>
    </div>
    <div class="text-first-blue flex justify-end mr-10">
      <router-link to="/offers">see more</router-link>
    </div>
    <div class="flex justify-center mt-5">
      <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        <div class="card bg-secondary-blue rounded-xl h-fit w-70 shadow-sm">
          <div class="offer absolute">
            <img
              src="https://res.cloudinary.com/dlrgf0myy/image/upload/v1760703911/image__8_-removebg-preview_oymppq.png"
              class="w-15 rounded-b-full"
              alt=""
            />
          </div>

          <img
            src="https://res.cloudinary.com/dlrgf0myy/image/upload/v1760702375/image_5_qdnori.jpg"
            alt=""
            class="w-full rounded-t-2xl"
          />
          <div class="card-body mt-2 items-center text-center">
            <h2 class="card-title text-red-600">10% OFF</h2>
            <p>on your First Service</p>
            <div class="card-actions pb-3">
              <button
                class="btn mt-2 text-white rounded-sm p-1.5 cursor-pointer bg-[#5984C6]"
              >
                Claim offer
              </button>
            </div>
          </div>
        </div>

        <div class="card bg-secondary-blue rounded-2xl w-70 shadow-sm">
          <div class="offer absolute">
            <img
              src="https://res.cloudinary.com/dlrgf0myy/image/upload/v1760703911/image__8_-removebg-preview_oymppq.png"
              class="w-15 rounded-b-full"
              alt=""
            />
          </div>

          <img
            src="https://res.cloudinary.com/dlrgf0myy/image/upload/v1760702374/image_6_y3qk8x.jpg"
            alt=""
            class="w-full rounded-t-2xl"
          />
          <div class="card-body mt-2 items-center text-center">
            <h2 class="card-title text-red-600">10% OFF</h2>
            <p>on your First Service</p>
            <div class="card-actions pb-3">
              <button
                class="btn mt-2 text-white rounded-sm p-1.5 cursor-pointer bg-[#5984C6]"
              >
                Claim offer
              </button>
            </div>
          </div>
        </div>

        <div class="card bg-secondary-blue rounded-2xl w-70 shadow-sm">
          <div class="offer absolute">
            <img
              src="https://res.cloudinary.com/dlrgf0myy/image/upload/v1760703911/image__8_-removebg-preview_oymppq.png"
              class="w-15 rounded-b-full"
              alt=""
            />
          </div>

          <img
            src="https://res.cloudinary.com/dlrgf0myy/image/upload/v1760702373/image_7_gacwsb.jpg"
            alt=""
            class="w-full rounded-t-2xl"
          />
          <div class="card-body mt-2 items-center text-center">
            <h2 class="card-title text-red-600">10% OFF</h2>
            <p>on your First Service</p>
            <div class="card-actions pb-3">
              <button
                class="btn mt-2 text-white rounded-sm p-1.5 cursor-pointer bg-[#5984C6]"
              >
                Claim offer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--Why choose us-->
    <div>
      <h2 class="main-header">Why Choose US?</h2>
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
        <ul class=" ">
          <li class="row flex flex-row justify-between pb-15">
            <div class="text-4xl font-thin pr-5">
              <img
                class="w-10"
                src="https://res.cloudinary.com/dlrgf0myy/image/upload/v1760704859/image__9_-removebg-preview_rlbcrt.png"
                alt=""
              />
            </div>
            <div class="list-col-grow">
              <div class="w-80">
                We serve over 60,000 happy customers and they continue to order
                regularly.
              </div>
            </div>
          </li>

          <li class="row flex flex-row justify-between pb-15">
            <div class="text-4xl font-thin pr-5">
              <i class="fa-solid fa-people-group text-[#5984C6] w-10"></i>
            </div>
            <div class="list-col-grow">
              <div class="w-80">
                flexible prices, choose the price suitable for you and negotiate
              </div>
            </div>
          </li>

          <li class="row flex flex-row justify-between pb-15">
            <div class="text-4xl font-thin pr-5">
              <i class="fa-solid fa-address-card text-[#5984C6] w-10"></i>
            </div>
            <div class="list-col-grow">
              <div class="w-80">
                All workers and technicians are contracted with us and all their
                data is fully available.
              </div>
            </div>
          </li>

          <li class="row flex flex-row justify-between pb-15">
            <div class="text-4xl font-thin pr-5">
              <i class="fa-solid fa-headphones text-[#5984C6] w-10"></i>
            </div>
            <div class="list-col-grow">
              <div class="w-80">
                continues follow-up during and until the completion of the order
                implementation.
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!--Customer feedback-->
    <div class="relative w-full">
      <!-- العنوان -->
      <h2 class="main-header">Our Customers Feedback</h2>

      <!-- السلايدر -->
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
            <h2 class="text-[#5984C6] text-2xl mb-2 font-medium">
              {{ item.name }}
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

      <!-- النقاط -->
      <div
        class="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-3 z-20"
      >
        <button
          v-for="(item, index) in slides"
          :key="'dot-' + index"
          @click="goToSlide(index)"
          class="w-3 h-3 rounded-full transition-colors"
          :class="currentSlide === index ? 'bg-[#5984C6]' : 'bg-gray-300'"
        ></button>
      </div>

      <!-- الأسهم -->
      <button
        @click="prevSlide"
        class="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 group focus:outline-none"
      >
        <span
          class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/40 group-hover:bg-white/70"
        >
          <svg
            class="w-4 h-4 text-gray-800"
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
        class="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 group focus:outline-none"
      >
        <span
          class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/40 group-hover:bg-white/70"
        >
          <svg
            class="w-4 h-4 text-gray-800"
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
    <!--our work-->
    <h2 class="hidden md:block mb-5 main-header">Our Work</h2>
    <div class="flex justify-center">
      <div
        class="md:grid md:grid-cols-9 grid-cols-3 hidden grid-rows-2 md:w-2xl"
      >
        <div
          v-for="(image, index) in works"
          :key="index"
          :class="[
            'overflow-hidden rounded-2xl cursor-pointer transition-transform duration-300 hover:scale-105',
            image.size === 'large'
              ? 'col-span-1 row-span-1'
              : 'col-span-2 row-span-1',
          ]"
        >
          <img
            :src="image.src"
            :alt="image.alt"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
    <!--contact info-->
    <div class="flex justify-center mt-10">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <!-- Card 1 -->
        <div
          class="flex cursor-pointer items-center gap-4 bg-white shadow-md border border-gray-200 rounded-2xl px-6 py-4 hover:shadow-lg transition-all duration-300 w-64"
        >
          <div
            class="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full text-xl"
          >
            <i class="fa-solid fa-phone"></i>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-800">Phone</h3>
            <span class="text-gray-500 text-sm">+2025895623</span>
          </div>
        </div>

        <!-- Card 2 -->
        <div
          class="flex cursor-pointer items-center gap-4 bg-white shadow-md border border-gray-200 rounded-2xl px-6 py-4 hover:shadow-lg transition-all duration-300 w-64"
        >
          <div
            class="flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full text-xl"
          >
            <i class="fa-solid fa-envelope"></i>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-800">Email</h3>
            <span class="text-gray-500 text-sm">tashtebaty12@gmail.com</span>
          </div>
        </div>

        <!-- Card 3 -->
        <div
          class="flex cursor-pointer items-center gap-4 bg-white shadow-md border border-gray-200 rounded-2xl px-6 py-4 hover:shadow-lg transition-all duration-300 w-64"
        >
          <div
            class="flex items-center justify-center w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full text-xl"
          >
            <i class="fa-solid fa-location-dot"></i>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-800">Address</h3>
            <span class="text-gray-500 text-sm">XYZ Street</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomePage",

  data() {
    return {
      currentSlide: 0,
      interval: null,
      slides: [
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
      ],
      works: [
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
        {
          src: "https://res.cloudinary.com/dlrgf0myy/image/upload/v1760888695/service-maintenance-worker-repairing_slghmb.jpg",
          alt: "Work 6",
          size: "small",
        },
        {
          src: "https://res.cloudinary.com/dlrgf0myy/image/upload/v1760702374/image_6_y3qk8x.jpg",
          alt: "Work 6",
          size: "large",
        },
        {
          src: "https://res.cloudinary.com/dlrgf0myy/image/upload/v1760888695/service-maintenance-worker-repairing_slghmb.jpg",
          alt: "Work 6",
          size: "small",
        },
        {
          src: "https://res.cloudinary.com/dlrgf0myy/image/upload/v1760702374/image_6_y3qk8x.jpg",
          alt: "Work 6",
          size: "large",
        },
        {
          src: "https://res.cloudinary.com/dlrgf0myy/image/upload/v1760888695/service-maintenance-worker-repairing_slghmb.jpg",
          alt: "Work 6",
          size: "small",
        },
        {
          src: "https://res.cloudinary.com/dlrgf0myy/image/upload/v1760702374/image_6_y3qk8x.jpg",
          alt: "Work 6",
          size: "large",
        },
      ],
    };
  },
  methods: {
    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    },
    prevSlide() {
      this.currentSlide =
        (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    },
    goToSlide(index) {
      this.currentSlide = index;
    },
  },

  mounted() {
    this.interval = setInterval(this.nextSlide, 5000);
  },

  beforeUnmount() {
    clearInterval(this.interval);
  },
};
</script>

<style scoped>
.offer {
  z-index: 20;
}
</style>