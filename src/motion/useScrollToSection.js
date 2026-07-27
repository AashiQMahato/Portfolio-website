import { useCallback } from "react";
import { useLenis } from "./SmoothScroll";

const NAV_OFFSET = -72;

/**
 * Returns a scrollTo(target) function that goes through Lenis when smooth
 * scrolling is active, or falls back to native scrollIntoView (reduced
 * motion / Lenis unmounted).
 */
export default function useScrollToSection() {
  const lenis = useLenis();

  return useCallback(
    (target) => {
      const el =
        typeof target === "string" ? document.querySelector(target) : target;
      if (!el) return;
      if (lenis) {
        lenis.scrollTo(el, { offset: NAV_OFFSET });
      } else {
        el.scrollIntoView({ block: "start" });
      }
    },
    [lenis],
  );
}
