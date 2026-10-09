import PropTypes from "prop-types";
import { useTheme } from "../../context/ThemeContext";
import { techColor } from "./techColor";
import { techShape } from "./shapes";

/** Official mark in its (legibility-adjusted) brand colour, or a monogram plate. */
const TechLogo = ({ tech, className = "h-8 w-8" }) => {
  const { theme } = useTheme();
  if (!tech.icon) {
    return (
      <span
        aria-hidden="true"
        className={`relative grid place-items-center rounded-[3px] border border-ink/30 font-mono text-[0.6rem] font-semibold tracking-[0.04em] text-ink ${className}`}
      >
        <span className="absolute left-1 top-1 h-1 w-1 bg-signal" />
        {tech.code}
      </span>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d={tech.icon.path} fill={techColor(tech.icon.hex, theme)} />
    </svg>
  );
};

TechLogo.propTypes = { tech: techShape.isRequired, className: PropTypes.string };

export default TechLogo;
