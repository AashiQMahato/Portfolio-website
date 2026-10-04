// Motion system — import animation primitives from here.
// Architecture notes and extension points: docs/DESIGN.md
export { gsap, ScrollTrigger, Flip } from "./gsapSetup";
export { EASE, DUR, STAGGER } from "./tokens";
export { default as usePrefersReducedMotion } from "./usePrefersReducedMotion";
export { default as useMediaQuery } from "./useMediaQuery";
export { default as SmoothScroll, useLenis } from "./SmoothScroll";
export { default as Reveal } from "./Reveal";
export { default as SplitText } from "./SplitText";
export { default as ImageReveal } from "./ImageReveal";
export { default as useActiveSection } from "./useActiveSection";
export { default as useScrollToSection } from "./useScrollToSection";
export { default as ScrollManager } from "./ScrollManager";
export { default as Magnetic } from "./Magnetic";
export { PageTransitionProvider, usePageTransition } from "./PageTransition";
export { isBootActive, markBootDone, BOOT_DONE_EVENT, onBootDone } from "./bootGate";
