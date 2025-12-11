import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../features/products/productsSlice";
import ProductCard from "../components/ProductCard";

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = useSelector((s) => s.products.byId[id]);

  useEffect(() => {
    if (!product) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id, product]);

  if (!product)
    return (
      <div style={{ padding: 30 }}>
        <h2>Loading product...</h2>
        <div className="product-detail-skeleton">
          <div className="img-skeleton" />
          <div className="text-skeleton long" />
          <div className="text-skeleton" />
          <div className="text-skeleton short" />
        </div>
      </div>
    );

  return (
    <div style={{ padding: 20 }}>
      <h1>{product.title}</h1>

      <div className="product-detail-container">
        <img src={product.image} alt={product.title} />

        <div>
          <p style={{ maxWidth: 600 }}>{product.description}</p>
          <h2>₹{product.price}</h2>
        </div>
      </div>

      <h3>Quick Actions</h3>
      <ProductCard product={product} />
    </div>
  );
}
