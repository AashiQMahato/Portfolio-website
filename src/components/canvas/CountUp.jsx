import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { animate, usePrefersReducedMotion } from "../../motion";

const defaultFormat = (v) => Math.round(v).toLocaleString();

/**
 * Number that counts from 0 to `value` once when it enters the viewport.
 * anime.js drives a plain proxy object (time-indexed work); reduced motion
 * renders the final value immediately.
 */
const CountUp = ({
  value,
  duration = 1400,
  className = "",
  format = defaultFormat,
  suffix = "",
}) => {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (reduced) {
      el.textContent = `${format(value)}${suffix}`;
      return undefined;
    }
    let anim = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const counter = { v: 0 };
        anim = animate(counter, {
          v: value,
          duration,
          ease: "outExpo",
          onUpdate: () => {
            el.textContent = `${format(counter.v)}${suffix}`;
          },
        });
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      anim?.pause();
    };
  }, [value, duration, format, suffix, reduced]);

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
};

CountUp.propTypes = {
  value: PropTypes.number.isRequired,
  duration: PropTypes.number,
  className: PropTypes.string,
  format: PropTypes.func,
  suffix: PropTypes.string,
};

export default CountUp;
