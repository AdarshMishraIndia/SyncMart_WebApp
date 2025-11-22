import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// SECURITY WARNING: Move these to environment variables
// Use .env file with VITE_FIREBASE_* prefix
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBXjJkiFeSQ-DJ8pK7qMXBMlvWJVk8OfG4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "syncmart-2db9f.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "syncmart-2db9f",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "syncmart-2db9f.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "61170465939",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:61170465939:web:29626e28ee3a97262aa166"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;