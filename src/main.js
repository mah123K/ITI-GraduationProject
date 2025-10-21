import "./assets/main.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import HomePage from "./components/HomePage.vue";
import OfferPage from "./components/OfferPage.vue";
import LoginPage from "./components/LoginPage.vue";

import App from "./App.vue";
import AboutUs from "./components/AboutUs.vue";
import ProfilesPage from "./components/profilesPage.vue";
const routes = [
  { path: "/", component: HomePage },
  { path: "/offers", component: OfferPage },
  { path: "/login", component: LoginPage },
  { path: "/about", component: AboutUs },
  { path: "/profiles", component: ProfilesPage },
];
const router = createRouter({ history: createWebHistory(), routes });

createApp(App).use(router).mount("#app");
