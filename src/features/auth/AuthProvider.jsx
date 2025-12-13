// src/features/auth/AuthProvider.jsx
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseClient";

import { setUser as setUserAction } from "./authSlice";
import { mergeGuestDataOnLogin } from "../cart/cartSlice";

// -------------------------
// FIREBASE CONFIG
// -------------------------
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// -------------------------------------------------------
// MAIN PROVIDER — ONLY HANDLES AUTH + USER LOADING
// -------------------------------------------------------
export default function AuthProvider({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        dispatch(setUserAction(null));
        return;
      }

      // Basic Firebase User
      const firebaseBasic = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName,
        provider: fbUser.providerData?.[0]?.providerId,
      };

      // Try loading Firestore profile (safe)
      let profile = {};

      try {
        const ref = doc(db, "users", fbUser.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) profile = snap.data();
      } catch (err) {
        console.warn("Firestore profile load skipped:", err.message);
      }

      const finalUser = { ...firebaseBasic, ...profile };

      // Save user in Redux
      dispatch(setUserAction(finalUser));

      // Merge guest cart -> user cart
      try {
        dispatch(mergeGuestDataOnLogin(finalUser));
      } catch (err) {
        console.warn("Cart merge failed:", err.message);
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
}

// -------------------------------------------------------
// AUTH HELPERS
// -------------------------------------------------------
export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const loginWithGithub = () => signInWithPopup(auth, githubProvider);
export const logoutUser = () => signOut(auth);

export const loginWithEmailPassword = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const signUpWithEmailPassword = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);
