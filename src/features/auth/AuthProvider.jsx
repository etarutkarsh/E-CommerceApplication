// src/features/auth/AuthProvider.jsx
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

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

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        dispatch(setUserAction(null));
        setAuthLoaded(true);
        return;
      }

      // Load Firestore user document safely
      let profile = {};
      try {
        const snap = await getDoc(doc(db, "users", fbUser.uid));
        if (snap.exists()) profile = snap.data();
      } catch (err) {
        console.warn("Skipping Firestore load:", err.message);
      }

      dispatch(
        setUserAction({
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName,
          ...profile,
        })
      );

      dispatch(mergeGuestDataOnLogin({ uid: fbUser.uid }));

      setAuthLoaded(true);
    });

    return () => unsubscribe();
  }, [dispatch]);

  // 🚀 Prevent screen flicker: show blank until auth is loaded
  if (!authLoaded) return null;

  return children;
}

// -------------------------------------------
// AUTH HELPERS
// -------------------------------------------
export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const loginWithGithub = () => signInWithPopup(auth, githubProvider);
export const logoutUser = () => signOut(auth);

export const loginWithEmailPassword = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const signUpWithEmailPassword = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);
