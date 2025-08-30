
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// This configuration is correct and has been verified.
const firebaseConfig = {
  projectId: "projectwise-rtgmv",
  appId: "1:997252467907:web:9c44c3f427e1218646e676",
  storageBucket: "projectwise-rtgmv.firebasestorage.app",
  apiKey: "AIzaSyD58K4lTHvpwkqYB0d1_eN2lu9zxOKPe18",
  authDomain: "projectwise-rtgmv.firebaseapp.com",
  messagingSenderId: "997252467907",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
