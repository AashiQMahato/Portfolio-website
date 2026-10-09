import PropTypes from "prop-types";
import { Reveal, SplitText } from "../../motion";
import SectionAvatar from "../avatar/SectionAvatar";

/**
 * Section opener used across the home page: a mono index row with an
 * animated hairline, then a split display title. `aside` sits opposite the
 * title on wide screens (a short lede or a link). `avatar` ({ mood, hover })
 * puts the section's companion at the end of the index row.
 */
const SectionHeader = ({ index, label, title, id, aside, avatar, className = "" }) => (
  <header className={`mb-[clamp(3rem,8vh,6rem)] ${className}`}>
    <div className="mb-8 flex items-end gap-4">
      <Reveal variant="clip" className="flex flex-1 items-center gap-4 border-t border-line pt-4">
        <span className="hud tabular-nums text-ink">({index})</span>
        <span className="hud">{label}</span>
      </Reveal>
      {/* Outside the clip reveal, which would crop the avatar's silhouette. */}
      {avatar && <SectionAvatar mood={avatar.mood} hover={avatar.hover} className="-mb-1 h-10 w-10 md:h-12 md:w-12" />}
    </div>
    <div className="grid items-end gap-8 lg:grid-cols-12">
      <Reveal variant="lines" className={aside ? "lg:col-span-8" : "lg:col-span-12"}>
        <SplitText as="h2" id={id} lines={title} className="text-display-2 text-ink" />
      </Reveal>
      {aside && (
        <Reveal variant="fade" delay={0.2} className="lg:col-span-4 lg:pb-2">
          {aside}
        </Reveal>
      )}
    </div>
  </header>
);

SectionHeader.propTypes = {
  index: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  title: PropTypes.arrayOf(PropTypes.string).isRequired,
  id: PropTypes.string,
  aside: PropTypes.node,
  avatar: PropTypes.shape({ mood: PropTypes.string.isRequired, hover: PropTypes.string }),
  className: PropTypes.string,
};

export default SectionHeader;
