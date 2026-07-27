import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsapSetup";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

const LenisContext = createContext(null);

/** Returns the live Lenis instance, or null (reduced motion / not mounted). */
export const useLenis = () => useContext(LenisContext);

/**
 * Site-wide smooth scroll. Drives Lenis from the GSAP ticker and keeps
 * ScrollTrigger in sync. Disabled entirely under prefers-reduced-motion —
 * native scrolling takes over and ScrollTrigger falls back to window scroll.
 * Nested scrollable panels must set data-lenis-prevent.
 */
const SmoothScroll = ({ children }) => {
  const reducedMotion = usePrefersReducedMotion();
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    if (reducedMotion) return undefined;

    const instance = new Lenis({
      duration: 1.1,
      autoRaf: false,
    });
    instance.on("scroll", ScrollTrigger.update);

    const raf = (time) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(raf);
      instance.destroy();
      setLenis(null);
    };
  }, [reducedMotion]);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
};

SmoothScroll.propTypes = {
  children: PropTypes.node,
};

export default SmoothScroll;
