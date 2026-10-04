import { useLayoutEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { gsap, Flip, EASE, Reveal, usePrefersReducedMotion } from "../motion";
import { SectionHeader } from "../components/ui";
import { stack, stackCategories } from "../data/stack";

const ALL = "all";

/**
 * Technical range as a navigable system rather than a badge wall.
 * Choosing a category Flip-reorders the type wall so its technologies lead
 * (the rest recede but stay readable — large type keeps AA at the faint
 * step). Hovering, focusing or tapping a technology traces where it was
 * actually used: projects, roles and writing, all derived from content.
 */
const Skills = () => {
  const wallRef = useRef(null);
  const flipState = useRef(null);
  const reduced = usePrefersReducedMotion();
  const [category, setCategory] = useState(ALL);
  const [selected, setSelected] = useState(null);

  const ordered =
    category === ALL
      ? stack
      : [...stack.filter((t) => t.category === category), ...stack.filter((t) => t.category !== category)];

  const pickCategory = (id) => {
    if (id === category) return;
    if (!reduced) flipState.current = Flip.getState(wallRef.current.querySelectorAll("[data-tech]"));
    setCategory(id);
    setSelected(null);
  };

  useLayoutEffect(() => {
    if (!flipState.current) return;
    Flip.from(flipState.current, {
      duration: 0.8,
      ease: EASE.expo,
      stagger: 0.008,
      absolute: false,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0 }, { opacity: 1 }),
    });
    flipState.current = null;
  }, [category]);

  const detail = selected && stack.find((t) => t.name === selected);
  const counts = Object.fromEntries(stackCategories.map((c) => [c.id, stack.filter((t) => t.category === c.id).length]));

  return (
    <section id="skills" aria-labelledby="skills-title" className="relative py-[clamp(7rem,16vh,13rem)]">
      <div className="shell">
        <SectionHeader
          index="05"
          label="Capabilities"
          id="skills-title"
          title={["Range, traced", "to real work."]}
          aside={
            <p className="max-w-sm text-ink-dim">
              Pick a discipline, then point at a technology to see the projects, roles and
              writing behind it.
            </p>
          }
        />

        <div className="grid gap-10 lg:grid-cols-12">
          {/* Categories */}
          <div className="lg:col-span-3">
            <p id="stack-cats" className="hud mb-4">Discipline</p>
            <div role="group" aria-labelledby="stack-cats" className="flex flex-wrap gap-2 lg:flex-col lg:items-start lg:gap-0.5">
              {[{ id: ALL, label: "Everything" }, ...stackCategories].map((c) => {
                const on = category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => pickCategory(c.id)}
                    className={`group flex min-h-11 items-center gap-3 rounded-full border px-3.5 py-1.5 text-sm lg:min-h-0 transition-colors duration-300 lg:rounded-none lg:border-0 lg:px-0 lg:py-1.5 lg:text-base ${
                      on
                        ? "border-ink bg-ink text-background lg:bg-transparent lg:text-ink"
                        : "border-line text-ink-dim hover:text-ink"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`hidden h-px bg-signal transition-[width] duration-500 ease-out lg:block ${on ? "w-6" : "w-0 group-hover:w-3"}`}
                    />
                    {c.label}
                    <span className={`font-mono text-[11px] tabular-nums ${on ? "lg:text-ink-dim" : "text-ink-dim"}`}>
                      {c.id === ALL ? stack.length : counts[c.id]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Type wall + trace */}
          <div className="lg:col-span-9">
            <Reveal variant="fade">
              <ul ref={wallRef} className="flex flex-wrap items-baseline gap-x-[0.45em] gap-y-1 text-[clamp(1.5rem,2.7vw,2.5rem)] font-medium leading-[1.2] tracking-[-0.035em]">
                {ordered.map((t) => {
                  const inCat = category === ALL || t.category === category;
                  const on = selected === t.name;
                  return (
                    <li key={t.name} data-tech data-flip-id={t.name} className="group/tech">
                      <button
                        type="button"
                        aria-controls="stack-trace"
                        aria-pressed={on}
                        onMouseEnter={() => setSelected(t.name)}
                        onFocus={() => setSelected(t.name)}
                        onClick={() => setSelected(on ? null : t.name)}
                        className={`relative rounded-sm text-left transition-colors duration-300 ${
                          on ? "text-signal" : inCat ? "text-ink hover:text-signal" : "text-ink-faint hover:text-ink-dim"
                        }`}
                      >
                        {t.name}
                      </button>
                      <span aria-hidden="true" className="ml-[0.45em] font-light text-ink-faint group-last/tech:hidden">
                        /
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Reveal>

            <div
              id="stack-trace"
              aria-live="polite"
              className="mt-10 min-h-[9.5rem] border-t border-line pt-6"
            >
              {detail ? (
                <div className="grid gap-6 sm:grid-cols-[12rem_1fr]">
                  <div>
                    <p className="hud">{detail.categoryLabel}</p>
                    <p className="mt-1 text-2xl font-medium tracking-[-0.03em] text-ink">{detail.name}</p>
                  </div>
                  <dl className="grid gap-4 text-sm sm:grid-cols-3">
                    <TraceList label="Projects" items={detail.projects} />
                    <TraceList label="Roles" items={detail.roles.map((r) => ({ title: r }))} />
                    <TraceList label="Writing" items={detail.posts} />
                  </dl>
                </div>
              ) : (
                <p className="max-w-md text-ink-dim">
                  <span className="hud mr-3 text-ink">Trace</span>
                  Hover, focus or tap a technology to see where it shows up in shipped work.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const TraceList = ({ label, items }) => (
  <div>
    <dt className="hud mb-2">{label}</dt>
    {items.length ? (
      items.map((it) => (
        <dd key={it.title} className="mb-1.5 text-ink">
          {it.href ? (
            <Link to={it.href} className="link-line hover:text-signal">
              {it.title}
            </Link>
          ) : (
            it.title
          )}
        </dd>
      ))
    ) : (
      <dd className="text-ink-dim">—</dd>
    )}
  </div>
);

TraceList.propTypes = {
  label: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({ title: PropTypes.string.isRequired, href: PropTypes.string })).isRequired,
};

export default Skills;
