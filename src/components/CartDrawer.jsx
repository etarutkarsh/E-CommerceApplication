import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function CartDrawer({ open, onClose }) {
  const cartItems = useSelector((s) => s.cart.items);
  const products = useSelector((s) => s.products.byId);

  return (
    <div className={`cart-drawer ${open ? "open" : ""}`}>
      <div className="cart-drawer-header">
        <h3>Your Cart</h3>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="cart-drawer-body">
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map((it) => {
            const p = products[it.productId] || {};
            return (
              <div key={it.productId} className="drawer-item">
                <img src={p.image} alt="" />
                <div>
                  <p>{p.title}</p>
                  <strong>Qty: {it.qty}</strong>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Link to="/checkout" className="drawer-checkout-btn">
        Go to Checkout
      </Link>
    </div>
  );
}
