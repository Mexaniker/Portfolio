import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';

// Попытка получить ключи из переменных окружения (для Vite/Create-React-App/Next.js)
// Если переменных нет (текущий режим), используются строки, которые вы предоставили.
const getEnv = (key: string, fallback: string) => {
  // @ts-ignore - suppress TS error for checking various env sources
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key];
  }
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
      // @ts-ignore
      return process.env[key];
  }
  return fallback;
};

const firebaseConfig = {
  apiKey: getEnv("VITE_FIREBASE_API_KEY", "AIzaSyDnbDzTet-ycdW7e7BhdYlTLAVKUO0Yc8w"),
  authDomain: getEnv("VITE_FIREBASE_AUTH_DOMAIN", "porfolio-39c28.firebaseapp.com"),
  projectId: getEnv("VITE_FIREBASE_PROJECT_ID", "porfolio-39c28"),
  storageBucket: getEnv("VITE_FIREBASE_STORAGE_BUCKET", "porfolio-39c28.firebasestorage.app"),
  messagingSenderId: getEnv("VITE_FIREBASE_MESSAGING_SENDER_ID", "306926191444"),
  appId: getEnv("VITE_FIREBASE_APP_ID", "1:306926191444:web:af3d9a6f9b4dd6a71d7ec1"),
  measurementId: getEnv("VITE_FIREBASE_MEASUREMENT_ID", "G-4LEM1NRCPD")
};

// Initialize Firebase
let app;
try {
    if (firebase.apps.length === 0) {
        app = firebase.initializeApp(firebaseConfig);
    } else {
        app = firebase.app();
    }
} catch (e) {
    console.error("Firebase initialization error:", e);
}

export const db = app ? app.firestore() : null;
export const auth = app ? app.auth() : null;
export const storage = app ? app.storage() : null;