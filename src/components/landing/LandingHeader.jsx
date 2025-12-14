// components/landing/LandingHeader.jsx
import { Button } from "@mui/material";

export default function LandingHeader() {
  return (
    <header className="landing-header">
      <h1>Etar Luxury</h1>

      <Button
        variant="contained"
        onClick={() => (window.location.href = "/login")}
      >
        Login
      </Button>
    </header>
  );
}
