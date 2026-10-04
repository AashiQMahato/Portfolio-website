import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, Reveal, usePrefersReducedMotion } from "../motion";
import { CV, projects } from "../data/portfolioData";

const TEXT =
  "I build digital systems where software, electronics and interaction meet — from sensor traces on a breadboard to the interfaces people actually touch.";
const ACCENT = new Set(["software,", "electronics", "interaction"]);

const FACTS = [
  { value: String(projects.length).padStart(2, "0"), label: "Projects shipped, hardware to web" },
  { value: String(CV.experience.length).padStart(2, "0"), label: "Industry roles in engineering + frontend" },
  { value: "BE", label: "Electronics, Communication & Information Eng." },
];

/**
 * Editorial statement read at scroll speed: every word starts muted and
 * lights up as the paragraph passes through the viewport, so the sentence
 * resolves exactly as fast as it is read. The text is real, selectable and
 * fully present in the DOM; muted words still meet large-text contrast.
 */
const Statement = () => {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      // Scrub a mix weight, not opacity: unread words sit at --ink-faint
      // (≥3:1, valid for type this size) and resolve to ink / signal.
      gsap.fromTo(
        "[data-word]",
        { "--w": 0 },
        {
          "--w": 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: {
            trigger: "[data-statement]",
            start: "top 78%",
            end: "bottom 42%",
            scrub: 0.6,
          },
        },
      );
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
        </Reveal>

        <div className="lg:col-span-9">
          <h2 id="statement-title" className="sr-only">
            What I do
          </h2>
          <p data-statement className="text-statement text-ink">
            {TEXT.split(" ").map((word, i) => (
              <span key={i}>
                <span data-word className={ACCENT.has(word) ? "word-mix word-mix-signal" : "word-mix"}>
                  {word}
                </span>{" "}
              </span>
            ))}
          </p>

          <Reveal as="dl" variant="rise" selector="[data-fact]" className="mt-[clamp(4rem,10vh,7rem)] grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
            {FACTS.map((f) => (
              <div key={f.label} data-fact className="flex flex-col justify-between gap-10 bg-background p-6">
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
