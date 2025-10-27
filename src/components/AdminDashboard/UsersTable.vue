<template>
  <div class="bg-white shadow-lg rounded-2xl p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-[#5984C6]">Client Management</h2>

      <!-- Search -->
      <div class="relative">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search for clients..."
          class="border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-[#5984C6]"
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
    <div v-if="loading" class="text-center py-6 text-gray-400">
      Loading clients...
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto rounded-lg border border-gray-200">
      <table class="min-w-full text-sm text-gray-700">
        <thead class="bg-[#5984C6] text-white">
          <tr>
            <th class="py-3 px-4 text-left">Name</th>
            <th class="py-3 px-4 text-left">Phone</th>
            <th class="py-3 px-4 text-left">Address</th>
            <th class="py-3 px-4 text-left">Email</th>
            <th class="py-3 px-4 text-left">Status</th>
            <th class="py-3 px-4 text-left">Created</th>
            <th class="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="client in filteredClients"
            :key="client.uid"
            class="border-t hover:bg-[#f3f9fc] transition"
          >
            <td class="py-3 px-6">{{ client.name || "No name" }}</td>
            <td class="py-3 px-6">{{ client.phone || "-" }}</td>
            <td class="py-3 px-2">
              {{
                typeof client.address === "object"
                  ? client.address.city ||
                    Object.values(client.address)
                      .filter((v) => typeof v === "string" && v.length === 1)
                      .join("") ||
                    "-"
                  : client.address || "-"
              }}
            </td>
            <td class="py-3 px-6">{{ client.email }}</td>
            <td class="py-3 px-6">
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
                {{
                  client.status === "banned"
                    ? "Suspended"
                    : client.status === "pending"
                    ? "Pending"
                    : "Active"
                }}
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
              >
                <i class="bi bi-eye"></i>
              </button>
              <div class="h-3 border-l border-gray-300"></div>
              <button
                v-if="client.status !== 'banned'"
                @click="openModal('ban', client)"
                class="p-2 text-red-500 hover:bg-orange-100 rounded-lg"
              >
                <i class="bi bi-slash-circle"></i>
              </button>
              <button
                v-else
                @click="openModal('reactivate', client)"
                class="p-2 text-green-500 hover:bg-green-100 rounded-lg"
              >
                <i class="bi bi-check-circle"></i>
              </button>
              <div class="h-3 border-l border-gray-300"></div>
              <button
                @click="openModal('delete', client)"
                class="p-2 text-red-500 hover:bg-red-100 rounded-lg"
              >
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div
        v-if="filteredClients.length === 0"
        class="text-center py-6 text-gray-500"
      >
        No clients found.
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
        class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-fadeIn"
      >
        <h3 class="text-xl font-semibold text-red-600 mb-4">Delete User</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete
          "<strong>{{ selectedClient?.name }}</strong>"?
        </p>
        <div class="flex justify-center space-x-4">
          <button
            @click="confirmAction"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
          <button
            @click="closeModal"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- Suspend Modal -->
      <div
        v-else-if="modalType === 'ban'"
        class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-fadeIn"
      >
        <h3 class="text-xl font-semibold text-red-600 mb-4">Suspend User</h3>
        <p class="text-gray-600 mb-6">
          Suspend "<strong>{{ selectedClient?.name }}</strong>" temporarily?
        </p>
        <div class="flex justify-center space-x-4">
          <button
            @click="confirmAction"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Suspend
          </button>
          <button
            @click="closeModal"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- Reactivate Modal -->
      <div
        v-else-if="modalType === 'reactivate'"
        class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-fadeIn"
      >
        <h3 class="text-xl font-semibold text-green-600 mb-4">
          Reactivate User
        </h3>
        <p class="text-gray-600 mb-6">
          Reactivate "<strong>{{ selectedClient?.name }}</strong>"?
        </p>
        <div class="flex justify-center space-x-4">
          <button
            @click="confirmAction"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Reactivate
          </button>
          <button
            @click="closeModal"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- View Modal -->
      <div
        v-else-if="modalType === 'view'"
        class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-fadeIn"
      >
        <h3 class="text-xl font-semibold text-[#5984C6] mb-4">
          Client Details
        </h3>
        <div class="text-gray-700 text-sm space-y-2 text-left">
          <p><strong>Name:</strong> {{ selectedClient?.name || "-" }}</p>
          <p><strong>Email:</strong> {{ selectedClient?.email }}</p>
          <p><strong>Phone:</strong> {{ selectedClient?.phone || "-" }}</p>
          <p><strong>Address:</strong> {{ selectedClient?.address || "-" }}</p>
          <p><strong>Status:</strong> {{ selectedClient?.status }}</p>
        </div>
        <div class="flex justify-center mt-6">
          <button
            @click="closeModal"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Close
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
  const term = searchTerm.value.toLowerCase();
  return clients.value.filter(
    (c) =>
      (c.name || "").toLowerCase().includes(term) ||
      (c.email || "").toLowerCase().includes(term) ||
      (c.phone || "").toLowerCase().includes(term) ||
      (c.address || "").toLowerCase().includes(term)
  );
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
</script>
