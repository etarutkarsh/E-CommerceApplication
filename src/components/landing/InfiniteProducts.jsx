import React, { useEffect, useState, useRef } from "react";
import ProductCard from "../ProductCard";

export default function InfiniteProducts() {
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const observerRef = useRef();

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    if (loading) return;
    setLoading(true);
    const res = await fetch(
      `https://dummyjson.com/products?limit=12&skip=${(page - 1) * 12}`
    );
    const data = await res.json();

    setProducts((prev) => [...prev, ...data.products]);
    if (data.products.length === 0) setHasMore(false);
    setLoading(false);
  };

  const lastProductRef = (node) => {
    if (!hasMore) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((p) => p + 1);
      }
    });

    if (node) observerRef.current.observe(node);
  };

  return (
    
    <section className="products-grid">
      {products.map((p, i) => {
        if (i === products.length - 1) {
          return (
            <div ref={lastProductRef} key={p.id}>
              <ProductCard product={p} />
            </div>
          );
        }
        return <ProductCard key={p.id} product={p} />;
      })}
    </section>
  );
}
