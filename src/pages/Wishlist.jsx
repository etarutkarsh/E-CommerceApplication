import React from "react";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../components/ProductCard";
import { removeFromWishlist } from "../features/wishlist/wishlistSlice";

export default function Wishlist() {
  const dispatch = useDispatch(); // ✅ FIXED

  const wishlistIds = useSelector((s) => s.wishlist.items);
  const productsById = useSelector((s) => s.products.byId);

  if (wishlistIds.length === 0) {
    return <h2 style={{ padding: 20 }}>Your wishlist is empty ❤️</h2>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>My Wishlist</h2>

      <div className="products-grid">
        {wishlistIds.map((id) => {
          const product = productsById[id];
          if (!product) return null;

          return (
            <div key={id} style={{ position: "relative" }}>
              <ProductCard product={product} />

              <button
                style={{
                  marginTop: 10,
                  background: "#e63946",
                  color: "white",
                  padding: "8px 14px",
                  borderRadius: "8px",
                }}
                onClick={() => dispatch(removeFromWishlist(id))}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
