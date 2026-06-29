// services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD7EJddakaxmeQI1w3Dp9chtXtKoaA9ZQM",
  authDomain: "my-new-project-18ddf.firebaseapp.com",
  projectId: "my-new-project-18ddf",
  storageBucket: "my-new-project-18ddf.firebasestorage.app",
  messagingSenderId: "341679729602",
  appId: "1:341679729602:web:1241457a4c8d76e985c45b",
  measurementId: "G-2M3JN1L2MS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
