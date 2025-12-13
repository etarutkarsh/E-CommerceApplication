// src/components/CartDrawer.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromCart, updateQty } from "../features/cart/cartSlice";

export default function CartDrawer({ open, onClose }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((s) => s.cart.items);
  const products = useSelector((s) => s.products.byId);

  const totalPrice = cartItems.reduce((sum, it) => {
    const p = products[it.productId];
    return sum + (p?.price || 0) * it.qty;
  }, 0);

  return (
    <div className={`cart-drawer ${open ? "open" : ""}`}>
      {/* HEADER */}
      <div className="cart-header">
        <h3>Your Cart</h3>
        <button onClick={onClose} className="close-cart-btn">
          ✕
        </button>
      </div>

      {/* BODY */}
      <div className="cart-body">
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map((item) => {
            const p = products[item.productId];
            if (!p) return null;

            return (
              <div key={item.productId} className="cart-item">
                {/* Image */}
                <img
                  src={p.thumbnail || p.images?.[0]}
                  alt={p.title}
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/80")
                  }
                />

                {/* Info */}
                <div className="cart-item-info">
                  <p className="cart-item-title">{p.title}</p>
                  <p className="cart-item-price">₹{p.price}</p>

                  {/* Qty Controls */}
                  <div className="qty-controls">
                    <button
                      onClick={() =>
                        dispatch(
                          updateQty({
                            productId: item.productId,
                            qty: Math.max(1, item.qty - 1),
                          })
                        )
                      }
                    >
                      -
                    </button>

                    <span>{item.qty}</span>

                    <button
                      onClick={() =>
                        dispatch(
                          updateQty({
                            productId: item.productId,
                            qty: item.qty + 1,
                          })
                        )
                      }
                    >
                      +
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    className="remove-item-btn"
                    onClick={() => dispatch(removeFromCart(item.productId))}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FOOTER */}
      {cartItems.length > 0 && (
        <div className="cart-footer">
          <h3>Total: ₹{totalPrice}</h3>
          <Link
            to="/checkout"
            onClick={() => {
              sessionStorage.removeItem("checkout_item"); // ← FIX
              onClose();
            }}
            className="drawer-checkout-btn"
            style={{
              display: "block",
              background: "#d4af37",
              padding: "12px",
              borderRadius: "10px",
              textAlign: "center",
              color: "black",
              fontWeight: "bold",
            }}
          >
            Go to Cart →
          </Link>
        </div>
      )}
    </div>
  );
}
