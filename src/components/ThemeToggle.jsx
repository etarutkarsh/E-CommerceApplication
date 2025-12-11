import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="toggle-wrapper" onClick={toggleTheme}>
      <div className={`toggle-switch ${theme === "dark" ? "active" : ""}`}>
        <div className="toggle-thumb"></div>
      </div>
    </div>
  );
}
