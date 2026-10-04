import { useRef } from "react";
import PropTypes from "prop-types";
import { useGSAP } from "@gsap/react";
import { gsap } from "./gsapSetup";
import { DUR, EASE, STAGGER } from "./tokens";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

/**
 * Scroll-triggered entrance with a small vocabulary of variants, so each
 * section can pick a motion identity instead of every block fading up:
 *
 *  rise   y + opacity (blocks, cards)
 *  lines  masked lines/words slide up from their clip (pairs with SplitText)
 *  chars  masked characters, tight stagger (short display words only)
 *  clip   clip-path wipe from the bottom edge (rules, panels, media)
 *  fade   opacity only (quiet metadata)
 *
 * Only transform/opacity/clip-path animate. Under reduced motion nothing
 * is tweened and content renders in its final state.
 */
const VARIANTS = {
  rise: (y) => ({ from: { opacity: 0, y }, to: { opacity: 1, y: 0, ease: EASE.out, duration: DUR.enter } }),
  lines: () => ({ from: { yPercent: 110 }, to: { yPercent: 0, ease: EASE.strong, duration: DUR.enter } }),
  chars: () => ({ from: { yPercent: 110 }, to: { yPercent: 0, ease: EASE.strong, duration: DUR.enter } }),
  clip: () => ({
    from: { clipPath: "inset(0% 0% 100% 0%)" },
    to: { clipPath: "inset(0% 0% 0% 0%)", ease: EASE.expo, duration: DUR.cinematic },
  }),
  fade: () => ({ from: { opacity: 0 }, to: { opacity: 1, ease: EASE.soft, duration: DUR.enter } }),
};

const DEFAULT_TARGET = {
  lines: "[data-split-line], [data-split-word]",
  chars: "[data-split-char]",
};

const DEFAULT_STAGGER = {
  rise: STAGGER.items,
  lines: STAGGER.lines,
  chars: STAGGER.chars,
  clip: STAGGER.items,
  fade: STAGGER.items,
};

const Reveal = ({
  as: Tag = "div",
  children,
  className = "",
  variant = "rise",
  selector,
  y = 32,
  delay = 0,
  stagger,
  start = "top 85%",
  ...rest
}) => {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced || !ref.current) return;
      const sel = selector || DEFAULT_TARGET[variant];
      const targets = sel ? ref.current.querySelectorAll(sel) : ref.current;
      if (!targets || targets.length === 0) return;

      const { from, to } = (VARIANTS[variant] || VARIANTS.rise)(y);
      gsap.fromTo(targets, from, {
        ...to,
        delay,
        stagger: sel ? (stagger ?? DEFAULT_STAGGER[variant]) : 0,
        scrollTrigger: { trigger: ref.current, start, once: true },
      });
    },
    { dependencies: [reduced], scope: ref },
  );

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
};

Reveal.propTypes = {
  as: PropTypes.elementType,
  children: PropTypes.node,
  className: PropTypes.string,
  variant: PropTypes.oneOf(["rise", "lines", "chars", "clip", "fade"]),
  selector: PropTypes.string,
  y: PropTypes.number,
  delay: PropTypes.number,
  stagger: PropTypes.number,
  start: PropTypes.string,
};

export default Reveal;
