// src/routes/PublicRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import FullPageLoader from "../components/loaders/FullPageLoader";
export default function PublicRoute({ children }) {
  const { user, loading } = useSelector((s) => s.auth);

  if (loading) return <FullPageLoader />; // block until auth is ready

  if (user) return <Navigate to="/dashboard" replace />;

  return children;
}
