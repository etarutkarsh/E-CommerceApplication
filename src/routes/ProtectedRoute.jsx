// src/routes/ProtectedRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useSelector((s) => s.auth);

  if (loading) {
    return <LoadingFallback />;
  } // wait for AuthProvider to finish

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
