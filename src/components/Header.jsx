import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { logoutUser } from "../features/auth/AuthProvider";
import ThemeToggle from "./ThemeToggle";
import WishlistDropdown from "./WishlistDropdown";

export default function Header() {
  const cart = useSelector((s) => s.cart.items);
  const wishlist = useSelector((s) => s.wishlist.items);
  const wishlistCount = wishlist.length;
  const user = useSelector((s) => s.auth.user);

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`lux-header ${scrolled ? "scrolled" : ""}`}>
      {/* MOBILE HAMBURGER */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      {/* LEFT NAVIGATION (HIDDEN ON MOBILE) */}
      <nav className={`lux-nav-left ${menuOpen ? "open" : ""}`}>
        <Link
          className="nav-item"
          to="/dashboard"
          onClick={() => setMenuOpen(false)}
        >
          Home
        </Link>

        <Link
          className="nav-item"
          to="/checkout"
          onClick={() => setMenuOpen(false)}
        >
          Checkout ({cart.length})
        </Link>

        <div className="wishlist-wrapper">
          <Link className="nav-item" to="/wishlist">
            Wishlist ❤️ {wishlistCount}
          </Link>
          <WishlistDropdown items={wishlist} />
        </div>
      </nav>

      {/* CENTER LOGO */}
      <div className="lux-logo">Etar Luxury</div>

      {/* RIGHT SIDE (USER + TOGGLE) */}
      <div className="lux-nav-right">
        {user ? (
          <>
            <span className="user-name">{user.displayName}</span>
            <button onClick={logoutUser}>Logout</button>
          </>
        ) : (
          <Link className="nav-item" to="/login">
            Login
          </Link>
        )}

        <ThemeToggle />
      </div>
    </header>
  );
}
