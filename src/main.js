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
import App from "./App.vue";
import "./assets/main.css";

// ================================
// 📦 Components Imports
// ================================
import HomePage from "./components/HomePage.vue";
import OfferPage from "./components/OfferPage.vue";
import LoginPage from "./components/LoginPage.vue";
import SignUp from "./components/SignUp.vue";
import ContactUs from "./components/ContactUs.vue";
import AboutUs from "./components/AboutUs.vue";
import ProfilesPage from "./components/ProfilesPage.vue";
import TechnicianProfile from "./components/technicianProfile.vue";
import ChatPage from "./components/ChatPage.vue";
import ManageUserProfile from "./components/MannageUserProfile.vue";

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
    children: [
      { path: "", name: "TechnicianOrders", component: ordersCard },
      { path: "services", name: "TechnicianServices", component: ServiceCard },
      { path: "appointments", name: "TechnicianAppointments", component: MyAppointments },
      { path: "Techsettings", name: "TechnicianSettings", component: ManageTechnicianProfile },
      { path: "create-service", name: "CreateServiceCard", component: CreateServiceCard },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
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

  if (!user && (requiresAdmin || requiresTechnician)) {
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
    app.mount("#app");
    appInitialized = true;
  }

  // ننتظر Firebase تبعت الحالة بالكامل
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

    // ✅ لو المستخدم فني
    if (techDoc.exists()) {
      // لو مفيش route متخزنة، نحفظ الحالية كـ default
      if (!lastRoute || !lastRoute.startsWith("/technician-dashboard")) {
        localStorage.setItem("lastDashboardRoute", "/technician-dashboard");
        lastRoute = "/technician-dashboard";
      }

      // لو المستخدم في login أو signup أو /
      if (currentPath === "/" || currentPath === "/login" || currentPath === "/signup") {
        router.replace(lastRoute);
      }
    }

    // ✅ لو المستخدم أدمن
    else if (adminDoc.exists()) {
      if (!lastRoute || !lastRoute.startsWith("/dashboard")) {
        localStorage.setItem("lastDashboardRoute", "/dashboard");
        lastRoute = "/dashboard";
      }

      if (currentPath === "/" || currentPath === "/login" || currentPath === "/signup") {
        router.replace(lastRoute);
      }
    }

    // ✅ لو مستخدم عادي (مش فني ولا أدمن)
    else {
      if (currentPath === "/login" || currentPath === "/signup") {
        router.replace("/");
      }
    }
  } catch (error) {
    console.error("Error restoring dashboard route:", error);
  }
});
