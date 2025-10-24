<template>
  <div class="dashboard grid grid-cols-4 gap-6 p-6 justify-center items-center">
    <!-- Users Card -->
    <div class="card bg-white p-6 shadow-xl rounded-3xl flex flex-col items-center justify-center h-48">
      <div class="icon-circle bg-blue-100 text-blue-500 mb-4">
        <i class="bi bi-people-fill text-3xl"></i>
      </div>
      <p class="text-gray-500 text-lg font-medium">Total Users</p>
      <p class="text-3xl font-bold">{{ totalUsers }}</p>
    </div>

    <!-- Companies Card -->
    <div class="card bg-white p-6 shadow-xl rounded-3xl flex flex-col items-center justify-center h-48">
      <div class="icon-circle bg-green-100 text-green-500 mb-4">
        <i class="bi bi-building text-3xl"></i>
      </div>
      <p class="text-gray-500 text-lg font-medium">Total Companies</p>
      <p class="text-3xl font-bold">{{ totalCompanies }}</p>
    </div>

    <!-- Craftsmen Card -->
    <div class="card bg-white p-6 shadow-xl rounded-3xl flex flex-col items-center justify-center h-48">
      <div class="icon-circle bg-yellow-100 text-yellow-500 mb-4">
        <i class="bi bi-hammer text-3xl"></i>
      </div>
      <p class="text-gray-500 text-lg font-medium">Total Craftsmen</p>
      <p class="text-3xl font-bold">{{ totalCraftsmen }}</p>
    </div>

    <!-- Orders Card -->
    <div class="card bg-white p-6 shadow-xl rounded-3xl flex flex-col items-center justify-center h-48">
      <div class="icon-circle bg-red-100 text-red-500 mb-4">
        <i class="bi bi-cart-fill text-3xl"></i>
      </div>
      <p class="text-gray-500 text-lg font-medium">Total Orders</p>
      <p class="text-3xl font-bold">{{ totalOrders }}</p>
    </div>
  </div>
</template>

<style scoped>
.card:hover {
  transform: translateY(-5px);
  transition: all 0.3s ease;
}

.icon-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
</style>



<script>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default {
  setup() {
    const totalUsers = ref(0);
    const totalCompanies = ref(0);
    const totalCraftsmen = ref(0);
    const totalOrders = ref(0);

    const fetchData = async () => {
      const usersSnapshot = await getDocs(collection(db, "clients"));
      totalUsers.value = usersSnapshot.size;

      const companiesSnapshot = await getDocs(collection(db, "companies"));
      totalCompanies.value = companiesSnapshot.size;
          
      const craftsmenSnapshot = await getDocs(collection(db, "technicians"));
      totalCraftsmen.value = craftsmenSnapshot.size;

      const ordersSnapshot = await getDocs(collection(db, "orders"));
      totalOrders.value = ordersSnapshot.size;
    };

    onMounted(fetchData);

    return { totalUsers, totalCompanies, totalCraftsmen, totalOrders };
  },
};
</script>
