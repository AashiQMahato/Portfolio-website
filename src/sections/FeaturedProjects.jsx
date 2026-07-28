import { useRef } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { projects } from "../data/portfolioData";
import {
  Reveal,
  gsap,
  DUR,
  EASE,
  STAGGER,
  usePrefersReducedMotion,
} from "../motion";
import { FrameLabel, SelectionBox, TapeLabel } from "../components/canvas";

const featured = projects.filter((p) => p.featured);

const keyMetric = (project) => {
  const metric = project.metrics?.[0];
  if (!metric) return null;
  const value = metric.value || metric.improvement || metric.after;
  return value ? { value, label: metric.label } : null;
};

const ProjectRow = ({ project, index }) => {
  const metric = keyMetric(project);
  const flip = index % 2 === 1;

  return (
    <article
      data-project-row
      className="group grid items-center gap-10 py-16 first:pt-8 lg:grid-cols-12 lg:gap-12"
    >
      {/* Image in a selection frame */}
      <div className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
        <SelectionBox
          name="image.jpg"
          size="1280 × 720"
          tone={index % 2 ? "accent" : "ember"}
          className="rounded-xl"
        >
          <Link
            to={`/projects/${project.slug}`}
            aria-label={`${project.title} case study`}
            tabIndex={-1}
            data-cursor="view"
            className="relative block overflow-hidden rounded-xl"
          >
            <span data-project-img className="relative block aspect-video">
              {/* Canvas fallback — visible if the remote image fails */}
              <span
                aria-hidden="true"
                className="canvas-dots absolute inset-0 flex items-center justify-center bg-panel"
              >
                <span className="pill px-3 py-2 font-mono text-xs uppercase tracking-[0.3em] text-ink-dim">
                  /{String(index + 1).padStart(2, "0")} — {project.category}
                </span>
              </span>
              <img
                src={project.image}
                alt=""
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.visibility = "hidden";
                }}
                className="absolute inset-x-0 -top-[7%] h-[114%] w-full object-cover transition-[filter] duration-500 group-hover:brightness-105 motion-reduce:transition-none"
              />
            </span>
            <span className="absolute left-3 top-3 rounded-full bg-panel/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim backdrop-blur">
              {project.year} · {project.category}
            </span>
          </Link>
        </SelectionBox>
      </div>

      {/* Copy */}
      <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
        <p
          data-project-copy
          className="font-mono text-sm font-bold tracking-[0.1em] text-accent-ink"
        >
          /{String(index + 1).padStart(2, "0")}
        </p>
        <h3
          data-project-copy
          className="mt-3 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl"
        >
          <Link
            to={`/projects/${project.slug}`}
            className="transition-colors hover:text-accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
          >
            {project.title}
          </Link>
        </h3>
        <p
          data-project-copy
          className="mt-4 text-sm leading-relaxed text-ink-dim md:text-base"
        >
          {project.tagline || project.shortDesc}
        </p>

        {metric ? (
          <p data-project-copy className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-2xl font-bold text-ember">
              {metric.value}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-dim">
              {metric.label}
            </span>
          </p>
        ) : null}

        <ul
          data-project-copy
          className="mt-5 flex flex-wrap gap-2"
          aria-label="Technologies"
        >
          {project.tags.slice(0, 4).map((tag) => (
            <li
              key={tag}
              className="pill px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-dim"
            >
              {tag}
            </li>
          ))}
        </ul>

        <div data-project-copy className="mt-7 flex flex-wrap items-center gap-6">
          <Link
            to={`/projects/${project.slug}`}
            className="group/link flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
          >
            Case study
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </Link>
          {project.github ? (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-ink-dim transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
            >
              GitHub <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          ) : null}
          {project.live ? (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-ink-dim transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
            >
              Live <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
};

ProjectRow.propTypes = {
  project: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string,
    year: PropTypes.string,
    category: PropTypes.string,
    tagline: PropTypes.string,
    shortDesc: PropTypes.string,
    metrics: PropTypes.array,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    github: PropTypes.string,
    live: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

/** Featured works — /01–/04 canvas frames with image wipes + soft parallax. */
const FeaturedProjects = () => {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.utils.toArray("[data-project-row]").forEach((row) => {
        const img = row.querySelector("[data-project-img]");
        const copy = row.querySelectorAll("[data-project-copy]");
        gsap
          .timeline({
            scrollTrigger: { trigger: row, start: "top 75%", once: true },
            defaults: { ease: EASE.out },
          })
          .fromTo(
            img,
            { clipPath: "inset(0 100% 0 0)" },
            { clipPath: "inset(0 0% 0 0)", duration: DUR.lg },
          )
          .fromTo(
            copy,
            { autoAlpha: 0, y: 22 },
            { autoAlpha: 1, y: 0, duration: DUR.md, stagger: STAGGER.tight },
            "-=0.5",
          );

        // Soft scrubbed parallax on the image while the row crosses the viewport.
        gsap.fromTo(
          img.querySelector("img"),
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: row,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    },
    { dependencies: [reduced], scope: ref },
  );

  return (
    <section
      ref={ref}
      id="work"
      data-section
      aria-labelledby="work-heading"
      className="relative px-5 py-[clamp(6rem,14vh,11rem)] md:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex flex-wrap items-center gap-4">
            <FrameLabel index="04" name="featured-works.frame" />
            <TapeLabel rotate={-2} tone="ember">
              real users, real constraints
            </TapeLabel>
          </div>
          <h2
            id="work-heading"
            className="mt-8 font-display text-display-2 text-ink"
          >
            Built, measured, shipped
            <span className="text-signal">.</span>
          </h2>
        </Reveal>

        <div className="mt-6 divide-y divide-line/70">
          {featured.map((project, i) => (
            <ProjectRow key={project.slug} project={project} index={i} />
          ))}
        </div>

        <Reveal className="mt-4 border-t border-line pt-10">
          <Link
            to="/projects"
            className="group flex w-fit items-center gap-3 font-mono text-sm uppercase tracking-[0.25em] text-ink transition-colors hover:text-accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
          >
            All {projects.length} projects
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1.5 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </Link>
        </Reveal>
      </div>
    </section>
  );
};

export default FeaturedProjects;
