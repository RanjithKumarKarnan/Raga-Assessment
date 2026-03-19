import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration with environment variables and fallback
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoKeyForDevelopmentOnly",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "healthcare-saas-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "healthcare-saas-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "healthcare-saas-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456789",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

console.log('Firebase config:', firebaseConfig);

let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Fallback to demo config
  const demoConfig = {
    apiKey: "AIzaSyDemoKeyForDevelopmentOnly",
    authDomain: "healthcare-saas-demo.firebaseapp.com",
    projectId: "healthcare-saas-demo",
    storageBucket: "healthcare-saas-demo.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456789"
  };
  app = initializeApp(demoConfig);
}

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
