import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA2Eoj_zRSIG7hZVt86bEUqOP5vqMWvQ2o",
  authDomain: "afrixa-d4002.firebaseapp.com",
  projectId: "afrixa-d4002",
  storageBucket: "afrixa-d4002.firebasestorage.app",
  messagingSenderId: "413151076185",
  appId: "1:413151076185:web:b8f3e4a06bdb9abb18b648",
  measurementId: "G-ZEPJ3S5ZVZ"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app; 