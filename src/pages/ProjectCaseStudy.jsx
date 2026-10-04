import { useRef } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, EASE, ImageReveal, Reveal, SplitText, usePrefersReducedMotion } from "../motion";
import { projects } from "../data/portfolioData";
import NotFound from "./NotFound";

const GALLERY_REVEALS = ["side", "scale", "clip"];

/** Numbered chapter: sticky mono label on the left, content on the right. */
const Chapter = ({ index, title, children }) => (
  <section className="grid gap-6 border-t border-line py-[clamp(3.5rem,9vh,6rem)] lg:grid-cols-12">
    <div className="lg:col-span-4">
      <h2 className="hud flex gap-3 lg:sticky lg:top-[calc(var(--nav-h)+2rem)]">
        <span className="tabular-nums text-ink">{index}</span>
        {title}
      </h2>
    </div>
    <div className="lg:col-span-8">{children}</div>
  </section>
);

Chapter.propTypes = { index: PropTypes.string.isRequired, title: PropTypes.string.isRequired, children: PropTypes.node };

/**
 * Case study. The hero image is full-bleed at 100svh — exactly where the
 * Flip transition from the home page / index lands, so the lifted image
 * becomes this page. Below, numbered chapters tell problem → approach →
 * architecture → challenges → results, each with its own reveal pattern,
 * and the next project hands off with the same transition.
 */
const ProjectCaseStudy = () => {
  const { slug } = useParams();
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const idx = projects.findIndex((p) => p.slug === slug);
  const project = projects[idx];

  useGSAP(
    () => {
      if (reduced || !project) return;
      const q = gsap.utils.selector(ref);
      gsap.fromTo(q("[data-hero-copy]"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: EASE.out, stagger: 0.08, delay: 0.35 });
      gsap.to(q("[data-hero-img]"), {
        yPercent: 12,
        scale: 1.06,
        ease: "none",
        scrollTrigger: { trigger: q("[data-cs-hero]")[0], start: "top top", end: "bottom top", scrub: true },
      });
    },
    { dependencies: [reduced, slug], scope: ref, revertOnUpdate: true },
  );

  if (!project) return <NotFound />;

  const next = projects[(idx + 1) % projects.length];
  const meta = [
    ["Category", project.category],
    ["Year", project.year],
    project.role && ["Role", project.role],
    project.teamSize && ["Team", project.teamSize === 1 ? "Solo" : `${project.teamSize} people`],
    project.timeline && ["Timeline", project.timeline],
    ["Status", project.status === "live" ? "Shipped" : project.status],
  ].filter(Boolean);
  const gallery = (project.gallery || []).filter((g) => g && g !== project.image);
  let n = 0;
  const num = () => String((n += 1)).padStart(2, "0");

  return (
    <article ref={ref} key={slug}>
      {/* Hero — the Flip landing zone */}
      <header data-cs-hero className="relative h-[100svh] min-h-[34rem] overflow-hidden bg-panel">
        <img
          data-hero-img
          src={project.image}
          alt={`${project.title} — screenshot`}
          width={1600}
          height={974}
          // React 18 drops the camelCase prop; the lowercase attribute reaches the DOM.
          // eslint-disable-next-line react/no-unknown-property
          fetchpriority="high"
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
        <div className="shell relative flex h-full flex-col justify-end pb-[clamp(2.5rem,7vh,5rem)] text-white">
          <p data-hero-copy className="hud mb-6 flex flex-wrap gap-x-4 text-white/80">
            <span>Case study — {String(idx + 1).padStart(2, "0")}</span>
            <span>{project.category}</span>
            <span>{project.year}</span>
          </p>
          <h1 data-hero-copy className="max-w-5xl text-display">
            {project.title}
          </h1>
          {(project.tagline || project.shortDesc) && (
            <p data-hero-copy className="mt-6 max-w-2xl text-lede text-white/85">
              {project.tagline || project.shortDesc}
            </p>
          )}
        </div>
      </header>

      <div className="shell">
        {/* Meta strip */}
        <Reveal as="dl" variant="fade" selector="[data-meta]" className="grid grid-cols-2 gap-x-8 gap-y-6 py-12 sm:grid-cols-3 lg:grid-cols-6">
          {meta.map(([k, v]) => (
            <div key={k} data-meta>
              <dt className="hud">{k}</dt>
              <dd className="mt-1.5 text-ink">{v}</dd>
            </div>
          ))}
        </Reveal>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-line py-8">
          <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
            {project.tags.map((t) => (
              <li key={t} className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-ink-dim">
                {t}
              </li>
            ))}
          </ul>
          <div className="flex gap-6 sm:ml-auto">
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink">
                <span className="link-line">Visit live site</span> <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink">
                <span className="link-line">{project.githubBackend ? "Frontend source" : "Source on GitHub"}</span>{" "}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
            {project.githubBackend && (
              <a href={project.githubBackend} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink">
                <span className="link-line">Backend source</span> <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>

        {project.problemStatement && (
          <Chapter index={num()} title="The problem">
            <Reveal variant="rise">
              <p className="max-w-3xl text-[clamp(1.4rem,2.3vw,2.1rem)] font-medium leading-[1.28] tracking-[-0.025em] text-ink">{project.problemStatement}</p>
            </Reveal>
          </Chapter>
        )}

        <Chapter index={num()} title="The build">
          <Reveal variant="rise" selector="[data-p]" className="max-w-3xl space-y-6">
            <p data-p className="text-lede text-ink">{project.fullDesc}</p>
            {project.recruiterSummary && <p data-p className="text-ink-dim">{project.recruiterSummary}</p>}
          </Reveal>
          {project.features?.length > 0 && (
            <Reveal as="ul" variant="clip" selector="li" className="mt-10 grid border-t border-line sm:grid-cols-2 sm:gap-x-10">
              {project.features.map((f) => (
                <li key={f} className="flex gap-3 border-b border-line py-4 text-ink-dim">
                  <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                  {f}
                </li>
              ))}
            </Reveal>
          )}
        </Chapter>

        {project.architecture?.length > 0 && (
          <Chapter index={num()} title="Architecture">
            <Reveal as="ol" variant="rise" selector="[data-node]" stagger={0.1} className="relative">
              {project.architecture.map((a, i) => (
                <li key={a.component} data-node className="relative grid grid-cols-[2.5rem_1fr] gap-4 pb-8 last:pb-0">
                  {i < project.architecture.length - 1 && (
                    <span aria-hidden="true" className="absolute left-[0.6rem] top-7 h-[calc(100%-1.75rem)] w-px bg-line" />
                  )}
                  <span className="grid h-5 w-5 place-items-center rounded-full border border-signal font-mono text-[10px] text-accent-ink">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-xl font-medium tracking-[-0.02em] text-ink">{a.component}</h3>
                    <p className="mt-1 text-ink-dim">{a.desc}</p>
                  </div>
                </li>
              ))}
            </Reveal>
          </Chapter>
        )}

        {gallery[0] && (
          <ImageReveal src={gallery[0]} alt={`${project.title} — additional view`} width={1600} height={974} variant="iris" drift={8} className="my-6 aspect-[16/9] rounded-lg bg-panel" />
        )}

        {project.challenges?.length > 0 && (
          <Chapter index={num()} title="What broke, and the fix">
            <div className="space-y-10">
              {project.challenges.map((c) => (
                <Reveal key={c.title} variant="rise" selector="[data-c]" className="grid gap-4 sm:grid-cols-2 sm:gap-10">
                  <div data-c>
                    <h3 className="text-xl font-medium tracking-[-0.02em] text-ink">{c.title}</h3>
                    <p className="mt-2 text-ink-dim">{c.problem}</p>
                  </div>
                  <div data-c className="border-l border-signal pl-5">
                    <p className="hud mb-2 text-accent-ink">Solution</p>
                    <p className="text-ink">{c.solution}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Chapter>
        )}

        {project.metrics?.length > 0 && (
          <Chapter index={num()} title="Results">
            <Reveal as="dl" variant="rise" selector="[data-metric]" className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
              {project.metrics.map((m) => (
                <div key={m.label} data-metric className="flex flex-col gap-6 bg-background p-6">
                  <dt className="hud">{m.label}</dt>
                  <dd className="order-first font-mono text-[clamp(1.8rem,3vw,2.6rem)] font-medium leading-none tracking-[-0.04em] text-ink">
                    {m.value || (
                      <>
                        <span className="text-ink-dim line-through decoration-1">{m.before}</span>{" "}
                        <span aria-hidden="true" className="text-ink-dim">→</span>{" "}
                        <span className="sr-only">to</span>
                        {m.after}
                      </>
                    )}
                  </dd>
                  {m.improvement && <dd className="text-sm text-accent-ink">{m.improvement}</dd>}
                </div>
              ))}
            </Reveal>
          </Chapter>
        )}

        {gallery.length > 1 && (
          <div className="grid gap-6 sm:grid-cols-2">
            {gallery.slice(1).map((g, i) => (
              <ImageReveal key={g} src={g} alt={`${project.title} — view ${i + 2}`} variant={GALLERY_REVEALS[i % 3]} className="aspect-[4/3] rounded-lg bg-panel" />
            ))}
          </div>
        )}

        {project.lessons?.length > 0 && (
          <Chapter index={num()} title="Lessons">
            <Reveal as="ul" variant="lines" selector="[data-l]" className="space-y-5">
              {project.lessons.map((l) => (
                <li key={l} className="overflow-clip">
                  <span data-l className="block text-[clamp(1.25rem,2vw,1.6rem)] leading-snug tracking-[-0.02em] text-ink">
                    {l}
                  </span>
                </li>
              ))}
            </Reveal>
            {project.futureImprovements?.length > 0 && (
              <>
                <h3 className="hud mb-4 mt-12">Next iteration</h3>
                <ul className="space-y-2 text-ink-dim">
                  {project.futureImprovements.map((f) => (
                    <li key={f}>— {f}</li>
                  ))}
                </ul>
              </>
            )}
          </Chapter>
        )}
      </div>

      {/* Next project */}
      <nav aria-label="Next project" className="mt-[clamp(3rem,8vh,6rem)] border-t border-line">
        <Link to={`/projects/${next.slug}`} data-transition="project" data-cursor="view" className="group block">
          <div className="shell grid items-center gap-8 py-[clamp(3rem,8vh,5rem)] lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p className="hud mb-4">Next project</p>
              <SplitText
                as="p"
                lines={[next.title]}
                by="lines"
                className="text-display-2 text-ink transition-transform duration-700 ease-out group-hover:translate-x-2"
              />
              <span className="mt-8 inline-flex items-center gap-3 text-sm font-medium text-ink">
                <span className="link-line">Continue</span>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-signal text-primary-foreground transition-transform duration-500 ease-out group-hover:translate-x-1">
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </span>
            </div>
            <div className="overflow-hidden rounded-lg lg:col-span-6">
              <img
                src={next.image}
                alt=""
                width={1600}
                height={974}
                loading="lazy"
                className="aspect-[16/10] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.035]"
              />
            </div>
          </div>
        </Link>
      </nav>
    </article>
  );
};

export default ProjectCaseStudy;
