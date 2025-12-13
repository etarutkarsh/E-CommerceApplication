import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQty } from "../features/cart/cartSlice";

export default function CartPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector((s) => s.cart.items);
  const products = useSelector((s) => s.products.byId);

  return (
    <div style={{ padding: 20 }}>
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item) => {
          const p = products[item.productId];
          if (!p) return null;

          return (
            <div
              key={item.productId}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 20,
                gap: 16,
                borderBottom: "1px solid #eee",
                paddingBottom: 10,
              }}
            >
              {/* FIXED IMAGE */}
              <img
                src={p.thumbnail || p.images?.[0]}
                alt={p.title}
                style={{ width: 70, height: 70, borderRadius: 8 }}
              />

              <div style={{ flexGrow: 1 }}>
                <h4>{p.title}</h4>
                <p>₹{p.price}</p>

                <div style={{ display: "flex", gap: 10 }}>
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

                  <strong>{item.qty}</strong>

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

                <button
                  style={{ color: "red", marginTop: 6 }}
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
  );
}
