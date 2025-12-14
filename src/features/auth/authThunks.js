// src/features/auth/authThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  signInWithEmailAndPassword as fbSignIn,
  createUserWithEmailAndPassword as fbCreateUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebaseClient.js";

// Helper: username → uid/email lookup
const lookupByUsername = async (username) => {
  const snap = await getDoc(doc(db, "usernames", username.toLowerCase()));
  if (!snap.exists()) return null;
  return snap.data(); // { uid, email }
};

// 1) SIGN UP WITH EMAIL/PASSWORD
export const signupWithEmail = createAsyncThunk(
  "auth/signupWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await fbCreateUser(auth, email, password);
      return { uid: res.user.uid, email: res.user.email };
    } catch (err) {
      return rejectWithValue(err.message || err.code);
    }
  }
);
export const signupAndSaveProfile = createAsyncThunk(
  "auth/signupAndSaveProfile",
  async (data, { rejectWithValue }) => {
    try {
      const { email, password, username } = data;

      // 1. Create Firebase Auth user
      const res = await fbCreateUser(auth, email, password);
      const uid = res.user.uid;

      // 2. Check username availability
      const usernameRef = doc(db, "usernames", username);
      const snap = await getDoc(usernameRef);
      if (snap.exists()) return rejectWithValue("Username already taken");

      // 3. Save profile
      await setDoc(doc(db, "users", uid), {
        uid,
        ...data,
        createdAt: serverTimestamp(),
      });

      // 4. Map username → uid
      await setDoc(usernameRef, { uid, email });

      return { uid, ...data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


// 2) SAVE USER PROFILE TO FIRESTORE
export const saveUserDetails = createAsyncThunk(
  "auth/saveUserDetails",
  async (userData, { rejectWithValue }) => {
    try {
      const { uid, username, email } = userData;
      const uname = username.toLowerCase();

      // Check if username exists
      const usernameDoc = doc(db, "usernames", uname);
      const usernameSnap = await getDoc(usernameDoc);
      if (usernameSnap.exists()) {
        return rejectWithValue("Username already taken");
      }

      // Write users/{uid}
      await setDoc(doc(db, "users", uid), {
        uid,
        email,
        username: uname,
        fullName: userData.fullName,
        age: userData.age,
        dob: userData.dob,
        createdAt: serverTimestamp(),
      });

      // Write usernames/{username}
      await setDoc(usernameDoc, { uid, email });

      return userData;
    } catch (err) {
      return rejectWithValue(err.message || err.code);
    }
  }
);

// 3) LOGIN: EMAIL OR USERNAME
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ emailOrUsername, password }, { rejectWithValue }) => {
    try {
      let targetEmail = emailOrUsername;

      // If it's NOT an email → treat as username
      if (!emailOrUsername.includes("@")) {
        const map = await lookupByUsername(emailOrUsername);
        if (!map) return rejectWithValue("Username not found");
        targetEmail = map.email;
      }

      const res = await fbSignIn(auth, targetEmail, password);
      return { uid: res.user.uid, email: res.user.email };
    } catch (err) {
      return rejectWithValue(err.message || err.code);
    }
  }
);
