import { createContext, useCallback, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

const ThemeContext = createContext({ theme: "dark", setTheme: () => {}, toggleTheme: () => {} });

export const useTheme = () => useContext(ThemeContext);

// v3: the editorial redesign is dark-first, so earlier saved choices reset.
export const THEME_KEY = "portfolio-theme-v3";
const THEMES = ["dark", "light"];

const read = () => {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    return THEMES.includes(saved) ? saved : "dark";
  } catch {
    return "dark";
  }
};

/**
 * Dark-first theme. The inline script in index.html applies the saved class
 * before first paint; this provider owns changes after that. The colour
 * change itself is eased by the body transition in index.css, avoiding an
 * abrupt brightness jump.
 */
export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(read);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
    root.style.colorScheme = theme;
    document
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((m) => m.setAttribute("content", theme === "dark" ? "#070708" : "#F3F1EC"));
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* private mode — choice lasts for this page only */
    }
  }, [theme]);

  const setTheme = useCallback((next) => {
    // "system" is accepted for older callers and resolved once.
    if (next === "system") {
      next = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }
    if (THEMES.includes(next)) setThemeState(next);
  }, []);

  const toggleTheme = useCallback(
    () => setThemeState((t) => (t === "dark" ? "light" : "dark")),
    [],
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = { children: PropTypes.node };
