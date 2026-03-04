import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("portfolio-theme") || "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (isDark) => {
      root.classList.toggle("dark", isDark);
      root.classList.toggle("light", !isDark);
      root.style.colorScheme = isDark ? "dark" : "light";
    };

    if (theme === "system") {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      applyTheme(mql.matches);

      const handler = (e) => applyTheme(e.matches);
      mql.addEventListener("change", handler);
      try {
        localStorage.setItem("portfolio-theme", theme);
      } catch {}
      return () => mql.removeEventListener("change", handler);
    } else {
      applyTheme(theme === "dark");
      try {
        localStorage.setItem("portfolio-theme", theme);
      } catch {}
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
