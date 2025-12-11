import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function FloatingCart() {
  const navigate = useNavigate();
  const count = useSelector((s) => s.cart.items.length);

  return (
    <div className="floating-cart" onClick={() => navigate("/checkout")}>
      🛒 <span>{count}</span>
    </div>
  );
}
