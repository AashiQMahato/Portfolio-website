import PropTypes from "prop-types";

/**
 * Full-bleed infinite marquee using the tailwind `marquee` keyframes
 * (translateX -50% on a w-max track holding two copies of the content).
 * CSS-only; freezes under reduced motion.
 */
const Ticker = ({ children, duration = "40s", reverse = false, className = "" }) => (
  <div className={`overflow-hidden ${className}`}>
    <div
      className={`flex w-max ${
        reverse ? "animate-marquee-reverse" : "animate-marquee"
      } motion-reduce:animate-none`}
      style={{ "--marquee-duration": duration }}
    >
      <div className="flex shrink-0 items-center">{children}</div>
      <div className="flex shrink-0 items-center" aria-hidden="true">
        {children}
      </div>
    </div>
  </div>
);

Ticker.propTypes = {
  children: PropTypes.node,
  duration: PropTypes.string,
  reverse: PropTypes.bool,
  className: PropTypes.string,
};

export default Ticker;
