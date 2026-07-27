import PropTypes from "prop-types";

const TONES = {
  ember: {
    border: "border-ember/70",
    chip: "bg-ember text-white",
    handle: "border-ember/70",
  },
  accent: {
    border: "border-signal/70",
    chip: "bg-signal text-primary-foreground",
    handle: "border-signal/70",
  },
  dim: {
    border: "border-ink-dim/50",
    chip: "bg-ink-dim text-panel",
    handle: "border-ink-dim/50",
  },
};

const HANDLE_POSITIONS = [
  "-left-[5px] -top-[5px]",
  "-right-[5px] -top-[5px]",
  "-left-[5px] -bottom-[5px]",
  "-right-[5px] -bottom-[5px]",
];

/**
 * Figma-style selection frame: dashed bounding box with corner handles and
 * optional metadata chips — `name` (file-tab chip, top-left), `note`
 * (playful sticker, top-right), `size` (dimension readout, bottom-right).
 * Pure CSS chrome; children render inside untouched.
 */
const SelectionBox = ({
  children,
  className = "",
  name,
  note,
  size,
  tone = "ember",
  handles = true,
}) => {
  const t = TONES[tone] || TONES.ember;
  return (
    <div className={`relative border border-dashed ${t.border} ${className}`}>
      {handles &&
        HANDLE_POSITIONS.map((pos) => (
          <span
            key={pos}
            aria-hidden="true"
            className={`absolute ${pos} z-10 h-2 w-2 rounded-[2px] border bg-panel ${t.handle}`}
          />
        ))}
      {name && (
        <span
          className={`absolute left-3 top-0 z-10 -translate-y-1/2 whitespace-nowrap rounded-full px-2.5 py-0.5 font-mono text-[10px] tracking-wider ${t.chip}`}
        >
          {name}
        </span>
      )}
      {note && (
        <span
          className={`absolute right-3 top-0 z-10 -translate-y-1/2 whitespace-nowrap rounded-full px-2.5 py-0.5 font-mono text-[10px] tracking-wider ${t.chip}`}
        >
          {note}
        </span>
      )}
      {size && (
        <span
          aria-hidden="true"
          className="absolute bottom-0 right-2 z-10 translate-y-full pt-1 font-mono text-[10px] tracking-wider text-ink-dim"
        >
          {size}
        </span>
      )}
      {children}
    </div>
  );
};

SelectionBox.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  name: PropTypes.string,
  note: PropTypes.string,
  size: PropTypes.string,
  tone: PropTypes.oneOf(["ember", "accent", "dim"]),
  handles: PropTypes.bool,
};

export default SelectionBox;
