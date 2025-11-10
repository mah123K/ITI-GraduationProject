<template>
  <div class="bg-white dark:bg-[#1f2937] dark:text-gray-100 shadow-lg rounded-2xl p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-semibold text-[#5984C6] dark:text-[#8db4ff]">{{ $t('adminDashboard.support.title') }}</h2>
        <p class="text-gray-500 dark:text-gray-300 text-sm">{{ $t('adminDashboard.support.subtitle') }}</p>
      </div>

      <!-- Search -->
      <div class="flex items-center space-x-4">
        <div class="relative">
          <input
            v-model="searchTerm"
            type="text"
            :placeholder="$t('adminDashboard.support.searchPlaceholder')"
            class="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-[#5984C6]"
          />
          <svg
            class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Tickets Table -->
    <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table class="min-w-full text-sm text-gray-700 dark:text-gray-200">
        <thead class="bg-[#5984C6] text-white">
          <tr>
            <th class="py-3 px-4 text-left">{{ $t('adminDashboard.support.name') }}</th>
            <th class="py-3 px-4 text-left">{{ $t('adminDashboard.support.email') }}</th>
            <th class="py-3 px-4 text-left">{{ $t('adminDashboard.support.phone') }}</th>
            <th class="py-3 px-4 text-left">{{ $t('adminDashboard.support.subject') }}</th>
            <th class="py-3 px-4 text-left">{{ $t('adminDashboard.support.ticketDate') }}</th>
            <th class="py-3 px-4 text-left">{{ $t('adminDashboard.support.actions') }}</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="ticket in filteredTickets" :key="ticket.id" class="border-t border-gray-200 dark:border-gray-700 hover:bg-[#f3f9fc] dark:hover:bg-gray-800 transition">
            <td class="py-3 px-4">{{ ticket.name }}</td>
            <td class="py-3 px-4">{{ ticket.email }}</td>
            <td class="py-3 px-4">{{ ticket.phone }}</td>
            <td class="py-3 px-4">{{ ticket.subject }}</td>
            <td class="py-3 px-4">{{ ticket.createdAt?.toDate().toLocaleString() }}</td>
            <td class="py-3 px-4 flex space-x-2">
              <!-- View Message -->
              <button @click="viewMessage(ticket)" class="p-2 rounded-lg text-green-500 hover:bg-green-100 transition" :title="$t('adminDashboard.support.viewMessage')">
                <i class="bi bi-chat-dots"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- VIEW MESSAGE MODAL -->
    <div v-if="showMessageModal" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
  <div class="bg-white dark:bg-[#111827] dark:text-gray-100 rounded-2xl shadow-xl w-full max-w-md p-6 animate-fadeIn relative">
    <button @click="closeMessageModal" class="absolute top-4 right-6 text-gray-500 hover:text-gray-700">✖</button>
    <h3 class="text-2xl font-semibold text-[#5984C6] mb-4">{{ $t('adminDashboard.support.messageContent') }}</h3>
    <div class="text-gray-700 dark:text-gray-300 space-y-2">
      <p class="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg whitespace-pre-wrap">{{ selectedMessage?.message }}</p>
    </div>
    <div class="mt-6 flex justify-end">
      <button @click="closeMessageModal" class="px-4 py-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-100 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">{{ $t('adminDashboard.support.close') }}</button>
    </div>
  </div>
</div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase"; 

// 🔹 Search
const searchTerm = ref("");

// 🔹 Tickets
const tickets = ref([]);

// 🔹 Modal
const showMessageModal = ref(false);
const selectedMessage = ref(null);

// 🔹 Computed filter
const filteredTickets = computed(() =>
  tickets.value.filter((ticket) =>
    [ticket.name, ticket.email, ticket.phone, ticket.subject, ticket.message]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.value.toLowerCase())
  )
);

// 🔹 Actions
const viewMessage = (ticket) => {
  selectedMessage.value = { message: ticket.message };
  showMessageModal.value = true;
};

const closeMessageModal = () => {
  selectedMessage.value = null;
  showMessageModal.value = false;
};

// 🔹 Fetch tickets from Firebase
const fetchTickets = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "feedbacks"));
    tickets.value = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      console.log("Ticket Data:", data);
      return {
        id: doc.id,
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        subject: data.subject || "",
        message: data.message || "",
        createdAt: data.createdAt || null,
      };
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
  }
};

onMounted(() => {
  fetchTickets();
});
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.18s ease-out;
}
</style>
