// ================================
// 🔥 Firebase Imports
// ================================
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import "@fortawesome/fontawesome-free/css/all.min.css";

// ================================
// 🌐 Vue Imports
// ================================
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./assets/App.vue";
import "./assets/main.css";


// import { createI18n } from "vue-i18n";
import i18n from './i18n';




// const i18n = createI18n({
//   legacy: false, // Use Composition API mode
//   locale: localStorage.getItem("lang") || "en", // Default locale
//   fallbackLocale: "en", // Fallback locale
//   messages: {
//     en: en, // English translations
//     ar: ar, // Arabic translations
//   },
// });
// ================================
// 📦 Components Imports
// ================================
import HomePage from "./components/HomePage.vue";
import OfferPage from "./components/OfferPage.vue";
import LoginPage from "./components/LoginPage.vue";
import SignUp from "./components/SignUp/SignUp.vue";
import ContactUs from "./components/ContactUs.vue";
import AboutUs from "./components/AboutUs.vue";
import ProfilesPage from "./components/ProfilesPage.vue";
import TechnicianProfile from "./components/technicianProfile.vue";
import ChatPage from "./components/ChatPage.vue";
import ManageUserProfile from "./components/MannageUserProfile.vue";
import forgotpassword from "./components/ForgotPassword.vue";

// Admin Dashboard
import DashboardLayout from "./components/AdminDashboard/Sisebar.vue";
import Dashboard from "./components/AdminDashboard/Dashboard.vue";
import Users from "./components/AdminDashboard/UsersTable.vue";
import Providers from "./components/AdminDashboard/ProvidersTable.vue";
import ServicesPage from "./components/AdminDashboard/ServicesPage.vue";
import Orders from "./components/AdminDashboard/Orders.vue";
import Payments from "./components/AdminDashboard/Payments.vue";
import Support from "./components/AdminDashboard/Support.vue";
import Settings from "./components/AdminDashboard/Settings.vue";
import AdminProfile from "./components/AdminDashboard/AdminProfile.vue";
import AddOffer from "./components/AdminDashboard/AddOffers.vue";

// Technician Dashboard
import TechncionDashboard from "./components/TechncionDashboard.vue";
import CreateServiceCard from "./components/CreateServiceCard.vue";
import MyAppointments from "./components/MyAppointments.vue";
import ManageTechnicianProfile from "./components/MannageTechnicionProfile.vue";
import ordersCard from "./components/ordersCard.vue";
import ServiceCard from "./components/ServiceCard.vue";

// ✅ User Pages
import UserOrders from "./components/UserOrders.vue";
import PaymentSuccess from "./components/PaymentSuccess.vue";
import PaymentFailed from "./components/PaymentFailed.vue";

// ✅ New Payment Page
import PaymentPage from "./components/PaymentPage.vue"; // 🆕 Added line

// ================================
// ⚙️ Firebase Config
// ================================
const firebaseConfig = {
  apiKey: "AIzaSyCoEkOce-LY7cXvtJHzvyVaygMAjPIzU3k",
  authDomain: "tashteb-36a40.firebaseapp.com",
  projectId: "tashteb-36a40",
  storageBucket: "tashteb-36a40.firebasestorage.app",
  messagingSenderId: "716229351637",
  appId: "1:716229351637:web:5be022a580bcd8a67a6a5c",
  measurementId: "G-S9GFQC17GB",
};

initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();

// ================================
// 🚦 Router Setup
// ================================
const routes = [
  { path: "/", component: HomePage },
  { path: "/offers", component: OfferPage },
  { path: "/login", component: LoginPage },
  { path: "/signup", component: SignUp },
  { path: "/about", component: AboutUs },
  { path: "/profiles/:service", name: "ProfilesPage", component: ProfilesPage },
  { path: "/profile/:id", component: TechnicianProfile },
  { path: "/contactus", component: ContactUs },
  { path: "/chat", component: ChatPage },
  { path: "/manageUserProfile", component: ManageUserProfile },
  { path: "/forgot-password", component: forgotpassword, alias: "/forgotpassword" },

  // ✅ صفحة الطلبات الجديدة (My Orders)
  {
    path: "/my-orders",
    name: "MyOrders",
    component: UserOrders,
    meta: { requiresAuth: true },
  },

  // ✅ صفحة الدفع المخصصة (قبل Paymob iframe)
  {
    path: "/payment",
    name: "PaymentPage",
    component: PaymentPage, // 🆕 Added route
    meta: { requiresAuth: true },
  },

  // ✅ صفحات الدفع (نجاح / فشل)
  {
    path: "/payment-success",
    name: "PaymentSuccess",
    component: PaymentSuccess,
  },
  {
    path: "/payment-failed",
    name: "PaymentFailed",
    component: PaymentFailed,
  },

  // Admin Dashboard
  {
    path: "/dashboard",
    component: DashboardLayout,
    meta: { requiresAdmin: true },
    children: [
      { path: "", name: "DashboardHome", component: Dashboard },
      { path: "users", name: "Users", component: Users },
      { path: "providers", name: "Providers", component: Providers },
      { path: "services", name: "Services", component: ServicesPage },
      { path: "orders", name: "Orders", component: Orders },
      { path: "payments", name: "Payments", component: Payments },
      { path: "support", name: "Support", component: Support },
      { path: "settings", name: "Settings", component: Settings },
      { path: "addoffer", name: "AddOffer", component: AddOffer },
      {
        path: "adminprofile",
        name: "AdminProfile",
        component: AdminProfile,
        meta: { requiresAdmin: true },
      },
    ],
  },

  // Technician Dashboard
  {
    path: "/technician-dashboard",
    component: TechncionDashboard,
    meta: { requiresTechnician: true },
  },

  // Technician Chat
  {
    path: "/technician-chat",
    name: "TechnicianChat",
    component: ChatPage,
    meta: { requiresTechnician: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// ================================
// 🧭 Save last visited dashboard route
// ================================
router.afterEach((to) => {
  if (to.path.startsWith("/dashboard") || to.path.startsWith("/technician-dashboard")) {
    localStorage.setItem("lastDashboardRoute", to.fullPath);
  }
});

// ================================
// 🧱 Navigation Guard
// ================================
router.beforeEach(async (to, from, next) => {
  const user = auth.currentUser;
  const requiresAdmin = to.meta.requiresAdmin;
  const requiresTechnician = to.meta.requiresTechnician;
  const requiresAuth = to.meta.requiresAuth;

  if (!user && (requiresAdmin || requiresTechnician || requiresAuth)) {
    return next("/login");
  }

  if ((to.path === "/login" || to.path === "/signup") && user) {
    const lastRoute = localStorage.getItem("lastDashboardRoute");
    if (lastRoute?.startsWith("/dashboard")) return next(lastRoute);
    if (lastRoute?.startsWith("/technician-dashboard")) return next(lastRoute);
    return next("/");
  }

  next();
});

// ================================
// 🚀 Mount Vue app *after* Firebase auth is ready
// ================================
let appInitialized = false;

onAuthStateChanged(auth, async (user) => {
  if (!appInitialized) {
    const app = createApp(App);
    app.use(router);
    app.use(i18n)
    app.mount("#app");
    appInitialized = true;
  }

  if (!user) {
    localStorage.removeItem("lastDashboardRoute");
    if (
      router.currentRoute.value.meta.requiresAdmin ||
      router.currentRoute.value.meta.requiresTechnician
    ) {
      router.push("/login");
    }
    return;
  }

  try {
    const [adminDoc, techDoc] = await Promise.all([
      getDoc(doc(db, "admin", user.uid)),
      getDoc(doc(db, "technicians", user.uid)),
    ]);

    const currentPath = router.currentRoute.value.path;
    let lastRoute = localStorage.getItem("lastDashboardRoute");

    if (techDoc.exists()) {
      if (!lastRoute || !lastRoute.startsWith("/technician-dashboard")) {
        localStorage.setItem("lastDashboardRoute", "/technician-dashboard");
        lastRoute = "/technician-dashboard";
      }

      if (currentPath === "/" || currentPath === "/login" || currentPath === "/signup") {
        router.replace(lastRoute);
      }
    } else if (adminDoc.exists()) {
      if (!lastRoute || !lastRoute.startsWith("/dashboard")) {
        localStorage.setItem("lastDashboardRoute", "/dashboard");
        lastRoute = "/dashboard";
      }

      if (currentPath === "/" || currentPath === "/login" || currentPath === "/signup") {
        router.replace(lastRoute);
      }
    } else {
      if (currentPath === "/login" || currentPath === "/signup") {
        router.replace("/");
      }
    }
  } catch (error) {
    console.error("Error restoring dashboard route:", error);
  }
});
