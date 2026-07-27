import { useEffect, useState } from "react";

/** Tracks the `dark` class the ThemeProvider stamps on <html>. */
const useDocumentTheme = () => {
  const read = () =>
    document.documentElement.classList.contains("dark") ? "dark" : "light";
  const [theme, setTheme] = useState(read);

  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(read()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return theme;
};

export default useDocumentTheme;
