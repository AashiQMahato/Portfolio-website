import PropTypes from "prop-types";
import Magnetic from "../../motion/Magnetic";

const VARIANTS = {
  primary:
    "bg-signal text-white border border-signal shadow-[0_10px_24px_rgb(var(--signal)/0.35)] hover:brightness-105",
  outline:
    "bg-panel text-ink border border-ink/50 hover:bg-ink hover:text-panel",
  ghost:
    "bg-transparent text-ink-dim border border-line hover:border-ink-dim hover:text-ink",
};

/**
 * Rounded pill CTA in the canvas voice. `primary` is the orange fill with a
 * white bold label (AA-large); `outline` is the ink hairline pill.
 * Magnetic lean on fine pointers via the existing Magnetic wrapper.
 */
const PillButton = ({
  as: Tag = "button",
  variant = "primary",
  magnetic = true,
  className = "",
  children,
  ...props
}) => {
  const btn = (
    <Tag
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-display text-sm font-bold tracking-tight transition-[filter,background-color,color,border-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
  return magnetic ? <Magnetic strength={0.25}>{btn}</Magnetic> : btn;
};

PillButton.propTypes = {
  as: PropTypes.elementType,
  variant: PropTypes.oneOf(["primary", "outline", "ghost"]),
  magnetic: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default PillButton;
