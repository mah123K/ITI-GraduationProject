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
const totalEarnings = computed(() =>
  orders.value.reduce((sum, order) => {
    const price = parseFloat(order.price);
    return sum + (isNaN(price) ? 0 : price);
  }, 0)
);

onMounted(async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    technicianId.value = user.uid;

    // load technician info
    const docRef = doc(db, "technicians", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      technician.value = docSnap.data();
    }

    // listen for live orders for total earnings
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("technicianId", "==", user.uid));
    onSnapshot(q, (snapshot) => {
      orders.value = snapshot.docs.map((d) => d.data());
    });

    // 🔒 منع الرجوع لصفحة اللوجين بعد الدخول
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", () => {
      window.history.pushState(null, "", window.location.href);
    });
  }
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
    class="fixed left-0 top-0 h-full w-[20%] bg-[#133B5D] text-white flex flex-col items-center py-6 justify-between"
  >
    <div class="flex flex-col items-center w-full">
      <img
        src="../images/white logo.png"
        alt=""
        class="w-[200px] mb-6"
      />

      <div class="flex flex-col items-center mb-6">
        <img
          :src="technician.image || '/images/default-tech.png'"
          alt=""
          class="w-[100px] h-[100px] rounded-full border-4 border-white shadow-md mb-3 object-cover"
        />
        <p class="text-lg font-semibold">{{ technician.name || 'Technician' }}</p>

        <div class="mt-3 text-center">
          <p class="text-sm opacity-80 font-medium">My Earnings:</p>
<p class="text-xl font-bold">{{ totalEarnings?.toLocaleString?.() || 0 }} EGP</p>
        </div>
      </div>

      <nav class="flex flex-col w-full mt-2 space-y-2">
        <button
          @click="emit('changeTab', 'orders')"
          :class="[props.active === 'orders' ? 'bg-[#1b5383] text-white' : 'text-gray-300 hover:bg-[#1b5383]/60']"
          class="cursor-pointer py-3 text-lg font-semibold rounded-xl w-[90%] mx-auto transition"
        >
          📋 Orders
        </button>

        <button
          @click="emit('changeTab', 'appointments')"
          :class="[props.active === 'appointments' ? 'bg-[#1b5383] text-white' : 'text-gray-300 hover:bg-[#1b5383]/60']"
          class="cursor-pointer py-3 text-lg font-semibold rounded-xl w-[90%] mx-auto transition"
        >
          🗓 Appointments
        </button>

        <button
          @click="emit('changeTab', 'services')"
          :class="[props.active === 'services' ? 'bg-[#1b5383] text-white' : 'text-gray-300 hover:bg-[#1b5383]/60']"
          class="cursor-pointer py-3 text-lg font-semibold rounded-xl w-[90%] mx-auto transition"
        >
          🧰 My Services
        </button>

        <button
          @click="emit('changeTab', 'earnings')"
          :class="[props.active === 'earnings' ? 'bg-[#1b5383] text-white' : 'text-gray-300 hover:bg-[#1b5383]/60']"
          class="cursor-pointer py-3 text-lg font-semibold rounded-xl w-[90%] mx-auto transition"
        >
          💰 My Earnings
        </button>

        <button
          @click="emit('changeTab', 'Techsettings')"
          :class="[props.active === 'Techsettings' ? 'bg-[#1b5383] text-white' : 'text-gray-300 hover:bg-[#1b5383]/60']"
          class="cursor-pointer py-3 text-lg font-semibold rounded-xl w-[90%] mx-auto transition"
        >
          ⚙️ Settings
        </button>

        <button
          @click="emit('changeTab', 'chat')"
          :class="[props.active === 'chat' ? 'bg-[#1b5383] text-white' : 'text-gray-300 hover:bg-[#1b5383]/60']"
          class="cursor-pointer flex items-center justify-center gap-2 py-3 text-lg font-semibold rounded-xl w-[90%] mx-auto transition"
        >
          <i class="fa-solid fa-comments text-xl"></i>
          Chat
        </button>
      </nav>
    </div>

    <div class="w-full flex flex-col items-center space-y-4 mt-6 sticky bottom-6">
      <button
        @click="handleLogout"
        class="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-xl w-[80%] transition shadow-md"
      >
        Log Out
      </button>
    </div>
  </div>
</template>

<style scoped>
button {
  transition: all 0.3s ease;
}
</style>
