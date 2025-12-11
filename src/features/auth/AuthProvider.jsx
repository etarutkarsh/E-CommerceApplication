import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./authSlice";
import { initializeApp, getApps, getApp } from "firebase/app";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { mergeGuestDataOnLogin } from "../cart/cartSlice";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
const loginWithGithub = () => signInWithPopup(auth, githubProvider);
const logoutUser = () => signOut(auth);

const loginWithEmailPassword = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

const signUpWithEmailPassword = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const user = {
          uid: fbUser.uid,
          displayName: fbUser.displayName,
          email: fbUser.email,
          providerData: fbUser.providerData,
        };

        dispatch(setUser(user));
        await dispatch(mergeGuestDataOnLogin(user));
      } else {
        dispatch(setUser(null));
      }
    });

    return () => unsub();
  }, [dispatch]);

  return <>{children}</>;
}

export {
  auth,
  loginWithGoogle,
  loginWithGithub,
  loginWithEmailPassword,
  signUpWithEmailPassword,
  logoutUser,
};
