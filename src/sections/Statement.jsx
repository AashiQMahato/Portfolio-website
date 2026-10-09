import { useRef } from "react";
import PropTypes from "prop-types";
import { useGSAP } from "@gsap/react";
import { gsap, Reveal, usePrefersReducedMotion } from "../motion";
import { CV, projects } from "../data/portfolioData";
import SectionAvatar from "../components/avatar/SectionAvatar";

// Two lines of philosophy (About carries the biography). Accented words light in the signal colour.
const FIRST = {
  text: "I build at the intersection of software and the physical world — from sensor traces on a breadboard to the interfaces people actually touch.",
  accent: new Set(["software", "physical", "world"]),
};
const SECOND = {
  text: "Good engineering connects complex systems to useful experiences.",
  accent: new Set(["useful", "experiences."]),
};
// The wire between them: the three ends every build has to satisfy.
const TERMINALS = ["Hardware", "Software", "People"];

const FACTS = [
  { value: String(projects.length).padStart(2, "0"), label: "Projects shipped, hardware to web" },
  { value: String(CV.experience.length).padStart(2, "0"), label: "Industry roles in engineering + frontend" },
  { value: "BE", label: "Electronics, Communication & Information Eng." },
];

const Words = ({ line, ...rest }) => (
  <p {...rest}>
    {line.text.split(" ").map((word, i) => (
      <span key={i}>
        <span data-word className={line.accent.has(word) ? "word-mix word-mix-signal" : "word-mix"}>
          {word}
        </span>{" "}
      </span>
    ))}
  </p>
);

Words.propTypes = {
  line: PropTypes.shape({ text: PropTypes.string.isRequired, accent: PropTypes.instanceOf(Set).isRequired }).isRequired,
};

/**
 * Statement — a short engineering manifesto read at scroll speed. The first
 * line lights word by word as it passes the reading band; a schematic wire
 * then draws across, energising three terminals; the second line resolves
 * last. Text is real and complete in the DOM; muted words sit at ink-faint
 * (≥3:1 at this size) and everything renders lit under reduced motion.
 */
const Statement = () => {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const lightUp = (scope, start, end) =>
        gsap.fromTo(
          `${scope} [data-word]`,
          { "--w": 0 },
          { "--w": 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: scope, start, end, scrub: 0.6 } },
        );
      lightUp("[data-statement='1']", "top 78%", "bottom 45%");
      lightUp("[data-statement='2']", "top 80%", "bottom 55%");

      const wire = gsap.timeline({ scrollTrigger: { trigger: "[data-wire]", start: "top 85%", end: "bottom 55%", scrub: 0.6 } });
      wire.fromTo("[data-wire-line]", { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 1 });
      gsap.utils.toArray(ref.current.querySelectorAll("[data-terminal]")).forEach((t, i, all) => {
        const at = i / (all.length - 1);
        wire
          .fromTo(t.querySelector("[data-node-fill]"), { scale: 0 }, { scale: 1, duration: 0.12 }, at * 0.9)
          .fromTo(t.querySelector("[data-label]"), { opacity: 0.25 }, { opacity: 1, duration: 0.12 }, at * 0.9);
      });
    },
    { dependencies: [reduced], scope: ref },
  );

  return (
    <section ref={ref} aria-labelledby="statement-title" className="relative py-[clamp(7rem,18vh,14rem)]">
      <div className="shell grid gap-12 lg:grid-cols-12">
        <Reveal variant="fade" className="lg:col-span-3">
          <p className="hud flex items-center gap-3">
            <span className="tabular-nums text-ink">(01)</span> Statement
          </p>
          <SectionAvatar mood="thinking" className="mt-6 h-14 w-14 md:h-16 md:w-16" />
          <p className="hud mt-6 hidden lg:block">Fig. 01 — Approach</p>
        </Reveal>

        <div className="lg:col-span-9">
          <h2 id="statement-title" className="sr-only">
            Approach
          </h2>
          <Words line={FIRST} data-statement="1" className="text-statement text-ink" />

          {/* Schematic wire: a hairline that draws across, three terminals energise in turn. */}
          <div data-wire aria-hidden="true" className="relative my-[clamp(3.5rem,9vh,6rem)] max-w-3xl">
            <span className="absolute left-0 right-0 top-[5px] h-px bg-line" />
            <span data-wire-line className="absolute left-0 right-0 top-[5px] h-px origin-left bg-signal" />
            <ol className="relative flex justify-between">
              {TERMINALS.map((t) => (
                <li key={t} data-terminal className="flex flex-col items-center gap-3 first:items-start last:items-end">
                  <span className="grid h-[11px] w-[11px] place-items-center rounded-full border border-signal bg-background">
                    <span data-node-fill className="block h-[7px] w-[7px] rounded-full bg-signal" />
                  </span>
                  <span data-label className="hud text-ink">
                    {t}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <Words line={SECOND} data-statement="2" className="max-w-4xl text-[clamp(1.75rem,3.4vw,3rem)] font-medium leading-[1.12] tracking-[-0.035em] text-ink" />

          <Reveal as="dl" variant="rise" selector="[data-fact]" className="mt-[clamp(4rem,10vh,7rem)] grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
            {FACTS.map((f) => (
              <div key={f.label} data-fact data-avatar="proud" className="flex flex-col justify-between gap-10 bg-background p-6">
                <dt className="order-2 text-sm text-ink-dim">{f.label}</dt>
                <dd className="order-1 font-mono text-4xl font-medium tracking-[-0.04em] text-ink">{f.value}</dd>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Statement;
