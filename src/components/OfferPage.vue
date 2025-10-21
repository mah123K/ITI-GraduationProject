
<template>
    <div>
          <div class="w-full mt-15">
    <!-- ====== SIGNUP & REFER CARDS ====== -->
    <div class="flex justify-center w-full">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
        <!-- SIGNUP CARD -->
        <div
          class="relative mt-10 w-96 mx-auto bg-accent-color rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition duration-300"
        >
          <div
            class="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm"
          >
            Limited Time
          </div>
          <h1 class="text-3xl md:text-4xl font-bold mb-4">SIGN UP AND GET</h1>
          <div
            class="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30 inline-block"
          >
            <div class="text-4xl md:text-5xl font-black mb-2">150 EGP</div>
            <div class="text-2xl font-semibold">DISCOUNT VOUCHER!</div>
          </div>
          <p class="mt-6 text-lg">on your first order!</p>
          <button
            class="mt-6 bg-white text-accent-color px-8 py-3 rounded-full font-semibold hover:shadow-xl transition transform hover:scale-105 flex items-center space-x-2"
          >
            <span>Get Started</span>
          </button>
        </div>

        <!-- REFER CARD -->
        <div
          class="bg-gradient-to-br mt-10 w-96 mx-auto from-purple-600 to-pink-500 rounded-2xl p-8 text-white shadow-2xl hover:scale-105 transition duration-300"
        >
          <div class="flex flex-col items-center justify-between gap-6">
            <div class="flex-1 text-center">
              <h2 class="text-2xl md:text-3xl font-bold mb-2">REFER A FRIEND</h2>
              <p class="text-lg opacity-90">
                You both get 100 EGP credit when they book!
              </p>
            </div>

            <div
              class="bg-white/10 backdrop-blur-md rounded-2xl px-8 py-6 border-2 border-white/30"
            >
              <div class="text-3xl md:text-4xl font-black">100 EGP</div>
              <div class="text-sm font-semibold mt-1">FOR EACH</div>
            </div>

            <button
              class="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:shadow-xl transition transform hover:scale-105 flex items-center space-x-2 whitespace-nowrap"
            >
              <span>Share Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ====== OFFERS SECTION ====== -->
    <div class="flex justify-center mt-14">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        <div
          v-for="(offer, index) in offers"
          :key="index"
          class="relative bg-secondary-blue rounded-2xl w-72 shadow-md hover:shadow-xl transition transform hover:scale-105"
        >
          <div class="absolute top-0 left-0">
            <img
              src="https://res.cloudinary.com/dlrgf0myy/image/upload/v1760703911/image__8_-removebg-preview_oymppq.png"
              class="w-15"
              alt=""
            />
          </div>

          <img
            :src="offer.image"
            alt="offer image"
            class="w-full rounded-t-2xl h-48 object-cover"
          />

          <div class="card-body mt-2 items-center text-center p-3">
            <h2 class="text-red-600 font-bold text-xl">{{ offer.title }}</h2>
            <p class="text-gray-700 text-sm">{{ offer.description }}</p>
            <div class="mt-4">
              <button
                class="bg-[#5984C6] text-white rounded-md px-4 py-2 hover:bg-[#4a6ca6] transition"
              >
                Claim Offer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    </div>
</template>

<script>
    export default {
            name:"OfferPage",
    data(){
    return{
        offers:[
  {
    title: "10% OFF",
    description: "on your First Service",
    image:
      "https://res.cloudinary.com/dlrgf0myy/image/upload/v1760702375/image_5_qdnori.jpg",
  },
  {
    title: "15% OFF",
    description: "on Plumbing Services",
    image:
      "https://res.cloudinary.com/dlrgf0myy/image/upload/v1760702374/image_6_y3qk8x.jpg",
  },
  {
    title: "Free Check-up",
    description: "with every maintenance order",
    image:
      "https://res.cloudinary.com/dlrgf0myy/image/upload/v1760702373/image_7_gacwsb.jpg",
  },
   {
    title: "10% OFF",
    description: "on your First Service",
    image:
      "https://res.cloudinary.com/dlrgf0myy/image/upload/v1760702375/image_5_qdnori.jpg",
  },
  {
    title: "15% OFF",
    description: "on finishing home Services",
    image:
      "https://res.cloudinary.com/dlrgf0myy/image/upload/v1760702374/image_6_y3qk8x.jpg",
  },
]
    }
}
        
    }
</script>

<style scoped>

</style>
