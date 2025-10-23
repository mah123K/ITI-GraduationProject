import "./assets/main.css";
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import HomePage from "./components/HomePage.vue";
import OfferPage from "./components/OfferPage.vue";
import LoginPage from "./components/LoginPage.vue";
import SignUp from "./components/SignUp.vue";
import ContactUs from "./components/ContactUs.vue";
import App from "./App.vue";
import AboutUs from "./components/AboutUs.vue";
import ProfilesPage from "./components/ProfilesPage.vue";
import TechnicianProfile from "./components/technicianProfile.vue";
const routes = [
  { path: "/", component: HomePage },
  { path: "/offers", component: OfferPage },
  { path: "/login", component: LoginPage },
  { path: "/SignUp", component: SignUp },
  { path: "/about", component: AboutUs },
  { path: "/profiles/:service", name: "ProfilesPage", component:ProfilesPage },
  { path: "/technicianProfile", component: TechnicianProfile },
  { path: "/ContactUs", component: ContactUs },
];
const router = createRouter({ history: createWebHistory(), routes });

createApp(App).use(router).mount("#app");
