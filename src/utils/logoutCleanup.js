export const cleanupLocalStorage = (uid) => {
  localStorage.removeItem("userDetails");
  localStorage.removeItem("guest_cart_v1");
  localStorage.removeItem("guest_wishlist_v1");

  if (uid) {
    localStorage.removeItem(`cart_${uid}`);
    localStorage.removeItem(`wishlist_${uid}`);
  }
};
