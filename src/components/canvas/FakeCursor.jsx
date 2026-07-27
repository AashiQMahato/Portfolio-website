import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  animate,
  ANIME,
  usePrefersReducedMotion,
  useMediaQuery,
} from "../../motion";
import { useRecruiterMode } from "../../context/RecruiterModeContext";

/**
 * A fake "multiplayer" collaborator cursor that idly wanders the page,
 * easing between elements tagged [data-poi] — the design-tool joke that
 * someone else is viewing the file with you.
 *
 * anime.js owns the wandering (time-indexed, per the division-of-labor
 * rules in motion/animeSetup.js). Gated to fine pointers, ≥lg viewports,
 * motion-safe, non-recruiter, visible tab. Decorative: aria-hidden and
 * pointer-events-none.
 */
const FakeCursor = ({ name = "mishra", className = "" }) => {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const fine = useMediaQuery("(pointer: fine)");
  const wide = useMediaQuery("(min-width: 1024px)");
  const { isRecruiterMode } = useRecruiterMode();
  const enabled = fine && wide && !reduced && !isRecruiterMode;

  useEffect(() => {
    if (!enabled) return undefined;
    const el = ref.current;
    if (!el) return undefined;

    let cancelled = false;
    let anim = null;
    let timer = 0;
    // Current transform position, kept as the anime target between hops.
    const pos = {
      x: window.scrollX + window.innerWidth * 0.72,
      y: window.scrollY + window.innerHeight * 0.4,
    };
    el.style.transform = `translate(${pos.x}px, ${pos.y}px)`;

    const hop = () => {
      if (cancelled) return;
      const pois = document.querySelectorAll("[data-poi]");
      if (!pois.length) {
        timer = window.setTimeout(hop, 4000);
        return;
      }
      const poi = pois[Math.floor(Math.random() * pois.length)];
      const r = poi.getBoundingClientRect();
      // Only wander to elements near the current viewport.
      if (r.bottom < -300 || r.top > window.innerHeight + 300) {
        timer = window.setTimeout(hop, 1500);
        return;
      }
      const targetX =
        window.scrollX + r.left + r.width * (0.2 + Math.random() * 0.6);
      const targetY =
        window.scrollY + r.top + r.height * (0.2 + Math.random() * 0.6);
      anim = animate(pos, {
        x: targetX,
        y: targetY,
        duration: 1600 + Math.random() * 1400,
        ease: ANIME.ease.soft,
        onUpdate: () => {
          el.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
        },
        onComplete: () => {
          timer = window.setTimeout(hop, 1800 + Math.random() * 3200);
        },
      });
    };
    timer = window.setTimeout(hop, 1200);

    const onVisibility = () => {
      if (document.hidden) anim?.pause();
      else anim?.play();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      anim?.pause();
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute left-0 top-0 z-[55] ${className}`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="rgb(var(--ember))"
        stroke="rgb(var(--panel))"
        strokeWidth="1.5"
        className="drop-shadow-sm"
      >
        <path d="M4 2l16 8-7 2-3 7z" />
      </svg>
      <span className="ml-3 inline-block rounded-full bg-ember px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-white">
        {name}
      </span>
    </div>
  );
};

FakeCursor.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
};

export default FakeCursor;
