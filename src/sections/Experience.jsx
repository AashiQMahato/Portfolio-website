import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, usePrefersReducedMotion } from "../motion";
import { SectionHeader } from "../components/ui";
import { CV, siteConfig } from "../data/portfolioData";

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
    now: true,
  },
  ...CV.experience.map((e) => ({
    period: e.period,
    title: e.role,
    org: `${e.company} · ${e.location}`,
    summary: e.bullets.join(" "),
    tech: ROLE_TECH[e.company] || [],
  })),
  {
    period: degree.period.replace(/Jan /g, ""),
    title: degree.degree,
    org: `${degree.institution} · ${degree.location}`,
    summary:
      "Electronics, communication systems and embedded design — the base the hardware projects grew from.",
    tech: ["Electronics", "Embedded systems", "Communication"],
  },
];

/**
 * Professional journey. The rail fills with scroll progress; each milestone
 * becomes "current" (full ink, filled node) as it crosses the reading line
 * and recedes once passed, so the eye always has one anchor. Receding is a
 * colour step (ink → ink-dim), never opacity, so text stays AA. Without
 * motion every entry renders fully active.
 */
const Experience = () => {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

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
          title={["The path so far."]}
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

          {MILESTONES.map((m) => (
            <li
              key={m.title}
              data-milestone
              className={`group relative grid gap-3 pb-[clamp(3.5rem,8vh,5.5rem)] pl-10 last:pb-0 lg:grid-cols-4 lg:gap-0 lg:pl-0 ${
                reduced ? "is-active" : ""
              }`}
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border border-line bg-background transition-colors duration-500 group-[.is-active]:border-signal group-[.is-active]:bg-signal lg:left-[25%]"
              />
              <p className="hud transition-colors duration-500 group-[.is-active]:text-ink lg:pr-10 lg:text-right">
                {m.period}
              </p>
              <div className="lg:col-span-3 lg:pl-14">
                <h3 className="text-[clamp(1.5rem,2.6vw,2.4rem)] font-medium leading-tight tracking-[-0.03em] text-ink-dim transition-colors duration-500 group-[.is-active]:text-ink">
                  {m.now && (
                    <span className="mr-3 inline-block h-2.5 w-2.5 -translate-y-1 rounded-full bg-signal" aria-hidden="true" />
                  )}
                  {m.title}
                </h3>
                <p className="mt-1 text-ink-dim">{m.org}</p>
                <p className="mt-5 max-w-2xl text-ink-dim">{m.summary}</p>
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
