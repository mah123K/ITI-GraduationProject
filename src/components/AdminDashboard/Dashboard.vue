<template>
  <div class="bg-white dark:bg-[#1f2937] dark:text-gray-100 shadow-lg rounded-2xl p-6">
    <!-- Title -->
    <div>
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Dashboard Overview</h2>
      <p class="text-gray-500 dark:text-gray-300 mt-1">Monitor your platform’s performance and key metrics</p>
    </div>

    <!-- Cards -->
    <div class="grid grid-cols-4 gap-6 mt-8 max-w-6xl">
      <!-- Users -->
      <div class="bg-white dark:bg-[#111827] dark:text-gray-100 shadow-md rounded-2xl p-5 cursor-pointer hover:-translate-y-1 transition-all duration-300">
        <p class="text-gray-500 dark:text-gray-300 text-sm font-medium">Total Users</p>
        <div class="flex justify-between items-center mt-4">
          <p class="text-3xl font-bold">{{ totalUsers }}</p>
          <div class="bg-blue-100 text-blue-500 w-12 h-12 flex items-center justify-center rounded-full">
            <i class="bi bi-people-fill text-xl"></i>
          </div>
        </div>
        <p class="text-sm" :class="userChange >=0 ? 'text-green-500' : 'text-red-500'"> {{ userChange >=0 ? '+' : ''}}{{ userChange }}% since last week </p>
      </div>

      <!-- Companies -->
      <div class="bg-white dark:bg-[#111827] dark:text-gray-100 shadow-md rounded-2xl p-5 cursor-pointer hover:-translate-y-1 transition-all duration-300">
        <p class="text-gray-500 dark:text-gray-300 text-sm font-medium">Total Companies</p>
        <div class="flex justify-between items-center mt-4">
          <p class="text-3xl font-bold">{{ totalCompanies }}</p>
          <div class="bg-green-100 text-green-500 w-12 h-12 flex items-center justify-center rounded-full">
            <i class="bi bi-building text-xl"></i>
          </div>
        </div>
        <p class="text-sm" :class="companyChange >=0 ? 'text-green-500' : 'text-red-500'"> {{ companyChange >=0 ? '+' : ''}}{{ companyChange }}% since last week </p>
      </div>

      <!-- Craftsmen -->
      <div class="bg-white dark:bg-[#111827] dark:text-gray-100 shadow-md rounded-2xl p-5 cursor-pointer hover:-translate-y-1 transition-all duration-300">
        <p class="text-gray-500 dark:text-gray-300 text-sm font-medium">Total Craftsmen</p>
        <div class="flex justify-between items-center mt-4">
          <p class="text-3xl font-bold">{{ totalCraftsmen }}</p>
          <div class="bg-yellow-100 text-yellow-500 w-12 h-12 flex items-center justify-center rounded-full">
            <i class="bi bi-hammer text-xl"></i>
          </div>
        </div>
        <p class="text-sm" :class="craftsmenChange >=0 ? 'text-green-500' : 'text-red-500'"> {{ craftsmenChange >=0 ? '+' : ''}}{{ craftsmenChange }}% since last week </p>
      </div>

      <!-- Orders -->
      <div class="bg-white dark:bg-[#111827] dark:text-gray-100 shadow-md rounded-2xl p-5 cursor-pointer hover:-translate-y-1 transition-all duration-300">
        <p class="text-gray-500 dark:text-gray-300 text-sm font-medium">Total Orders</p>
        <div class="flex justify-between items-center mt-4">
          <p class="text-3xl font-bold">{{ totalOrders }}</p>
          <div class="bg-red-100 text-red-500 w-12 h-12 flex items-center justify-center rounded-full">
            <i class="bi bi-cart-fill text-xl"></i>
          </div>
        </div>
        <p class="text-sm" :class="ordersChange >=0 ? 'text-green-500' : 'text-red-500'"> {{ ordersChange >=0 ? '+' : ''}}{{ ordersChange }}% since last week </p>
        <p class="text-gray-400 dark:text-gray-300 text-xs mt-2">Pending price: {{ pendingOrdersCount }}</p>
      </div>
    </div>

    <!-- Monthly Revenue Chart -->
    <div class="bg-white dark:bg-[#111827] dark:text-gray-100 p-6 rounded-2xl shadow-md max-w-4xl mt-10">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Monthly Revenue</h2>
      <canvas id="revenueChart"></canvas>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import Chart from "chart.js/auto";

export default {
  setup() {
    // Counts
    const totalUsers = ref(0);
    const totalCompanies = ref(0);
    const totalCraftsmen = ref(0);
    const totalOrders = ref(0);
    const pendingOrdersCount = ref(0);

    // Changes since last week (percent)
    const userChange = ref(0);
    const companyChange = ref(0);
    const craftsmenChange = ref(0);
    const ordersChange = ref(0);

    // Monthly Revenue
    const monthlyRevenue = ref([]);
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    // حساب نسبة التغير
    const calculateChange = (current, last) => {
      if (last === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - last) / last) * 100);
    };

    const fetchData = async () => {
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Users
      const usersSnapshot = await getDocs(collection(db, "clients"));
      totalUsers.value = usersSnapshot.size;

      // Companies
      const companiesSnapshot = await getDocs(collection(db, "companies"));
      totalCompanies.value = companiesSnapshot.size;

      // Craftsmen
      const craftsmenSnapshot = await getDocs(collection(db, "technicians"));
      totalCraftsmen.value = craftsmenSnapshot.size;

      // Orders
      const ordersSnapshot = await getDocs(collection(db, "orders"));
      totalOrders.value = ordersSnapshot.size;

      // Pending Orders
      const pendingSnapshot = await getDocs(query(collection(db, "orders"), where("price", "==", "Pending Quote")));
      pendingOrdersCount.value = pendingSnapshot.size;

      // Orders last week for percent change
      const lastWeekOrdersSnapshot = await getDocs(
        query(
          collection(db, "orders"),
          where("createdAt", "<", Timestamp.fromDate(now)),
          where("createdAt", ">", Timestamp.fromDate(oneWeekAgo))
        )
      );
      ordersChange.value = calculateChange(totalOrders.value, lastWeekOrdersSnapshot.size);

      // Example: fixed percent changes for demo
      userChange.value = 5;
      companyChange.value = -2;
      craftsmenChange.value = 3;

      // Monthly Revenue Calculation (derive from `payments` collection)
      const paymentsSnapshot = await getDocs(collection(db, 'payments'));
      const revenueByMonth = Array(12).fill(0); // 12 months
      paymentsSnapshot.forEach((docItem) => {
        const data = docItem.data();
        // support fields: amount, price
        const price = parseFloat(data.amount ?? data.price ?? 0);
        if (!isNaN(price)) {
          let dateObj;
          // Firestore Timestamp
          if (data.date && data.date.seconds) {
            dateObj = new Date(data.date.seconds * 1000);
          } else if (data.date) {
            // try parsing string date
            dateObj = new Date(data.date);
            if (isNaN(dateObj.getTime())) dateObj = new Date();
          } else if (data.createdAt && data.createdAt.seconds) {
            dateObj = new Date(data.createdAt.seconds * 1000);
          } else {
            dateObj = new Date();
          }

          revenueByMonth[dateObj.getMonth()] += price;
        }
      });
      monthlyRevenue.value = revenueByMonth;
    };

    const renderRevenueChart = () => {
      const ctx = document.getElementById("revenueChart").getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: months,
          datasets: [{
            label: "Revenue",
            data: monthlyRevenue.value,
            backgroundColor: "#3B82F6"
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: true } },
          scales: { y: { beginAtZero: true } }
        }
      });
    };

    onMounted(async () => {
      await fetchData();
      renderRevenueChart();
    });

    return {
      totalUsers,
      totalCompanies,
      totalCraftsmen,
      totalOrders,
      pendingOrdersCount,
      userChange,
      companyChange,
      craftsmenChange,
      ordersChange
    };
  }
};
</script>

<style scoped>
/* Tailwind classes already applied */
</style>
