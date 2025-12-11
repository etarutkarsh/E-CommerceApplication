import React from "react";

export default function Filter({ categories, filters, setFilters }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        padding: 16,
        background: "var(--card-bg)",
        borderRadius: 12,
        border: "1px solid var(--border)",
        marginBottom: 20,
      }}
    >
      {/* CATEGORY FILTER */}
      <select
        value={filters.category}
        onChange={(e) =>
          setFilters((f) => ({ ...f, category: e.target.value }))
        }
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search products..."
        value={filters.search}
        onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
        style={{
          padding: 6,
          minWidth: 200,
        }}
      />

      {/* SORT */}
      <select
        value={filters.sort}
        onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
      >
        <option value="">Sort By</option>
        <option value="price-asc">Price - Low to High</option>
        <option value="price-desc">Price - High to Low</option>
        <option value="az">Name A-Z</option>
        <option value="za">Name Z-A</option>
      </select>

      {/* PRICE RANGE */}
      <input
        type="range"
        min="0"
        max="2000"
        value={filters.maxPrice}
        onChange={(e) =>
          setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))
        }
      />
      <span>Max: ₹{filters.maxPrice}</span>
    </div>
  );
}
