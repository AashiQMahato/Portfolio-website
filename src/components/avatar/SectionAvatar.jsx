import { lazy, Suspense, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { AVATAR_REACT_EVENT } from "./mood";

// Lazy so the renderer (and its schema validator) stay out of first paint.
const Avatar = lazy(() => import("./Avatar"));

const INTERACTIVE = "a, button, input, textarea, select, [data-avatar]";
// Hover → rest delay, so sweeping across a row of links doesn't flicker.
const LINGER_MS = 450;

/**
 * The avatar as a section's companion. Rests on `mood`, plays `hover` while
 * a link/button/field inside its section is hovered or focused (an element's
 * `data-avatar="key"` overrides), and joins global reactions (reactAvatar)
 * while on screen. Off screen it settles into a still pose: no frame loop.
 * The wrapper owns the size, so nothing shifts when the renderer loads.
 */
export default function SectionAvatar({ mood, hover, className = "h-10 w-10 md:h-12 md:w-12" }) {
  const ref = useRef(null);
  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);
  const [hot, setHot] = useState(null);
  const [reaction, setReaction] = useState(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin: "240px 0px" },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const self = ref.current;
    const root =
      self.closest("[data-avatar-scope]") ?? self.closest("section") ?? self.closest("footer") ?? self.closest("main");
    if (!root) return undefined;
    let timer = 0;
    const pick = (target) => {
      const el = target.closest?.(INTERACTIVE);
      return el && root.contains(el) ? el.dataset.avatar || hover || null : null;
    };
    const update = (e) => {
      const next = e.type === "focusout" || e.type === "pointerleave" ? null : pick(e.target);
      window.clearTimeout(timer);
      if (next) setHot(next);
      else timer = window.setTimeout(() => setHot(null), LINGER_MS);
    };
    const types = ["pointerover", "pointerleave", "focusin", "focusout"];
    types.forEach((t) => root.addEventListener(t, update));
    return () => {
      window.clearTimeout(timer);
      types.forEach((t) => root.removeEventListener(t, update));
    };
  }, [hover]);

  useEffect(() => {
    if (!inView) return undefined;
    let timer = 0;
    const onReact = ({ detail }) => {
      window.clearTimeout(timer);
      setReaction(detail.animation);
      timer = window.setTimeout(() => setReaction(null), detail.ms);
    };
    window.addEventListener(AVATAR_REACT_EVENT, onReact);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(AVATAR_REACT_EVENT, onReact);
      setReaction(null);
    };
  }, [inView]);

  return (
    <span ref={ref} aria-hidden="true" className={`relative inline-block shrink-0 align-middle ${className}`}>
      {near && (
        <Suspense fallback={null}>
          <Avatar animation={inView ? reaction || hot || mood : undefined} className="h-full w-full" />
        </Suspense>
      )}
    </span>
  );
}

SectionAvatar.propTypes = {
  mood: PropTypes.string.isRequired,
  hover: PropTypes.string,
  className: PropTypes.string,
};
