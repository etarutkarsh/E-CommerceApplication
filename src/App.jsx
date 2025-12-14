import "./styles.css";
import React, { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Wishlist from "./pages/Wishlist";
import SignupDetails from "./pages/SignupDetails";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import Signup from "./pages/Signup";

import {
  fetchProducts,
  setProductsFromStatic,
} from "./features/products/productsSlice";

import LoadingFallback from "./components/LoadingFallback";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

const LandingPage = lazy(() => import("./pages/LandingPage.jsx"));
const ProductDetail = lazy(() => import("./pages/ProductDetail.lazy"));

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const productsStatus = useSelector((s) => s.products.status);

  useEffect(() => {
    if (productsStatus === "idle") {
      dispatch(fetchProducts()).catch(() => {
        dispatch(
          setProductsFromStatic([
            { id: "p1", title: "Sample T-shirt", price: 299 },
            { id: "p2", title: "Sneakers", price: 2499 },
          ])
        );
      });
    }
  }, [dispatch, productsStatus]);

  return (
    <div className="App">
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* 🌍 LANDING PAGE (PUBLIC, NO HEADER) */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            }
          />

          {/* 🔐 AUTH PAGES */}
          <Route
            path="/login"
            element={
              <AuthLayout>
                <PublicRoute>
                  <Login />
                </PublicRoute>
              </AuthLayout>
            }
          />

          <Route
            path="/signup"
            element={
              <AuthLayout>
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              </AuthLayout>
            }
          />

          {/* 🔒 PROTECTED PAGES */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout
                  drawerOpen={drawerOpen}
                  setDrawerOpen={setDrawerOpen}
                >
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <MainLayout
                  drawerOpen={drawerOpen}
                  setDrawerOpen={setDrawerOpen}
                >
                  <Wishlist />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <MainLayout
                  drawerOpen={drawerOpen}
                  setDrawerOpen={setDrawerOpen}
                >
                  <Checkout />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/:id"
            element={
              <ProtectedRoute>
                <MainLayout
                  drawerOpen={drawerOpen}
                  setDrawerOpen={setDrawerOpen}
                >
                  <ProductDetail />
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </div>
  );
}
