import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAR_pdDnjO6T0U5ItXdJDjsS1L3YoiTuI4",
  authDomain: "chatapp-b0fff.firebaseapp.com",
  projectId: "chatapp-b0fff",
  storageBucket: "chatapp-b0fff.appspot.com",
  messagingSenderId: "231611060547",
  appId: "1:231611060547:web:0b9cc63bcb4cc4cb4a9ff6",
  measurementId: "G-ZVJ1NMYQ1C"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
