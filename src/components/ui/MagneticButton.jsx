import PropTypes from "prop-types";
import { ArrowUpRight } from "lucide-react";
import Magnetic from "../../motion/Magnetic";

const VARIANTS = {
  solid:
    "bg-ink text-background border-ink hover:bg-signal hover:border-signal hover:text-primary-foreground",
  signal:
    "bg-signal text-primary-foreground border-signal hover:bg-ink hover:border-ink hover:text-background",
  outline:
    "bg-transparent text-ink border-line hover:border-ink",
};

const SIZES = {
  md: "h-12 px-6 text-[0.95rem]",
  lg: "h-14 px-8 text-base",
};

/**
 * Pill CTA with a magnetic lean (fine pointers only) and an icon that exits
 * and re-enters along its own direction on hover — the arrow "points" at
 * where the click goes. Press feedback is immediate (scale on :active).
 */
const MagneticButton = ({
  as: Tag = "button",
  variant = "solid",
  size = "md",
  icon: Icon = ArrowUpRight,
  iconDirection = "diagonal",
  className = "",
  children,
  ...props
}) => {
  const exit =
    iconDirection === "down"
      ? "group-hover:translate-y-[140%]"
      : iconDirection === "right"
        ? "group-hover:translate-x-[140%]"
        : "group-hover:translate-x-[140%] group-hover:-translate-y-[140%]";
  const enter =
    iconDirection === "down"
      ? "-translate-y-[140%] group-hover:translate-y-0"
      : iconDirection === "right"
        ? "-translate-x-[140%] group-hover:translate-x-0"
        : "-translate-x-[140%] translate-y-[140%] group-hover:translate-x-0 group-hover:translate-y-0";

  return (
    <Magnetic strength={0.35}>
      <Tag
        data-cursor="button"
        className={`group inline-flex select-none items-center justify-center gap-3 whitespace-nowrap rounded-full border font-medium tracking-tight transition-[background-color,border-color,color,transform] duration-300 ease-out active:scale-[0.97] active:duration-100 ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
        {...props}
      >
        <span>{children}</span>
        {Icon && (
          <span className="relative h-4 w-4 overflow-hidden" aria-hidden="true">
            <Icon className={`absolute inset-0 h-4 w-4 transition-transform duration-500 ease-out ${exit}`} />
            <Icon className={`absolute inset-0 h-4 w-4 transition-transform duration-500 ease-out ${enter}`} />
          </span>
        )}
      </Tag>
    </Magnetic>
  );
};

MagneticButton.propTypes = {
  as: PropTypes.elementType,
  variant: PropTypes.oneOf(["solid", "signal", "outline"]),
  size: PropTypes.oneOf(["md", "lg"]),
  icon: PropTypes.elementType,
  iconDirection: PropTypes.oneOf(["diagonal", "right", "down"]),
  className: PropTypes.string,
  children: PropTypes.node,
};

export default MagneticButton;
