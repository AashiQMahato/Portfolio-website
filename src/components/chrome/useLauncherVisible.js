import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * Floating launchers (chat, terminal) stay out of the home hero — they would
 * sit on top of its calls to action — and appear once the reader has
 * scrolled into the content. Other routes show them immediately.
 */
export default function useLauncherVisible() {
  const { pathname } = useLocation();
  const onHome = pathname === "/";
  const [past, setPast] = useState(false);

  useEffect(() => {
    if (!onHome) return undefined;
    const check = () => setPast(window.scrollY > window.innerHeight * 0.7);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [onHome]);

  return !onHome || past;
}
