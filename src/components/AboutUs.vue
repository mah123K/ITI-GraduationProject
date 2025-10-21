<script>
  export default{
    name:"AboutUs",
    data(){
      return{
        currentIndex:0,
        feedbacks: [
        {
          name: "manar morad",
          image: new URL("../images/Ellipse 47.png", import.meta.url).href,
          text: "I needed a plumber for an urgent leak, and I used Tashtebaty for the first time. The process was incredibly smooth. I loved that all the plumber's info was right there no guessing! The price was fair, and the follow up call after the job was finished was a fantastic touch. I'm definitely a regular customer now! Highly recommend for reliable service"
        },
        {
          name: "mohamed amir",
          image: new URL("../images/Ellipse 46.png", import.meta.url).href,
          text: "I finally decided to get my kitchen cabinets updated, and I booked a carpenter through Tashtebaty. I was so impressed! The quality of the work was top-notch, and the technician's data was transparently provided upfront. The price was great, and they finished ahead of schedule. Knowing they check in after completion shows they really care. This is my new go-to for home maintenance. Highly recommend!"
        },
        {
          name: "samir khaled",
          image: new URL("../images/Ellipse 46.png", import.meta.url).href,
          text: "My main breaker kept tripping, which was a huge hassle. I used Tashtebaty and an electrician was dispatched incredibly fast. I appreciated the clear communication about the fee structure before he started the repair. He fixed the wiring issue quickly and professionally, and the system follow-up was excellent. I feel much safer now. If you need speed and trustworthy help, this is the service to use!"
        }
        ]
      }
    },
    methods: {
      nextFeedback() {
      this.currentIndex = (this.currentIndex + 1) % this.feedbacks.length;
      },
      prevFeedback() {
        this.currentIndex = (this.currentIndex - 1 + this.feedbacks.length) % this.feedbacks.length;
      }
    }
  }
</script>

<template>
  <div class="heroSection mt-18 relative h-[70vh] flex flex-col justify-center items-center overflow-hidden text-white">
    
    <img src="../images/final happy workers.png" alt="happy workers smiling" class="w-full h-full object-cover">
    <div class="blueLayer absolute inset-0 bg-[#5984C6] opacity-70"></div>

    <div class="textContainer absolute flex flex-col w-1/2 mx-auto ">
      <h2 class="text-3xl font-semibold my-4">About Tashtebaty</h2>
      <h1 class="text-5xl font-semibold my-4">We provide the highest quality with the best Prices in the market</h1>
      <p class="text-xl">A leading Egyptian platform founded in 2025 by five founders united by a single goal: to simplify access to the best home maintenance and professional services in Egypt.
      Tashtebaty was born from our belief in the necessity of building a bridge of trust and professionalism between our valued customers and the most skilled craftsmen and technicians. We are not just a middleman; we are your trusted partner who guarantees quality work and peace of mind.
      </p>
    </div>

  </div>

  <div class="OurSpecialFeatures flex w-3/4 mx-auto justify-between items-center">

    <div class="imagesContainer w-1/2 relative flex flex-col items-center">
      <img 
        src="../images/Rectangle 19.png" 
        alt="technician with wrench"
        class="rounded-[40px] w-[400px] h-[300px] object-cover shadow-lg relative z-10"
      />
      <img 
        src="../images/Rectangle 18.png" 
        alt="electrician working"
        class="rounded-[40px] w-[400px] h-[300px] object-cover shadow-lg absolute -bottom-50 left-0 z-10"
      />
    </div>

    <div class="textContainer w-1/2 my-20">
      <h2 class="text-3xl font-semibold my-4 ">Our special features</h2>
      <h1 class="text-5xl font-semibold my-4 text-accent-color">We don't just fix homes, we deliver an experience.</h1>
      <ul>
        <li class="text-xl my-2"><h2 class="text-3xl my-2 text-accent-color">Certified Technicians</h2>Every professional is highly skilled and verified, specializing in their exact trade—no generalists. You get a true expert every time.</li>
        <li class="text-xl my-2"><h2 class="text-3xl my-2 text-accent-color">24/7 Priority Support</h2>Get an instant response and dedicated assistance from our support team, ensuring your issue is tracked and addressed around the clock, from start to finish.</li>
        <li class="text-xl my-2"><h2 class="text-3xl my-2 text-accent-color">Transparent Pricing Policy</h2>No hidden fees or surprise costs. We provide clear, detailed estimates before any work begins, so you always know what you're paying for.</li>
      </ul>
    </div>
    
  </div>

  <div class="numbersSection bg-accent-color text-white my-15">
    <div class="container flex justify-between items-center w-3/4 mx-auto py-10 text-center">
      <div class="number flex flex-col ">
        <h1 class="font-semibold text-[45px]">2000+</h1>
        <p class="text-2xl">Completed services</p>
      </div>
      <div class="number flex flex-col">
        <h1 class="font-semibold text-[45px]">6000+</h1>
        <p class="text-2xl">Registered users</p>
      </div>
      <div class="number flex flex-col">
        <h1 class="font-semibold text-[45px]">75%+</h1>
        <p class="text-2xl">Repeated Orders</p>
      </div>
      <div class="number flex flex-col">
        <h1 class="font-semibold text-[45px]">4.9+</h1>
        <p class="text-2xl">Average rating</p>
      </div>
    </div>
  </div>

  <div class="WhyToChooseUs flex w-3/4 mx-auto justify-between items-center">

    <div class="imagesContainer flex flex-col w-1/2">
      <img src="../images/Rectangle 21.png" class="rounded-[40px] w-[400px] h-[450px] object-cover shadow-lg  z-10" alt="">
      <img src="../images/Rectangle 22.png" class="rounded-[40px] w-[400px] h-[300px] object-cover shadow-lg relative z-20 bottom-50 left-50" alt="">
    </div>

    <div class="textContainer flex flex-col my-20 w-[40%]">
      <h2 class="text-3xl font-semibold my-4">Why choose us?</h2>
      <p class="text-xl my-10">Tashtebaty is your trusted Egyptian platform, solving the hassle of finding reliable help since 2025. We meticulously vet and contract every professional from quick repairs (plumbing, electrics) to full home finishing. We guarantee expert workmanship, clear pricing, and continuous support from order to completion, ensuring total peace of mind with every service.</p>
      
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

  <div class="feedback relative flex flex-col items-center justify-between w-[70%] mx-auto my-20 text-center">
    <h1 class="main-header">Customers FeedBack</h1>

    <div v-if="feedbacks[currentIndex]" :key="currentIndex" class="feedback-item h-[500px]">
      
      <div class="imgContainer flex flex-col items-center justify-center">
        <img :src="feedbacks[currentIndex].image" class="w-[170px]" alt="">
        <p class="text-[20px] font-semibold">{{ feedbacks[currentIndex].name }}</p>
        <div class="flex justify-center my-4 text-yellow-400 text-xl ">
          <svg v-for="n in 5" :key="n" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="w-6 h-6 mx-1 fill-current">
            <path d="M316.9 18C311.6 7 300.4 0 288 0s-23.6 7-28.9 18L195 150.3 
            47.9 171.5c-12.2 1.8-22.3 10.3-26.2 21.9s-.7 24.4 
            7.9 32.9L150 357.4 129.1 504.6c-1.8 12.2 3 24.5 
            12.6 32s22.4 9 33.2 4.2L288 439.6l113.1 61.2c10.8 
            4.8 23.6 3.3 33.2-4.2s14.4-19.8 12.6-32L426 
            357.4l120.4-131.1c8.6-8.5 11.7-21.3 
            7.9-32.9s-14-20.1-26.2-21.9L381 
            150.3 316.9 18z" />
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
</template>

<style scoped>

</style>
