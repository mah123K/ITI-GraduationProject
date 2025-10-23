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
import ChatPage from "./components/ChatPage.vue";

import {initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'
import { Timestamp } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBvMXFM7Z6hGMStuVJ1vtFqm7zGZ6pR0sk",
  authDomain: "tashteebaty-website.firebaseapp.com",
  projectId: "tashteebaty-website",
  storageBucket: "tashteebaty-website.firebasestorage.app",
  messagingSenderId: "780680548339",
  appId: "1:780680548339:web:cfe90d7b41150d6ea9cc86",
  measurementId: "G-0Q8VY2YZSY"
};

initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const auth = getAuth();
export const auth = getAuth();


const routes = [
  { path: "/", component: HomePage },
  { path: "/offers", component: OfferPage },
  { path: "/login", component: LoginPage },
  { path: "/SignUp", component: SignUp },
  { path: "/about", component: AboutUs },
  { path: "/profiles/:service", name: "ProfilesPage", component:ProfilesPage },
  { path: "/technicianProfile", component: TechnicianProfile },
  { path: "/ContactUs", component: ContactUs },
  { path: "/chat", component: ChatPage },
];
const router = createRouter({ history: createWebHistory(), routes });

createApp(App).use(router).mount("#app");
