import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, usePrefersReducedMotion } from "../motion";
import { SectionHeader } from "../components/ui";
import { CV, siteConfig } from "../data/portfolioData";
import { BEHAVIOR, reactAvatar } from "../components/avatar/mood";

const ROLE_TECH = {
  "WebX Nepal": ["React", "Tailwind CSS", "Responsive UI", "Performance"],
  "Entegra Sources Pvt. Ltd": ["Electronics", "Technical writing", "Engineering documentation"],
};

const degree = CV.education[0];

const MILESTONES = [
  {
    period: "2026 —",
    title: siteConfig.availability,
    org: "Freelance, contract or full-time — remote or Kathmandu",
    summary:
      "Looking for teams building at the edge of hardware and software: IoT products, embedded dashboards, or React platforms that need an engineer's eye.",
    tech: [],
    kind: "now",
  },
  ...CV.experience.map((e) => ({
    period: e.period,
    title: e.role,
    org: `${e.company} · ${e.location}`,
    summary: e.bullets[0],
    details: e.bullets.slice(1),
    tech: ROLE_TECH[e.company] || [],
    kind: "role",
  })),
  {
    period: degree.period.replace(/Jan /g, ""),
    title: degree.degree,
    org: `${degree.institution} · ${degree.location}`,
    summary:
      "Electronics, communication systems and embedded design — the base the hardware projects grew from.",
    tech: ["Electronics", "Embedded systems", "Communication"],
    kind: "education",
  },
];
const KIND_LABEL = { now: "Now", role: "Role", education: "Education" };

/**
 * Professional journey. The rail fills with scroll progress; each milestone
 * becomes "current" (full ink, filled node) as it crosses the reading line
 * and recedes once passed, so the eye always has one anchor. Receding is a
 * colour step (ink → ink-dim), never opacity, so text stays AA. Without
 * motion every entry renders fully active. Roles, education and the open
 * "now" entry each get their own marker; extra responsibilities sit behind
 * a disclosure so the timeline scans at a glance.
 */
const Experience = () => {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = useState(null);
  const toggle = (key) => {
    setOpen((o) => (o === key ? null : key));
    if (open !== key) reactAvatar(BEHAVIOR.curious, 1800);
  };

  useGSAP(
    () => {
      if (reduced) return;
      gsap.fromTo(
        "[data-rail-progress]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: "[data-timeline]", start: "top 55%", end: "bottom 55%", scrub: true },
        },
      );
      gsap.utils.toArray("[data-milestone]").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          toggleClass: { targets: el, className: "is-active" },
        });
      });
    },
    { dependencies: [reduced], scope: ref },
  );

  return (
    <section ref={ref} id="experience" aria-labelledby="experience-title" className="relative py-[clamp(7rem,16vh,13rem)]">
      <div className="shell">
        <SectionHeader
          index="04"
          avatar={{ mood: "proud", hover: "curious" }}
          label="Experience"
          id="experience-title"
          title={["Where I've built,", "learned and shipped."]}
          aside={
            <Link to="/timeline" className="link-line text-sm text-ink-dim hover:text-ink">
              Full timeline →
            </Link>
          }
        />

        <ol data-timeline className="relative">
          <span aria-hidden="true" className="absolute bottom-0 left-[7px] top-0 w-px bg-line lg:left-[calc(25%+7px)]">
            <span data-rail-progress className="absolute inset-0 origin-top bg-signal" />
          </span>

          {MILESTONES.map((m, i) => (
            <li
              key={m.title}
              data-milestone
              className={`group relative grid gap-3 pb-[clamp(3.5rem,8vh,5.5rem)] pl-10 last:pb-0 lg:grid-cols-4 lg:gap-0 lg:pl-0 ${
                reduced ? "is-active" : ""
              }`}
            >
              {/* Marker shape says what kind of milestone it is: ring = role, square = education, dot = now. */}
              <span
                aria-hidden="true"
                className={`absolute left-0 top-1.5 h-[15px] w-[15px] border border-line bg-background transition-colors duration-500 group-[.is-active]:border-signal lg:left-[25%] ${
                  m.kind === "education" ? "rotate-45 scale-[0.85] rounded-[2px]" : "rounded-full"
                } ${m.kind === "role" ? "group-[.is-active]:bg-signal" : m.kind === "now" ? "border-signal bg-signal" : "group-[.is-active]:bg-signal/30"}`}
              />
              <p className="hud transition-colors duration-500 group-[.is-active]:text-ink lg:pr-10 lg:text-right">
                {m.period}
                <span className="mt-1 block text-ink-faint lg:mt-1.5">{KIND_LABEL[m.kind]}</span>
              </p>
              <div className="lg:col-span-3 lg:pl-14">
                <h3 className="text-[clamp(1.5rem,2.6vw,2.4rem)] font-medium leading-tight tracking-[-0.03em] text-ink-dim transition-colors duration-500 group-[.is-active]:text-ink">
                  {m.kind === "now" && (
                    <span className="mr-3 inline-block h-2.5 w-2.5 -translate-y-1 rounded-full bg-signal" aria-hidden="true" />
                  )}
                  {m.title}
                </h3>
                <p className="mt-1 text-ink-dim">{m.org}</p>
                <p className="mt-5 max-w-2xl text-ink-dim">{m.summary}</p>
                {m.details?.length > 0 && (
                  <>
                    <button
                      type="button"
                      aria-expanded={open === m.title}
                      aria-controls={`exp-${i}`}
                      onClick={() => toggle(m.title)}
                      className="hud mt-4 inline-flex items-center gap-2 rounded-sm text-ink hover:text-signal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal"
                    >
                      <span aria-hidden="true" className={`inline-block transition-transform duration-300 ${open === m.title ? "rotate-45" : ""}`}>
                        +
                      </span>
                      {open === m.title ? "Less" : `${m.details.length} more responsibilities`}
                    </button>
                    <div
                      id={`exp-${i}`}
                      className={`grid transition-[grid-template-rows] duration-500 ease-out ${open === m.title ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                    >
                      <ul className="max-w-2xl space-y-2 overflow-hidden" inert={open === m.title ? undefined : ""}>
                        {m.details.map((d) => (
                          <li key={d} className="flex gap-3 pt-2 text-ink-dim first:pt-3">
                            <span aria-hidden="true" className="mt-[0.6em] h-px w-3 shrink-0 bg-line" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
                {m.tech.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Focus areas">
                    {m.tech.map((t) => (
                      <li key={t} className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-ink-dim">
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Experience;
