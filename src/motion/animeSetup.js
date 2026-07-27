// Single anime.js entry point — import from here, never from "animejs" directly.
//
// Division of labor between the two animation runtimes:
//   1. GSAP owns everything indexed by SCROLL: ScrollTrigger scrub/pin,
//      the Lenis ticker, and quickTo pointer-followers (Cursor).
//   2. anime.js owns everything indexed by TIME: cloud drift, theme
//      crossfades, the fake multiplayer cursor, count-ups, text staggers,
//      and hover/click micro-interactions.
//   3. Never both libraries on the same property of the same element.
//   4. On-enter pattern: a ScrollTrigger with once:true FIRES an anime
//      timeline in onEnter — GSAP detects, anime performs.
//   5. Every anime loop must respect prefers-reduced-motion and recruiter
//      mode; hold long-running loop handles in refs and pause them on
//      unmount / visibilitychange.
//
// NOTE: the three.js adapter ("animejs/adapters/three") is NOT imported
// here — it would drag three.js into the entry bundle. It lives at the top
// of src/scene/SkyScene.jsx only, inside the lazy three chunk.

// Only re-export what the site actually uses — the namespace exports
// (utils, svg, text, eases) are whole-module objects that defeat
// tree-shaking, so add them here only when something imports them.
export {
  animate,
  createTimeline,
  createTimer,
  stagger,
  utils,
  engine,
} from "animejs";

// anime-side motion tokens (milliseconds — anime uses ms, GSAP uses s).
// Mirrors EASE/DUR in ./tokens.js so both runtimes share one motion voice.
export const ANIME = {
  ease: {
    out: "outCubic", // ≈ power3.out
    inOut: "inOutCubic", // ≈ power3.inOut
    pop: "outBack(1.6)", // playful overshoot for chips/CTAs
    soft: "outQuint", // long settling moves (fake cursor)
  },
  dur: {
    xs: 250,
    sm: 450,
    md: 700,
    lg: 900,
  },
  stagger: {
    tight: 60,
    base: 90,
    loose: 140,
  },
};
