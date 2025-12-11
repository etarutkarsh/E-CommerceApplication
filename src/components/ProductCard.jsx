import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import { addToWishlist } from "../features/wishlist/wishlistSlice";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const id = product.id;

  const handleBuyNow = () => {
    const token = localStorage.getItem("auth_token");

    sessionStorage.setItem(
      "checkout_item",
      JSON.stringify({ productId: id, qty: 1 })
    );

    if (!token) {
      // redirect to login THEN redirect back to checkout
      sessionStorage.setItem("post_login_redirect", "/checkout");
      return navigate("/login");
    }

    navigate("/checkout");
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.title} />

      <h3>{product.title}</h3>
      <p className="price">₹{product.price}</p>

      <div className="card-actions">
        <button onClick={() => dispatch(addToCart({ productId: id, qty: 1 }))}>
          Add to Cart
        </button>

        <button onClick={() => dispatch(addToWishlist(id))}>❤️</button>

        <button onClick={() => navigate(`/products/${id}`)}>View</button>
        <button onClick={handleBuyNow}>Buy Now</button>
      </div>
    </div>
  );
}
