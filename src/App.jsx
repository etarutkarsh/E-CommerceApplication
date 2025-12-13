import "./styles.css";
import React, { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Wishlist from "./pages/Wishlist";
import SignupDetails from "./pages/SignupDetails";
import FloatingCart from "./components/FloatingCart";
import CartDrawer from "./components/CartDrawer";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

import {
  fetchProducts,
  setProductsFromStatic,
} from "./features/products/productsSlice";

import Header from "./components/Header";
import LoadingFallback from "./components/LoadingFallback";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";
import CartPage from "./pages/CartPage";

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
            {
              id: "p1",
              title: "Sample T-shirt",
              price: 299,
              description: "Comfortable cotton tee",
              image: "images/tshirt.jpg",
            },
            {
              id: "p2",
              title: "Sneakers",
              price: 2499,
              description: "Stylish sneakers",
              image: "/images/sneakers.jpg",
            },
          ])
        );
      });
    }
  }, [dispatch, productsStatus]);

  return (
    <div className="App">
      <Header onOpenCart={() => setDrawerOpen(true)} />

      {drawerOpen && (
        <div
          className="drawer-backdrop"
          onClick={() => setDrawerOpen(false)}
        ></div>
      )}

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <FloatingCart onOpenDrawer={() => setDrawerOpen(true)} />

      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* PUBLIC ROUTES */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/signup-details"
            element={
              <PublicRoute>
                <SignupDetails />
              </PublicRoute>
            }
          />

          {/* PROTECTED ROUTES */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/:id"
            element={
              <ProtectedRoute>
                <ProductDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </div>
  );
}
