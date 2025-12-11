import OpenStreetMap from "../components/OpenStreetMap";

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

  const checkoutItem = JSON.parse(
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

  return (
    <div style={{ padding: 20, maxWidth: 720, margin: "auto" }}>
      <h2>Checkout</h2>

      <h3>Items</h3>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((it) => {
          const p = productsById[it.productId] || {
            title: "(Unknown Product)",
            price: 0,
            image: "https://via.placeholder.com/80",
          };

          return (
            <li
              key={it.productId}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 20,
                paddingBottom: 10,
                borderBottom: "1px solid #ccc",
              }}
            >
              {/* Product Image */}
              <img
                src={p.image}
                alt={p.title}
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />

              {/* Product Details */}
              <div style={{ flex: 1 }}>
                <strong>{p.title}</strong>
                <p>₹{p.price}</p>

                {/* Quantity Controls */}
                {checkoutItem ? (
                  <p>Qty: {it.qty}</p>
                ) : (
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <button
                      onClick={() =>
                        handleQtyChange(it.productId, Math.max(1, it.qty - 1))
                      }
                    >
                      -
                    </button>

                    <span>{it.qty}</span>

                    <button
                      onClick={() => handleQtyChange(it.productId, it.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>

              {/* Price */}
              <p style={{ fontWeight: "bold" }}>₹{p.price * it.qty}</p>
            </li>
          );
        })}
      </ul>

      <p>
        <strong>Total: ₹{total}</strong>
      </p>

      <h3>Delivery & Address</h3>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handlePayment();
        }}
      >
        <div>
          <label>Name</label>
          <br />
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Phone</label>
          <br />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Address</label>
          <br />
          <textarea
            name="addressLine1"
            value={form.addressLine1}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>City</label>
          <br />
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>State</label>
          <br />
          <input
            name="state"
            value={form.state}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Pincode</label>
          <br />
          <input
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
            required
          />
        </div>

        <hr />
        <button type="submit">Pay ₹{total} (Mock Payment)</button>
      </form>
      <h3>Your Location & Store Route</h3>

      {userLocation ? (
        <OpenStreetMap
          userLocation={userLocation}
          storeLocation={storeLocation}
        />
      ) : (
        <p>Fetching location...</p>
      )}
    </div>
  );
}
