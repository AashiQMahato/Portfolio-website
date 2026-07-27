import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/** Live media-query hook gating every animation, Lenis, and the WebGL hero. */
export default function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia(QUERY).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const onChange = () => setReduced(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
