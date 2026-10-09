import PropTypes from "prop-types";

const link = PropTypes.shape({ title: PropTypes.string.isRequired, href: PropTypes.string.isRequired });

export const techShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  blurb: PropTypes.string.isRequired,
  icon: PropTypes.shape({ path: PropTypes.string, hex: PropTypes.string, title: PropTypes.string }),
  code: PropTypes.string,
  listed: PropTypes.bool,
  projects: PropTypes.arrayOf(PropTypes.shape({ title: PropTypes.string, href: PropTypes.string })).isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  posts: PropTypes.arrayOf(PropTypes.shape({ title: PropTypes.string, href: PropTypes.string })).isRequired,
});

export const capabilityShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  index: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  techs: PropTypes.arrayOf(techShape).isRequired,
  projects: PropTypes.arrayOf(link).isRequired,
});
