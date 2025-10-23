<script>
  export default{
    name:"AboutUs",
    data(){
      return{
        
      numbersStarted: false,
      animatedNumbers: {
        services: 0,
        users: 0,
        orders: 0,
        rating: 0,
      },
      targetNumbers: {
        services: 2000,
        users: 6000,
        orders: 75,
        rating: 4.9,
      },
        currentSlide:0,
      interval: null,
          slides: [
        {
          image:
            "https://res.cloudinary.com/dlrgf0myy/image/upload/v1760769725/Screenshot_2025-10-08_002515_zwynbi.png",
          name: "Client 1",
          text: "My main breaker kept tripping, which was a huge hassle. I used Tashtebaty and an electrician was dispatched incredibly fast. I appreciated the clear communication about the fee structure before he started the repair. He fixed the wiring issue quickly and professionally, and the system follow-up was excellent. I feel much safer now. If you need speed and trustworthy help, this is the service to use!"
        },
        {
          image:
            "https://res.cloudinary.com/dlrgf0myy/image/upload/v1760769725/Screenshot_2025-10-08_002635_ny2rnm.png",
          name: "Client 2",
          text: "I finally decided to get my kitchen cabinets updated, and I booked a carpenter through Tashtebaty. I was so impressed! The quality of the work was top-notch, and the technician's data was transparently provided upfront. The price was great, and they finished ahead of schedule. Knowing they check in after completion shows they really care. This is my new go-to for home maintenance. Highly recommend!"
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
          text: "I needed a plumber for an urgent leak, and I used Tashtebaty for the first time. The process was incredibly smooth. I loved that all the plumber's info was right there no guessing! The price was fair, and the follow up call after the job was finished was a fantastic touch. I'm definitely a regular customer now! Highly recommend for reliable service"
        },
      ],
      }
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
      handleScroll() {
      const section = this.$refs.numbersSection;
      const rect = section.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

      if (isVisible && !this.numbersStarted) {
        this.numbersStarted = true;
        this.startCountAnimation();
      }
    },
    startCountAnimation() {
      const duration = 2000; // total duration in ms
      const startTime = performance.now();

      const animate = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);

        this.animatedNumbers.services = Math.floor(
          this.targetNumbers.services * progress
        );
        this.animatedNumbers.users = Math.floor(
          this.targetNumbers.users * progress
        );
        this.animatedNumbers.orders = Math.floor(
          this.targetNumbers.orders * progress
        );
        this.animatedNumbers.rating = (this.targetNumbers.rating * progress).toFixed(1);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    },
    },
    mounted() {
    this.interval = setInterval(this.nextFeedback, 5000);
     window.addEventListener("scroll", this.handleScroll);
  },

  beforeUnmount() {
    clearInterval(this.interval);
    window.removeEventListener("scroll", this.handleScroll);
  },
  
  }
</script>

<template>
    <div
    class="heroSection mt-18 relative h-[70vh] flex flex-col justify-center items-center overflow-hidden text-white"
  >
    <img
      src="../images/final happy workers.png"
      alt="happy workers smiling"
      class="w-full h-full object-cover"
    />
    <div class="blueLayer absolute inset-0 bg-[#5984C6] opacity-70"></div>

    <div
      class="textContainer absolute flex flex-col w-11/12 md:w-2/3 lg:w-1/2 mx-auto text-center md:text-left"
    >
      <h2 class="text-xl md:text-2xl font-semibold my-4">About Tashtebaty</h2>
      <h1
        class="text-2xl md:text-4xl font-semibold my-4 leading-snug md:leading-tight"
      >
        We provide the highest quality with the best Prices in the market
      </h1>
      <p class="text-sm md:text-base leading-relaxed">
        A leading Egyptian platform founded in 2025 by five founders united by a
        single goal: to simplify access to the best home maintenance and
        professional services in Egypt. Tashtebaty was born from our belief in
        the necessity of building a bridge of trust and professionalism between
        our valued customers and the most skilled craftsmen and technicians.
      </p>
    </div>
  </div>


  <div class="OurSpecialFeatures flex justify-center my-10">
<div class="lg:grid lg:grid-cols-2">
    <div class="imagesContainer   md:flex-col items-center relative hidden lg:flex">
      <img 
        src="../images/Rectangle 19.png" 
        alt="technician with wrench"
        class="relative rounded-[40px] w-[400px] h-[300px] object-cover shadow-lg  z-10"
      />
      <img 
        src="../images/Rectangle 18.png" 
        alt="electrician working"
        class=" object-cover w-80  shadow-lg absolute top-60 left-50 z-10"
      />
    </div>

    <div class="textContainer lg:w-xl gap-5 flex flex-col w-96 md:w-2xl justify-center">
      <h2 class="text-xl font-semibold my-4 ">Our special features</h2>
      <h1 class="text-4xl font-semibold my-4 text-accent-color">We don't just fix homes, we deliver an experience.</h1>
      <ul>
        <li class="text-sm my-2"><h2 class="text-3xl my-2 text-accent-color">Certified Technicians</h2>Every professional is highly skilled and verified, specializing in their exact trade—no generalists. You get a true expert every time.</li>
        <li class="text-sm my-2"><h2 class="text-3xl my-2 text-accent-color">24/7 Priority Support</h2>Get an instant response and dedicated assistance from our support team, ensuring your issue is tracked and addressed around the clock, from start to finish.</li>
        <li class="text-sm my-2"><h2 class="text-3xl my-2 text-accent-color">Transparent Pricing Policy</h2>No hidden fees or surprise costs. We provide clear, detailed estimates before any work begins, so you always know what you're paying for.</li>
      </ul>
    </div>
    </div>
  </div>

  <div ref="numbersSection" class="numbersSection bg-accent-color text-white my-15">
    <div
      class="container grid grid-cols-2 md:grid-cols-4 gap-8 w-11/12 mx-auto py-10 text-center"
    >
      <div class="number flex flex-col">
        <h1 class="font-semibold text-3xl md:text-[45px]">
          {{ animatedNumbers.services }}+
        </h1>
        <p class="text-lg md:text-2xl">Completed services</p>
      </div>
      <div class="number flex flex-col">
        <h1 class="font-semibold text-3xl md:text-[45px]">
          {{ animatedNumbers.users }}+
        </h1>
        <p class="text-lg md:text-2xl">Registered users</p>
      </div>
      <div class="number flex flex-col">
        <h1 class="font-semibold text-3xl md:text-[45px]">
          {{ animatedNumbers.orders }}%
        </h1>
        <p class="text-lg md:text-2xl">Repeated Orders</p>
      </div>
      <div class="number flex flex-col">
        <h1 class="font-semibold text-3xl md:text-[45px]">
          {{ animatedNumbers.rating }}+
        </h1>
        <p class="text-lg md:text-2xl">Average rating</p>
      </div>
    </div>
  </div>


  <div class="WhyToChooseUs flex justify-center items-center w-full mb-15">
<div class="grid grid-cols-2">
    <div class="imagesContainer flex flex-col justify-center items-center">
      <img src="../images/Rectangle 21.png" class="rounded-[40px]  h-80 mb-5 lg:w-[400px] lg:h-[380px] object-cover shadow-lg relative  z-10" alt="">
    </div>

    <div class="textContainer justify-center lg:w-xl w-96 md:w-2xl gap-3 flex flex-col">
      <h2 class="text-3xl font-semibold">Why choose us?</h2>
      <p class="md:text-md text-sm">Tashtebaty is your trusted Egyptian platform, solving the hassle of finding reliable help since 2025. We meticulously vet and contract every professional from quick repairs (plumbing, electrics) to full home finishing. We guarantee expert workmanship, clear pricing, and continuous support from order to completion, ensuring total peace of mind with every service.</p>
      
      <ul class="space-y-4">
      <li class="flex items-start gap-3 text-xl text-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
          class="w-6 h-6 text-[#5984C6] flex-shrink-0 mt-1 fill-current">
          <path d="M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zM374 145.7c-10.7-7.8-25.7-5.4-33.5 5.3L221.1 315.2 
          169 263.1c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l72 72c5 5 11.8 7.5 
          18.8 7s13.4-4.1 17.5-9.8L379.3 179.2c7.8-10.7 
          5.4-25.7-5.3-33.5z"/>
        </svg>
        Use best materials and labor in every project.
      </li>

      <li class="flex items-start gap-3 text-xl text-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
          class="w-6 h-6 text-[#5984C6] flex-shrink-0 mt-1 fill-current">
          <path d="M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zM374 145.7c-10.7-7.8-25.7-5.4-33.5 5.3L221.1 315.2 
          169 263.1c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 
          33.9l72 72c5 5 11.8 7.5 
          18.8 7s13.4-4.1 17.5-9.8L379.3 
          179.2c7.8-10.7 
          5.4-25.7-5.3-33.5z"/>
        </svg>
        Integrity and honesty from top to bottom.
      </li>

      <li class="flex items-start gap-3 text-xl text-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
          class="w-6 h-6 text-[#5984C6] flex-shrink-0 mt-1 fill-current">
          <path d="M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zM374 145.7c-10.7-7.8-25.7-5.4-33.5 5.3L221.1 315.2 
          169 263.1c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 
          33.9l72 72c5 5 11.8 7.5 
          18.8 7s13.4-4.1 17.5-9.8L379.3 
          179.2c7.8-10.7 
          5.4-25.7-5.3-33.5z"/>
        </svg>
        Affordable and fair prices.
      </li>

      <li class="flex items-start gap-3 text-xl text-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
          class="w-6 h-6 text-[#5984C6] flex-shrink-0 mt-1 fill-current">
          <path d="M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zM374 145.7c-10.7-7.8-25.7-5.4-33.5 5.3L221.1 315.2 
          169 263.1c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 
          33.9l72 72c5 5 11.8 7.5 
          18.8 7s13.4-4.1 17.5-9.8L379.3 
          179.2c7.8-10.7 
          5.4-25.7-5.3-33.5z"/>
        </svg>
        Licensed and Insured.
      </li>

      <li class="flex items-start gap-3 text-xl text-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
          class="w-6 h-6 text-[#5984C6] flex-shrink-0 mt-1 fill-current">
          <path d="M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zM374 145.7c-10.7-7.8-25.7-5.4-33.5 5.3L221.1 315.2 
          169 263.1c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 
          33.9l72 72c5 5 11.8 7.5 
          18.8 7s13.4-4.1 17.5-9.8L379.3 
          179.2c7.8-10.7 
          5.4-25.7-5.3-33.5z"/>
        </svg>
        We care about our customers and give personal attention.
      </li>
    </ul>
    </div>
    </div>
  </div>

  <div class="relative w-full">
      <!-- العنوان -->
      <h2 class="font-semibold text-accent-color text-3xl text-center mt-5  lg:main-header">Our Customers Feedback</h2>

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
            <h2 class="text-accent-color text-2xl mb-2 font-medium">
              {{ item.name }}
            </h2>
            <div class="flex justify-center text-yellow-300 mb-2">
              <i v-for="n in 5" :key="n" class="fa-solid fa-star"></i>
            </div>
            <p class="text-gray-700 text-sm max-w-xl">
              {{ item.text }}
            </p>
          </div>
        </div>
      </div>

      <!-- الأسهم -->
      <button
        @click="prevSlide"
        class="absolute top-0 left-0 lg:top-20 lg:left-50 z-30 flex items-center justify-center h-full px-4 group focus:outline-none"
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
        class="absolute top-0 right-0 lg:top-20 lg:right-50 z-30 flex items-center justify-center h-full px-4 group focus:outline-none"
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
</template>

<style scoped>

</style>
