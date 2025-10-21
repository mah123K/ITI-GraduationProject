import "./assets/main.css";
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import HomePage from "./components/HomePage.vue";
import OfferPage from "./components/OfferPage.vue";
import LoginPage from "./components/LoginPage.vue";
import SignUp from "./components/SignUp.vue";
import CarpentersPage from "./components/CarpentersPage.vue";
import ElectrectionsPage from "./components/ElectrectionsPage.vue";
import FinishingCompanies from "./components/FinishingCompanies.vue";
import technichionProfile from "./components/technichionProfile.vue";
import ContactUs from "./components/ContactUs.vue";
import App from "./App.vue";
import AboutUs from "./components/AboutUs.vue";
import PlumbersPage from "./components/PlumbersPage.vue";
const routes = [
  { path: "/", component: HomePage },
  { path: "/offers", component: OfferPage },
  { path: "/login", component: LoginPage },
    { path: "/SignUp", component: SignUp },
  { path: "/about", component: AboutUs },
  { path: "/PlumbersPage", component: PlumbersPage },
  { path: "/CarpentersPage", component: CarpentersPage },
  { path: "/ElectrectionsPage", component: ElectrectionsPage },
  { path: "/FinishingCompanies", component: FinishingCompanies },
  { path: "/technichionProfile", component: technichionProfile },
  { path: "/ContactUs", component: ContactUs },
];
const router = createRouter({ history: createWebHistory(), routes });

createApp(App).use(router).mount("#app");
