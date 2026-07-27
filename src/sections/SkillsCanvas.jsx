import { useRef } from "react";
import PropTypes from "prop-types";
import { useGSAP } from "@gsap/react";
import { skillCategories } from "../data/portfolioData";
import {
  gsap,
  Reveal,
  useMediaQuery,
  usePrefersReducedMotion,
} from "../motion";
import { FrameLabel, SelectionBox } from "../components/canvas";

const TONES = ["accent", "ember", "dim", "accent"];

const ClusterCard = ({ category, index }) => (
  <SelectionBox
    name={`${category.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.frame`}
    size={`${420 + index * 4} × ${300 + index * 8}`}
    tone={TONES[index % TONES.length]}
    className="panel w-[85vw] max-w-[420px] shrink-0 rounded-2xl border-solid p-6 md:p-7"
  >
    <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-ink">
      <span className="text-accent-ink">{String(index + 1).padStart(2, "0")}</span>{" "}
      {category.title}
    </h3>
    <ul className="mt-6 space-y-4">
      {category.skills.map((skill) => (
        <li key={skill.name}>
          <div className="mb-1.5 flex items-baseline justify-between gap-4">
            <span className="text-sm font-semibold text-ink">{skill.name}</span>
            <span className="font-mono text-[10px] tracking-[0.15em] text-ink-dim">
              {skill.tags?.[0]?.toUpperCase()}
            </span>
          </div>
          <div
            className="h-[4px] w-full overflow-hidden rounded-full bg-muted"
            role="meter"
            aria-valuenow={skill.level}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${skill.name} proficiency`}
          >
            <div
              data-meter-fill
              className="h-full origin-left rounded-full bg-signal"
              style={{ width: `${skill.level}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  </SelectionBox>
);

ClusterCard.propTypes = {
  category: PropTypes.shape({
    title: PropTypes.string.isRequired,
    skills: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        level: PropTypes.number,
        tags: PropTypes.arrayOf(PropTypes.string),
      }),
    ).isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

/**
 * Skills as a horizontally panning canvas: the section pins and the cluster
 * cards pan sideways as you scroll (GSAP owns all scroll-indexed motion).
 * Mobile and reduced motion get a plain vertical stack — no pin.
 */
const SkillsCanvas = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const pctRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const isWide = useMediaQuery("(min-width: 1024px)");
  const pinned = isWide && !reduced;

  useGSAP(
    () => {
      if (!pinned) return;
      const track = trackRef.current;
      const distance = () => track.scrollWidth - window.innerWidth + 160;

      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (pctRef.current)
              pctRef.current.textContent = `${Math.round(self.progress * 100)}%`;
          },
        },
      });

      // Meter fills sweep once the pan starts.
      gsap.utils.toArray("[data-meter-fill]").forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              once: true,
            },
          },
        );
      });
    },
    { dependencies: [pinned], scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="skills"
      data-section
      aria-labelledby="skills-heading"
      className={`relative overflow-hidden ${
        pinned ? "flex h-screen flex-col justify-center" : "py-[clamp(6rem,14vh,11rem)]"
      }`}
    >
      <div className="mx-auto w-full max-w-5xl px-5 md:px-10">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <FrameLabel index="03" name="skills.canvas" />
              <h2
                id="skills-heading"
                className="mt-8 font-display text-display-2 text-ink"
              >
                What I work with
                <span className="text-signal">.</span>
              </h2>
            </div>
            {pinned && (
              <p
                className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dim"
                aria-hidden="true"
              >
                Scroll to pan
                <span className="pill inline-block min-w-[3.5rem] px-2.5 py-1 text-center text-accent-ink">
                  <span ref={pctRef}>0%</span>
                </span>
              </p>
            )}
          </div>
        </Reveal>
      </div>

      {/* Panning track (vertical stack when not pinned) */}
      <div
        ref={trackRef}
        className={`mt-12 flex will-change-transform ${
          pinned
            ? "w-max items-start gap-10 pl-[max(1.25rem,calc((100vw-64rem)/2))] pr-24"
            : "mx-auto max-w-5xl flex-col items-stretch gap-8 px-5 md:flex-row md:flex-wrap md:justify-center md:px-10"
        }`}
      >
        {skillCategories.map((category, i) => (
          <ClusterCard key={category.title} category={category} index={i} />
        ))}
      </div>
    </section>
  );
};

export default SkillsCanvas;
