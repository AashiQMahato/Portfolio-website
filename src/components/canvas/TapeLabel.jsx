import PropTypes from "prop-types";

/**
 * Small rotated sticker label ("hot right now", "v2.0") — a piece of tape
 * slapped on the canvas.
 */
const TapeLabel = ({ children, className = "", rotate = -3, tone = "accent" }) => (
  <span
    className={`inline-block rounded-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] ${
      tone === "accent" ? "bg-signal text-white" : "bg-ember text-white"
    } ${className}`}
    style={{ transform: `rotate(${rotate}deg)` }}
  >
    {children}
  </span>
);

TapeLabel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  rotate: PropTypes.number,
  tone: PropTypes.oneOf(["accent", "ember"]),
};

export default TapeLabel;
