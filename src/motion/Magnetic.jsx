import { useRef } from "react";
import PropTypes from "prop-types";
import { useGSAP } from "@gsap/react";
import { gsap } from "./gsapSetup";
import usePrefersReducedMotion from "./usePrefersReducedMotion";
import useMediaQuery from "./useMediaQuery";

const MAX_PULL = 8;

/**
 * Magnetic hover: the wrapped element leans toward the cursor (≤8px) and
 * springs back on leave. Fine-pointer devices only; inert under reduced
 * motion and on touch.
 */
const Magnetic = ({ children, strength = 0.3, className = "" }) => {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const fine = useMediaQuery("(pointer: fine)");

  useGSAP(
    (context, contextSafe) => {
      if (reduced || !fine) return undefined;
      const el = ref.current;
      const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });

      const onMove = contextSafe((e) => {
        const r = el.getBoundingClientRect();
        const relX = e.clientX - (r.left + r.width / 2);
        const relY = e.clientY - (r.top + r.height / 2);
        xTo(gsap.utils.clamp(-MAX_PULL, MAX_PULL, relX * strength));
        yTo(gsap.utils.clamp(-MAX_PULL, MAX_PULL, relY * strength));
      });
      const onLeave = contextSafe(() => {
        xTo(0);
        yTo(0);
      });

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    },
    { dependencies: [reduced, fine, strength], scope: ref },
  );

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {children}
    </span>
  );
};

Magnetic.propTypes = {
  children: PropTypes.node,
  strength: PropTypes.number,
  className: PropTypes.string,
};

export default Magnetic;
