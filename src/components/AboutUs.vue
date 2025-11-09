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
      
      // --- MODIFIED ---
      // We now store keys instead of hardcoded text.
      // The images remain the same.
      slides: [
        {
          image:
            "https://res.cloudinary.com/dlrgf0myy/image/upload/v1760769725/Screenshot_2025-10-08_002515_zwynbi.png",
          nameKey: "aboutUs.feedback.samir.name",
          textKey: "aboutUs.feedback.samir.text"
        },
        {
          image:
            "https://res.cloudinary.com/dlrgf0myy/image/upload/v1760769725/Screenshot_2025-10-08_002635_ny2rnm.png",
          nameKey: "aboutUs.feedback.mona.name",
          textKey: "aboutUs.feedback.mona.text"
        },
        {
          image:
            "https://res.cloudinary.com/dlrgf0myy/image/upload/v1760769725/Screenshot_2025-10-08_002730_y0bkp5.png",
          nameKey: "aboutUs.feedback.mai.name",
          textKey: "aboutUs.feedback.mai.text"
        },
        {
          image:
            "https://res.cloudinary.com/dlrgf0myy/image/upload/v1760769725/Screenshot_2025-10-08_002515_zwynbi.png",
          nameKey: "aboutUs.feedback.khaled.name",
          textKey: "aboutUs.feedback.khaled.text"
        },
      ],
      // --- END MODIFICATION ---
      
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
      if (!section) return; // Guard clause
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
    // Note: You had 'nextFeedback' here, but the method is 'nextSlide'
    this.interval = setInterval(this.nextSlide, 5000); 
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
    <div class="blueLayer absolute inset-0 bg-accent-color opacity-70"></div>

    <div
      class="textContainer absolute flex flex-col w-11/12 md:w-2/3 lg:w-1/2 mx-auto text-center rtl:md:text-right"
    >
      <h2 class="text-xl md:text-2xl font-semibold my-4">{{ $t('aboutUs.hero.title') }}</h2>
      <h1
        class="text-2xl md:text-4xl font-semibold my-4 leading-snug md:leading-tight"
      >
        {{ $t('aboutUs.hero.subtitle') }}
      </h1>
      <p class="text-sm md:text-base leading-relaxed">
        {{ $t('aboutUs.hero.description') }}
      </p>
    </div>
  </div>


  <div class="OurSpecialFeatures flex justify-center my-10">
<div class="lg:grid lg:grid-cols-2">
    <div class="imagesContainer md:flex-col items-center relative hidden lg:flex">
      <img 
        src="../images/Rectangle 19.png" 
        alt="technician with wrench"
        class="relative rounded-[40px] w-[400px] h-[300px] object-cover shadow-lg z-10"
      />
      <img 
        src="../images/Rectangle 18.png" 
        alt="electrician working"
        class=" object-cover w-70 shadow-lg absolute top-60 left-60 rtl:left-auto rtl:right-60 z-10"
      />
    </div>

    <div class="textContainer lg:w-xl gap-3 flex flex-col w-96 md:w-2xl justify-center">
      <h2 class="text-xl font-semibold my-2 text-(--text-primary)">{{ $t('aboutUs.features.title') }}</h2>
      <h1 class="text-4xl font-semibold text-accent-color">{{ $t('aboutUs.features.subtitle') }}</h1>
      <ul>
        <li class="text-md my-2 text-(--text-muted)"><h2 class="text-3xl my-2 text-accent-color">{{ $t('aboutUs.features.feature1Title') }}</h2>{{ $t('aboutUs.features.feature1Text') }}</li>
        <li class="text-md my-2 text-(--text-muted)"><h2 class="text-3xl my-2 text-accent-color">{{ $t('aboutUs.features.feature2Title') }}</h2>{{ $t('aboutUs.features.feature2Text') }}</li>
        <li class="text-md my-2 text-(--text-muted)"><h2 class="text-3xl my-2 text-accent-color">{{ $t('aboutUs.features.feature3Title') }}</h2>{{ $t('aboutUs.features.feature3Text') }}</li>
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
        <p class="text-lg md:text-2xl">{{ $t('aboutUs.stats.services') }}</p>
      </div>
      <div class="number flex flex-col">
        <h1 class="font-semibold text-3xl md:text-[45px]">
          {{ animatedNumbers.users }}+
        </h1>
        <p class="text-lg md:text-2xl">{{ $t('aboutUs.stats.users') }}</p>
      </div>
      <div class="number flex flex-col">
        <h1 class="font-semibold text-3xl md:text-[45px]">
          {{ animatedNumbers.orders }}%
        </h1>
        <p class="text-lg md:text-2xl">{{ $t('aboutUs.stats.orders') }}</p>
      </div>
      <div class="number flex flex-col">
        <h1 class="font-semibold text-3xl md:text-[45px]">
          {{ animatedNumbers.rating }}+
        </h1>
        <p class="text-lg md:text-2xl">{{ $t('aboutUs.stats.rating') }}</p>
      </div>
    </div>
  </div>


  <div class="WhyToChooseUs flex justify-center items-center w-full mb-15">
    <div class="grid md:grid-cols-2">
      <div class="imagesContainer flex flex-col justify-center items-center">
        <img src="../images/Rectangle 21.png" class="rounded-[40px] h-80 mb-5 lg:w-[400px] lg:h-[380px] object-cover shadow-lg relative z-10" alt="">
      </div>

      <div class="textContainer justify-center lg:w-xl w-96 md:w-2xl gap-3 flex flex-col">

        <h2 class="text-3xl font-semibold text-(--text-primary)">{{ $t('aboutUs.whyUs.title') }}</h2>
        <p class="md:text-md text-md text-(--text-muted)">{{ $t('aboutUs.whyUs.description') }}</p>
        
        <ul class="space-y-4">
        <li class="flex items-start gap-3 text-xl text-(--text-primary)">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
            class="w-6 h-6 text-accent-color flex-shrink-0 mt-1 fill-current">
            <path d="M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zM374 145.7c-10.7-7.8-25.7-5.4-33.5 5.3L221.1 315.2 
            169 263.1c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l72 72c5 5 11.8 7.5 
            18.8 7s13.4-4.1 17.5-9.8L379.3 179.2c7.8-10.7 
            5.4-25.7-5.3-33.5z"/>
          </svg>
          {{ $t('aboutUs.whyUs.point1') }}
        </li>

        <li class="flex items-start gap-3 text-xl text-(--text-primary)">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
            class="w-6 h-6 text-accent-color flex-shrink-0 mt-1 fill-current">
            <path d="M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zM374 145.7c-10.7-7.8-25.7-5.4-33.5 5.3L221.1 315.2 
            169 263.1c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 
            33.9l72 72c5 5 11.8 7.5 
            18.8 7s13.4-4.1 17.5-9.8L379.3 
            179.2c7.8-10.7 
            5.4-25.7-5.3-33.5z"/>
          </svg>
          {{ $t('aboutUs.whyUs.point2') }}
        </li>

        <li class="flex items-start gap-3 text-xl text-(--text-primary)">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
            class="w-6 h-6 text-accent-color flex-shrink-0 mt-1 fill-current">
            <path d="M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zM374 145.7c-10.7-7.8-25.7-5.4-33.5 5.3L221.1 315.2 
            169 263.1c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 
            33.9l72 72c5 5 11.8 7.5 
            18.8 7s13.4-4.1 17.5-9.8L379.3 
            179.2c7.8-10.7 
            5.4-25.7-5.3-33.5z"/>
          </svg>
          {{ $t('aboutUs.whyUs.point3') }}
        </li>

        <li class="flex items-start gap-3 text-xl text-(--text-primary)">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
            class="w-6 h-6 text-accent-color flex-shrink-0 mt-1 fill-current">
            <path d="M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zM374 145.7c-10.7-7.8-25.7-5.4-33.5 5.3L221.1 315.2 
            169 263.1c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 
            33.9l72 72c5 5 11.8 7.5 
            18.8 7s13.4-4.1 17.5-9.8L379.3 
            179.2c7.8-10.7 
            5.4-25.7-5.3-33.5z"/>
          </svg>
          {{ $t('aboutUs.whyUs.point4') }}
        </li>

        <li class="flex items-start gap-3 text-xl text-(--text-primary)">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
            class="w-6 h-6 text-accent-color flex-shrink-0 mt-1 fill-current">
            <path d="M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zM374 145.7c-10.7-7.8-25.7-5.4-33.5 5.3L221.1 315.2 
            169 263.1c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 
            33.9l72 72c5 5 11.8 7.5 
            18.8 7s13.4-4.1 17.5-9.8L379.3 
            179.2c7.8-10.7 
            5.4-25.7-5.3-33.5z"/>
          </svg>
          {{ $t('aboutUs.whyUs.point5') }}
        </li>
      </ul>
      </div>
    </div>
  </div>

  <div class="relative w-full">
      <h2 class="font-semibold text-accent-color text-3xl text-center mt-5 lg:main-header">{{ $t('aboutUs.feedback.title') }}</h2>

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
              {{ $t(item.nameKey) }}
            </h2>
            <div class="flex justify-center text-yellow-300 mb-2">
              <i v-for="n in 5" :key="n" class="fa-solid fa-star"></i>
            </div>
            <p class="text-(--text-muted) text-sm max-w-xl">
              {{ $t(item.textKey) }}
            </p>
          </div>
        </div>
      </div>

      <button
        @click="prevSlide"
        class="absolute top-0 left-0 lg:top-20 lg:left-50 z-30 flex items-center justify-center h-full px-4 group focus:outline-none rtl:left-auto rtl:right-0"
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
        class="absolute top-0 right-0 lg:top-20 lg:right-50 z-30 flex items-center justify-center h-full px-4 group focus:outline-none rtl:right-auto rtl:left-0"
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
</template>

<style scoped>

</style>