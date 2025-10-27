<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { defineProps, defineEmits } from "vue";

// Props and Emits
const props = defineProps({
  active: { type: String, default: "orders" },
});
const emit = defineEmits(["changeTab"]);

const handleTabClick = (tabName) => {
  emit("changeTab", tabName);
};

// ✅ Router instance (needed for navigation)
const router = useRouter();

// ✅ Technician name reactive variable
const technicianName = ref("Technician");

// ✅ Logout function
const handleLogout = async () => {
  const auth = getAuth();
  try {
    await signOut(auth);
    router.push("/login");
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

// ✅ Fetch technician name from Firestore on mount
onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const docRef = doc(db, "technicians", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          technicianName.value = docSnap.data().name || "Technician";
        }
      } catch (error) {
        console.error("Error fetching technician data:", error);
      }
    }
  });
});
</script>


<template>
  <div
    class="navigationAside w-[20%] h-screen bg-[#133B5D] flex flex-col items-center text-white fixed"
  >
    <div class="navContents p-3 flex justify-between">
      <img src="../images/white logo.png" class="w-[200px]" alt="Logo" />
    </div>

    <div class="profileImgContainer flex flex-col items-center mb-2">
      <img src="../images/Ellipse 56.png" class="w-[90px]" alt="Technician photo" />
      <p class="text-lg">{{ technicianName }}</p>
    </div>

    <p class="text-2xl font-semibold">My Earnings:</p>
    <p class="text-2xl mb-4">4530 EGP</p>

    <div class="navList text-center">
      <ul class="flex flex-col items-center justify-between h-[350px] m-5">
        <li
          class="text-lg font-semibold p-1 rounded-xl my-1 w-[180px] cursor-pointer transition-colors"
          :class="
            ['requests', 'upcoming', 'completed', 'orders'].includes(props.active)
              ? 'bg-[#1b5383]'
              : 'bg-[#133B5D]'
          "
          @click="handleTabClick('orders')"
        >
          Orders
        </li>
        <li
          class="text-lg font-semibold p-1 rounded-xl my-1 w-[180px] cursor-pointer transition-colors"
          :class="props.active === 'appointments' ? 'bg-[#1b5383]' : 'bg-[#133B5D]'"
          @click="handleTabClick('appointments')"
        >
          Appointments
        </li>
        <li
          class="text-lg font-semibold p-1 rounded-xl my-1 w-[180px] cursor-pointer"
          :class="props.active === 'services' ? 'bg-[#1b5383]' : 'bg-[#133B5D]'"
          @click="handleTabClick('services')"
        >
          My Services
        </li>

        <li
          class="text-lg font-semibold p-1 rounded-xl my-1 w-[180px] cursor-pointer"
          :class="props.active === 'earnings' ? 'bg-[#1b5383]' : 'bg-[#133B5D]'"
          @click="handleTabClick('earnings')"
        >
          My Earnings
        </li>
        <li 
        class="text-lg font-semibold bg-[#133B5D] p-1 rounded-xl my-1 w-[180px] cursor-pointer"
        :class="props.active === 'Techsettings' ? 'bg-[#1b5383]' : 'bg-[#133B5D]'"
          @click="handleTabClick('Techsettings')"
        >Settings</li>

        <li :class="{'active': active === 'chat'}" @click="$emit('changeTab', 'chat')" class="cursor-pointer text-lg font-semibold p-1 rounded-xl my-1 w-[180px]">
        <i class="fa-solid fa-comments"></i> Chat
      </li>
        <button @click="handleLogout" class="border rounded-xl p-2 px-3 mt-4 cursor-pointer">Log Out</button>
      </ul>
    </div>
  </div>
</template>
