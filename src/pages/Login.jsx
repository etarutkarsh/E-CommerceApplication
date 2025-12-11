import React, { useState } from "react";
import {
  loginWithGoogle,
  loginWithGithub,
  loginWithEmailPassword,
  signUpWithEmailPassword,
} from "../features/auth/AuthProvider";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = async () => {
    try {
      await loginWithEmailPassword(email, password);
      alert("Logged in successfully");
    } catch (e) {
      alert("Login Failed: " + e.message);
    }
  };

  const handleEmailSignup = async () => {
    try {
      await signUpWithEmailPassword(email, password);
      alert("Account created & logged in");
    } catch (e) {
      alert("Signup Failed: " + e.message);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
    } catch (e) {
      alert("Google Login Failed: " + e.message);
    }
  };

  const handleGithub = async () => {
    try {
      await loginWithGithub();
    } catch (e) {
      alert("Github Login Failed: " + e.message);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "0 auto" }}>
      <h2>Login</h2>

      {/* Email */}
      <div style={{ marginBottom: 10 }}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 8, marginTop: 5 }}
        />
      </div>

      {/* Password */}
      <div style={{ marginBottom: 10 }}>
        <label>Password</label>
        <input
          type="password"
          value={password}
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 8, marginTop: 5 }}
        />
      </div>

      <button onClick={handleEmailLogin} style={{ width: "100%", padding: 10 }}>
        Login with Email
      </button>

      <button
        onClick={handleEmailSignup}
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      >
        Sign Up
      </button>

      <hr style={{ margin: "20px 0" }} />

      <button onClick={handleGoogle} style={{ width: "100%", padding: 10 }}>
        Sign in with Google
      </button>

      <button
        onClick={handleGithub}
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      >
        Sign in with GitHub
      </button>
    </div>
  );
}
