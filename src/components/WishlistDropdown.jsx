// src/components/WishlistDropdown.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { removeFromWishlist } from "../features/wishlist/wishlistSlice";
import { addToCart } from "../features/cart/cartSlice";

export default function WishlistDropdown() {
  const dispatch = useDispatch();

  const wishlist = useSelector((s) => s.wishlist.items);
  const productsById = useSelector((s) => s.products.byId);

  const previewItems = wishlist.slice(0, 3);

  const handleMoveToCart = (productId) => {
    dispatch(addToCart({ productId, qty: 1 })); // Add to cart
    dispatch(removeFromWishlist(productId)); // Remove from wishlist
  };

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  return (
    <div className="wishlist-dropdown">
      {previewItems.length === 0 ? (
        <p>No items yet ❤️</p>
      ) : (
        previewItems.map((id) => {
          const p = productsById[id];
          if (!p) return null;

          return (
            <div
              key={id}
              className="wishlist-item"
              style={{ display: "flex", alignItems: "center", gap: 10 }}
            >
              {/* Product Image */}
              <img
                src={p.thumbnail || p.images?.[0]}
                alt={p.title}
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/80")
                }
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: 8,
                  objectFit: "cover",
                }}
              />

              {/* Product Info */}
              <div style={{ flexGrow: 1 }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                  {p.title}
                </span>
                <br />
                <span style={{ color: "#d4af37", fontWeight: 700 }}>
                  ₹{p.price}
                </span>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <button
                  className="move-btn"
                  style={{
                    background: "#d4af37",
                    borderRadius: 6,
                    padding: "4px 8px",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                  }}
                  onClick={() => handleMoveToCart(id)}
                >
                  Move to Cart
                </button>

                <button
                  className="remove-btn"
                  style={{
                    background: "#e63946",
                    color: "white",
                    borderRadius: 6,
                    padding: "4px 8px",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                  }}
                  onClick={() => handleRemove(id)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })
      )}

      {wishlist.length > 3 && (
        <Link className="wishlist-see-all" to="/wishlist">
          See all →
        </Link>
      )}
    </div>
  );
}
