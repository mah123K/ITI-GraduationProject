// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBvMXFM7Z6hGMStuVJ1vtFqm7zGZ6pR0sk",
  authDomain: "tashteebaty-website.firebaseapp.com",
  projectId: "tashteebaty-website",
  storageBucket: "tashteebaty-website.firebasestorage.app",
  messagingSenderId: "780680548339",
  appId: "1:780680548339:web:cfe90d7b41150d6ea9cc86",
  measurementId: "G-0Q8VY2YZSY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);

export const storage = getStorage(app);
export { db, auth };
