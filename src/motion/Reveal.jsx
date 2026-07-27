import { useRef } from "react";
import PropTypes from "prop-types";
import { useGSAP } from "@gsap/react";
import { gsap } from "./gsapSetup";
import { DUR, EASE, STAGGER } from "./tokens";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

/**
 * Scroll-triggered reveal: rises + fades when the block enters the viewport.
 * Pass `selector` to stagger matching descendants instead of the wrapper.
 * Under prefers-reduced-motion content renders static — no tween is created.
 */
const Reveal = ({
  as: Tag = "div",
  children,
  className = "",
  selector,
  y = 28,
  delay = 0,
  stagger = STAGGER.base,
  start = "top 82%",
}) => {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced || !ref.current) return;
      const targets = selector
        ? ref.current.querySelectorAll(selector)
        : ref.current;
      if (!targets || targets.length === 0) return;
      gsap.fromTo(
        targets,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration: DUR.md,
          ease: EASE.out,
          delay,
          stagger: selector ? stagger : 0,
          scrollTrigger: { trigger: ref.current, start, once: true },
        },
      );
    },
    { dependencies: [reduced], scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
};

Reveal.propTypes = {
  as: PropTypes.elementType,
  children: PropTypes.node,
  className: PropTypes.string,
  selector: PropTypes.string,
  y: PropTypes.number,
  delay: PropTypes.number,
  stagger: PropTypes.number,
  start: PropTypes.string,
};

export default Reveal;
