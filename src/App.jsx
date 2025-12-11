import "./styles.css";
import React, { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Wishlist from "./pages/Wishlist";

import FloatingCart from "./components/FloatingCart";
import CartDrawer from "./components/CartDrawer";

import {
  fetchProducts,
  setProductsFromStatic,
} from "./features/products/productsSlice";


import Header from "./components/Header";
import LoadingFallback from "./components/LoadingFallback";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";

// Lazy-loaded page
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
      <Header />
      {drawerOpen && (
        <div
          className="drawer-backdrop"
          onClick={() => setDrawerOpen(false)}
        ></div>
      )}
      {/* CART DRAWER */}
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* FLOATING CART BUTTON (OPEN DRAWER) */}
      <FloatingCart onOpenDrawer={() => setDrawerOpen(true)} />

      {/* PAGE ROUTES */}
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* PRODUCT DETAIL */}
          <Route path="/products/:id" element={<ProductDetail />} />

          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </Suspense>
    </div>
  );
}
