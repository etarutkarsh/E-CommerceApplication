import React from "react";

export default function HeroSection() {
  const handleScrollToProducts = () => {
    document
      .querySelector(".products-grid")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          Discover <span>Luxury</span> That Defines You
        </h1>

        <p>
          Hand-picked premium products crafted for elegance, quality and
          comfort.
        </p>

        <button onClick={handleScrollToProducts}>Explore Collection</button>
      </div>
    </section>
  );
}
