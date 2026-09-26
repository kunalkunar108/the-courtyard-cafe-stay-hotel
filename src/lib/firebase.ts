import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// Firebase web configuration.
// These values are intended for the browser; access control is enforced by
// Firebase Authentication, Firestore Rules, Storage Rules and callable functions.
const config = {
  apiKey: "AIzaSyC-jA_O0l1HVTK8yhjgkdBztQ_juV0BHRw",
  authDomain: "the-grand-courtyard-hotel.firebaseapp.com",
  projectId: "the-grand-courtyard-hotel",
  storageBucket: "the-grand-courtyard-hotel.firebasestorage.app",
  messagingSenderId: "1006849714884",
  appId: "1:1006849714884:web:9b5ab01f8d8c60ee0d7791"
};

export const firebaseConfigured = Object.values(config).every(Boolean);
export const app = firebaseConfigured ? (getApps()[0] ?? initializeApp(config)) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;
export const functions = app ? getFunctions(app, "asia-south1") : null;
