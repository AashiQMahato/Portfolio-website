import { useRef } from "react";
import PropTypes from "prop-types";
import { useGSAP } from "@gsap/react";
import { gsap } from "./gsapSetup";
import { DUR, EASE } from "./tokens";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

/**
 * Editorial image entrance. The frame clips; the image inside moves.
 *
 *  clip       frame wipes open bottom→top while the image settles from 1.15
 *  side       frame wipes open left→right (directional, for alternating rows)
 *  scale      frame stays open, image scales 1.25 → 1 (quiet, for grids)
 *  iris       frame opens from a centred inset rectangle
 *  parallax   no entrance; image drifts against scroll (scrubbed)
 *
 * `parallax` can also be combined with any entrance via the `drift` prop.
 * The <img> keeps explicit width/height for zero layout shift.
 */
const FROM_CLIP = {
  clip: "inset(100% 0% 0% 0%)",
  side: "inset(0% 100% 0% 0%)",
  iris: "inset(18% 18% 18% 18% round 0.75rem)",
};

const ImageReveal = ({
  src,
  alt,
  width,
  height,
  variant = "clip",
  drift = 0,
  className = "",
  imgClassName = "",
  loading = "lazy",
  fetchPriority,
  start = "top 85%",
  children,
  ...rest
}) => {
  const frame = useRef(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const img = frame.current.querySelector("[data-reveal-img]");
      const amount = variant === "parallax" ? drift || 12 : drift;
      // Headroom so a drifting image never exposes the frame edge.
      const restScale = amount ? 1 + (amount / 100) * 1.1 : 1;
      if (variant === "parallax") gsap.set(img, { scale: restScale });

      if (variant !== "parallax") {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: frame.current, start, once: true },
        });
        if (FROM_CLIP[variant]) {
          tl.fromTo(
            frame.current,
            { clipPath: FROM_CLIP[variant] },
            { clipPath: "inset(0% 0% 0% 0% round 0rem)", duration: DUR.cinematic, ease: EASE.expo },
          );
        }
        tl.fromTo(
          img,
          { scale: variant === "scale" ? 1.25 : 1.15 },
          { scale: restScale, duration: DUR.cinematic + 0.2, ease: EASE.expo },
          0,
        );
      }

      if (amount) {
        gsap.fromTo(
          img,
          { yPercent: -amount / 2 },
          {
            yPercent: amount / 2,
            ease: EASE.linear,
            scrollTrigger: { trigger: frame.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      }
    },
    { dependencies: [reduced, variant, drift], scope: frame },
  );

  return (
    <div ref={frame} className={`relative overflow-hidden ${className}`} {...rest}>
      <img
        data-reveal-img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        fetchpriority={fetchPriority}
        className={`h-full w-full object-cover will-change-transform ${imgClassName}`}
      />
      {children}
    </div>
  );
};

ImageReveal.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  variant: PropTypes.oneOf(["clip", "side", "scale", "iris", "parallax"]),
  drift: PropTypes.number,
  className: PropTypes.string,
  imgClassName: PropTypes.string,
  loading: PropTypes.oneOf(["lazy", "eager"]),
  fetchPriority: PropTypes.oneOf(["high", "low", "auto"]),
  start: PropTypes.string,
  children: PropTypes.node,
};

export default ImageReveal;
