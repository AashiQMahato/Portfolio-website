import { useRef } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, EASE, Reveal, usePrefersReducedMotion } from "../motion";
import { useTheme } from "../context/ThemeContext";
import SectionAvatar from "../components/avatar/SectionAvatar";
import ProductFrame from "../components/case-study/ProductFrame";
import CaseNav from "../components/case-study/CaseNav";
import ArchitectureFlow from "../components/case-study/ArchitectureFlow";
import { projects } from "../data/portfolioData";
import { PROJECT_ACCENTS } from "../data/projectAccents";
import { techColor } from "../sections/capabilities/techColor";
import NotFound from "./NotFound";

const pad = (n) => String(n).padStart(2, "0");
/** Dark text on light accents, white on dark ones (WCAG relative luminance). */
const onAccent = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.3 ? "#0a0a0b" : "#ffffff";
};

/** One case-study chapter: index + title, then content. Only rendered when the data supports it. */
const Chapter = ({ id, index, title, accent, children }) => (
  <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-[calc(var(--nav-h)+1.5rem)] border-t border-line py-[clamp(3.5rem,9vh,6rem)]">
    <Reveal variant="fade">
      <p className="hud mb-3 tabular-nums" style={{ color: accent }}>
        {index}
      </p>
      <h2 id={`${id}-title`} className="mb-10 text-[clamp(1.9rem,3.4vw,3rem)] font-medium leading-[1.05] tracking-[-0.035em] text-ink">
        {title}
      </h2>
    </Reveal>
    {children}
  </section>
);

Chapter.propTypes = {
  id: PropTypes.string.isRequired,
  index: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  accent: PropTypes.string.isRequired,
  children: PropTypes.node,
};

const ExternalLink = ({ href, children, primary, accent }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={
      primary
        ? "group inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        : "group inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink transition-colors duration-300 hover:border-ink-dim focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal"
    }
    style={primary ? { background: accent, color: onAccent(accent) } : undefined}
  >
    {children}
    <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    <span className="sr-only">(opens in a new tab)</span>
  </a>
);

ExternalLink.propTypes = { href: PropTypes.string.isRequired, children: PropTypes.node, primary: PropTypes.bool, accent: PropTypes.string };

/**
 * Project case study — one shared template for every /projects/:slug.
 * Editorial hero (title, pitch, real links, facts) above the real product
 * shown large and legible; then chapters built only from the data each
 * project has: overview → challenge → approach → features → architecture →
 * what broke → outcome, with a sticky contents list and reading progress.
 */
const ProjectCaseStudy = () => {
  const { slug } = useParams();
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const { theme } = useTheme();
  const idx = projects.findIndex((p) => p.slug === slug);
  const project = projects[idx];
  const accent = techColor(PROJECT_ACCENTS[slug] ?? "#FF6A33", theme);

  useGSAP(
    () => {
      if (reduced || !project) return;
      const q = gsap.utils.selector(ref);
      const tl = gsap.timeline({ defaults: { ease: EASE.out }, delay: 0.15 });
      tl.from(q("[data-cs-meta]"), { opacity: 0, y: 10, duration: 0.5, stagger: 0.05 })
        .from(q("[data-cs-title]"), { yPercent: 110, duration: 0.9, ease: EASE.strong }, 0.1)
        .from(q("[data-cs-copy]"), { opacity: 0, y: 18, duration: 0.6, stagger: 0.07 }, 0.4)
        .fromTo(
          q("[data-cs-art]"),
          { clipPath: "inset(14% 8% 0% 8% round 12px)", y: 60 },
          { clipPath: "inset(0% 0% 0% 0% round 12px)", y: 0, duration: 1.2, ease: EASE.expo },
          0.35,
        )
        .from(q("[data-cs-art] [data-frame-img]"), { scale: 1.08, duration: 1.4, ease: EASE.expo }, 0.35);
      // A little depth as the product scrolls past.
      gsap.to(q("[data-cs-art] [data-frame-img]"), {
        yPercent: -4,
        ease: "none",
        scrollTrigger: { trigger: q("[data-cs-art]")[0], start: "top 60%", end: "bottom top", scrub: true },
      });
    },
    { dependencies: [reduced, slug], scope: ref, revertOnUpdate: true },
  );

  if (!project) return <NotFound />;

  const total = projects.length;
  const prev = projects[(idx - 1 + total) % total];
  const next = projects[(idx + 1) % total];
  const isDiagram = project.image.endsWith(".svg") || (project.cats || [project.category]).includes("Hardware");
  const extraShots = (project.gallery || []).filter((g) => g && g !== project.image);

  const facts = [
    ["Category", project.category],
    ["Year", project.year],
    project.role && ["Role", project.role],
    project.teamSize && ["Team", project.teamSize === 1 ? "Solo" : `${project.teamSize} people`],
    project.timeline && ["Timeline", project.timeline],
    project.status && ["Status", project.status === "live" ? "Shipped" : project.status],
  ].filter(Boolean);

  const chapters = [
    { id: "cs-overview", title: "Overview", show: Boolean(project.fullDesc) },
    { id: "cs-challenge", title: "The challenge", show: Boolean(project.problemStatement) },
    { id: "cs-approach", title: "Approach", show: project.highlights?.length > 0 },
    { id: "cs-features", title: "Features", show: project.features?.length > 0 },
    { id: "cs-architecture", title: "Architecture", show: project.architecture?.length > 0 },
    { id: "cs-decisions", title: "What broke, and the fix", show: project.challenges?.length > 0 },
    { id: "cs-outcome", title: "Outcome", show: project.metrics?.length > 0 || project.lessons?.length > 0 },
  ].filter((c) => c.show);
  const num = Object.fromEntries(chapters.map((c, i) => [c.id, pad(i + 1)]));
  const chapter = (id, children) => {
    const c = chapters.find((x) => x.id === id);
    return c ? (
      <Chapter id={c.id} index={num[c.id]} title={c.title} accent={accent}>
        {children}
      </Chapter>
    ) : null;
  };

  return (
    <article ref={ref} key={slug} className="pb-[clamp(3rem,8vh,6rem)]">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <header className="shell pt-[calc(var(--nav-h)+clamp(1.5rem,5vh,3.5rem))]">
        <div data-cs-meta className="flex flex-wrap items-center justify-between gap-4">
          <Link to="/projects" className="hud group inline-flex min-h-11 items-center gap-2 text-ink-dim hover:text-ink">
            <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            All projects
          </Link>
          <p className="hud tabular-nums">
            Case study <span className="text-ink">{pad(idx + 1)}</span> / {pad(total)}
          </p>
        </div>

        <div className="mt-[clamp(2rem,6vh,4rem)] grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <p data-cs-meta className="hud mb-6 flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8" style={{ background: accent }} />
              {project.category}
              <span aria-hidden="true">·</span>
              {project.year}
              <SectionAvatar mood="searching" hover="excited" className="-my-3 ml-2 h-11 w-11" />
            </p>
            <h1 className="line-mask pb-[0.08em] text-[clamp(2.75rem,7vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-ink">
              <span data-cs-title className="inline-block">
                {project.title}
              </span>
            </h1>
            <p data-cs-copy className="mt-8 max-w-2xl text-lede text-ink-dim">
              {project.tagline || project.shortDesc}
            </p>
            {(project.live || project.github) && (
              <div data-cs-copy className="mt-8 flex flex-wrap gap-3">
                {project.live && (
                  <ExternalLink href={project.live} primary accent={accent}>
                    Visit live site
                  </ExternalLink>
                )}
                {project.github && (
                  <ExternalLink href={project.github}>{project.githubBackend ? "Frontend source" : "Source code"}</ExternalLink>
                )}
                {project.githubBackend && <ExternalLink href={project.githubBackend}>Backend source</ExternalLink>}
              </div>
            )}
          </div>

          <dl data-cs-copy className="self-end border-t border-line lg:col-span-4">
            {facts.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-6 border-b border-line py-3">
                <dt className="hud">{k}</dt>
                <dd className="text-right text-sm text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div data-cs-art className="mt-[clamp(3rem,8vh,5rem)]">
          <ProductFrame
            src={project.image}
            alt={`${project.title} — ${isDiagram ? "system diagram" : "product interface"}`}
            kind={isDiagram ? "figure" : "browser"}
            url={project.live || undefined}
            caption={isDiagram ? "System diagram" : undefined}
            priority
          />
        </div>

        <ul data-cs-copy className="mt-6 flex flex-wrap gap-1.5" aria-label="Technologies">
          {project.tags.map((t) => (
            <li key={t} className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-ink-dim">
              {t}
            </li>
          ))}
        </ul>
      </header>

      {/* ── Story ────────────────────────────────────────────── */}
      <div className="shell mt-[clamp(3rem,8vh,6rem)] grid gap-10 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <CaseNav chapters={chapters} articleRef={ref} accent={accent} />
        </aside>

        <div className="min-w-0 lg:col-span-9">
          {chapter(
            "cs-overview",
            <Reveal variant="rise" selector="[data-p]" className="max-w-3xl space-y-6">
              <p data-p className="text-[clamp(1.25rem,1.9vw,1.6rem)] leading-[1.45] tracking-[-0.015em] text-ink">
                {project.fullDesc}
              </p>
              {project.scope && (
                <p data-p className="text-ink-dim">
                  <span className="hud mr-3 text-ink">Scope</span>
                  {project.scope}
                </p>
              )}
              {project.audience?.length > 0 && (
                <div data-p>
                  <p className="hud mb-2">Built for</p>
                  <ul className="space-y-1 text-ink-dim">
                    {project.audience.map((a) => (
                      <li key={a}>— {a}</li>
                    ))}
                  </ul>
                </div>
              )}
              {project.whyItMatters?.length > 0 && (
                <div data-p>
                  <p className="hud mb-2">Why it matters</p>
                  <ul className="space-y-1 text-ink-dim">
                    {project.whyItMatters.map((w) => (
                      <li key={w}>— {w}</li>
                    ))}
                  </ul>
                </div>
              )}
              {project.recruiterSummary && (
                <p data-p className="text-ink-dim">
                  {project.recruiterSummary}
                </p>
              )}
            </Reveal>,
          )}

          {chapter(
            "cs-challenge",
            <Reveal variant="rise">
              <blockquote className="max-w-3xl border-l-2 pl-6 text-[clamp(1.4rem,2.4vw,2.2rem)] font-medium leading-[1.25] tracking-[-0.025em] text-ink" style={{ borderColor: accent }}>
                {project.problemStatement}
              </blockquote>
            </Reveal>,
          )}

          {chapter(
            "cs-approach",
            <Reveal as="ol" variant="clip" selector="li" className="grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-3">
              {project.highlights?.map((h, i) => (
                <li key={h} className="flex flex-col gap-6 bg-background p-6">
                  <span className="font-mono text-[11px] tabular-nums" style={{ color: accent }}>
                    {pad(i + 1)}
                  </span>
                  <p className="text-ink">{h}</p>
                </li>
              ))}
            </Reveal>,
          )}

          {chapter(
            "cs-features",
            extraShots.length > 0 ? (
              // A second real view exists: show it beside the feature list.
              <div className="grid gap-10 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] xl:items-start">
                <div className="xl:sticky xl:top-[calc(var(--nav-h)+2rem)]">
                  <ProductFrame src={extraShots[0]} alt={`${project.title} — additional view`} kind="figure" caption="Another real view" />
                </div>
                <FeatureList features={project.features} accent={accent} />
              </div>
            ) : (
              <FeatureList features={project.features} accent={accent} columns />
            ),
          )}

          {chapter("cs-architecture", <ArchitectureFlow nodes={project.architecture ?? []} accent={accent} />)}

          {chapter(
            "cs-decisions",
            <div className="space-y-10">
              {project.challenges?.map((c) => (
                <Reveal key={c.title} variant="rise" selector="[data-c]" className="grid gap-4 md:grid-cols-2 md:gap-10">
                  <div data-c>
                    <h3 className="text-xl font-medium tracking-[-0.02em] text-ink">{c.title}</h3>
                    <p className="mt-2 text-ink-dim">{c.problem}</p>
                  </div>
                  <div data-c className="border-l pl-5" style={{ borderColor: accent }}>
                    <p className="hud mb-2" style={{ color: accent }}>
                      Fix
                    </p>
                    <p className="text-ink">{c.solution}</p>
                  </div>
                </Reveal>
              ))}
            </div>,
          )}

          {chapter(
            "cs-outcome",
            <>
              {project.metrics?.length > 0 && (
                <Reveal as="dl" variant="rise" selector="[data-metric]" className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 xl:grid-cols-3">
                  {project.metrics.map((m) => (
                    <div key={m.label} data-metric className="flex flex-col gap-4 bg-background p-6">
                      <dt className="hud">{m.label}</dt>
                      <dd className="order-first font-mono text-[clamp(1.5rem,2.6vw,2.2rem)] font-medium leading-tight tracking-[-0.04em] text-ink">
                        {m.value || (
                          <>
                            <span className="text-ink-dim line-through decoration-1">{m.before}</span>{" "}
                            <span aria-hidden="true" className="text-ink-dim">
                              →
                            </span>{" "}
                            <span className="sr-only">to</span>
                            {m.after}
                          </>
                        )}
                      </dd>
                      {m.improvement && <dd className="text-sm" style={{ color: accent }}>{m.improvement}</dd>}
                    </div>
                  ))}
                </Reveal>
              )}
              {project.lessons?.length > 0 && (
                <div className="mt-12 grid gap-10 md:grid-cols-2">
                  <div>
                    <h3 className="hud mb-4">What I learned</h3>
                    <ul className="space-y-4">
                      {project.lessons.map((l) => (
                        <li key={l} className="text-[1.1rem] leading-snug tracking-[-0.01em] text-ink">
                          {l}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {project.futureImprovements?.length > 0 && (
                    <div>
                      <h3 className="hud mb-4">Next iteration</h3>
                      <ul className="space-y-2 text-ink-dim">
                        {project.futureImprovements.map((f) => (
                          <li key={f}>— {f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </>,
          )}
        </div>
      </div>

      {/* ── Previous / next ──────────────────────────────────── */}
      <nav aria-label="More projects" className="shell mt-[clamp(3rem,8vh,6rem)] border-t border-line pt-10">
        <div className="mb-8 flex items-center justify-between">
          <p className="hud">Keep exploring</p>
          <Link to="/projects" className="hud link-line text-ink">
            All {total} projects
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {[
            ["Previous", prev],
            ["Next", next],
          ].map(([label, p]) => (
            <Link key={label} to={`/projects/${p.slug}`} data-transition="project" data-cursor="view" className="group block">
              <div className="overflow-hidden rounded-lg border border-line bg-panel">
                <img
                  src={p.image}
                  alt=""
                  width={1600}
                  height={974}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover object-top transition-transform duration-[1200ms] ease-out group-hover:scale-[1.035]"
                />
              </div>
              <p className="hud mt-5 flex items-center gap-2">
                {label === "Previous" && <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />}
                {label} project
                {label === "Next" && <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />}
              </p>
              <p className="mt-2 text-[clamp(1.4rem,2.4vw,2rem)] font-medium leading-tight tracking-[-0.03em] text-ink transition-transform duration-500 ease-out group-hover:translate-x-1">
                {p.title}
              </p>
              <p className="hud mt-2">
                {p.category} · {p.year}
              </p>
            </Link>
          ))}
        </div>
      </nav>
    </article>
  );
};

/** Real features as a numbered editorial list (two columns when there's no side image). */
const FeatureList = ({ features, accent, columns = false }) => (
  <Reveal as="ol" variant="clip" selector="li" stagger={0.06} className={`border-t border-line ${columns ? "grid md:grid-cols-2 md:gap-x-10" : ""}`}>
    {features.map((f, i) => (
      <li key={f} className="flex items-baseline gap-5 border-b border-line py-5">
        <span className="font-mono text-[11px] tabular-nums" style={{ color: accent }}>
          {pad(i + 1)}
        </span>
        <span className="text-[1.1rem] leading-snug tracking-[-0.01em] text-ink">{f}</span>
      </li>
    ))}
  </Reveal>
);

FeatureList.propTypes = { features: PropTypes.arrayOf(PropTypes.string).isRequired, accent: PropTypes.string.isRequired, columns: PropTypes.bool };

export default ProjectCaseStudy;
