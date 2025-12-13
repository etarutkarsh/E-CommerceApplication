// src/components/Header.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Fade from "@mui/material/Fade";

import MenuIcon from "@mui/icons-material/Menu";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import ThemeToggle from "./ThemeToggle";
import WishlistDropdown from "./WishlistDropdown";
import { logout } from "../features/auth/authSlice";
import CartDrawer from "./CartDrawer";
export default function Header({ onOpenCart }) {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  // user menu
  const [menuAnchor, setMenuAnchor] = useState(null);
  const openUserMenu = (e) => setMenuAnchor(e.currentTarget);
  const closeUserMenu = () => setMenuAnchor(null);
  const [cartOpen, setCartOpen] = useState(false);


  // wishlist hover
  const [wishlistOpen, setWishlistOpen] = useState(false);

  const displayName =
    user?.username ||
    user?.fullName ||
    user?.displayName ||
    (user?.email ? user.email.split("@")[0] : "Guest");

  const handleLogout = () => {
    dispatch(logout());
    closeUserMenu();
    window.location.href = "/login";
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backdropFilter: "blur(14px)",
          background: "rgba(255, 255, 255, 0.45)",
          borderBottom: "1px solid rgba(0,0,0,0.1)",
          padding: "8px 0",
          zIndex: 3000,
        }}
      >
        <Toolbar sx={{ display: "flex", alignItems: "center" }}>
          {/* MOBILE MENU */}
          <IconButton
            sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
            onClick={() => setMobileMenuOpen(true)}
          >
            <MenuIcon sx={{ color: "#000" }} />
          </IconButton>

          {/* CENTER LOGO */}
          <Typography
            variant="h6"
            onClick={() => (window.location.href = "/dashboard")}
            sx={{
              flexGrow: 1,
              cursor: "pointer",
              textAlign: "center",
              fontWeight: 800,
              fontSize: "1.7rem",
              background: "linear-gradient(45deg, #d4af37, #f5e6b8)",
              WebkitBackgroundClip: "text",
              color: "transparent",
              letterSpacing: "1px",
            }}
          >
            Etar-Luxury
          </Typography>

          {/* RIGHT ICONS */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Wishlist */}
            <div
              className="wishlist-wrapper"
              onMouseEnter={() => setWishlistOpen(true)}
              onMouseLeave={() => setWishlistOpen(false)}
              onClick={() => (window.location.href = "/wishlist")}
            >
              <IconButton sx={{ color: "#000" }}>
                <FavoriteBorderIcon />
              </IconButton>

              {wishlistOpen && <WishlistDropdown />}
            </div>

            {/* Cart */}
           <IconButton sx={{ color: "#000" }} onClick={onOpenCart}>
  <ShoppingCartIcon />
</IconButton>

              {cartOpen && (
                <CartDrawer
                  open={cartOpen}
                  onClose={() => setCartOpen(false)}
                />
              )}

            {/* Avatar */}
            {user && (
              <IconButton onClick={openUserMenu}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    background: "#d4af37",
                    color: "#000",
                    fontWeight: 700,
                  }}
                >
                  {displayName[0]?.toUpperCase()}
                </Avatar>
              </IconButton>
            )}

            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={closeUserMenu}
              TransitionComponent={Fade}
              PaperProps={{
                elevation: 6,
                sx: {
                  mt: 1.5,
                  borderRadius: "16px",
                  padding: "6px",
                  minWidth: 160,
                  zIndex: 99999,
                  background: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(12px)",
                },
              }}
            >
              <MenuItem onClick={() => (window.location.href = "/settings")}>
                Settings
              </MenuItem>
              <MenuItem
                onClick={() => (window.location.href = "/edit-profile")}
              >
                Edit Profile
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
                Logout
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
}
