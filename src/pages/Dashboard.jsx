import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import Filters from "../components/Filter";

export default function Dashboard() {
  const products = useSelector((s) => s.products.items);
  const status = useSelector((s) => s.products.status);

  const [filters, setFilters] = useState({
    category: "",
    search: "",
    sort: "",
    maxPrice: 2000,
  });

  const categories = [...new Set(products.map((p) => p.category))];

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // FILTER BY CATEGORY
    if (filters.category) {
      list = list.filter((p) => p.category === filters.category);
    }

    // SEARCH
    if (filters.search.trim()) {
      list = list.filter((p) =>
        p.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // PRICE RANGE
    list = list.filter((p) => p.price <= filters.maxPrice);

    // SORT
    switch (filters.sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "az":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "za":
        list.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    return list;
  }, [products, filters]);

  if (status === "loading")
    return <h2 style={{ padding: 20 }}>Loading products…</h2>;

  return (
    <main style={{ padding: 20 }}>
      <h1>Products</h1>

      <Filters
        categories={categories}
        filters={filters}
        setFilters={setFilters}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 20,
        }}
      >
        {filteredProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <h3 style={{ opacity: 0.7, marginTop: 20 }}>
          No products match your filters.
        </h3>
      )}
    </main>
  );
}
