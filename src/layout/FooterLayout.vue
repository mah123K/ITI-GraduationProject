<template>
  <footer
    class="bg-accent-color mt-10 sticky mx-auto text-white grid grid-cols-1 md:grid-cols-4 gap-5 p-8 text-left rtl:text-right"
  >
    <div class="text-left sm:text-left ms-0 sm:ms-10">
      <img
        src="https://res.cloudinary.com/dlrgf0myy/image/upload/v1760784552/image__11_-removebg-preview_ev3uvd.png"
        alt="Tashtebaty Logo"
        class="w-70 mb-4"
      />
      <p class="w-full sm:w-80 sm:ms-10 ms-0 max-w-full">
        {{ $t('footer.description') }}
      </p>
    </div>

    <div class="ms-0 sm:ms-10 text-left sm:text-left">
      <h6 class="text-lg font-semibold mb-3">{{ $t('footer.quickLinks') }}</h6>
      <ul class="space-y-2">
        <li><a href="#" class="hover:underline">{{ $t('footer.links.about') }}</a></li>
        <li><a href="#" class="hover:underline">{{ $t('footer.links.contact') }}</a></li>
        <li><a href="#" class="hover:underline">{{ $t('footer.links.services') }}</a></li>
        <li><a href="#" class="hover:underline">{{ $t('footer.links.offers') }}</a></li>
      </ul>
    </div>

    <div class="ms-0 sm:ms-10 text-left sm:text-left">
      <h6 class="text-lg font-semibold mb-3">{{ $t('footer.legal') }}</h6>
      <ul class="space-y-2">
        <li><a href="#" class="hover:underline">{{ $t('footer.links.terms') }}</a></li>
        <li><a href="#" class="hover:underline">{{ $t('footer.links.privacy') }}</a></li>
        <li><a href="#" class="hover:underline">{{ $t('footer.links.cookie') }}</a></li>
      </ul>
    </div>

    <div class="ms-0 sm:ms-10 text-left sm:text-left">
      <h6 class="text-lg font-semibold mb-3">{{ $t('footer.contactUs') }}</h6>
      <div class="flex gap-x-4 mt-2 rtl:justify-start justify-start">
        <a href="#" class="hover:text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-current">
            <path
              d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724 9.86 9.86 0 0 1-3.127 1.195 4.918 4.918 0 0 0-8.385 4.482A13.965 13.965 0 0 1 1.671 3.149 4.922 4.922 0 0 0 3.195 9.72a4.903 4.903 0 0 1-2.229-.616v.062a4.92 4.92 0 0 0 3.946 4.827 4.996 4.996 0 0 1-2.224.084A4.936 4.936 0 0 0 9.035 17.6 9.868 9.868 0 0 1 0 19.54a13.905 13.905 0 0 0 7.548 2.212c9.142 0 14.307-7.72 13.995-14.646A9.935 9.935 0 0 0 24 4.557z"
            ></path>
          </svg>
        </a>

        <a href="#" class="hover:text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-current">
            <path
              d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zM9 16v-8l8 4-8 4z"
            ></path>
          </svg>
        </a>

        <a href="#" class="hover:text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-current">
            <path
              d="M9 8H6v4h3v12h5V12h3.642l.358-4H14V6.333C14 5.378 14.192 5 15.115 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z"
            ></path>
          </svg>
        </a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterLayout",
};
</script>

<style scoped>
.footer-title {
  font-weight: 600;
  font-size: 1.125rem;
  margin-bottom: 0.75rem;
}
</style>
