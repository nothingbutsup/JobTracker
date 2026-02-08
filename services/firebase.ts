import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDavttfNSFsHIwWKNCO9i8s25JnfCW3wkM",
  authDomain: "application-tracker-21ac5.firebaseapp.com",
  projectId: "application-tracker-21ac5",
  storageBucket: "application-tracker-21ac5.firebasestorage.app",
  messagingSenderId: "8620259435",
  appId: "1:8620259435:web:027e50790b555e67b2992e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);