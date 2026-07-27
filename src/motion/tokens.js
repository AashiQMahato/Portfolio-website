// Motion design tokens — the only easings/durations/staggers used site-wide.
// "mech" is the mechanical steps() voice reserved for terminal/typing accents.

export const EASE = {
  out: "power3.out",
  inOut: "power3.inOut",
  mech: "steps(12)",
};

export const DUR = {
  xs: 0.25,
  sm: 0.45,
  md: 0.7,
  lg: 0.9,
};

export const STAGGER = {
  tight: 0.06,
  base: 0.09,
  loose: 0.14,
};
