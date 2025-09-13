import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC-0bH5lLBdEJ77o2tMKWL4MWkpnYeZV0U",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "supercalendar-5a77b.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "supercalendar-5a77b",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "supercalendar-5a77b.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "379409648344",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:379409648344:web:4de715121092b3a7aca5ad",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;