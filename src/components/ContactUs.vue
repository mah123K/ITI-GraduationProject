<template>
  <div class="contact-page flex flex-col items-center text-center font-sans pt-18">
    <div class="w-full h-[300px] overflow-hidden">
      <img
        src="../images/Rectangle 55.png"
        alt="Contact support team"
        class="w-full h-full object-cover"
      />
    </div>

    <section class="my-2 px-6 md:px-20 w-full max-w-5xl">
      <h2 class="main-header">{{ $t('contactUs.header.title') }}</h2>
      <p class="text-gray-600 mb-8">{{ $t('contactUs.header.subtitle') }}</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="rounded-2xl shadow-lg p-6 flex items-center justify-between h-30 bg-[#f5f5f5] hover:scale-102 transition-transform duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="w-[40px] h-[40px]">
            <path fill="#5984c6" d="M0 188.6C0 84.4 86 0 192 0S384 84.4 384 188.6c0 119.3-120.2 262.3-170.4 316.8-11.8 12.8-31.5 12.8-43.3 0-50.2-54.5-170.4-197.5-170.4-316.8zM192 256a64 64 0 1 0 0-128 64 64 0 1 0 0 128z"/>
          </svg>
          <div class="flex flex-col text-left rtl:text-right">
            <h3 class="font-semibold text-lg text-gray-800">{{ $t('contactUs.info.addressTitle') }}</h3>
            <p class="text-gray-600 mt-1">{{ $t('contactUs.info.addressText') }}</p>
          </div>
        </div>

        <div class="rounded-2xl shadow-lg p-6 flex items-center justify-between h-30 bg-[#f5f5f5] hover:scale-102 transition-transform duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 510 512" class="w-[40px] h-[40px]">
            <path fill="#5984c6" d="M160.2 25C152.3 6.1 131.7-3.9 112.1 1.4l-5.5 1.5c-64.6 17.6-119.8 80.2-103.7 156.4 37.1 175 174.8 312.7 349.8 349.8 76.3 16.2 138.8-39.1 156.4-103.7l1.5-5.5c5.4-19.7-4.7-40.3-23.5-48.1l-97.3-40.5c-16.5-6.9-35.6-2.1-47 11.8l-38.6 47.2C233.9 335.4 177.3 277 144.8 205.3L189 169.3c13.9-11.3 18.6-30.4 11.8-47L160.2 25z"/>
          </svg>
          <div class="flex flex-col text-left rtl:text-right">
            <h3 class="font-semibold text-lg text-gray-800">{{ $t('contactUs.info.phoneTitle') }}</h3>
            <p class="text-gray-600 mt-1">{{ $t('contactUs.info.phoneText') }}</p>
          </div>
        </div>

        <div class="rounded-2xl shadow-lg p-6 flex items-center justify-between h-30 bg-[#f5f5f5] hover:scale-102 transition-transform duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 510 512" class="w-[40px] h-[40px]">
            <path fill="#5984c6" d="M48 64c-26.5 0-48 21.5-48 48 0 15.1 7.1 29.3 19.2 38.4l208 156c17.1 12.8 40.5 12.8 57.6 0l208-156c12.1-9.1 19.2-23.3 19.2-38.4 0-26.5-21.5-48-48-48L48 64zM0 196L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-188-198.4 148.8c-34.1 25.6-81.1 25.6-115.2 0L0 196z"/>
          </svg>
          <div class="flex flex-col text-left rtl:text-right">
            <h3 class="font-semibold text-lg text-gray-800">{{ $t('contactUs.info.emailTitle') }}</h3>
            <p class="text-gray-600 mt-1">{{ $t('contactUs.info.emailText') }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="my-8 w-full max-w-3xl px-6">
      <h2 class="main-header">{{ $t('contactUs.form.title') }}</h2>

      <div v-if="successMessage" class="mt-4 p-3 rounded-lg bg-green-100 text-green-700">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="mt-4 p-3 rounded-lg bg-red-100 text-red-700">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="submitFeedback" class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input v-model="name" type="text" :placeholder="$t('contactUs.form.placeholderName')" class="rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5984C6] rtl:text-right" />
        <input v-model="email" type="email" :placeholder="$t('contactUs.form.placeholderEmail')" class="rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5984C6] rtl:text-right" />
        <input v-model="phone" type="text" :placeholder="$t('contactUs.form.placeholderPhone')" class="rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5984C6] rtl:text-right" />
        <input v-model="subject" type="text" :placeholder="$t('contactUs.form.placeholderSubject')" class="rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5984C6] rtl:text-right" />
        <textarea v-model="message" :placeholder="$t('contactUs.form.placeholderMessage')" rows="5" class="md:col-span-2 rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5984C6] rtl:text-right"></textarea>

        <div class="md:col-span-2 flex justify-center">
          <button type="submit" class="w-30 bg-[#5984C6] text-white text-[22px] py-3 rounded-[20px] hover:bg-[#4b72ac] transition-all">
            {{ $t('contactUs.form.submitButton') }}
          </button>
        </div>

    
      </form>
    </section>

    <section class="w-full max-w-5xl px-6 mb-12">
      <iframe
        class="w-full h-[300px] rounded-2xl border-0 shadow-lg"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3457.249656742979!2d31.214939375448027!3d30.043851881885697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14584cfd1b4c6c4d%3A0x8dbcf0a8e7968f74!2sGiza!5e0!3m2!1sen!2seg!4v1700000000000!5m2!1sen!2seg"
        allowfullscreen
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </section>
  </div>
</template>


<style scoped>
</style>
<script setup>
import { ref } from "vue";
import { db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useI18n } from "vue-i18n"; // 1. Import useI18n

defineOptions({
  name: "ContactUs",
});

// 2. Initialize the 't' function
const { t } = useI18n(); 

// 🔹 Reactive form data
const name = ref("");
const email = ref("");
const phone = ref("");
const subject = ref("");
const message = ref("");

// 3. Define the missing reactive variables
const successMessage = ref("");
const errorMessage = ref("");

// 🔹 Submit feedback function
const submitFeedback = async () => {
  if (!name.value || !email.value || !message.value) {
    // 4. Use the 't' function for messages
    errorMessage.value = t('contactUs.form.errorRequired');
    successMessage.value = "";
    return;
  }

  try {
    await addDoc(collection(db, "feedbacks"), {
      name: name.value,
      email: email.value,
      phone: phone.value,
      subject: subject.value,
      message: message.value,
      createdAt: serverTimestamp(),
    });

    successMessage.value = t('contactUs.form.success');
    errorMessage.value = "";

    // Reset form
    name.value = "";
    email.value = "";
    phone.value = "";
    subject.value = "";
    message.value = "";
  } catch (err) {
    console.error(err);
    errorMessage.value = t('contactUs.form.errorGeneral');
  }
};
</script>