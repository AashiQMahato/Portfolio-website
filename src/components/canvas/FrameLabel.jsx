import PropTypes from "prop-types";

/**
 * Section header rendered as a design-file tab: `01 · ABOUT.FRAME`.
 * The canvas-metaphor replacement for SectionHeading's index/mono line.
 */
const FrameLabel = ({ index, name, className = "" }) => (
  <p
    className={`inline-flex items-center gap-2.5 rounded-full border border-line bg-panel px-3.5 py-1.5 font-mono text-hud uppercase text-ink-dim ${className}`}
  >
    <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
    {index && <span className="text-accent-ink">{index}</span>}
    <span>{name}</span>
  </p>
);

FrameLabel.propTypes = {
  index: PropTypes.string,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default FrameLabel;
