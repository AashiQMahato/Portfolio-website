import { Fragment, useCallback, useId, useLayoutEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { ArrowDown, ArrowUpRight, Briefcase, Code2, FileText, GraduationCap, Layers } from "lucide-react";
import { gsap, EASE, usePrefersReducedMotion } from "../motion";
import { MagneticButton } from "../components/ui";
import SectionAvatar from "../components/avatar/SectionAvatar";
import { CV, projects } from "../data/portfolioData";
import { offsetBox } from "./statement/wire";

const pad = (n) => String(n).padStart(2, "0");
const degree = CV.education[0];
const gradYear = degree.period.split("–").pop().trim().split(" ").pop();

/*
 * The four parts of the résumé, physical order on the page, each in one of
 * the Statement's stage hues. Every value is read from portfolioData — the
 * same source the résumé page renders — never hand-typed.
 */
const PARTS = [
  {
    id: "sense",
    word: "Roles",
    n: "01",
    name: "Roles",
    blurb: ["Where I've worked", "and what I shipped."],
    Icon: Briefcase,
    pill: `${pad(CV.experience.length)} roles`,
  },
  {
    id: "process",
    word: "education",
    n: "02",
    name: "Education",
    blurb: ["Electronics, communication", "& information eng."],
    Icon: GraduationCap,
    pill: `BE · ${gradYear}`,
  },
  {
    id: "connect",
    word: "projects",
    n: "03",
    name: "Projects",
    blurb: ["Hardware to web,", "each with a case study."],
    Icon: Layers,
    pill: `${pad(projects.length)} projects`,
  },
  {
    id: "experience",
    word: "stack",
    n: "04",
    name: "Stack",
    blurb: ["The tools behind", "every build."],
    Icon: Code2,
    pill: `${CV.skills.length} skills`,
  },
];
const HUE = { Roles: "teal", education: "blue", projects: "violet", stack: "pink" };
const LINES = [
  ["Want", "the", "compact", "version?"],
  [{ w: "Roles", after: "," }, { w: "education", after: "," }],
  [{ w: "projects" }, "and", { w: "stack" }, "—"],
  ["two", "pages,", "kept", "up", "to", "date."],
];
const FULL = LINES.flat()
  .map((t) => (typeof t === "string" ? t : t.w + (t.after ?? "")))
  .join(" ");

/** What each card shows: a slice of the real résumé. */
const Sheet = ({ id }) => {
  const row = "border-b border-white/[0.06] pb-2.5 last:border-0 last:pb-0";
  if (id === "sense") {
    return (
      <ul className="space-y-2.5">
        {CV.experience.map((e) => (
          <li key={e.company} className={row}>
            <span className="block text-[0.8125rem] font-medium leading-snug text-ink">{e.role}</span>
            <span className="block text-[0.75rem] leading-snug text-ink-dim">{e.company}</span>
            <span className="mt-1 block font-mono text-[0.625rem] uppercase tracking-[0.12em] text-[rgb(var(--stage))]">{e.period}</span>
          </li>
        ))}
      </ul>
    );
  }
  if (id === "process") {
    return (
      <div>
        <span className="block text-[2.75rem] font-semibold leading-none tracking-[-0.05em] text-ink">BE</span>
        <span className="mt-2 block text-[0.8125rem] font-medium leading-snug text-ink">{degree.degree.replace(/^BE in /, "")}</span>
        <span className="mt-1.5 block text-[0.75rem] leading-snug text-ink-dim">{degree.institution}</span>
        <span className="mt-2 block font-mono text-[0.625rem] uppercase tracking-[0.12em] text-[rgb(var(--stage))]">{degree.period}</span>
      </div>
    );
  }
  if (id === "connect") {
    return (
      <ul className="space-y-1.5">
        {projects.slice(0, 5).map((p, i) => (
          <li key={p.slug} className="flex items-baseline gap-2 text-[0.75rem] leading-snug text-ink-dim">
            <span className="font-mono text-[0.625rem] text-[rgb(var(--stage))]">{pad(i + 1)}</span>
            <span className="min-w-0 truncate text-ink/85">{p.title.split(/ [-–—] | with /)[0]}</span>
          </li>
        ))}
        {projects.length > 5 && <li className="pl-6 text-[0.6875rem] text-ink-dim">+{projects.length - 5} more</li>}
      </ul>
    );
  }
  return (
    <ul className="flex flex-wrap gap-1.5">
      {CV.skills.map((s) => (
        <li key={s} className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[0.625rem] leading-relaxed text-ink/80">
          {s}
        </li>
      ))}
    </ul>
  );
};
Sheet.propTypes = { id: PropTypes.string.isRequired };

/** One part: the header is the control; the card under it is the page slice. */
const Part = ({ part, on, dim, pinned, setProbe, setPinned }) => (
  <li
    data-part={part.id}
    data-on={on}
    onPointerEnter={(e) => e.pointerType === "mouse" && setProbe(part.id)}
    onPointerLeave={(e) => e.pointerType === "mouse" && setProbe(null)}
    className={`stage-${part.id} relative flex flex-col transition-opacity duration-500 [--pad:clamp(0.25rem,1.6vw,1.5rem)] ${dim ? "opacity-55" : ""}`}
  >
    <button
      type="button"
      aria-pressed={pinned === part.id}
      onFocus={() => setProbe(part.id)}
      onClick={() => setPinned((p) => (p === part.id ? null : part.id))}
      className="relative block rounded-lg pl-[var(--pad)] text-left focus-visible:outline-offset-4"
    >
      <span
        data-node-disc
        className={`grid h-[2.875rem] w-[2.875rem] place-items-center rounded-full border bg-[rgb(var(--stage)/0.08)] transition-[transform,box-shadow,border-color] duration-500 ease-out ${
          on
            ? "border-[rgb(var(--stage))] shadow-[0_0_0_5px_rgb(var(--stage)/0.12),0_0_28px_rgb(var(--stage)/0.55)] motion-safe:scale-110"
            : "border-[rgb(var(--stage)/0.75)] shadow-[0_0_18px_-2px_rgb(var(--stage)/0.45)]"
        }`}
      >
        <part.Icon aria-hidden="true" strokeWidth={1.6} className="h-5 w-5 text-[rgb(var(--stage))]" />
      </span>
      <span data-node-text className="mt-4 block">
        <span className="block text-[0.9375rem] font-medium tabular-nums leading-none text-[rgb(var(--stage))]">{part.n}</span>
        <span className="mt-2.5 block text-[1.0625rem] font-semibold uppercase leading-none tracking-[0.01em] text-[rgb(var(--stage))]">{part.name}</span>
        <span className="mt-3 block text-[0.8125rem] leading-[1.45] text-ink/80">
          {part.blurb[0]}
          <br className="hidden xl:block" /> {part.blurb[1]}
        </span>
      </span>
    </button>

    <div className={`relative mt-5 flex-1 transition-transform duration-700 ease-out ${on ? "motion-safe:-translate-y-1.5" : ""}`}>
      <span aria-hidden="true" data-anchor={part.id} className="absolute left-1/2 top-0 h-0 w-0" />
      <div
        data-frame
        data-edge={part.id}
        className={`stage-card relative h-full min-h-[11.5rem] overflow-hidden rounded-xl p-4 pb-9`}
      >
        <div data-scene>
          <Sheet id={part.id} />
        </div>
      </div>
      <span
        data-pill
        className="absolute -bottom-3 left-4 z-10 whitespace-nowrap rounded-full border border-[rgb(var(--stage)/0.55)] bg-[rgb(8_9_14/0.9)] px-3 py-1.5 text-[0.75rem] leading-none tabular-nums text-ink shadow-[0_0_24px_-6px_rgb(var(--stage)/0.6)]"
      >
        {part.pill}
      </span>
    </div>
  </li>
);
Part.propTypes = {
  part: PropTypes.object.isRequired,
  on: PropTypes.bool,
  dim: PropTypes.bool,
  pinned: PropTypes.string,
  setProbe: PropTypes.func.isRequired,
  setPinned: PropTypes.func.isRequired,
};

/**
 * (06) Résumé — the compact version, set in the Statement's language: a
 * near-black stage, the offer in oversized light type with the four parts
 * of the CV in their stage hues, the four parts themselves as cards of real
 * CV data joined by one glowing wire, and the actions in a full-width strip
 * (the real PDF, the résumé page, the download).
 *
 * Entrance: rule → words rise → part words sweep into colour → chain →
 * discs → cards open behind masks → the wire draws card to card → pills →
 * strip. Hover / focus / tap a part to bring it (and its word) forward.
 * Reduced motion renders it complete; every interaction still works.
 */
const ResumeCta = () => {
  const ref = useRef(null);
  const railRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const uid = useId().replace(/:/g, "");
  const [probe, setProbe] = useState(null);
  const [pinned, setPinned] = useState(null);
  const [geo, setGeo] = useState(null);
  const active = probe ?? pinned;
  const ai = PARTS.findIndex((p) => p.id === active);
  const litWord = ai >= 0 ? PARTS[ai].word : null;

  // The wire: card-top terminals joined by a soft wave, measured from layout.
  const measure = useCallback(() => {
    const root = railRef.current;
    if (!root) return;
    const anchors = PARTS.map((p) => root.querySelector(`[data-anchor="${p.id}"]`));
    const edges = PARTS.map((p) => root.querySelector(`[data-edge="${p.id}"]`));
    if (anchors.some((a) => !a) || edges.some((e) => !e)) return;
    const pts = anchors.map((a) => offsetBox(a, root));
    const boxes = edges.map((e) => offsetBox(e, root));
    const links = boxes.slice(1).map((b, i) => ({ x1: boxes[i].x + boxes[i].w, x2: b.x, y: Math.min(boxes[i].y, b.y) + Math.min(boxes[i].h, b.h) * 0.5 }));
    setGeo({ w: root.offsetWidth, h: root.offsetHeight, pts, links });
  }, []);
  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(railRef.current);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [measure]);

  useGSAP(
    () => {
      if (reduced) return undefined;
      const q = gsap.utils.selector(ref);
      const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.out } });
      tl.fromTo(q("[data-intro-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: EASE.expo }, 0)
        .fromTo(q("[data-intro-meta]"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.1)
        .fromTo(q("[data-word]"), { yPercent: 115 }, { yPercent: 0, duration: 1.1, ease: EASE.strong, stagger: 0.03 }, 0.2)
        .fromTo(q("[data-emph]"), { "--e": 0 }, { "--e": 1, duration: 1, ease: "power2.inOut", stagger: 0.14 }, 0.9)
        .fromTo(q("[data-chain]"), { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.8, stagger: 0.12 }, 0.4)
        .fromTo(q("[data-node-disc]"), { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.7)", stagger: 0.12, clearProps: "transform,opacity" }, 0.6)
        .fromTo(q("[data-node-text]"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, clearProps: "transform,opacity" }, 0.7)
        .fromTo(
          q("[data-frame]"),
          { clipPath: "inset(100% 0% 0% 0% round 12px)" },
          { clipPath: "inset(0% 0% 0% 0% round 12px)", duration: 1.3, ease: EASE.expo, stagger: 0.16, clearProps: "clipPath" },
          0.9,
        )
        .fromTo(q("[data-scene]"), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: EASE.expo, stagger: 0.16 }, 1.05)
        .fromTo(q("[data-terminal]"), { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.3 }, 1.3)
        .fromTo(q("[data-wire='leg'], [data-wire='glow']"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, ease: "power1.inOut", stagger: 0.15 }, 1.35)
        .fromTo(q("[data-wire='link']"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.45, stagger: 0.3 }, 1.7)
        .fromTo(q("[data-pill]"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 }, 1.7)
        .fromTo(q("[data-strip-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: EASE.expo }, 1.6)
        .fromTo(q("[data-cta]"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 }, 1.8);
      gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 70%", once: true, onEnter: () => tl.play() } });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1280px) and (hover: hover)", () => {
        const st = { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true };
        gsap.fromTo(q("[data-drift='type']"), { yPercent: 3 }, { yPercent: -3, ease: "none", scrollTrigger: st });
        q("[data-frame]").forEach((el, i) => gsap.fromTo(el, { y: [8, 14, 6, 12][i] }, { y: -[8, 14, 6, 12][i], ease: "none", scrollTrigger: st }));
      });
      return () => mm.revert();
    },
    { dependencies: [reduced], scope: ref },
  );

  const legOn = (i) => (ai < 0 ? "rest" : i === ai - 1 || i === ai ? "on" : "off");
  const d = geo
    ? geo.pts.slice(1).map((b, i) => {
        const a = geo.pts[i];
        const dx = b.x - a.x;
        return `M${a.x} ${a.y} C${a.x + dx * 0.45} ${a.y - 16} ${b.x - dx * 0.45} ${b.y - 16} ${b.x} ${b.y}`;
      })
    : [];

  return (
    <section
      ref={ref}
      id="resume-cta"
      aria-labelledby="resume-cta-title"
      onKeyDown={(e) => {
        if (e.key === "Escape" && (pinned || probe)) {
          setPinned(null);
          setProbe(null);
        }
      }}
      className="statement-scope relative isolate overflow-x-clip py-[clamp(5rem,13vh,9.5rem)]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-[-10%] top-[20%] h-[60%] w-[70%] bg-[radial-gradient(closest-side,rgb(var(--c-connect)/0.08),transparent)]" />
        <div className="absolute left-[-15%] top-[5%] h-[55%] w-[45%] bg-[radial-gradient(closest-side,rgb(var(--c-sense)/0.05),transparent)]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[rgb(var(--background))] to-transparent" />
      </div>

      <div className="shell">
        <div className="grid gap-x-[clamp(1.5rem,2.6vw,3rem)] gap-y-16 xl:grid-cols-[minmax(0,0.62fr)_minmax(0,1fr)]">
          {/* Left — index row and the offer */}
          <div data-drift="type">
            <div className="mb-[clamp(2rem,5.5vh,3.75rem)] flex items-center gap-4">
              <span data-intro-meta className="text-[1rem] tabular-nums text-[rgb(var(--c-connect))]">
                (06)
              </span>
              <h2 id="resume-cta-title" data-intro-meta className="text-[1.0625rem] font-medium tracking-[-0.01em] text-ink">
                Résumé
              </h2>
              <span aria-hidden="true" className="relative ml-3 h-px w-[clamp(6rem,15vw,13.5rem)]">
                <span data-intro-rule className="absolute inset-0 origin-left bg-[linear-gradient(90deg,rgb(var(--c-sense)/0.9),rgb(var(--c-process)/0.5)_70%,transparent)]" />
              </span>
              <SectionAvatar mood="proud" hover="celebrate" className="ml-auto h-10 w-10 md:h-12 md:w-12" />
            </div>

            <p className="text-[clamp(2rem,5vw,3rem)] font-light leading-[1.28] tracking-[-0.03em] text-ink xl:text-[clamp(2rem,2.82vw,3rem)]">
              <span className="sr-only">{FULL}</span>
              {LINES.map((line, li) => (
                <span key={li} aria-hidden="true" className="sm:block sm:whitespace-nowrap">
                  {line.map((t, wi) => {
                    const emph = typeof t !== "string";
                    const word = emph ? t.w : t;
                    const lit = emph && litWord === word;
                    return (
                      <Fragment key={wi}>
                        <span className="-mb-[0.12em] inline-block overflow-clip pb-[0.12em] align-top">
                          <span data-word className="inline-block will-change-transform">
                            {emph ? (
                              <span
                                data-emph
                                className={`emph-word emph-${HUE[word]} relative inline-block font-semibold tracking-[-0.04em] transition-opacity duration-500 ${
                                  litWord && !lit ? "opacity-40" : ""
                                }`}
                              >
                                {word}
                                <span
                                  className={`absolute inset-x-0 bottom-[0.04em] h-[0.06em] origin-left rounded-full bg-[linear-gradient(90deg,var(--g1),var(--g2))] shadow-[0_0_14px_var(--g1)] transition-transform duration-500 ease-out ${
                                    lit ? "scale-x-100" : "scale-x-0"
                                  }`}
                                />
                              </span>
                            ) : (
                              word
                            )}
                            {emph && t.after}
                          </span>
                        </span>{" "}
                      </Fragment>
                    );
                  })}
                </span>
              ))}
            </p>
          </div>

          {/* Right — the four parts of the CV */}
          <div
            ref={railRef}
            className="relative xl:pt-[0.3rem]"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setProbe(null);
            }}
          >
            <p aria-hidden="true" className="mb-[clamp(2.5rem,7vh,4.75rem)] hidden items-center justify-end gap-[clamp(0.75rem,1.8vw,1.75rem)] font-mono text-[0.625rem] uppercase tracking-[0.32em] text-ink/70 sm:flex">
              {["Experience", "Education", "Projects", "Skills"].map((c, i) => (
                <span key={c} data-chain className="flex items-center gap-[clamp(0.75rem,1.8vw,1.75rem)]">
                  {i > 0 && <span className="tracking-normal text-ink-faint">→</span>}
                  {c}
                </span>
              ))}
            </p>

            {geo && (
              <svg aria-hidden="true" viewBox={`0 0 ${geo.w} ${geo.h}`} className="pointer-events-none absolute inset-0 z-[5] hidden h-full w-full overflow-visible md:block">
                <defs>
                  <linearGradient id={`${uid}-g`} gradientUnits="userSpaceOnUse" x1={geo.pts[0].x} y1="0" x2={geo.pts[3].x} y2="0">
                    <stop offset="0" stopColor="rgb(var(--c-sense))" />
                    <stop offset="0.33" stopColor="rgb(var(--c-process))" />
                    <stop offset="0.68" stopColor="rgb(var(--c-connect))" />
                    <stop offset="1" stopColor="rgb(var(--c-experience))" />
                  </linearGradient>
                  <filter id={`${uid}-glow`} x="-20%" y="-50%" width="140%" height="200%">
                    <feGaussianBlur stdDeviation="3" />
                  </filter>
                </defs>
                {geo.links.map((l, i) => (
                  <g key={i} className={`stage-${PARTS[i + 1].id}`} opacity={ai < 0 || ai === i || ai === i + 1 ? 1 : 0.3}>
                    <path d={`M${l.x1} ${l.y}H${l.x2}`} stroke={`url(#${uid}-g)`} strokeWidth="1.2" pathLength="1" strokeDasharray="1" data-wire="link" />
                    <circle cx={l.x1} cy={l.y} r="2.6" fill="rgb(var(--stage))" />
                    <circle cx={l.x2} cy={l.y} r="2.6" fill="rgb(var(--stage))" />
                  </g>
                ))}
                {d.map((p, i) => {
                  const st = legOn(i);
                  return (
                    <g key={i} opacity={st === "off" ? 0.28 : 1} className="transition-opacity duration-500">
                      <path d={p} data-wire="glow" pathLength="1" strokeDasharray="1" fill="none" stroke={`url(#${uid}-g)`} strokeWidth={st === "on" ? 6 : 4} opacity="0.55" filter={`url(#${uid}-glow)`} />
                      <path d={p} data-wire="leg" pathLength="1" strokeDasharray="1" fill="none" strokeLinecap="round" stroke={`url(#${uid}-g)`} strokeWidth={st === "on" ? 2 : 1.25} />
                    </g>
                  );
                })}
                {geo.pts.map((p, i) => (
                  <g key={PARTS[i].id} data-terminal className={`stage-${PARTS[i].id}`}>
                    <circle cx={p.x} cy={p.y} r={ai === i ? 9 : 6} fill="rgb(var(--stage) / 0.25)" />
                    <circle cx={p.x} cy={p.y} r="3" fill="rgb(var(--stage))" />
                    <circle cx={p.x} cy={p.y} r="1.2" fill="#fff" />
                  </g>
                ))}
              </svg>
            )}

            <ol className="relative grid grid-cols-1 gap-x-[clamp(1rem,1.8vw,1.75rem)] gap-y-12 min-[480px]:grid-cols-2 md:grid-cols-4">
              {PARTS.map((p) => (
                <Part key={p.id} part={p} on={active === p.id} dim={!!active && active !== p.id} pinned={pinned} setProbe={setProbe} setPinned={setPinned} />
              ))}
            </ol>
          </div>
        </div>

        {/* The actions, as a full-width strip — the real file, described truthfully (2-page PDF, ~57 KB). */}
        <div className="relative mt-[clamp(3.5rem,8vh,5.5rem)] grid items-center gap-6 pt-[clamp(2rem,5vh,3rem)] md:grid-cols-[minmax(0,1fr)_auto]">
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-line" />
          <span
            aria-hidden="true"
            data-strip-rule
            className="absolute inset-x-0 top-0 h-px origin-left bg-[linear-gradient(90deg,transparent,rgb(var(--c-sense)/0.5)_20%,rgb(var(--c-connect)/0.5)_80%,transparent)]"
          />
          <a
            data-cta
            href="/AashikKumarMahatoResume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex max-w-md items-center gap-4 rounded-xl border border-line bg-white/[0.02] p-3 pr-4 transition-colors duration-300 hover:border-[rgb(var(--c-connect)/0.6)] focus-visible:outline-offset-4"
          >
            <span className="grid h-14 w-11 shrink-0 place-items-center rounded-[4px] border border-[rgb(var(--c-connect)/0.45)] bg-[rgb(var(--c-connect)/0.08)] shadow-[0_0_24px_-8px_rgb(var(--c-connect)/0.7)] transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:-rotate-3">
              <FileText aria-hidden="true" strokeWidth={1.5} className="h-5 w-5 text-[rgb(var(--c-connect))]" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm text-ink">AashikKumarMahatoResume.pdf</span>
              <span className="mt-1 block font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-dim">PDF · 2 pages · 57 KB</span>
            </span>
            <ArrowUpRight aria-hidden="true" className="ml-auto h-4 w-4 shrink-0 text-ink-dim transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            <span className="sr-only">(opens the PDF in a new tab)</span>
          </a>
          <div className="flex flex-wrap gap-3">
            <span data-cta>
              <MagneticButton as={Link} to="/resume" variant="signal" size="lg" icon={ArrowUpRight}>
                View résumé
              </MagneticButton>
            </span>
            <span data-cta>
              <MagneticButton as="a" href="/AashikKumarMahatoResume.pdf" download="AashikKumarMahatoResume.pdf" variant="outline" size="lg" icon={ArrowDown} iconDirection="down">
                Download CV
              </MagneticButton>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeCta;
