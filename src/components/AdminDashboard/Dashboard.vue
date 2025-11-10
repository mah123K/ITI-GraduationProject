<template>
  <div class="bg-white dark:bg-[#1f2937] dark:text-gray-100 shadow-lg rounded-2xl p-6">
    <!-- Title -->
    <div>
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ $t('adminDashboard.dashboard.title') }}</h2>
      <p class="text-gray-500 dark:text-gray-300 mt-1">{{ $t('adminDashboard.dashboard.subtitle') }}</p>
    </div>

    <!-- Cards -->
    <div class="grid grid-cols-4 gap-6 mt-8 max-w-6xl">
      <!-- Users -->
      <div class="bg-white dark:bg-[#111827] dark:text-gray-100 shadow-md rounded-2xl p-5 cursor-pointer hover:-translate-y-1 transition-all duration-300">
        <p class="text-gray-500 dark:text-gray-300 text-sm font-medium">{{ $t('adminDashboard.dashboard.totalUsers') }}</p>
        <div class="flex justify-between items-center mt-4">
          <p class="text-3xl font-bold">{{ totalUsers }}</p>
          <div class="bg-blue-100 text-blue-500 w-12 h-12 flex items-center justify-center rounded-full">
            <i class="bi bi-people-fill text-xl"></i>
          </div>
        </div>
        <p class="text-sm" :class="userChange >=0 ? 'text-green-500' : 'text-red-500'"> {{ userChange >=0 ? '+' : ''}}{{ userChange }}% {{ $t('adminDashboard.dashboard.sinceLastWeek') }} </p>
      </div>

      <!-- Companies -->
      <div class="bg-white dark:bg-[#111827] dark:text-gray-100 shadow-md rounded-2xl p-5 cursor-pointer hover:-translate-y-1 transition-all duration-300">
        <p class="text-gray-500 dark:text-gray-300 text-sm font-medium">{{ $t('adminDashboard.dashboard.totalCompanies') }}</p>
        <div class="flex justify-between items-center mt-4">
          <p class="text-3xl font-bold">{{ totalCompanies }}</p>
          <div class="bg-green-100 text-green-500 w-12 h-12 flex items-center justify-center rounded-full">
            <i class="bi bi-building text-xl"></i>
          </div>
        </div>
        <p class="text-sm" :class="companyChange >=0 ? 'text-green-500' : 'text-red-500'"> {{ companyChange >=0 ? '+' : ''}}{{ companyChange }}% {{ $t('adminDashboard.dashboard.sinceLastWeek') }} </p>
      </div>

      <!-- Craftsmen -->
      <div class="bg-white dark:bg-[#111827] dark:text-gray-100 shadow-md rounded-2xl p-5 cursor-pointer hover:-translate-y-1 transition-all duration-300">
        <p class="text-gray-500 dark:text-gray-300 text-sm font-medium">{{ $t('adminDashboard.dashboard.totalCraftsmen') }}</p>
        <div class="flex justify-between items-center mt-4">
          <p class="text-3xl font-bold">{{ totalCraftsmen }}</p>
          <div class="bg-yellow-100 text-yellow-500 w-12 h-12 flex items-center justify-center rounded-full">
            <i class="bi bi-hammer text-xl"></i>
          </div>
        </div>
        <p class="text-sm" :class="craftsmenChange >=0 ? 'text-green-500' : 'text-red-500'"> {{ craftsmenChange >=0 ? '+' : ''}}{{ craftsmenChange }}% {{ $t('adminDashboard.dashboard.sinceLastWeek') }} </p>
      </div>

      <!-- Orders -->
      <div class="bg-white dark:bg-[#111827] dark:text-gray-100 shadow-md rounded-2xl p-5 cursor-pointer hover:-translate-y-1 transition-all duration-300">
        <p class="text-gray-500 dark:text-gray-300 text-sm font-medium">{{ $t('adminDashboard.dashboard.totalOrders') }}</p>
        <div class="flex justify-between items-center mt-4">
          <p class="text-3xl font-bold">{{ totalOrders }}</p>
          <div class="bg-red-100 text-red-500 w-12 h-12 flex items-center justify-center rounded-full">
            <i class="bi bi-cart-fill text-xl"></i>
          </div>
        </div>
        <p class="text-sm" :class="ordersChange >=0 ? 'text-green-500' : 'text-red-500'"> {{ ordersChange >=0 ? '+' : ''}}{{ ordersChange }}% {{ $t('adminDashboard.dashboard.sinceLastWeek') }} </p>
        <p class="text-gray-400 dark:text-gray-300 text-xs mt-2">{{ $t('adminDashboard.dashboard.pendingPrice') }} {{ pendingOrdersCount }}</p>
      </div>
    </div>

    <!-- Monthly Revenue Chart + Top Rated Providers -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10 max-w-6xl">
      <div class="bg-white dark:bg-[#111827] dark:text-gray-100 p-6 rounded-2xl shadow-md">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{{ $t('adminDashboard.dashboard.monthlyRevenue') }}</h2>
        <div class="w-full h-60 md:h-72 lg:h-96">
          <canvas id="revenueChart" class="w-full h-full"></canvas>
        </div>
      </div>

      <div class="bg-white dark:bg-[#111827] dark:text-gray-100 p-6 rounded-2xl shadow-md">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">{{ $t('adminDashboard.dashboard.topRatedProviders') }}</h2>
          <span class="text-sm text-gray-500 dark:text-gray-300">{{ $t('adminDashboard.dashboard.top5') }}</span>
        </div>
        <div class="space-y-3">
          <div v-if="!topProviders.length" class="text-gray-500 dark:text-gray-300">{{ $t('adminDashboard.dashboard.noProviders') }}</div>
          <div v-for="p in topProviders" :key="p.id" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            <div class="h-12 w-12 rounded-full bg-[#e8f0fe] dark:bg-gray-800 overflow-hidden flex items-center justify-center text-[#5984C6] font-semibold">
              <img :src="p.image || defaultAvatar" alt="avatar" class="w-full h-full object-cover" @error="(e)=>e.target.src=defaultAvatar" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <div class="truncate">
                  <p class="font-semibold text-gray-800 dark:text-gray-100 truncate">{{ p.name }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-300">{{ p.type }}</p>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-sm text-gray-800 dark:text-gray-100">{{ p.rating?.toFixed(2) || '0.00' }}</p>
                  <div class="text-yellow-400 text-xs">★</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import { collection, getDocs, query, where, Timestamp, onSnapshot } from "firebase/firestore";
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
    const topProviders = ref([]);
  let revenueChart = null;
  let paymentsUnsub = null;
    const defaultAvatar = 'data:image/svg+xml;utf8,\
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">\
  <circle cx="32" cy="32" r="32" fill="%23e5e7eb"/>\
  <circle cx="32" cy="24" r="12" fill="%239ca3af"/>\
  <path d="M12 54c4-10 12-16 20-16s16 6 20 16" fill="%239ca3af"/>\
</svg>';

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

        // topProviders will be populated by real-time listeners set up in subscribeTopProviders()
    };

    // compute monthly revenue from a collection snapshot or array of docs
    const computeMonthlyRevenue = (items) => {
      const revenueByMonth = Array(12).fill(0);
      try {
        const arr = items || [];
        arr.forEach((docItem) => {
          const data = (docItem.data && docItem.data()) ? docItem.data() : docItem;
          const price = parseFloat(data.amount ?? data.price ?? 0);
          if (!isNaN(price)) {
            let dateObj;
            if (data.date && data.date.seconds) {
              dateObj = new Date(data.date.seconds * 1000);
            } else if (data.date) {
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
      } catch (e) {
        console.error('computeMonthlyRevenue error', e);
      }
      return revenueByMonth;
    };

    const renderRevenueChart = () => {
      try {
        const canvas = document.getElementById("revenueChart");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        // destroy previous instance if exists
        if (revenueChart && typeof revenueChart.destroy === 'function') {
          revenueChart.destroy();
          revenueChart = null;
        }

        revenueChart = new Chart(ctx, {
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
            maintainAspectRatio: false,
            plugins: { legend: { display: true } },
            scales: { y: { beginAtZero: true } }
          }
        });
      } catch (e) {
        console.error('renderRevenueChart error:', e);
      }
    };

    // Real-time subscriptions for top providers
    let unsubTech = null;
    let unsubComp = null;
    const subscribeTopProviders = () => {
      try {
        unsubTech = onSnapshot(collection(db, 'technicians'), (snap) => {
          try {
            const list = [];
            snap.forEach((d) => {
              const data = d.data() || {};
              list.push({
                id: d.id,
                name: data.name || data.fullName || 'Technician',
                rating: Number(data.ratingAverage ?? data.rating ?? 0),
                image: data.profileImage || data.photoURL || '',
                type: 'Technician'
              });
            });
            // merge with companies later by reading current comp snapshot if available
            // store technicians temporarily on topProviders as base; companies snapshot will merge
            const comps = topProviders._companiesCache || [];
            const merged = list.concat(comps);
            merged.sort((a,b) => (b.rating || 0) - (a.rating || 0));
            topProviders.value = merged.slice(0,5);
            // cache technicians
            topProviders._techCache = list;
          } catch (e) { console.error('tech snapshot error:', e); }
        });

        unsubComp = onSnapshot(collection(db, 'companies'), (snap) => {
          try {
            const list = [];
            snap.forEach((d) => {
              const data = d.data() || {};
              list.push({
                id: d.id,
                name: data.name || data.companyName || 'Company',
                rating: Number(data.ratingAverage ?? data.rating ?? 0),
                image: data.logo || data.logoImage || data.profileImage || '',
                type: 'Company'
              });
            });
            const techs = topProviders._techCache || [];
            const merged = techs.concat(list);
            merged.sort((a,b) => (b.rating || 0) - (a.rating || 0));
            topProviders.value = merged.slice(0,5);
            // cache companies
            topProviders._companiesCache = list;
          } catch (e) { console.error('company snapshot error:', e); }
        });
      } catch (e) {
        console.error('subscribeTopProviders failed:', e);
      }
    };

    const subscribePaymentsRealtime = () => {
      try {
        paymentsUnsub = onSnapshot(collection(db, 'payments'), (snap) => {
          try {
            const revenue = computeMonthlyRevenue(snap.docs);
            monthlyRevenue.value = revenue;
            renderRevenueChart();
          } catch (e) {
            console.error('payments snapshot handling error:', e);
          }
        }, (err) => console.error('payments realtime error:', err));
      } catch (e) {
        console.error('subscribePaymentsRealtime failed:', e);
      }
    };

    onMounted(async () => {
      await fetchData();
      renderRevenueChart();
      subscribeTopProviders();
      subscribePaymentsRealtime();
    });

    onUnmounted(() => {
      if (typeof unsubTech === 'function') unsubTech();
      if (typeof unsubComp === 'function') unsubComp();
      if (typeof paymentsUnsub === 'function') paymentsUnsub();
      if (revenueChart && typeof revenueChart.destroy === 'function') {
        try { revenueChart.destroy(); } catch(e) { console.error('destroy chart error', e); }
        revenueChart = null;
      }
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
      ,topProviders, defaultAvatar
    };
  }
};
</script>

<style scoped>
/* Tailwind classes already applied */
</style>
