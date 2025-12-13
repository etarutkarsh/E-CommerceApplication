import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function FloatingCart() {
  const navigate = useNavigate();
  const count = useSelector((s) =>
  s.cart.items.reduce((sum, item) => sum + item.qty, 0)
);


  return (
    <div className="floating-cart" onClick={() => {
      sessionStorage.removeItem("checkout_item");
       navigate("/checkout");
      }}>
      🛒 <span>{count}</span>
    </div>
  );
}
