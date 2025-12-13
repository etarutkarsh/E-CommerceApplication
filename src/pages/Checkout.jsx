import OpenStreetMap from "../components/OpenStreetMap";
import Button from "@mui/material/Button";


import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearCart,
  updateQty, // ← YOU MUST ADD THIS IN cartSlice
} from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);

  const storeLocation = useMemo(
    () => ({
      lat: 28.6139,
      lng: 77.209,
    }),
    []
  );

  const cartItems = useSelector((s) => s.cart.items);
  const productsById = useSelector((s) => s.products.byId);

  let checkoutItem = JSON.parse(
    sessionStorage.getItem("checkout_item") || "null"
  );

  const items = checkoutItem ? [checkoutItem] : cartItems;

  const total = useMemo(() => {
    return items.reduce((sum, it) => {
      const p = productsById[it.productId] || {};
      return sum + (p.price || 0) * it.qty;
    }, 0);
  }, [items, productsById]);

  const handleQtyChange = (id, qty) => {
    if (!checkoutItem) {
      // only allowed when user is using cart checkout
      dispatch(updateQty({ productId: id, qty }));
    }
  };

  const [form, setForm] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
    deliveryOption: "standard",
  });
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePayment = async () => {
    await new Promise((res) => setTimeout(res, 800));
    alert("Payment Successful! Order placed.");
    if (!checkoutItem) dispatch(clearCart());
    sessionStorage.removeItem("checkout_item");
    navigate("/dashboard");
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.warn("Geolocation blocked, using fallback:", err);

        // fallback = central Delhi
        setUserLocation({
          lat: 28.6139,
          lng: 77.209,
        });
      }
    );
  }, []);
  console.log("CHECKOUT DATA:", {
    cartItems,
    productsById,
    items,
  });

return (
  <div className="checkout-wrapper">
    <div className="checkout-card">
      <h2 className="checkout-title">Checkout</h2>

      {/* ITEMS LIST */}
      <div className="checkout-section">
        <h3 className="section-title">Your Items</h3>

        <ul className="checkout-items">
          {items.map((it) => {
            const p = productsById[it.productId] || {
              title: "(Unknown Product)",
              price: 0,
              image: "https://via.placeholder.com/80",
            };

            return (
              <li key={it.productId} className="checkout-item">
                <img
                  src={p.thumbnail || p.images?.[0]}
                  alt={p.title}
                  className="item-img"
                />

                <div className="item-info">
                  <p className="item-title">{p.title}</p>
                  <p className="item-price">₹{p.price}</p>

                  {/* Quantity Controls */}
                  {checkoutItem ? (
                    <p className="item-qty">Qty: {it.qty}</p>
                  ) : (
                    <div className="qty-box">
                      <button
                        className="qty-btn"
                        onClick={() =>
                          handleQtyChange(it.productId, Math.max(1, it.qty - 1))
                        }
                      >
                        -
                      </button>

                      <span className="qty-count">{it.qty}</span>

                      <button
                        className="qty-btn"
                        onClick={() =>
                          handleQtyChange(it.productId, it.qty + 1)
                        }
                      >
                        +
                      </button>

                      {/* REMOVE BUTTON */}
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => dispatch(removeFromCart(it.productId))}
                        sx={{ marginLeft: "12px", height: "36px" }}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>

                <p className="item-total">₹{p.price * it.qty}</p>
                
              </li>
            );
          })}
        </ul>

        <div className="checkout-total">
          <span>Total Amount</span>
          <strong>₹{total.toFixed(2)}</strong>
        </div>
      </div>

      {/* ADDRESS FORM */}
      <div className="checkout-section">
        <h3 className="section-title">Delivery Details</h3>

        <form
          className="checkout-form"
          onSubmit={(e) => {
            e.preventDefault();
            handlePayment();
          }}
        >
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <textarea
            name="addressLine1"
            placeholder="Complete Address"
            value={form.addressLine1}
            onChange={handleChange}
            required
          />

          <div className="form-row">
            <input
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              required
            />
            <input
              name="state"
              placeholder="State"
              value={form.state}
              onChange={handleChange}
              required
            />
          </div>

          <input
            name="pincode"
            placeholder="Pincode"
            value={form.pincode}
            onChange={handleChange}
            required
          />

          <button type="submit" className="pay-btn">
            Pay ₹{total.toFixed(2)}
          </button>
        </form>
      </div>

      {/* MAP SECTION */}
      <div className="checkout-section">
        <h3 className="section-title">Delivery Route</h3>

        {userLocation ? (
          <OpenStreetMap
            userLocation={userLocation}
            storeLocation={storeLocation}
          />
        ) : (
          <p>Fetching your location...</p>
        )}
      </div>
    </div>
  </div>
);

}
