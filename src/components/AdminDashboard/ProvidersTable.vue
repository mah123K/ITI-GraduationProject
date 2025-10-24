<template>
  <div class="bg-white shadow-lg rounded-2xl p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-[#5984C6]">Provider Management</h2>

      <!-- Search -->
      <div class="flex items-center space-x-4">
        <div class="relative">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search for a provider..."
            class="border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-[#5984C6]"
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

    <!-- Tabs -->
    <div class="flex border-b border-gray-200 mb-6">
      <button
        @click="activeTab = 'company'"
        :class="[
          'px-6 py-3 text-lg font-medium border-b-2',
          activeTab === 'company'
            ? 'border-[#5984C6] text-[#5984C6]'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
        ]"
      >
        Company
      </button>
      <button
        @click="activeTab = 'craftsmen'"
        :class="[
          'px-6 py-3 text-lg font-medium border-b-2',
          activeTab === 'craftsmen'
            ? 'border-[#5984C6] text-[#5984C6]'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
        ]"
      >
        Craftsmen
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-6 text-gray-400">
      Loading {{ activeTab === 'company' ? 'companies' : 'craftsmen' }}...
    </div>

    <!-- Companies Table -->
    <div v-else-if="activeTab === 'company'" class="overflow-x-auto rounded-lg border border-gray-200">
      <h3 class="text-xl font-semibold text-gray-800 mb-4 p-4">All Companies</h3>
      <table class="min-w-full text-sm text-gray-700">
        <thead class="bg-[#5984C6] text-white">
          <tr>
            <th class="py-3 px-4 text-left">Company Name</th>
            <th class="py-3 px-4 text-left">Email</th>
            <th class="py-3 px-4 text-left">Phone</th>
            <th class="py-3 px-4 text-left">Address</th>
            <th class="py-3 px-4 text-left">Status</th>
            <th class="py-3 px-4 text-left ">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="company in filteredCompanies"
            :key="company.id"
            class="border-t hover:bg-gray-50 transition"
          >
            <td class="py-3 px-4">{{ company.name }}</td>
            <td class="py-3 px-4">{{ company.email }}</td>
            <td class="py-3 px-4">{{ company.phone || '-' }}</td>
            <td class="py-3 px-4">{{ company.address || '-' }}</td>
            <td class="py-3 px-4">
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-semibold',
                  company.status === 'banned'
                    ? 'bg-red-100 text-red-600'
                    : company.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-green-100 text-green-600',
                ]"
              >
                {{ company.status || 'active' }}
              </span>
            </td>
            <td class="py-3 px-4 flex space-x-2">
              <button @click="viewProvider(company)" class="p-2 rounded-lg text-blue-500 hover:bg-blue-100 transition">
                <i class="bi bi-eye"></i>
              </button>
              <div class="h-3 border-l border-gray-300 mt-3"></div>
              <button @click="openEditModal(company)" class="p-2 rounded-lg text-yellow-500 hover:bg-yellow-100 transition">
                <i class="bi bi-pencil"></i>
              </button>
              <div class="h-3 border-l border-gray-300 mt-3"></div>
              <button
                v-if="company.status !== 'banned'"
                @click="openSuspendModal(company)"
                class="p-2 rounded-lg text-red-500 hover:bg-orange-100 transition"
              >
                <i class="bi bi-slash-circle"></i>
              </button>
              <button
                v-else
                @click="openReactivateModal(company)"
                class="p-2 rounded-lg text-green-500 hover:bg-green-100 transition"
              >
                <i class="bi bi-check-circle"></i>
              </button>
              <div class="h-3 border-l border-gray-300 mt-3"></div>
              <button @click="openDeleteModal(company)" class="p-2 rounded-lg text-red-500 hover:bg-red-100 transition">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Craftsmen Table -->
    <div v-else class="overflow-x-auto rounded-lg border border-gray-200">
      <h3 class="text-xl font-semibold text-gray-800 mb-4 p-4">All Craftsmen</h3>
      <table class="min-w-full text-sm text-gray-700">
        <thead class="bg-[#5984C6] text-white">
          <tr>
            <th class="py-3 px-4 text-left">Name</th>
            <th class="py-3 px-4 text-left">Email</th>
            <th class="py-3 px-4 text-left">Phone</th>
            <th class="py-3 px-4 text-left">Address</th>
            <th class="py-3 px-4 text-left">Skill</th>
            <th class="py-3 px-4 text-left">Rating</th>
            <th class="py-3 px-4 text-left">Status</th>
            <th class="py-3 px-4  text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="craft in filteredCraftsmen"
            :key="craft.id"
            class="border-t hover:bg-gray-50 transition"
          >
            <td class="py-3 px-4">{{ craft.name }}</td>
            <td class="py-3 px-4">{{ craft.email }}</td>
            <td class="py-3 px-4">{{ craft.phone || '-' }}</td>
            <td class="py-3 px-4">{{ craft.address || '-' }}</td>
            <td class="py-3 px-4">{{ craft.skill || '-' }}</td>
            <td class="py-3 px-4 flex items-center space-x-1">
              <span>{{ craft.rating ?? 0 }}</span>
              <i class="bi bi-star-fill text-yellow-400"></i>
            </td>
            <td class="py-3 px-4">
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-semibold',
                  craft.status === 'banned'
                    ? 'bg-red-100 text-red-600'
                    : craft.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-green-100 text-green-600',
                ]"
              >
                {{ craft.status || 'active' }}
              </span>
            </td>
            <td class="py-3 px-4 flex space-x-2">
              <button @click="viewProvider(craft)" class="p-2 rounded-lg text-blue-500 hover:bg-blue-100 transition">
                <i class="bi bi-eye"></i>
              </button>
              <div class="h-3 border-l border-gray-300 mt-3"></div>
              <button @click="openEditModal(craft)" class="p-2 rounded-lg text-yellow-500 hover:bg-yellow-100 transition">
                <i class="bi bi-pencil"></i>
              </button>
              <div class="h-3 border-l border-gray-300 mt-3"></div>
              <button
                v-if="craft.status !== 'banned'"
                @click="openSuspendModal(craft)"
                class="p-2 rounded-lg text-red-500 hover:bg-orange-100 transition"
              >
                <i class="bi bi-slash-circle"></i>
              </button>
              <button
                v-else
                @click="openReactivateModal(craft)"
                class="p-2 rounded-lg text-green-500 hover:bg-green-100 transition"
              >
                <i class="bi bi-check-circle"></i>
              </button>
              <div class="h-3 border-l border-gray-300 mt-3"></div>
              <button @click="openDeleteModal(craft)" class="p-2 rounded-lg text-red-500 hover:bg-red-100 transition">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- CONFIRMATION MODALS -->
    <div v-if="showDeleteModal || showSuspendModal || showReactivateModal"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">

      <!-- Delete Modal -->
      <div v-if="showDeleteModal" class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-fadeIn">
        <h3 class="text-xl font-semibold text-red-600 mb-4">Delete Provider</h3>
        <p class="text-gray-600 mb-6">Are you sure you want to delete "<strong>{{ selectedActionProvider?.name }}</strong>"?</p>
        <div class="flex justify-center space-x-4">
          <button @click="confirmDelete" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
          <button @click="closeModals" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Cancel</button>
        </div>
      </div>

      <!-- Suspend Modal -->
      <div v-if="showSuspendModal" class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-fadeIn">
        <h3 class="text-xl font-semibold  text-red-600 mb-4">Suspend Provider</h3>
        <p class="text-gray-600 mb-6">Suspend "<strong>{{ selectedActionProvider?.name }}</strong>" temporarily?</p>
        <div class="flex justify-center space-x-4">
          <button @click="confirmSuspend" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-600">Suspend</button>
          <button @click="closeModals" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Cancel</button>
        </div>
      </div>

      <!-- Reactivate Modal -->
      <div v-if="showReactivateModal" class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-fadeIn">
        <h3 class="text-xl font-semibold text-green-600 mb-4">Reactivate Provider</h3>
        <p class="text-gray-600 mb-6">Reactivate "<strong>{{ selectedActionProvider?.name }}</strong>"?</p>
        <div class="flex justify-center space-x-4">
          <button @click="confirmReactivate" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Reactivate</button>
          <button @click="closeModals" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Cancel</button>
        </div>
      </div>
    </div>

    <!-- VIEW MODAL -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fadeIn">
        <button @click="closeViewModal" class="absolute top-4 right-6 text-gray-500 hover:text-gray-700">✖</button>
        <h3 class="text-2xl font-semibold text-[#5984C6] mb-4">Provider Details</h3>
        <div class="space-y-2 text-gray-700">
          <p><strong>Name:</strong> {{ selectedProvider?.name }}</p>
          <p><strong>Email:</strong> {{ selectedProvider?.email }}</p>
          <p><strong>Phone:</strong> {{ selectedProvider?.phone || '-' }}</p>
          <p><strong>Address:</strong> {{ selectedProvider?.address || '-' }}</p>
          <p><strong>Status:</strong>
            <span :class="[
                'px-2 py-1 rounded text-xs font-semibold',
                selectedProvider?.status === 'banned' ? 'bg-red-100 text-red-600'
                : selectedProvider?.status === 'pending' ? 'bg-yellow-100 text-yellow-600'
                : 'bg-green-100 text-green-600'
              ]">
              {{ selectedProvider?.status || 'active' }}
            </span>
          </p>
          <p><strong>Created At:</strong> {{ selectedProvider?.createdAt || '-' }}</p>
          <p v-if="selectedProvider?.skill"><strong>Skill:</strong> {{ selectedProvider.skill }}</p>
          <p v-if="selectedProvider?.rating !== undefined"><strong>Rating:</strong> {{ selectedProvider.rating }}</p>
        </div>
      </div>
    </div>

    <!-- EDIT MODAL -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fadeIn">
        <button @click="closeEditModal" class="absolute top-4 right-6 text-gray-500 hover:text-gray-700">✖</button>
        <h3 class="text-2xl font-semibold text-[#5984C6] mb-4">Edit Provider</h3>
        <form @submit.prevent="saveProviderChanges" class="space-y-4">
          <div>
            <label class="block mb-1 font-medium text-gray-700">Name</label>
            <input v-model="editForm.name" type="text" class="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#5984C6]"/>
          </div>
          <div>
            <label class="block mb-1 font-medium text-gray-700">Email</label>
            <input v-model="editForm.email" type="email" class="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#5984C6]"/>
          </div>
          <div>
            <label class="block mb-1 font-medium text-gray-700">Phone</label>
            <input v-model="editForm.phone" type="text" class="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#5984C6]"/>
          </div>
          <div>
            <label class="block mb-1 font-medium text-gray-700">Address</label>
            <input v-model="editForm.address" type="text" class="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#5984C6]"/>
          </div>
          <div>
            <label class="block mb-1 font-medium text-gray-700">Status</label>
            <select v-model="editForm.status" class="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#5984C6]">
              <option value="active">Active</option>
              <option value="banned">Banned</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <button type="submit" class="w-full bg-[#5984C6] text-white py-2 rounded-lg hover:bg-[#4968a0] transition">Save Changes</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { db } from "../../firebase/firebase";
import { collection, onSnapshot, doc, updateDoc, deleteDoc, getDocs } from "firebase/firestore";

/* STATE */
const route = useRoute();
const searchTerm = ref("");
const activeTab = ref("company");
const loading = ref(true);

const companies = ref([]);
const craftsmen = ref([]);
const filteredTechnicians = ref([]);

const showDeleteModal = ref(false);
const showSuspendModal = ref(false);
const showReactivateModal = ref(false);
const selectedActionProvider = ref(null);

const showViewModal = ref(false);
const showEditModal = ref(false);
const selectedProvider = ref(null);
const editForm = reactive({
  name: "",
  email: "",
  phone: "",
  address: "",
  status: "active",
});

/* FETCH PROVIDERS */
const fetchProviders = async () => {
  loading.value = true;
  try {
    const providersRef = collection(db, "technicians");
    const snapshot = await getDocs(providersRef);
    const allProviders = [];
    snapshot.forEach((d) => allProviders.push({ id: d.id, ...d.data() }));

    const selectedCategory = route.query.category;

    // 🟢 الشرط الجديد
    if (selectedCategory) {
      if (selectedCategory.toLowerCase() === "finishing") {
        // لو Finishing → اعرض الشركات فقط
        craftsmen.value = [];
        filteredTechnicians.value = [];
        activeTab.value = "company";
      } else {
        // لو Plumbing / Electrical / Carpentry → اعرض الفنيين فقط اللي skill بتاعتهم متوافقة
        filteredTechnicians.value = allProviders.filter(
          (p) =>
            p.skill &&
            p.skill.toLowerCase() === selectedCategory.toLowerCase()
        );
        companies.value = [];
        activeTab.value = "craftsmen";
      }
    } else {
      // لو مفيش category → اعرض الكل (شركات + فنيين)
      filteredTechnicians.value = allProviders;
      activeTab.value = "company"; // أو اختياري حسب اللي تحبي يظهر أولاً
    }
  } catch (error) {
    console.error("Error fetching providers:", error);
  } finally {
    loading.value = false;
  }
};


/* COMPANIES LISTENER */
onMounted(() => {
  const unsubCompanies = onSnapshot(
    collection(db, "companies"),
    (snap) => {
      const list = [];
      snap.forEach((d) => {
        const data = d.data() || {};
        list.push({
          id: d.id,
          userType: "company",
          name: data.name || data.companyName || "",
          email: data.email || data.contact || "",
          phone: data.phone || "",
          address: data.address || "",
          status: data.status || "active",
          createdAt: data.createdAt || "",
          ...data,
        });
      });
      companies.value = list;
    },
    (err) => console.error(err)
  );

  fetchProviders();
});
/* TECHNICIANS REAL-TIME LISTENER */
onMounted(() => {
  const unsubTechnicians = onSnapshot(
    collection(db, "technicians"),
    (snap) => {
      const allProviders = [];
      snap.forEach((d) => allProviders.push({ id: d.id, ...d.data() }));

      const selectedCategory = route.query.category;

      if (selectedCategory) {
        if (selectedCategory.toLowerCase() === "finishing") {
          // لو Finishing → اعرض الشركات فقط
          filteredTechnicians.value = [];
          activeTab.value = "company";
        } else {
          // لو Plumbing / Electrical / Carpentry → اعرض الفنيين فقط اللي skill بتاعتهم متوافقة
          filteredTechnicians.value = allProviders.filter(
            (p) =>
              p.skill &&
              p.skill.toLowerCase() === selectedCategory.toLowerCase()
          );
          activeTab.value = "craftsmen";
        }
      } else {
        // لو مفيش category → اعرض كل الفنيين
        filteredTechnicians.value = allProviders;
      }

      loading.value = false;
    },
    (err) => console.error("Error listening to technicians:", err)
  );

  // تنظيف الاشتراك لما الصفحة تتقفل
  return () => unsubTechnicians();
});


watch(
  () => route.query.category,
  () => fetchProviders()
);

/* COMPUTED FILTERS */
const filteredCompanies = computed(() =>
  companies.value.filter((c) =>
    [c.name, c.email, c.phone, c.address].join(" ").toLowerCase().includes(searchTerm.value.toLowerCase())
  )
);

const filteredCraftsmen = computed(() =>
  filteredTechnicians.value.filter((c) =>
    [c.name, c.email, c.phone, c.address].join(" ").toLowerCase().includes(searchTerm.value.toLowerCase())
  )
);

/* ACTIONS */
const getCollectionName = (provider) => {
  if (provider.userType) return provider.userType === "company" ? "companies" : "technicians";
  if (provider.skill) return "technicians"; // ✅ إضافة
  return "companies";
};


const openDeleteModal = (p) => { selectedActionProvider.value = p; showDeleteModal.value = true; };
const openSuspendModal = (p) => { selectedActionProvider.value = p; showSuspendModal.value = true; };
const openReactivateModal = (p) => { selectedActionProvider.value = p; showReactivateModal.value = true; };
const closeModals = () => { showDeleteModal.value = false; showSuspendModal.value = false; showReactivateModal.value = false; selectedActionProvider.value = null; };

const confirmDelete = async () => {
  if (!selectedActionProvider.value) return;
  try { await deleteDoc(doc(db, getCollectionName(selectedActionProvider.value), selectedActionProvider.value.id)); }
  catch (err) { console.error(err); }
  finally { closeModals(); }
};

const confirmSuspend = async () => {
  if (!selectedActionProvider.value) return;
  try { await updateDoc(doc(db, getCollectionName(selectedActionProvider.value), selectedActionProvider.value.id), { status: "banned" }); }
  catch (err) { console.error(err); }
  finally { closeModals(); }
};

const confirmReactivate = async () => {
  if (!selectedActionProvider.value) return;
  try { await updateDoc(doc(db, getCollectionName(selectedActionProvider.value), selectedActionProvider.value.id), { status: "active" }); }
  catch (err) { console.error(err); }
  finally { closeModals(); }
};

/* VIEW & EDIT */
const viewProvider = (provider) => { selectedProvider.value = provider; showViewModal.value = true; };
const closeViewModal = () => { showViewModal.value = false; selectedProvider.value = null; };

const openEditModal = (provider) => {
  selectedProvider.value = provider;
  editForm.name = provider.name || "";
  editForm.email = provider.email || "";
  editForm.phone = provider.phone || "";
  editForm.address = provider.address || "";
  editForm.status = provider.status || "active";
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  selectedProvider.value = null;
  editForm.name = ""; editForm.email = ""; editForm.phone = ""; editForm.address = ""; editForm.status = "active";
};

const saveProviderChanges = async () => {
  if (!selectedProvider.value) return;
  try {
    await updateDoc(doc(db, getCollectionName(selectedProvider.value), selectedProvider.value.id), {
      name: editForm.name,
      companyName: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      address: editForm.address,
      status: editForm.status,
    });
    closeEditModal();
  } catch (err) { console.error(err); }
};
</script>

<style scoped>
.animate-fadeIn { animation: fadeIn 0.2s ease-in-out; }
@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
</style>
