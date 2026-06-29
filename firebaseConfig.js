// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 🔴 Use the values from your Firebase Web App (copied from Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyD7EJddakaxmeQI1w3Dp9chtXtKoaA9ZQM",
  authDomain: "my-new-project-18ddf.firebaseapp.com",
  projectId: "my-new-project-18ddf",
  storageBucket: "my-new-project-18ddf.appspot.com",
  messagingSenderId: "341679729602",
  appId: "1:341679729602:web:1241457a4c8d76e985c45b"
  // measurementId is optional; you can omit it if you don't need Analytics
};

// ✅ Initialize the Firebase app
const app = initializeApp(firebaseConfig);

// ✅ Export auth, Firestore database, and storage for use in other files
export const auth = getAuth(app);        // for login / register / logout
export const db = getFirestore(app);     // for CRUD operations (products, etc.)
export const storage = getStorage(app);  // for uploading images

export default app;
