import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { gsap } from "../../motion/gsapSetup";
import usePrefersReducedMotion from "../../motion/usePrefersReducedMotion";

/** Cycles through words with a rise/fade swap. GSAP-based (framer-free). */
const RotatingText = ({ words = [], interval = 3000, className = "" }) => {
  const [index, setIndex] = useState(0);
  const spanRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  const safeWords = useMemo(
    () => (Array.isArray(words) ? words.filter(Boolean) : []),
    [words],
  );

  useEffect(() => {
    if (reduced || safeWords.length <= 1) return undefined;
    const timer = setInterval(() => {
      const el = spanRef.current;
      if (!el) return;
      gsap.to(el, {
        y: -18,
        autoAlpha: 0,
        duration: 0.22,
        ease: "power2.in",
        onComplete: () => {
          setIndex((prev) => (prev + 1) % safeWords.length);
          gsap.fromTo(
            el,
            { y: 18, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.3, ease: "power2.out" },
          );
        },
      });
    }, interval);
    return () => clearInterval(timer);
  }, [reduced, safeWords, interval]);

  const current = safeWords.length ? safeWords[index % safeWords.length] : "";

  return (
    <span className={`inline-block relative ${className}`}>
      <span ref={spanRef} className="inline-block will-change-transform">
        {current}
      </span>
    </span>
  );
};

RotatingText.propTypes = {
  words: PropTypes.arrayOf(PropTypes.string),
  interval: PropTypes.number,
  className: PropTypes.string,
};

export default RotatingText;
