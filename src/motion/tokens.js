/**
 * Motion design tokens — the only easings, durations and staggers used
 * site-wide. Duration encodes hierarchy: the bigger the thing, the longer
 * (and calmer) it moves. CSS mirrors live in tailwind.config.js.
 */
export const EASE = {
  out: "power3.out", // default UI entrance
  strong: "power4.out", // headlines, large type
  expo: "expo.out", // cinematic reveals, image masks
  inOut: "expo.inOut", // curtains, page + route transitions
  soft: "power2.out", // hover and pointer follow
  linear: "none", // scrubbed scroll timelines
};

export const DUR = {
  fast: 0.3, // hover / press feedback
  base: 0.6, // normal UI
  enter: 1, // major section entrances
  cinematic: 1.4, // hero + image reveals
};

export const STAGGER = {
  chars: 0.025,
  words: 0.04,
  lines: 0.09,
  items: 0.07,
};
