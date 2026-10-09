import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { techColor } from "../capabilities/techColor";
import SectionAvatar from "../../components/avatar/SectionAvatar";

const pad = (n) => String(n).padStart(2, "0");

/**
 * One project in the Selected Work sequence. The same markup serves both
 * layouts: absolutely stacked panels in the pinned desktop stage, or a
 * normal-flow article on mobile / reduced motion (where `media` is the
 * scroll-revealed image supplied by the parent).
 */
const WorkSlide = ({ project, index, total, pinned, onFocus, media }) => {
  const caseStudy = `/projects/${project.slug}`;
  const { theme } = useTheme();
  const accent = project.accent ? techColor(project.accent, theme) : "rgb(var(--signal))";

  const image = (
    <Link
      to={caseStudy}
      data-transition="project"
      data-cursor="view"
      aria-hidden="true"
      tabIndex={-1}
      className="group/media relative block"
    >
      {media || (
        <div data-media-frame className="relative aspect-[16/10] overflow-hidden rounded-lg bg-panel">
          {/* Inside the clipped frame, so stacked slides never show each other's accent. */}
          <span aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-[2px]" style={{ background: accent }} />
          {/* Hover zoom on its own layer: the scroll timeline owns the img's transform. */}
          <span className="block h-full w-full transition-transform duration-700 ease-out group-hover/media:scale-[1.035] group-hover/media:translate-y-[-0.5%]">
            <img
              src={project.image}
              alt=""
              width={1600}
              height={974}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              className="h-full w-full object-cover will-change-transform"
            />
          </span>
        </div>
      )}
      <span className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-ink/10 transition-[box-shadow] duration-500 group-hover/media:ring-ink/25" />
    </Link>
  );

  return (
    <article
      data-slide
      aria-labelledby={`work-${project.slug}`}
      onFocusCapture={onFocus}
      className={`group/slide ${pinned ? "absolute inset-0" : ""}`}
    >
      <div
        className={
          pinned
            ? "shell grid h-full grid-cols-12 items-center gap-10 pr-[calc(var(--gutter)+3.5rem)] pt-[var(--nav-h)]"
            : "grid gap-8"
        }
      >
        <div className={pinned ? "col-span-7 col-start-6 row-start-1" : ""}>{image}</div>

        <div className={pinned ? "col-span-4 row-start-1" : ""}>
          <p data-copy aria-hidden="true" className="mb-4 flex items-baseline gap-2 font-medium leading-none tracking-[-0.05em] tabular-nums">
            <span className="text-[clamp(3.5rem,6vw,5.5rem)]" style={{ color: accent }}>
              {pad(index + 1)}
            </span>
            <span className="hud tracking-[0.14em]">/ {pad(total)}</span>
            <SectionAvatar mood="curious" hover="excited" active={pinned ? index === 0 : undefined} className="ml-auto h-12 w-12 self-center md:h-14 md:w-14" />
          </p>
          <p data-copy className="hud mb-6 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="sr-only">
              Project {index + 1} of {total}:
            </span>
            <span aria-hidden="true" className="h-px w-6" style={{ background: accent }} />
            {project.category}
            <span aria-hidden="true" className="text-ink-dim">·</span>
            {project.year}
          </p>

          <h3
            id={`work-${project.slug}`}
            data-copy
            className="text-[clamp(2rem,3.6vw,3.6rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-ink transition-transform duration-500 ease-out group-hover/slide:translate-x-1.5"
          >
            {project.title}
          </h3>

          <p data-copy className="mt-6 max-w-md text-ink-dim">
            {project.shortDesc}
          </p>

          <ul data-copy className="mt-6 flex flex-wrap gap-1.5" aria-label="Technologies">
            {project.tags.slice(0, 5).map((t) => (
              <li key={t} className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-ink-dim">
                {t}
              </li>
            ))}
          </ul>

          <div data-copy className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              to={caseStudy}
              data-transition="project"
              className="group/cta inline-flex items-center gap-3 text-[0.95rem] font-medium text-ink"
            >
              <span className="link-line">Read the case study</span>
              <span className="sr-only">: {project.title}</span>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-signal text-primary-foreground transition-transform duration-500 ease-out group-hover/cta:translate-x-1">
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="link-line inline-flex items-center gap-1 text-sm text-ink-dim hover:text-ink"
              >
                Live site <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="sr-only">for {project.title} (opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

WorkSlide.propTypes = {
  project: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    shortDesc: PropTypes.string,
    category: PropTypes.string,
    year: PropTypes.string,
    image: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    live: PropTypes.string,
    accent: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  pinned: PropTypes.bool.isRequired,
  onFocus: PropTypes.func.isRequired,
  media: PropTypes.node,
};

export default WorkSlide;
