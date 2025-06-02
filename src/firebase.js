import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Paste your Firebase config here
   apiKey: "AIzaSyAEU_3mFvBsGLOspTy-B7k0BMcfR1zRY9g",
  authDomain: "recipehub-d08a1.firebaseapp.com",
  projectId: "recipehub-d08a1",
  storageBucket: "recipehub-d08a1.appspot.com",
  messagingSenderId: "994606686567",
  appId: "1:994606686567:web:d8c84acde63bb671c18fc2",
  measurementId: "G-S4SRJMXLPP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);