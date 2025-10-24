// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCoEkOce-LY7cXvtJHzvyVaygMAjPIzU3k",
  authDomain: "tashteb-36a40.firebaseapp.com",
  projectId: "tashteb-36a40",
  storageBucket: "tashteb-36a40.firebasestorage.app",
  messagingSenderId: "716229351637",
  appId: "1:716229351637:web:5be022a580bcd8a67a6a5c",
  measurementId: "G-S9GFQC17GB",
}
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, createUserWithEmailAndPassword, doc, setDoc, ref, uploadBytes, getDownloadURL };