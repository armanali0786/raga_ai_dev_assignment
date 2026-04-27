import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

// Firebase configuration
// Replace with your actual Firebase project config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemo-HealthcareApp-Key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'healthcare-saas-demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'healthcare-saas-demo',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'healthcare-saas-demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef123456',
};

let app: FirebaseApp;
let auth: Auth;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Re-throw so the app knows initialization failed
  throw error;
}

export { app, auth };
export default firebaseConfig;
