<template>
  <div class="bg-white shadow-lg rounded-2xl p-6">
    <!-- Section Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-[#5984C6]">Order Management</h2>
      <p class="text-gray-600">Track and manage all service orders</p>
    </div>

    <!-- Title + Search + Filter -->
    <div class="flex justify-between items-center mb-4 px-4">
      <h3 class="text-xl font-semibold text-gray-800">All Orders</h3>

      <div class="flex items-center gap-3">
        <!-- Search Input (smaller) -->
        <div class="relative w-60">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
            class="w-full py-2 pl-9 pr-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5984C6]"
          />
          <i class="bi bi-search absolute left-3 top-2.5 text-gray-500 text-sm"></i>
        </div>

        <!-- Filter Dropdown -->
        <div class="relative">
          <button
            @click="toggleFilter"
            class="flex items-center gap-2 bg-[#1E293B] text-white px-4 py-2 rounded-lg hover:bg-[#334155] transition text-sm"
          >
            <i class="bi bi-funnel"></i>
            Filter
          </button>

          <!-- Filter Menu -->
          <div
            v-if="showFilter"
            class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
          >
            <ul>
              <li
                v-for="option in statusOptions"
                :key="option"
                @click="filterStatus = option; showFilter = false"
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {{ option }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Orders Table -->
    <table class="min-w-full text-sm text-gray-700">
      <thead class="bg-[#5984C6] text-white">
        <tr>
          <th class="py-3 px-4 text-left">Order ID</th>
          <th class="py-3 px-4 text-left">Customer</th>
          <th class="py-3 px-4 text-left">Service</th>
          <th class="py-3 px-4 text-left">Provider</th>
          <th class="py-3 px-4 text-left">Amount</th>
          <th class="py-3 px-4 text-left">Date</th>
     
          <th class="py-3 px-4 text-left">Status</th>
          <th class="py-3 px-4 text-left">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="order in filteredOrders"
          :key="order.id"
          class="border-t hover:bg-[#f3f9fc] transition"
        >
          <td class="py-3 px-4">{{ order.id }}</td>
          <td class="py-3 px-4">{{ order.customer }}</td>
          <td class="py-3 px-4">{{ order.service }}</td>
          <td class="py-3 px-4">{{ order.provider }}</td>
          <td class="py-3 px-4 font-semibold">{{ order.amount }}EGP</td>
        <td class="py-3 px-4">
  <div class="flex flex-col">
    <span class="text-gray-700 font-medium">{{ order.date }}</span>
    <span class="text-gray-500 text-xs">{{ order.time }}</span>
  </div>
</td>

         
         <td class="py-3 px-4">
  <span
    :class="[
      'px-3 py-1 rounded-full text-xs font-semibold',
      order.status === 'completed'
        ? 'bg-green-100 text-green-700'
        : order.status === 'unconfirmed'
        ? 'bg-amber-100 text-amber-700'
        : order.status === 'upcoming'
        ? 'bg-sky-100 text-sky-700'
        : order.status === 'new'
        ? 'bg-indigo-100 text-indigo-700'
        : 'bg-rose-100 text-rose-700',
    ]"
  >
    {{ order.status }}
  </span>
</td>

          
          <td class="py-3 px-4 flex space-x-2">
            <button
              @click="openModal('view', order)"
              class="p-2 rounded-lg text-blue-500 hover:bg-blue-100 transition"
            >
              <i class="bi bi-eye"></i>
            </button>
            <div class="h-3 border-l border-gray-300 mt-3"></div>

            <button
              @click="openModal('edit', order)"
              class="p-2 rounded-lg text-yellow-500 hover:bg-yellow-100 transition"
            >
              <i class="bi bi-pencil"></i>
            </button>
            <div class="h-3 border-l border-gray-300 mt-3"></div>

            <button
              @click="openModal('delete', order)"
              class="p-2 rounded-lg text-red-500 hover:bg-red-100 transition"
            >
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
     <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
    >
      <div class="bg-white w-96 rounded-xl shadow-xl p-6 relative">
        <!-- Close button -->
        <button
          @click="closeModal"
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <i class="bi bi-x-lg"></i>
        </button>

        <!-- Dynamic Modal Title -->
        <h3 class="text-lg font-semibold text-[#5984C6] mb-4">
          {{ modalType === 'view'
            ? 'View Order Details'
            : modalType === 'edit'
            ? 'Edit Order'
            : 'Delete Confirmation' }}
        </h3>

        <!-- View (read-only) or Edit Form -->
        <div v-if="modalType === 'view'" class="space-y-3">
          <div class="grid grid-cols-1 gap-2">
            <div>
              <div class="text-sm text-gray-500">Order ID</div>
              <div class="font-medium text-gray-800">{{ selectedOrder.id }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">Customer</div>
              <div class="font-medium text-gray-800">{{ selectedOrder.customer }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">Service</div>
              <div class="font-medium text-gray-800">{{ selectedOrder.service }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">Provider</div>
              <div class="font-medium text-gray-800">{{ selectedOrder.provider }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">Amount</div>
              <div class="font-medium text-gray-800">{{ selectedOrder.amount }}EGP</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">Date & Time</div>
              <div class="font-medium text-gray-800">{{ selectedOrder.date }} <span class="text-gray-500 text-xs">{{ selectedOrder.time }}</span></div>
            </div>
            <div>
              <div class="text-sm text-gray-500">Status</div>
              <div>
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    selectedOrder.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : selectedOrder.status === 'unconfirmed'
                      ? 'bg-amber-100 text-amber-700'
                      : selectedOrder.status === 'upcoming'
                      ? 'bg-sky-100 text-sky-700'
                      : selectedOrder.status === 'new'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-rose-100 text-rose-700',
                  ]"
                >
                  {{ selectedOrder.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="modalType === 'edit'" class="space-y-3">
          <div>
            <label class="text-sm font-medium text-gray-600">Customer</label>
            <input
              v-model="selectedOrder.customer"
              class="w-full p-2 border rounded-lg text-sm"
            />
          </div>

          <div>
            <label class="text-sm font-medium text-gray-600">Service</label>
            <input
              v-model="selectedOrder.service"
              class="w-full p-2 border rounded-lg text-sm"
            />
          </div>

          <div>
            <label class="text-sm font-medium text-gray-600">Provider</label>
            <input
              v-model="selectedOrder.provider"
              class="w-full p-2 border rounded-lg text-sm"
            />
          </div>

          <div>
            <label class="text-sm font-medium text-gray-600">Amount</label>
            <input
              v-model="selectedOrder.amount"
              class="w-full p-2 border rounded-lg text-sm"
            />
          </div>

         <div>
            <label class="text-sm font-medium text-gray-600">Status</label>
            <select
              v-model="selectedOrder.status"
              class="w-full p-2 border rounded-lg text-sm bg-white"
            >
              <option v-for="status in statusOptions" :key="status" :value="status.toLowerCase()">
                {{ status }}
              </option>
            </select>
          </div>

          <div class="flex justify-end mt-4">
            <button
              @click="saveChanges"
              class="bg-[#5984C6] text-white px-4 py-2 rounded-lg hover:bg-[#4369a4] transition text-sm"
            >
              Save Changes
            </button>
          </div>
        </div>

        <!-- Delete Confirmation -->
        <div v-else class="text-center">
          <p class="text-gray-600 mb-4">
            Are you sure you want to delete this order?
          </p>
          <div class="flex justify-center gap-3">
            <button
              @click="confirmDelete"
              class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm"
            >
              Delete
            </button>
            <button
              @click="closeModal"
              class="bg-gray-200 px-4 py-2 rounded-lg text-sm hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { ref, computed, onMounted } from "vue";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default {
  setup() {
    const orders = ref([]);
    const searchQuery = ref("");
    const filterStatus = ref("All");
    const showFilter = ref(false);
    const showModal = ref(false);
    const modalType = ref("");
    const selectedOrder = ref({});

   const statusOptions = ['All', 'completed', 'unconfirmed', 'upcoming', 'new']

    
    const fetchOrders = async () => {
      const snapshot = await getDocs(collection(db, "orders"));
      orders.value = snapshot.docs.map((docItem) => {
        const data = docItem.data();
        return {
          id: docItem.id,
          customer: data.clientName,
          service: data.description,
          provider: data.technicianName,
          amount: data.price,
          date: data.appointmentDate.toDate().toLocaleDateString(),
          time: data.appointmentDate.toDate().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: data.status,
        };
      });
    };

    onMounted(fetchOrders);

    const filteredOrders = computed(() => {
      return orders.value.filter((order) => {
        const matchesSearch =
          order.customer.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          order.service.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          order.provider.toLowerCase().includes(searchQuery.value.toLowerCase());

        const matchesStatus =
          filterStatus.value === "All" || order.status === filterStatus.value;

        return matchesSearch && matchesStatus;
      });
    });

    const toggleFilter = () => (showFilter.value = !showFilter.value);

   
    const openModal = (type, order) => {
      modalType.value = type;
      selectedOrder.value = { ...order };
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
    };

   
    const saveChanges = async () => {
      try {
        const orderRef = doc(db, "orders", selectedOrder.value.id);
        await updateDoc(orderRef, {
          clientName: selectedOrder.value.customer,
          description: selectedOrder.value.service,
          technicianName: selectedOrder.value.provider,
          price: selectedOrder.value.amount,
          status: selectedOrder.value.status,
        });


        const index = orders.value.findIndex(
          (o) => o.id === selectedOrder.value.id
        );
        if (index !== -1) {
          orders.value[index] = { ...selectedOrder.value };
        }

        closeModal();
      } catch (error) {
        console.error("Error updating order:", error);
      }
    };

   
    const confirmDelete = async () => {
      try {
        const orderRef = doc(db, "orders", selectedOrder.value.id);
        await deleteDoc(orderRef);

        orders.value = orders.value.filter(
          (o) => o.id !== selectedOrder.value.id
        );

        closeModal();
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    };

    return {
      orders,
      filteredOrders,
      searchQuery,
      filterStatus,
      showFilter,
      showModal,
      modalType,
      selectedOrder,
      statusOptions,
      toggleFilter,
      openModal,
      closeModal,
      saveChanges,
      confirmDelete,
    };
  },
};

</script>
