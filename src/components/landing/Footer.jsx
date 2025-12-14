// components/landing/Footer.jsx
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <h3>Etar Luxury</h3>
        <p>Premium products. Seamless shopping.</p>
      </div>

      <div className="footer-links">
        <a href="#">About</a>
        <a href="#">Products</a>
        <a href="#">Contact</a>
        <a href="#">Privacy Policy</a>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Etar Luxury. All rights reserved.</p>
      </div>
    </footer>
  );
}
