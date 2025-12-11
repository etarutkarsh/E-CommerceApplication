import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function WishlistDropdown() {
  const wishlist = useSelector((s) => s.wishlist.items);
  const productsById = useSelector((s) => s.products.byId);

  const previewItems = wishlist.slice(0, 3);

  return (
    <div className="wishlist-dropdown">
      {previewItems.length === 0 ? (
        <p>No items yet</p>
      ) : (
        previewItems.map((id) => {
          const p = productsById[id];
          if (!p) return null;

          return (
            <Link to={`/products/${id}`} key={id} className="wishlist-item">
              <img src={p.image} alt={p.title} />
              <span>{p.title}</span>
            </Link>
          );
        })
      )}

      {wishlist.length > 3 && (
        <Link className="wishlist-see-all" to="/wishlist">
          See all →
        </Link>
      )}
      <button
        className="remove-btn"
        onClick={() => dispatch(removeFromWishlist(itemId))}
      >
        ✕
      </button>
    </div>
  );
}
