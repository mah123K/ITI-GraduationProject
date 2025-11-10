<template>
  <div class="bg-white dark:bg-[#1f2937] dark:text-gray-100 shadow-lg rounded-2xl p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-[#5984C6] dark:text-[#8db4ff]">{{ $t('adminDashboard.users.title') }}</h2>

      <!-- Search -->
      <div class="relative">
        <input
          v-model="searchTerm"
          type="text"
          :placeholder="$t('adminDashboard.users.searchPlaceholder')"
          class="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-[#5984C6]"
        />
        <svg
          class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-6 text-gray-400 dark:text-gray-300">
      {{ $t('adminDashboard.users.loading') }}
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table class="min-w-full text-sm text-gray-700 dark:text-gray-200">
        <thead class="bg-[#5984C6] text-white">
          <tr>
            <th class="py-3 px-4 text-left">{{ $t('adminDashboard.users.profile') }}</th>
            <th class="py-3 px-4 text-left">{{ $t('adminDashboard.users.name') }}</th>
            <th class="py-3 px-4 text-left">{{ $t('adminDashboard.users.phone') }}</th>
            <th class="py-3 px-4 text-left">{{ $t('adminDashboard.users.address') }}</th>
            <th class="py-3 px-12 text-left">{{ $t('adminDashboard.users.email') }}</th>
            <th class="py-3 px-4 text-left">{{ $t('adminDashboard.users.status') }}</th>
            <th class="py-3 px-4 text-left">
              <button @click="toggleSort('createdAt')" class="flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                {{ $t('adminDashboard.users.created') }}
                <svg v-if="sortKey === 'createdAt'" :class="['w-4 h-4 transition-transform', sortOrder === 'asc' ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                </svg>
              </button>
            </th>
            <th class="py-3 px-8 text-left">{{ $t('adminDashboard.users.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="client in filteredClients"
            :key="client.uid"
            class="border-t border-gray-200 dark:border-gray-700 hover:bg-[#f3f9fc] dark:hover:bg-gray-800 transition"
          >
          <td class="py-3 px-6">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-full overflow-hidden bg-[#e8f0fe] dark:bg-gray-700 flex-shrink-0">
                  <img :src="getUserImage(client) || defaultAvatar" alt="avatar" class="h-full w-full object-cover" @error="onUserImgError" />
                </div>
               
              </div>
            </td>
            <td class="py-3 px-6">{{ client.name || $t('adminDashboard.users.noName') }}</td>
            <td class="py-3 px-6">{{ client.phone || "-" }}</td>
            <td class="py-3 px-8">{{ formatClientAddress(client) }}</td>
            <td class="py-3 px-2">{{ client.email }}</td>
            <td class="py-3 px-4">
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-semibold',
                  client.status === 'banned'
                    ? 'bg-red-100 text-red-600'
                    : client.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-green-100 text-green-600',
                ]"
              >
                {{ $t(`adminDashboard.users.${client.status || 'active'}`) }}
              </span>
            </td>
            <td class="py-3 px-4">
              {{
                client.createdAt
                  ? new Date(client.createdAt).toLocaleDateString()
                  : "-"
              }}
            </td>
            <td class="py-3 px-3 flex items-center gap-2">
              <button
                @click="openModal('view', client)"
                class="p-2 text-blue-500 hover:bg-blue-100 rounded-lg"
                :title="$t('adminDashboard.users.view')"
              >
                <i class="bi bi-eye"></i>
              </button>
              <div class="h-3 border-l border-gray-300"></div>
              <button
                v-if="client.status !== 'banned'"
                @click="openModal('ban', client)"
                class="p-2 text-red-500 hover:bg-orange-100 rounded-lg"
                :title="$t('adminDashboard.users.suspend')"
              >
                <i class="bi bi-slash-circle"></i>
              </button>
              <button
                v-else
                @click="openModal('reactivate', client)"
                class="p-2 text-green-500 hover:bg-green-100 rounded-lg"
                :title="$t('adminDashboard.users.reactivate')"
              >
                <i class="bi bi-check-circle"></i>
              </button>
              <div class="h-3 border-l border-gray-300"></div>
              <button
                @click="openModal('delete', client)"
                class="p-2 text-red-500 hover:bg-red-100 rounded-lg"
                :title="$t('adminDashboard.users.delete')"
              >
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div
        v-if="filteredClients.length === 0"
        class="text-center py-6 text-gray-500 dark:text-gray-300"
      >
        {{ $t('adminDashboard.users.noClientsYet') }}
      </div>
    </div>

    <!-- CONFIRMATION MODALS (Styled like Provider) -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <!-- Delete Modal -->
      <div
        v-if="modalType === 'delete'"
        class="bg-white dark:bg-[#111827] dark:text-gray-100 rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-fadeIn"
      >
        <h3 class="text-xl font-semibold text-red-600 mb-4">{{ $t('adminDashboard.users.deleteUser') }}</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          {{ $t('adminDashboard.users.confirmDelete') }} "<strong>{{ selectedClient?.name }}</strong>"?
        </p>
        <div class="flex justify-center space-x-4">
          <button
            @click="confirmAction"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            {{ $t('adminDashboard.users.delete') }}
          </button>
          <button
            @click="closeModal"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {{ $t('adminDashboard.users.cancel') }}
          </button>
        </div>
      </div>

      <!-- Suspend Modal -->
      <div
        v-else-if="modalType === 'ban'"
        class="bg-white dark:bg-[#111827] dark:text-gray-100 rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-fadeIn"
      >
        <h3 class="text-xl font-semibold text-red-600 mb-4">{{ $t('adminDashboard.users.suspendUser') }}</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          {{ $t('adminDashboard.users.confirmSuspend') }} "<strong>{{ selectedClient?.name }}</strong>"?
        </p>
        <div class="flex justify-center space-x-4">
          <button
            @click="confirmAction"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            {{ $t('adminDashboard.users.suspend') }}
          </button>
          <button
            @click="closeModal"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {{ $t('adminDashboard.users.cancel') }}
          </button>
        </div>
      </div>

      <!-- Reactivate Modal -->
      <div
        v-else-if="modalType === 'reactivate'"
        class="bg-white dark:bg-[#111827] dark:text-gray-100 rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-fadeIn"
      >
        <h3 class="text-xl font-semibold text-green-600 mb-4">
          {{ $t('adminDashboard.users.reactivateUser') }}
        </h3>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          {{ $t('adminDashboard.users.confirmReactivate') }} "<strong>{{ selectedClient?.name }}</strong>"?
        </p>
        <div class="flex justify-center space-x-4">
          <button
            @click="confirmAction"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            {{ $t('adminDashboard.users.reactivate') }}
          </button>
          <button
            @click="closeModal"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {{ $t('adminDashboard.users.cancel') }}
          </button>
        </div>
      </div>

      <!-- View Modal -->
      <div
        v-else-if="modalType === 'view'"
        class="bg-white dark:bg-[#111827] dark:text-gray-100 rounded-2xl shadow-xl w-full max-w-md p-6 animate-fadeIn"
      >
        <div class="flex items-center gap-4 mb-4">
          <div class="h-14 w-14 rounded-full bg-[#e8f0fe] dark:bg-gray-800 flex items-center justify-center overflow-hidden text-[#5984C6] text-lg font-semibold">
            <img :src="getUserImage(selectedClient) || defaultAvatar" alt="avatar" class="h-full w-full object-cover" @error="onUserImgError" />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-2xl font-semibold text-[#5984C6] truncate">{{ selectedClient?.name || $t('adminDashboard.users.client') }}</h3>
            <div class="mt-1">
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-semibold',
                  selectedClient?.status === 'banned'
                    ? 'bg-red-100 text-red-600'
                    : selectedClient?.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-green-100 text-green-600',
                ]"
              >
                {{ $t(`adminDashboard.users.${selectedClient?.status || 'active'}`) }}
              </span>
            </div>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate"><i class="bi bi-geo-alt-fill mr-1"></i>{{ formatClientAddress(selectedClient) }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300 text-sm">
          <div>
            <p class="text-gray-500 dark:text-gray-400">{{ $t('adminDashboard.users.email') }}</p>
            <p class="font-medium break-all">{{ selectedClient?.email || '-' }}</p>
          </div>
          <div>
            <p class="text-gray-500 dark:text-gray-400">{{ $t('adminDashboard.users.phone') }}</p>
            <p class="font-medium">{{ selectedClient?.phone || '-' }}</p>
          </div>
          <div class="sm:col-span-2">
            <p class="text-gray-500 dark:text-gray-400">{{ $t('adminDashboard.users.address') }}</p>
            <p class="font-medium wrap-break-word">{{ formatClientAddress(selectedClient) }}</p>
          </div>
          <div>
            <p class="text-gray-500 dark:text-gray-400">{{ $t('adminDashboard.users.created') }}</p>
            <p class="font-medium">{{ selectedClient?.createdAt ? new Date(selectedClient.createdAt).toLocaleString() : '-' }}</p>
          </div>
        </div>

        <div class="flex justify-end mt-6">
          <button
            @click="closeModal"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {{ $t('adminDashboard.users.close') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { db } from "../../firebase/firebase";
import { collection, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore";

const clients = ref([]);
const loading = ref(true);
const searchTerm = ref("");
const showModal = ref(false);
const modalType = ref("");
const selectedClient = ref(null);
const sortKey = ref("createdAt");
const sortOrder = ref("desc");

// Fetch clients
onMounted(() => {
  onSnapshot(
    collection(db, "clients"),
    (snapshot) => {
      clients.value = snapshot.docs.map((docItem) => ({
        uid: docItem.id,
        ...docItem.data(),
        status: docItem.data().status || "active",
      }));
      loading.value = false;
    },
    (error) => {
      console.error("Error fetching clients:", error);
      loading.value = false;
    }
  );
});

const filteredClients = computed(() => {
  const term = (searchTerm.value || "").trim().toLowerCase();
  let filtered = clients.value;
  if (term) {
    filtered = clients.value.filter((c) => {
      const haystack = [
        c.name,
        c.email,
        c.phone,
        formatClientAddress(c),
        c.status,
      ]
        .map((v) => (v ?? "").toString().toLowerCase())
        .join(" ");
      return haystack.includes(term);
    });
  }
  // Sort the filtered results
  return filtered.sort((a, b) => {
    let aVal = a[sortKey.value];
    let bVal = b[sortKey.value];
    if (sortKey.value === "createdAt") {
      aVal = aVal ? new Date(aVal).getTime() : 0;
      bVal = bVal ? new Date(bVal).getTime() : 0;
    } else {
      aVal = (aVal ?? "").toString().toLowerCase();
      bVal = (bVal ?? "").toString().toLowerCase();
    }
    if (sortOrder.value === "asc") {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    }
  });
});

// Open/Close Modal
const openModal = (type, client) => {
  modalType.value = type;
  selectedClient.value = client;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  modalType.value = "";
  selectedClient.value = null;
};

// Toggle Sort
const toggleSort = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortOrder.value = "desc";
  }
};

// Confirm Actions
const confirmAction = async () => {
  if (!selectedClient.value) return;
  const clientRef = doc(db, "clients", selectedClient.value.uid);

  try {
    if (modalType.value === "delete") {
      await deleteDoc(clientRef);
    } else if (modalType.value === "ban") {
      await updateDoc(clientRef, { status: "banned" });
    } else if (modalType.value === "reactivate") {
      await updateDoc(clientRef, { status: "active" });
    }
  } catch (error) {
    console.error("Error performing action:", error);
  } finally {
    closeModal();
  }
};

// Helpers for view modal UI
const defaultAvatar = 'data:image/svg+xml;utf8,\
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">\
  <circle cx="32" cy="32" r="32" fill="%23e5e7eb"/>\
  <circle cx="32" cy="24" r="12" fill="%239ca3af"/>\
  <path d="M12 54c4-10 12-16 20-16s16 6 20 16" fill="%239ca3af"/>\
</svg>';
const getUserImage = (u) => u?.profileImage || u?.photoURL || u?.avatar || u?.image || '';
const onUserImgError = (e) => { if (e && e.target) e.target.src = defaultAvatar; };
const formatClientAddress = (c) => {
  if (!c) return '-';
  const addr = c.address;
  const parts = [];
  if (addr && typeof addr === 'object') {
    if (addr.street) parts.push(addr.street);
    if (addr.city) parts.push(addr.city);
    if (addr.country) parts.push(addr.country);
  } else if (typeof addr === 'string' && addr.trim()) {
    parts.push(addr.trim());
  }
  return parts.length ? parts.join(', ') : '-';
};
</script>
