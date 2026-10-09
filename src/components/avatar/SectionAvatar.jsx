import PropTypes from "prop-types";

/**
 * A place in the layout where the one site companion (Companion.jsx) can
 * sit. It reserves real space, so the character never covers content, and
 * tells the companion how to feel here: `mood` at rest, `hover` while the
 * visitor points at links in this section. `active={false}` makes it
 * ineligible (e.g. hidden slides in the pinned work stage).
 */
export default function SectionAvatar({ mood, hover, active, className = "h-10 w-10 md:h-12 md:w-12" }) {
  return (
    <span
      aria-hidden="true"
      data-companion-anchor
      data-mood={mood}
      data-hover={hover}
      data-active={active === undefined ? undefined : String(active)}
      className={`relative inline-block shrink-0 align-middle ${className}`}
    />
  );
}

SectionAvatar.propTypes = {
  mood: PropTypes.string.isRequired,
  hover: PropTypes.string,
  active: PropTypes.bool,
  className: PropTypes.string,
};
