import PropTypes from "prop-types";

/**
 * Corner HUD metadata in the design-tool voice ("WORKING WORLDWIDE",
 * "x: 240 y: 96"). Decorative — hidden from assistive tech.
 */
const HUDLabel = ({ className = "", title, sub }) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none select-none font-mono text-hud uppercase ${className}`}
  >
    <p className="text-ink/80">{title}</p>
    {sub && <p className="mt-1 text-ink-dim/80">{sub}</p>}
  </div>
);

HUDLabel.propTypes = {
  className: PropTypes.string,
  title: PropTypes.node.isRequired,
  sub: PropTypes.node,
};

export default HUDLabel;
