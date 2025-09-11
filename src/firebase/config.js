import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// You'll need to replace these with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyC-0bH5lLBdEJ77o2tMKWL4MWkpnYeZV0U",
  authDomain: "supercalendar-5a77b.firebaseapp.com",
  projectId: "supercalendar-5a77b",
  storageBucket: "supercalendar-5a77b.firebasestorage.app",
  messagingSenderId: "379409648344",
  appId: "1:379409648344:web:4de715121092b3a7aca5ad",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;