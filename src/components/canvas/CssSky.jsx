import PropTypes from "prop-types";

const CLOUDS = [
  { top: "10%", duration: "110s", delay: "-20s", scale: 1 },
  { top: "26%", duration: "150s", delay: "-70s", scale: 0.7 },
  { top: "55%", duration: "130s", delay: "-45s", scale: 1.2 },
  { top: "78%", duration: "170s", delay: "-100s", scale: 0.85 },
];

/**
 * Pure-CSS sky: gradient ground + blurred drifting cloud blobs + a starfield
 * that fades in via the dark theme. The universal fallback for the WebGL
 * SkyScene (reduced motion / no WebGL / mobile / save-data) and the ambient
 * background for secondary pages. Decorative only.
 */
const CssSky = ({ className = "" }) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`}
    style={{
      background:
        "linear-gradient(to bottom, rgb(var(--sky-high)), rgb(var(--sky-low)))",
    }}
  >
    {CLOUDS.map((cloud, i) => (
      <div
        key={i}
        className="cssky-cloud"
        style={{
          top: cloud.top,
          animationDuration: cloud.duration,
          animationDelay: cloud.delay,
          scale: String(cloud.scale),
        }}
      />
    ))}
    <div className="cssky-stars absolute inset-0" />
  </div>
);

CssSky.propTypes = {
  className: PropTypes.string,
};

export default CssSky;
