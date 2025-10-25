// ✅ Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import '@fortawesome/fontawesome-free/css/all.min.css'

// ✅ Vue
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

// ✅ CSS
import "./assets/main.css";

// ✅ Components
import App from "./App.vue";
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
// ✅ Dashboard Components (inside AdminDashboard folder)

import DashboardLayout from "./components/AdminDashboard/Sisebar.vue";
import Dashboard from "./components/AdminDashboard/Dashboard.vue"
import Users from "./components/AdminDashboard/UsersTable.vue";
import Providers from "./components/AdminDashboard/ProvidersTable.vue";
import ServicesPage from "./components/AdminDashboard/ServicesPage.vue";
import Orders from "./components/AdminDashboard/Orders.vue";
import Payments from "./components/AdminDashboard/Payments.vue";
import Support from "./components/AdminDashboard/Support.vue";
import Settings from "./components/AdminDashboard/Settings.vue";
//Technicion Dashboard
import TechncionDashboard from "./components/TechncionDashboard.vue";
import TechnicionDashNav from "./layout/TechnicionDashNav.vue";
import CreateServiceCard from "./components/CreateServiceCard.vue";
import MyAppointments from "./components/MyAppointments.vue";
import ordersCard from "./components/ordersCard.vue";
import ServiceCard from "./components/ServiceCard.vue";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCoEkOce-LY7cXvtJHzvyVaygMAjPIzU3k",
  authDomain: "tashteb-36a40.firebaseapp.com",
  projectId: "tashteb-36a40",
  storageBucket: "tashteb-36a40.firebasestorage.app",
  messagingSenderId: "716229351637",
  appId: "1:716229351637:web:5be022a580bcd8a67a6a5c",
  measurementId: "G-S9GFQC17GB",
};

// ✅ Initialize Firebase
initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();


const routes = [
  { path: "/", component: HomePage },
  { path: "/offers", component: OfferPage },
  { path: "/login", component: LoginPage },
  { path: "/signup", component: SignUp },
  { path: "/about", component: AboutUs },
  { path: "/profiles/:service", name: "ProfilesPage", component: ProfilesPage },
  { path: "/technicianProfile", component: TechnicianProfile },
  { path: "/contactus", component: ContactUs },
  { path: "/chat", component: ChatPage },
  { path: "/mannageuserprofile", component: ManageUserProfile },

  // ✅ Dashboard (Admin only)
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
    ],
  },
    {
    path: "/technician-dashboard",
    component: TechncionDashboard,
    meta: { requiresTechnician: true },
    children: [
      { path: "", name: "TechnicianOrders", component: ordersCard },
      { path: "services", name: "TechnicianServices", component: ServiceCard },
      { path: "appointments", name: "TechnicianAppointments", component: MyAppointments },
      { path: "create-service", name: "CreateServiceCard", component: CreateServiceCard },
    ],
  },
];

// ✅ Router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ✅ Navigation Guard (حماية صفحات الأدمن)
router.beforeEach(async (to, from, next) => {
  const user = auth.currentUser;
  const requiresAdmin = to.meta.requiresAdmin;

  if (requiresAdmin && !user) return next("/login");

 if (requiresAdmin && user) {
    try {
      // 🧩 نبحث في كل المجموعات عن المستخدم
      const collections = ["admin", "clients", "technicians", "companies"];
      let userDoc = null;
      let userType = null;

      for (const c of collections) {
        const docRef = doc(getFirestore(), c, user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          userDoc = snap;
          userType = snap.data().userType;
          break;
        }
      }

      // ✅ لو المستخدم أدمن فعلاً
      if (userType === "admin") {
        return next(); // يدخل صفحة الأدمن عادي
      }

      // ❌ المستخدم مش أدمن — رجعه حسب نوعه
      if (userType === "client") {
        return next("/");
      } else if (userType === "technicians" || userType === "companies") {
        return next("/provider-dashboard");
      } else {
        return next("/login");
      }

    } catch (err) {
      console.error("Navigation guard error:", err);
      return next("/login");
    }
  }

  next();
});

// ✅ Create and Mount App
const app = createApp(App);
app.use(router);
app.mount("#app");

// ✅ Redirect to Home if already logged in
auth.onAuthStateChanged((user) => {
  if (user && router.currentRoute.value.path === "/login") {
    router.push("/");
  }
});
