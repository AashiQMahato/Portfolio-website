import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { skillCategories, techPills } from "../data/portfolioData";
import SectionHeading from "../components/schematic/SectionHeading";
import { Reveal, gsap, DUR, EASE, usePrefersReducedMotion } from "../motion";
import Marquee from "../components/ui/Marquee";

const Skills = () => {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  // Meter fills sweep in once their panel scrolls into view.
  useGSAP(
    () => {
      if (reduced) return;
      gsap.utils.toArray("[data-meter-fill]").forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: DUR.lg,
            ease: EASE.out,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
      });
    },
    { dependencies: [reduced], scope: ref },
  );

  return (
    <section
      ref={ref}
      id="skills"
      data-section
      aria-labelledby="skills-heading"
      className="relative px-5 py-[clamp(6rem,14vh,11rem)] md:px-10 lg:pl-28 lg:pr-16"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="02"
          label="Skills"
          title={<span id="skills-heading">Signal processing, both kinds<span className="text-signal">.</span></span>}
          blurb="Web stack for the product layer, embedded stack for the physical one — and the tooling that connects them."
        />

        <Reveal selector="[data-skill-panel]" className="grid gap-px border border-line bg-line sm:grid-cols-2">
          {skillCategories.map((category) => (
            <div key={category.title} data-skill-panel className="bg-background p-6 md:p-8">
              <h3 className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-ink">
                <span className="text-signal">{"//"}</span> {category.title}
              </h3>
              <ul className="space-y-5">
                {category.skills.map((skill) => (
                  <li key={skill.name}>
                    <div className="mb-2 flex items-baseline justify-between gap-4">
                      <span className="text-sm font-medium text-ink">{skill.name}</span>
                      <span className="font-mono text-[10px] tracking-[0.15em] text-ink-dim">
                        {skill.tags?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div
                      className="h-[3px] w-full bg-line"
                      role="meter"
                      aria-valuenow={skill.level}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${skill.name} proficiency`}
                    >
                      <div
                        data-meter-fill
                        className="h-full origin-left bg-signal"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>
      </div>

      {/* Tech ticker */}
      <div className="mt-16 border-y border-line py-4">
        <Marquee speed={38} pauseOnHover={false}>
          {techPills.map((tech) => (
            <span
              key={tech}
              className="font-mono text-xs uppercase tracking-[0.25em] text-ink-dim"
            >
              {tech} <span className="ml-6 text-signal" aria-hidden="true">+</span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default Skills;
