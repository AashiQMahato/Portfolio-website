import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLenis } from "./SmoothScroll";

const NAV_OFFSET = -72;

/**
 * Route-change scroll behavior: new pathname → jump to top; hash → smooth
 * scroll to the matching section (used by the old section-route redirects
 * and nav anchor links).
 */
const ScrollManager = () => {
  const { pathname, hash } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        requestAnimationFrame(() => {
          if (lenis) lenis.scrollTo(el, { offset: NAV_OFFSET });
          else el.scrollIntoView({ block: "start" });
        });
        return;
      }
    }
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    // Deliberately not keyed on `lenis` — re-running on Lenis init would
    // re-scroll a page the user has already started reading.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, hash]);

  return null;
};

export default ScrollManager;
