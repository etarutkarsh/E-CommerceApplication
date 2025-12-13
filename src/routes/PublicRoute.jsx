// src/routes/PublicRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const user = useSelector((s) => s.auth.user);
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}
