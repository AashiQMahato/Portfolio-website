import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { gsap, Flip, EASE, Reveal, SplitText, usePrefersReducedMotion } from "../motion";
import { FollowPreview } from "../components/ui";
import SectionAvatar from "../components/avatar/SectionAvatar";
import { projects } from "../data/portfolioData";

const byYear = [...projects].sort((a, b) => Number(b.year) - Number(a.year));
const FILTERS = ["All", ...new Set(byYear.flatMap((p) => p.cats || [p.category]))];

/**
 * Project index — an editorial list rather than a card grid. Filters
 * Flip-animate the list (rows that leave fold away, the rest close ranks).
 * Desktop hover brings the project's image alongside the cursor; clicking
 * lifts that same image into the case study. Mobile rows carry an inline
 * thumbnail instead.
 */
const Projects = () => {
  const listRef = useRef(null);
  const flipState = useRef(null);
  const reduced = usePrefersReducedMotion();
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState(null);

  const matches = (p) => filter === "All" || (p.cats || [p.category]).includes(filter);
  const count = byYear.filter(matches).length;

  const pick = (f) => {
    if (f === filter) return;
    if (!reduced) flipState.current = Flip.getState(listRef.current.querySelectorAll("[data-row]"));
    setFilter(f);
  };

  useLayoutEffect(() => {
    if (!flipState.current) return;
    Flip.from(flipState.current, {
      duration: 0.7,
      ease: EASE.expo,
      stagger: 0.03,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: EASE.out }),
      onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.25 }),
    });
    flipState.current = null;
  }, [filter]);

  return (
    <div className="shell pb-[clamp(5rem,12vh,9rem)] pt-[calc(var(--nav-h)+clamp(3rem,10vh,7rem))]">
      <header className="mb-[clamp(3rem,8vh,5rem)]">
        <Reveal variant="fade" className="mb-6 flex items-center gap-4">
          <p className="hud">
            <span className="tabular-nums text-ink">({String(projects.length).padStart(2, "0")})</span> — Project index
          </p>
          <SectionAvatar mood="curious" hover="excited" className="-my-3 h-12 w-12 md:h-14 md:w-14" />
        </Reveal>
        <Reveal variant="lines">
          <SplitText as="h1" lines={["Work, from the", "breadboard up."]} className="text-display text-ink" />
        </Reveal>
        <Reveal variant="rise" delay={0.2}>
          <p className="mt-8 max-w-xl text-lede text-ink-dim">
            Embedded prototypes, computer vision and production web platforms. Every entry has a
            case study: the problem, the architecture, what broke, and what it measured.
          </p>
        </Reveal>
      </header>

      <div role="group" aria-label="Filter by discipline" className="mb-8 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            data-avatar="searching"
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => pick(f)}
            className={`min-h-11 rounded-full border px-4 py-1.5 text-sm transition-colors duration-300 md:min-h-0 ${
              filter === f ? "border-ink bg-ink text-background" : "border-line text-ink-dim hover:border-ink-dim hover:text-ink"
            }`}
          >
            {f}
          </button>
        ))}
        <p className="hud ml-auto tabular-nums" aria-live="polite">
          {count} {count === 1 ? "project" : "projects"}
        </p>
      </div>

      <ul ref={listRef} className="border-t border-line" onMouseLeave={() => setActive(null)}>
        {byYear.map((p, i) => {
          const visible = matches(p);
          return (
            <li key={p.slug} data-row data-flip-id={p.slug} className={`border-b border-line ${visible ? "" : "hidden"}`}>
              <Link
                to={`/projects/${p.slug}`}
                data-transition="project"
                data-preview-key={p.slug}
                data-cursor="view"
                onMouseEnter={() => setActive(p.slug)}
                onFocus={() => setActive(p.slug)}
                onBlur={() => setActive(null)}
                className="group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-3 py-7 md:grid-cols-[3rem_1fr_10rem_5rem_2.5rem] md:py-9"
              >
                <img
                  src={p.image}
                  alt=""
                  width={1600}
                  height={974}
                  loading={i < 2 ? "eager" : "lazy"}
                  decoding="async"
                  className="col-span-2 aspect-[16/10] w-full rounded-md object-cover md:hidden"
                />
                <span className="hud hidden tabular-nums md:block">{String(i + 1).padStart(2, "0")}</span>
                <span className="min-w-0">
                  <span className="block text-[clamp(1.6rem,3.6vw,3.25rem)] font-medium leading-[1.02] tracking-[-0.04em] text-ink transition-transform duration-500 ease-out group-hover:translate-x-2">
                    {p.title}
                  </span>
                  <span className="mt-2 block max-w-xl text-sm text-ink-dim md:opacity-0 md:transition-opacity md:duration-500 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
                    {p.tags.slice(0, 4).join(" · ")}
                  </span>
                </span>
                <span className="hud hidden md:block">{p.category}</span>
                <span className="hud tabular-nums">{p.year}</span>
                <span
                  aria-hidden="true"
                  className="hidden h-10 w-10 place-items-center rounded-full border border-line text-ink transition-[background-color,border-color,color] duration-300 group-hover:border-signal group-hover:bg-signal group-hover:text-primary-foreground md:grid"
                >
                  <ArrowRight className="h-4 w-4 -rotate-45 transition-transform duration-500 ease-out group-hover:rotate-0" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <FollowPreview
        aspect="16/10"
        activeKey={active}
        items={byYear.map((p) => ({
          key: p.slug,
          node: <img src={p.image} alt="" className="h-full w-full object-cover" />,
        }))}
      />
    </div>
  );
};

export default Projects;
