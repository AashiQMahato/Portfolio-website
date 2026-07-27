import { useRef, useState } from "react";
import { animate, usePrefersReducedMotion } from "../motion";

const LABELS = [
  "Poke it anyway",
  "Told you. Nothing.",
  "Still nothing.",
  "Persistence noted.",
  "The button admires you.",
  "Okay, that's 5. Go hire me instead →",
];

/**
 * "This button does absolutely nothing." A tiny toy: each poke shakes the
 * button and cycles increasingly unimpressed labels. anime.js shake;
 * reduced motion just cycles the text.
 */
const NothingButton = () => {
  const ref = useRef(null);
  const [pokes, setPokes] = useState(0);
  const reduced = usePrefersReducedMotion();

  const poke = () => {
    setPokes((p) => p + 1);
    if (!reduced && ref.current) {
      animate(ref.current, {
        translateX: [0, -7, 6, -4, 3, 0],
        rotate: [0, -2.5, 2, -1, 0],
        duration: 420,
        ease: "outQuad",
      });
    }
  };

  return (
    <div className="mt-20 text-center">
      <p className="font-mono text-hud uppercase text-ink-dim">
        This button does
        <span className="mx-1.5 text-accent-ink">absolutely nothing</span>
      </p>
      <button
        ref={ref}
        type="button"
        onClick={poke}
        className="pill mt-4 px-6 py-3 font-display text-sm font-bold text-ink transition-colors hover:border-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
      >
        {LABELS[Math.min(pokes, LABELS.length - 1)]}
      </button>
    </div>
  );
};

export default NothingButton;
