<template>
  <div class="min-h-screen bg-white-100 flex mt-18">
    <!-- Sidebar -->
    <aside
      class="w-full md:w-1/4 bg-[#ffffff] shadow-2xl p-6 flex flex-col items-center relative border border-gray-300"
    >
      <!-- Profile Image Section -->
      <div class="relative group">
        <img
          :src="tempClient.image"
          alt=""
          class="w-40 h-40 rounded-full object-cover border-4 border-[#5984C6] shadow-xl transition-transform duration-300"
          :class="{ 'group-hover:scale-105 cursor-pointer': isEditing }"
          @click="isEditing && triggerImageUpload"
        />

        <!-- Overlay عند التعديل -->
        <div
          v-if="isEditing"
          class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
          @click="triggerImageUpload"
        >
          <i class="fa-solid fa-camera text-white text-2xl"></i>
        </div>

        <input
          ref="imageInput"
          type="file"
          class="hidden"
          accept="image/*"
          @change="handleImageUpload"
        />
      </div>

      <!-- User Info -->
      <div class="mt-5 text-center">
        <h2 class="text-2xl font-bold text-black">{{ tempClient.name }}</h2>
        <p class="text-black-300 text-sm">{{ tempClient.email }}</p>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col gap-3 mt-6 w-full">
        <button
          v-if="!isEditing"
          @click="startEdit"
          class="bg-accent-color w-full text-white font-semibold py-3 rounded-2xl hover:bg-[#002153] transition duration-300 flex items-center justify-center gap-2 shadow-inner"
        >
          <i class="fa-solid fa-pen-to-square"></i> Edit Profile
        </button>

        <button
          v-if="isEditing"
          @click="saveChanges"
          class="bg-green-500 text-white font-semibold py-3 rounded-2xl hover:bg-[green] transition duration-300 flex items-center justify-center gap-2 shadow-lg"
        >
          <i class="fa-solid fa-check"></i> Save
        </button>

        <button
          v-if="isEditing"
          @click="cancelEdit"
          class="bg-red-500 text-white font-semibold py-3 rounded-2xl hover:bg-[#630000] transition duration-300 flex items-center justify-center gap-2 shadow-lg"
        >
          <i class="fa-solid fa-xmark"></i> Cancel
        </button>
      </div>

      <!-- My Recent Orders -->
      <button
        @click="toggleOrders"
        class="mt-6 w-full bg-[#5984c6] text-white font-semibold py-3 px-6 rounded-2xl hover:bg-[#002153] transition duration-300 flex items-center justify-center gap-2 shadow-inner"
      >
        <i class="fa-solid fa-box"></i>
        {{ showOrders ? "Back to Profile" : "My Recent Orders" }}
      </button>

      <!-- Back Button -->
      <button
        @click="goBack"
        class="mt-6 w-full bg-[#5984c6] text-[#ffffff] font-semibold py-3 px-6 rounded-2xl hover:bg-[#002153] transition duration-300 flex items-center justify-center gap-2 shadow-inner"
      >
        <i class="fa-solid fa-arrow-left"></i> Back
      </button>

      <!-- Background Glow Circle -->
      <div
        class="absolute bottom-0 w-32 h-32 bg-[#5984C6] opacity-20 blur-3xl rounded-full"
      ></div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-8 space-y-8">
      <!-- Orders Section -->
      <!-- Orders Section -->
      <section
        v-if="showOrders"
        class="transition-transform hover:scale-[1.01] duration-300 bg-white/30 backdrop-blur-md shadow-xl rounded-3xl p-6 border border-white/20"
      >
        <h3
          class="text-2xl font-semibold mb-6 text-[#5984C6] flex items-center gap-2"
        >
          <i class="fa-solid fa-box text-[#5984C6]"></i> Recent Orders
        </h3>

        <div class="overflow-y-auto max-h-[500px]">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-[#5984C6] text-white text-left sticky top-0">
                <th class="p-3">Order ID</th>
                <th class="p-3">Date</th>
                <th class="p-3">Status</th>
                <th class="p-3">Total</th>
                <th class="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="order in sortedOrders"
                :key="order.id"
                class="border-b hover:bg-gray-50 transition"
              >
                <td class="p-3 font-semibold text-gray-700">#{{ order.id }}</td>
                <td class="p-3 text-gray-600">{{ order.date }}</td>
                <td class="p-3">
                  <span
                    :class="statusClass(order.status)"
                    class="px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {{ order.status }}
                  </span>
                  <div class="mt-2 h-2 w-full bg-gray-200 rounded-full">
                    <div
                      :style="{ width: progressWidth(order.status) }"
                      class="h-2 rounded-full bg-gradient-to-r from-[#5984C6] to-[#003481] transition-all"
                    ></div>
                  </div>
                </td>
                <td class="p-3 font-medium text-gray-800">
                  ${{ order.total }}
                </td>
                <td class="p-3 text-center">
                  <button
                    @click="openModal(order)"
                    class="bg-[#5984C6] text-white px-3 py-1 rounded-lg hover:bg-[#002c74] transition-all duration-200"
                  >
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-6 text-right text-gray-700 font-semibold">
          Total Delivered Sales:
          <span class="text-[#5984C6]">${{ totalSales }}</span>
        </div>
      </section>

      <!-- Profile Section -->
      <section v-else class="space-y-6">
        <!-- Personal Info Box -->
        <div
          class="bg-white/30 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/20"
        >
          <h3 class="text-2xl font-semibold text-[#5984C6] mb-4">
            Personal Information
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Name -->
            <div>
              <label class="block text-gray-700 font-medium mb-1">
                <i class="fa-solid fa-user mr-2 text-[#5984C6]"></i> Name
              </label>
              <input
                v-model="tempClient.name"
                type="text"
                :disabled="!isEditing"
                class="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#5984C6] focus:outline-none"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-gray-700 font-medium mb-1">
                <i class="fa-solid fa-envelope mr-2 text-[#5984C6]"></i> Email
              </label>
              <input
                v-model="tempClient.email"
                type="email"
                :disabled="!isEditing"
                class="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#5984C6] focus:outline-none"
              />
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-gray-700 font-medium mb-1">
                <i class="fa-solid fa-phone mr-2 text-[#5984C6]"></i> Phone
              </label>
              <input
                v-model="tempClient.phone"
                type="text"
                :disabled="!isEditing"
                class="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#5984C6] focus:outline-none"
              />
            </div>

            <!-- Password -->
            <div>
              <label class="block text-gray-700 font-medium mb-1">
                <i class="fa-solid fa-lock mr-2 text-[#5984C6]"></i> Password
              </label>
              <div class="relative">
                <input
                  v-model="tempClient.password"
                  :type="showPassword ? 'text' : 'password'"
                  :disabled="!isEditing"
                  class="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#5984C6] focus:outline-none"
                />
                <i
                  @click="togglePassword"
                  class="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500"
                  :class="
                    showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'
                  "
                ></i>
              </div>
            </div>

            <!-- Confirm Password -->
            <div>
              <label class="block text-gray-700 font-medium mb-1">
                <i class="fa-solid fa-lock-keyhole mr-2 text-[#5984C6]"></i>
                Confirm Password
              </label>
              <div class="relative">
                <input
                  v-model="tempClient.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  :disabled="!isEditing"
                  class="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#5984C6] focus:outline-none"
                />
                <i
                  @click="toggleConfirmPassword"
                  class="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500"
                  :class="
                    showConfirmPassword
                      ? 'fa-solid fa-eye-slash'
                      : 'fa-solid fa-eye'
                  "
                ></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Location Box -->
        <div
          class="bg-white/30 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/20 flex flex-col md:flex-row gap-6"
        >
          <div class="flex-1 space-y-2">
            <h3 class="text-xl font-semibold text-[#5984C6]">Address</h3>
            <label class="block text-gray-700 font-medium mb-1">Street</label>
            <input
              v-model="tempClient.address.street"
              type="text"
              :disabled="!isEditing"
              class="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#5984C6] focus:outline-none"
            />
            <label class="block text-gray-700 font-medium mb-1">City</label>
            <input
              v-model="tempClient.address.city"
              type="text"
              :disabled="!isEditing"
              class="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#5984C6] focus:outline-none"
            />
            <label class="block text-gray-700 font-medium mb-1">Country</label>
            <input
              v-model="tempClient.address.country"
              type="text"
              :disabled="!isEditing"
              class="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#5984C6] focus:outline-none"
            />
          </div>
          <div
            class="flex-1 h-64 w-full rounded-2xl overflow-hidden border border-white/20 shadow-md"
          >
            <iframe
              :src="mapSrc"
              width="100%"
              height="100%"
              style="border: 0"
              allowfullscreen=""
              loading="lazy"
            >
            </iframe>
          </div>
        </div>
      </section>

      <!-- Order Modal -->
      <transition name="fade">
        <div
          v-if="selectedOrder"
          class="fixed inset-0 bg-[#0000008a] flex items-center justify-center z-50"
        >
          <div
            class="bg-white backdrop-blur-md rounded-3xl shadow-xl w-11/12 md:w-96 p-6 relative border border-white/20"
          >
            <button
              @click="closeModal"
              class="absolute top-3 right-3 text-[blue] hover:text-black transition"
            >
              <i class="fa-solid fa-xmark text-xl"></i>
            </button>
            <h3 class="text-2xl font-bold mb-4">
              Order #{{ selectedOrder.id }}
            </h3>
            <div class="space-y-2">
              <p><strong>Date:</strong> {{ selectedOrder.date }}</p>
              <p><strong>Status:</strong> {{ selectedOrder.status }}</p>
              <p><strong>Total:</strong> ${{ selectedOrder.total }}</p>
              <p>
                <strong>Notes:</strong>
                {{ selectedOrder.notes || "No additional notes." }}
              </p>
            </div>

            <div class="mt-4">
              <div class="h-2 w-full bg-white/20 rounded-full">
                <div
                  :style="{ width: progressWidth(selectedOrder.status) }"
                  class="h-2 rounded-full bg-gradient-to-r from-[#00ffbf] to-[#0066ff] transition-all"
                ></div>
              </div>
            </div>

            <div class="mt-6 flex justify-between items-center gap-2">
              <!-- Previous -->
              <button
                @click="prevOrder"
                class="flex-1 bg-[#5984C6] text-white px-4 py-2 rounded-xl hover:bg-[#003b7e] transition shadow-sm flex items-center justify-center gap-2"
              >
                <i class="fa-solid fa-arrow-left"></i>
              </button>

              <!-- Back to Orders -->
              <button
                @click="closeModal"
                class="flex-1 text-white px-4 py-2 rounded-xl shadow-md flex items-center justify-center gap-2 bg-[#f00000] hover:bg-[#570000]"
              >
                <i class="fa-solid fa-rotate-left"></i>
              </button>

              <!-- Next -->
              <button
                @click="nextOrder"
                class="flex-1 bg-[#5984C6] text-white px-4 py-2 rounded-xl hover:bg-[#003b7e] transition shadow-sm flex items-center justify-center gap-2"
              >
                <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const isEditing = ref(false);
const showOrders = ref(false);
const selectedOrder = ref(null);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const togglePassword = () => showPassword.value = !showPassword.value;
const toggleConfirmPassword = () => showConfirmPassword.value = !showConfirmPassword.value;

// جلب البيانات من localStorage إذا موجودة
const storedClient = localStorage.getItem("clientData");
const client = ref(storedClient ? JSON.parse(storedClient) : {
  name: "Ahmed El Sharkawi",
  email: "ahmed@example.com",
  phone: "+20 123 456 789",
  image: "https://via.placeholder.com/150",
  address: {
    street: "123 Nile St.",
    city: "Cairo",
    country: "Egypt",
    lat: 30.0444,
    lng: 31.2357
  },
  orders: [
    { id: 1020, date: "2025-09-01", status: "Delivered", total: 120, notes: "Delivered on time" },
    { id: 1021, date: "2025-09-03", status: "Pending", total: 210, notes: "" },
    { id: 1022, date: "2025-09-05", status: "Cancelled", total: 99, notes: "Customer canceled" },
    { id: 1023, date: "2025-09-07", status: "Delivered", total: 340, notes: "Left at door" },
    { id: 1024, date: "2025-09-10", status: "Pending", total: 180, notes: "" },
    { id: 1025, date: "2025-09-12", status: "Delivered", total: 250, notes: "" },
    { id: 1026, date: "2025-09-15", status: "Delivered", total: 400, notes: "Signature required" },
    { id: 1027, date: "2025-09-18", status: "Pending", total: 150, notes: "" },
    { id: 1028, date: "2025-09-20", status: "Cancelled", total: 80, notes: "Customer canceled" },
    { id: 1029, date: "2025-09-22", status: "Delivered", total: 320, notes: "" },
    { id: 1030, date: "2025-09-25", status: "Delivered", total: 270, notes: "" },
    { id: 1031, date: "2025-09-28", status: "Pending", total: 190, notes: "" },
    { id: 1032, date: "2025-10-01", status: "Delivered", total: 350, notes: "Left at reception" },
    { id: 1033, date: "2025-10-03", status: "Cancelled", total: 90, notes: "Customer canceled" },
    { id: 1034, date: "2025-10-05", status: "Delivered", total: 340, notes: "Left at door" },
    { id: 1035, date: "2025-10-07", status: "Pending", total: 210, notes: "" },
    { id: 1036, date: "2025-10-10", status: "Delivered", total: 260, notes: "" },
    { id: 1037, date: "2025-10-12", status: "Pending", total: 180, notes: "" },
    { id: 1038, date: "2025-10-15", status: "Delivered", total: 390, notes: "Signature required" },
    { id: 1039, date: "2025-10-18", status: "Cancelled", total: 100, notes: "Customer canceled" }
  ]
});

// نسخة مؤقتة للتعديل
const tempClient = ref(JSON.parse(JSON.stringify(client.value)));

const startEdit = () => {
  tempClient.value = JSON.parse(JSON.stringify(client.value));
  isEditing.value = true;
}

const saveChanges = () => {
  // تحقق من الباسورد
  if (tempClient.value.password !== tempClient.value.confirmPassword) {
    alert("Passwords do not match!");
    return; // تمنع الحفظ إذا لم تتطابق
  }

  // حفظ البيانات
  client.value = JSON.parse(JSON.stringify(tempClient.value));

  // حفظ البيانات في localStorage
  localStorage.setItem("clientData", JSON.stringify(client.value));

  isEditing.value = false;
}

const cancelEdit = () => {
  tempClient.value = JSON.parse(JSON.stringify(client.value));
  isEditing.value = false;
}

const toggleOrders = () => showOrders.value = !showOrders.value;
const goBack = () => showOrders.value = false;

// عرض كل الأوردرات بدون اقتصار
const sortedOrders = computed(() => {
  return [...client.value.orders].sort((a,b) => new Date(b.date) - new Date(a.date));
});



const totalSales = computed(() => client.value.orders.filter(o => o.status === 'Delivered').reduce((sum,o)=>sum+o.total,0));

const statusClass = (status) => {
  if(status==='Delivered') return 'bg-green-100 text-green-700';
  if(status==='Pending') return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
}

const progressWidth = (status) => {
  if(status==='Pending') return '33%';
  if(status==='Delivered') return '100%';
  return '0%';
}

const nextOrder = () => {
  const idx = client.value.orders.findIndex(o=>o.id===selectedOrder.value.id);
  selectedOrder.value = client.value.orders[(idx+1)%client.value.orders.length];
}
const prevOrder = () => {
  const idx = client.value.orders.findIndex(o=>o.id===selectedOrder.value.id);
  selectedOrder.value = client.value.orders[(idx-1+client.value.orders.length)%client.value.orders.length];
}

const openModal = (order) => selectedOrder.value = order;
const closeModal = () => selectedOrder.value = null;

// Image upload
const imageInput = ref(null);
const triggerImageUpload = () => {
  if(isEditing.value) imageInput.value.click(); // فقط في وضع التعديل
}
const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = ev => tempClient.value.image = ev.target.result;
    reader.readAsDataURL(file);
  }
}

// Map source computed
const mapSrc = computed(() => {
  const { street, city, country, lat, lng } = tempClient.value.address;

  if (lat && lng) {
    return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  } else {
    const address = encodeURIComponent(`${street}, ${city}, ${country}`);
    return `https://maps.google.com/maps?q=${address}&z=15&output=embed`;
  }
});

</script>



<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>