import { initializeApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import type { Auth } from "firebase/auth";

// Firebase configuration
// Replace with your actual Firebase project config
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyB8StYfoZ-GfU1kGkE3yFOOp8VDMi0ZCcM",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "medcore-e3bbc.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "medcore-e3bbc",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "medcore-e3bbc.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "61668718650",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:61668718650:web:a89fedd0203387a5f25d03",
};

let app: FirebaseApp;
let auth: Auth;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
  // Re-throw so the app knows initialization failed
  throw error;
}

export { app, auth };
export default firebaseConfig;
