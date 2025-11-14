<script setup>
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { db } from "@/firebase/firebase";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";

const props = defineProps({
  active: String,
});

const emit = defineEmits(["changeTab"]);

const router = useRouter();

const technician = ref({ name: "", earnings: 0, image: "" });
const technicianId = ref(null);
const orders = ref([]);
// 🔹 Calculate total and monthly earnings dynamically
const totalEarnings = computed(() => {
  return orders.value
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + (parseFloat(o.price) || 0), 0);
});


const isDark = ref(false);

const applyTheme = (mode) => {
  isDark.value = mode === 'dark';
  document.documentElement.classList.toggle('dark', isDark.value);
};

const toggleDarkMode = () => {
  const next = isDark.value ? 'light' : 'dark';
  applyTheme(next);
  try {
    localStorage.setItem('theme', next);
  } catch (e) {
    // ignore
  }
};


onMounted(async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    technicianId.value = user.uid;

    const docRef = doc(db, "technicians", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      technician.value = docSnap.data();
    }

    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("technicianId", "==", user.uid));
    onSnapshot(q, (snapshot) => {
      orders.value = snapshot.docs.map((d) => d.data());
    });

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", () => {
      window.history.pushState(null, "", window.location.href);
    });
  }
    window.addEventListener("profile-updated", (event) => {
    if (event.detail?.image) {
      technician.value.profileImage = event.detail.image;
    }
  });
});



const handleLogout = async () => {
  try {
    const auth = getAuth();
    await signOut(auth);
    router.push("/");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
</script>

<template>
  <div
    class="fixed left-0 top-0 h-full w-[20%] bg-[#133B5D] text-white flex flex-col items-center py-4 overflow-hidden"
  >
    <!-- Wrapper with flexible content & scroll if needed -->
    <div class="flex flex-col justify-between h-full w-full overflow-hidden">
      <!-- Scrollable content -->
      <div class="flex flex-col items-center w-full flex-1 overflow-y-auto pb-4">
        <div class="flex flex-col items-center shrink-0">
          <img
            src="../images/white logo.png"
            alt="logo"
            class="w-[140px] "
          />

          <div class="flex flex-col items-center ">
            <img
              :src="technician.profileImage || '/images/default-tech.png'"
              alt=""
              class="w-[80px] h-[80px] rounded-full border-4 border-white shadow-md mb-2 object-cover"
            />
            <p class="text-base font-semibold">{{ technician.name || 'Technician' }}</p>

            <div class="mt-2 text-center">
              <p class="text-sm opacity-80 font-medium">My Earnings:</p>
              <p class="text-lg font-bold">{{ totalEarnings?.toLocaleString?.() || 0 }} EGP</p>
            </div>

            <button @click="toggleDarkMode" class="cursor-pointer m-1" :title="isDark ? 'Light mode' : 'Dark mode'">
              <i v-if="isDark" class="fa-solid fa-sun text-yellow-400 text-xl"></i>
              <i v-else class="fa-solid fa-moon text-xl" :style="{ color: 'WHITE' }"></i>
            </button>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex flex-col w-full space-y-1 px-2">
          <button
            @click="emit('changeTab', 'orders')"
            :class="[props.active === 'orders' ? 'bg-[#1b5383]' : 'hover:bg-[#1b5383]/60']"
            class="flex items-center gap-2 py-3 rounded-xl w-[88%] mx-auto transition p-3 font-semibold text-[16px]"
          >
            <i class="fa-solid fa-clipboard-list text-white text-lg"></i>
            Orders
          </button>

          <button
            @click="emit('changeTab', 'appointments')"
            :class="[props.active === 'appointments' ? 'bg-[#1b5383]' : 'hover:bg-[#1b5383]/60']"
            class="flex items-center gap-2 py-3 rounded-xl w-[88%] mx-auto transition p-3 font-semibold text-[16px]"
          >
            <i class="fa-solid fa-calendar-days text-white text-lg"></i>
            Appointments
          </button>

          <button
            @click="emit('changeTab', 'services')"
            :class="[props.active === 'services' ? 'bg-[#1b5383]' : 'hover:bg-[#1b5383]/60']"
            class="flex items-center gap-2 py-3 rounded-xl w-[88%] mx-auto transition p-3 font-semibold text-[16px]"
          >
            <i class="fa-solid fa-screwdriver-wrench text-white text-lg"></i>
            My Services
          </button>

          <button
            @click="emit('changeTab', 'workGallery')"
            :class="[props.active === 'workGallery' ? 'bg-[#1b5383]' : 'hover:bg-[#1b5383]/60']"
            class="flex items-center gap-2 py-3 rounded-xl w-[88%] mx-auto transition p-3 font-semibold text-[16px]"
          >
            <i class="fa-solid fa-image text-white text-lg"></i>
            Work Gallery
          </button>

          <button
            @click="emit('changeTab', 'earnings')"
            :class="[props.active === 'earnings' ? 'bg-[#1b5383]' : 'hover:bg-[#1b5383]/60']"
            class="flex items-center gap-2 py-3 rounded-xl w-[88%] mx-auto transition p-3 font-semibold text-[16px]"
          >
            <i class="fa-solid fa-coins text-white text-lg"></i>
            My Earnings
          </button>

          <button
            @click="emit('changeTab', 'chat')"
            :class="[props.active === 'chat' ? 'bg-[#1b5383]' : 'hover:bg-[#1b5383]/60']"
            class="flex items-center gap-2 py-3 rounded-xl w-[88%] mx-auto transition p-3 font-semibold text-[16px]"
          >
            <i class="fa-solid fa-comments text-white text-lg"></i>
            Chat
          </button>

          <button
            @click="emit('changeTab', 'Techsettings')"
            :class="[props.active === 'Techsettings' ? 'bg-[#1b5383]' : 'hover:bg-[#1b5383]/60']"
            class="flex items-center gap-2 py-3 rounded-xl w-[88%] mx-auto transition p-3 font-semibold text-[16px]"
          >
            <i class="fa-solid fa-gear text-white text-lg"></i>
            Settings
          </button>
        </nav>
      </div>

      <!-- Logout always visible -->
      <div class="w-full flex flex-col items-center mt-auto mb-2 shrink-0">
        <button
          @click="handleLogout"
          class="cursor-pointer border hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-xl w-[88%] transition shadow-md text-[16px] flex items-center justify-center gap-2"
        >
          <i class="fa-solid fa-right-from-bracket text-white text-lg"></i>
          Log Out
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
button {
  transition: all 0.3s ease;
}
</style>

