import React from "react";
import Header from "../components/Header";
import FloatingCart from "../components/FloatingCart";
import CartDrawer from "../components/CartDrawer";

export default function MainLayout({ children, drawerOpen, setDrawerOpen }) {
  return (
    <>
      <Header onOpenCart={() => setDrawerOpen(true)} />

      {drawerOpen && (
        <div className="drawer-backdrop" onClick={() => setDrawerOpen(false)} />
      )}

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <FloatingCart onOpenDrawer={() => setDrawerOpen(true)} />

      {children}
    </>
  );
}
