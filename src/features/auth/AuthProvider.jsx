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
  apiKey: "AIzaSyAs6jl1ahYeBu1XTyZYzcsfBYBeuCsaUbE",
  authDomain: "e-commerceapplication-f3c61.firebaseapp.com",
  projectId: "e-commerceapplication-f3c61",
  storageBucket: "e-commerceapplication-f3c61.firebasestorage.app",
  messagingSenderId: "22624828098",
  appId: "1:22624828098:web:af61c65cc01ac9dca5d95b",
  measurementId: "G-KGEDESZZLY",
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
