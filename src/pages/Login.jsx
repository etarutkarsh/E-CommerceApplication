// src/pages/Login.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { loginUser } from "../features/auth/authThunks";
import {
  loginWithGoogle,
  loginWithGithub,
} from "../features/auth/AuthProvider"; // ⬅ ADDED

export default function Login() {
  const dispatch = useDispatch();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  // -----------------------------
  // EMAIL + USERNAME LOGIN
  // -----------------------------
  const handleLogin = async () => {
    if (!emailOrUsername.trim() || !password.trim()) {
      alert("Please enter login details");
      return;
    }

    setLoading(true);

    try {
      const res = await dispatch(loginUser({ emailOrUsername, password }));

      if (res.meta.requestStatus === "fulfilled") {
        window.location.href = "/dashboard";
      } else {
        alert("Login Failed: " + res.payload);
      }
    } catch (e) {
      alert("Login Failed: " + e.message);
    }

    setLoading(false);
  };

  // -----------------------------
  // GOOGLE AUTH
  // -----------------------------
  const handleGoogleLogin = async () => {
    try {
      setOauthLoading(true);
      await loginWithGoogle(); // Firebase popup
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Google login failed: " + err.message);
    }
    setOauthLoading(false);
  };

  // -----------------------------
  // GITHUB AUTH
  // -----------------------------
  const handleGithubLogin = async () => {
    try {
      setOauthLoading(true);
      await loginWithGithub(); // Firebase popup
      window.location.href = "/dashboard";
    } catch (err) {
      alert("GitHub login failed: " + err.message);
    }
    setOauthLoading(false);
  };

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 400,
        margin: "0 auto",
        background: "white",
        borderRadius: 12,
        boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ marginBottom: 20 }}>Login</h2>

      {/* EMAIL OR USERNAME LOGIN */}
      <label>Email or Username</label>
      <input
        type="text"
        value={emailOrUsername}
        placeholder="Enter email or username"
        onChange={(e) => setEmailOrUsername(e.target.value)}
        style={{ width: "100%", padding: 10, marginTop: 5 }}
      />

      <label style={{ marginTop: 12 }}>Password</label>
      <input
        type="password"
        value={password}
        placeholder="Enter password"
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: 10, marginTop: 5 }}
      />

      <button
        onClick={handleLogin}
        style={{ width: "100%", padding: 12, marginTop: 15 }}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      {/* CREATE ACCOUNT */}
      <button
        onClick={() => (window.location.href = "/signup-details")}
        style={{
          width: "100%",
          padding: 12,
          marginTop: 12,
          background: "#4b7bec",
          color: "white",
        }}
      >
        Create New Account
      </button>

      {/* DIVIDER */}
      <div
        style={{
          margin: "20px 0",
          textAlign: "center",
          opacity: 0.6,
          fontSize: "0.9rem",
        }}
      >
        OR CONTINUE WITH
      </div>

      {/* GOOGLE LOGIN */}
      <button
        onClick={handleGoogleLogin}
        disabled={oauthLoading}
        style={{
          width: "100%",
          padding: 12,
          background: "#db4437",
          color: "white",
          marginBottom: 10,
        }}
      >
        {oauthLoading ? "Please wait..." : "Sign in with Google"}
      </button>

      {/* GITHUB LOGIN */}
      <button
        onClick={handleGithubLogin}
        disabled={oauthLoading}
        style={{
          width: "100%",
          padding: 12,
          background: "#333",
          color: "white",
        }}
      >
        {oauthLoading ? "Please wait..." : "Sign in with GitHub"}
      </button>
    </div>
  );
}
