import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { gsap, EASE, useMediaQuery, usePrefersReducedMotion } from "../../motion";

const W = 352; // 22rem
const OFFSET = 36;

/**
 * Pointer-following preview for desktop lists. It sits beside the cursor
 * (never under it, so the hovered title stays readable), flips to the left
 * near the viewport edge, and interpolates with quickTo rather than
 * snapping. Each item stays mounted; the active one wipes in. Decorative:
 * aria-hidden, pointer-events none, absent on touch and reduced motion.
 */
const FollowPreview = ({ items, activeKey, aspect = "4/3" }) => {
  const ref = useRef(null);
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduced = usePrefersReducedMotion();
  const enabled = fine && !reduced;

  useEffect(() => {
    if (!enabled) return undefined;
    const el = ref.current;
    gsap.set(el, { xPercent: 0, yPercent: -50, x: -9999, y: -9999 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.65, ease: EASE.soft });
    const yTo = gsap.quickTo(el, "y", { duration: 0.65, ease: EASE.soft });
    const onMove = (e) => {
      const flip = e.clientX + OFFSET + W > window.innerWidth - 16;
      const x = flip ? e.clientX - OFFSET - W : e.clientX + OFFSET;
      if (!el.dataset.placed) {
        gsap.set(el, { x, y: e.clientY });
        el.dataset.placed = "1";
      }
      xTo(x);
      yTo(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    gsap.to(el, {
      opacity: activeKey ? 1 : 0,
      scale: activeKey ? 1 : 0.92,
      duration: activeKey ? 0.5 : 0.3,
      ease: EASE.out,
      overwrite: "auto",
    });
    el.querySelectorAll("[data-preview]").forEach((node) => {
      const on = node.dataset.preview === activeKey;
      gsap.to(node, {
        clipPath: on ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
        duration: on ? 0.6 : 0.4,
        ease: on ? EASE.expo : EASE.soft,
        overwrite: "auto",
      });
    });
  }, [activeKey, enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-chrome
      style={{ width: W, aspectRatio: aspect }}
      className="pointer-events-none fixed left-0 top-0 z-[60] overflow-hidden rounded-lg opacity-0 shadow-2xl shadow-black/40"
    >
      {items.map(({ key, node }) => (
        <div key={key} data-preview={key} className="absolute inset-0" style={{ clipPath: "inset(100% 0% 0% 0%)" }}>
          {node}
        </div>
      ))}
    </div>
  );
};

FollowPreview.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({ key: PropTypes.string.isRequired, node: PropTypes.node.isRequired }))
    .isRequired,
  activeKey: PropTypes.string,
  aspect: PropTypes.string,
};

export default FollowPreview;
