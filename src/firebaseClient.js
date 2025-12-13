// src/firebaseClient.js

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAeDSGIqt12cQwFFJfihANFSplw6RZScFc",
  authDomain: "etar-luxury-e-commerce.firebaseapp.com",
  projectId: "etar-luxury-e-commerce",
  storageBucket: "etar-luxury-e-commerce.firebasestorage.app",
  messagingSenderId: "986610343746",
  appId: "1:986610343746:web:a55c6a0cfca11e9557b2db",
  measurementId: "G-V9211L2NPL",
};

// Initialize Firebase once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firebase services
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

// Optional analytics (browser only)
export const analytics =
  typeof window !== "undefined" ? getAnalytics(app) : null;
