import { useEffect, useRef } from "react";
import {
  Atom,
  Briefcase,
  CircuitBoard,
  Cpu,
  Languages,
  Palette,
  Radio,
  Rocket,
  Server,
} from "lucide-react";
import { CV, projects, techPills } from "../data/portfolioData";
import { animate, Reveal, usePrefersReducedMotion } from "../motion";
import {
  FrameLabel,
  SelectionBox,
  CountUp,
  TapeLabel,
} from "../components/canvas";

const PORTRAIT_URL =
  "https://avatars.githubusercontent.com/u/89069898?s=400&v=4";

const METRICS = [
  {
    value: projects.length,
    label: "Projects shipped",
    suffix: "",
    Icon: Rocket,
  },
  {
    value: CV.experience.length,
    label: "Industry roles",
    suffix: "",
    Icon: Briefcase,
  },
  {
    value: techPills.length,
    label: "Technologies in rotation",
    suffix: "+",
    Icon: Cpu,
  },
  { value: 2, label: "Languages spoken", suffix: "", Icon: Languages },
];

const CAPABILITIES = [
  { label: "Electronics", Icon: CircuitBoard },
  { label: "IoT Systems", Icon: Radio },
  { label: "React / Next.js", Icon: Atom },
  { label: "Node.js APIs", Icon: Server },
  { label: "Firmware", Icon: Cpu },
  { label: "UI Engineering", Icon: Palette },
];

/**
 * statement.txt — who this is: portrait card on the canvas, one confident
 * statement, count-up metrics, and capability chips.
 */
const About = () => {
  const portraitRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  // Idle float loop on the portrait card — time-indexed, so anime.js owns
  // it; the handle is paused on unmount and never starts under reduced
  // motion.
  useEffect(() => {
    const el = portraitRef.current;
    if (!el || reduced) return undefined;
    const float = animate(el, {
      translateY: [-6, 6],
      duration: 4800,
      ease: "inOutSine",
      alternate: true,
      loop: true,
    });
    return () => float.pause();
  }, [reduced]);

  return (
    <section
      id="about"
      data-section
      aria-labelledby="about-heading"
      className="relative px-5 py-[clamp(6rem,14vh,11rem)] md:px-10"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <FrameLabel index="01" name="statement.txt" />
        </Reveal>

        <div className="mt-8 grid items-start gap-12 lg:grid-cols-12">
          {/* Statement + bio */}
          <Reveal selector="[data-about-line]" className="lg:col-span-7">
            <h2
              id="about-heading"
              data-about-line
              className="font-display text-display-2 text-ink"
            >
              I make hardware and software stop talking past each other
              <span className="text-signal">.</span>
            </h2>
            <p
              data-about-line
              className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-dim"
            >
              {CV.summary}
            </p>
            <p
              data-about-line
              className="mt-4 max-w-2xl leading-relaxed text-ink-dim"
            >
              I started on the hardware side — sensors, microcontrollers, and
              the physics of making things work in the real world — and grew
              into building the software above it. Whether it&apos;s a GSM
              module or a React tree, I care about how the whole signal path
              behaves.
            </p>
            <p
              data-about-line
              className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dim"
            >
              <span>Aashiq Mahato, since 2021 · {CV.contact.location}</span>
            </p>
          </Reveal>

          {/* Portrait card */}
          <Reveal className="mx-auto w-full max-w-[320px] lg:col-span-5 lg:mx-0 lg:justify-self-end">
            {/* Transform layers kept separate: Reveal (GSAP y/opacity) →
                static CSS rotate → anime float target. */}
            <div className="rotate-2">
              <div ref={portraitRef}>
                <SelectionBox
                  name="aashiq.png"
                  size="400 × 400"
                  tone="accent"
                  className="rounded-2xl"
                >
                  <span className="relative block aspect-square overflow-hidden rounded-2xl">
                    {/* Canvas fallback — visible if the avatar fails to load */}
                    <span
                      aria-hidden="true"
                      className="canvas-dots absolute inset-0 flex items-center justify-center bg-panel"
                    >
                      <span className="pill px-3 py-2 font-mono text-xs uppercase tracking-[0.3em] text-ink-dim">
                        aashiq.png
                      </span>
                    </span>
                    <img
                      src={PORTRAIT_URL}
                      alt="Portrait of Aashiq Mahato"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.visibility = "hidden";
                      }}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-panel/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim backdrop-blur">
                      2026 · Kathmandu
                    </span>
                  </span>
                </SelectionBox>
                <div className="mt-4 flex justify-center">
                  <TapeLabel rotate={-2}>
                    the human behind the commits
                  </TapeLabel>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Metrics strip */}
        <Reveal className="mt-14">
          <SelectionBox
            name="metrics"
            tone="accent"
            className="panel rounded-2xl border-solid"
          >
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-line md:grid-cols-4">
              {METRICS.map(({ value, label, suffix, Icon }) => (
                <div key={label} className="bg-panel p-6 text-center">
                  <Icon
                    className="mx-auto mb-3 h-5 w-5 text-accent-ink"
                    aria-hidden="true"
                  />
                  <dd className="font-display text-4xl font-bold text-ink">
                    <CountUp
                      value={value}
                      suffix={suffix}
                      format={(v) => String(Math.round(v)).padStart(2, "0")}
                    />
                  </dd>
                  <dt className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-dim">
                    {label}
                  </dt>
                </div>
              ))}
            </dl>
          </SelectionBox>
        </Reveal>

        {/* Capabilities */}
        <Reveal className="mt-16" selector="[data-capability]">
          <div className="mb-6 flex items-center gap-4">
            <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-ink">
              Capabilities
            </h3>
            <TapeLabel rotate={2}>no templates, ever</TapeLabel>
          </div>
          <ul className="flex flex-wrap gap-3">
            {CAPABILITIES.map(({ label, Icon }) => (
              <li
                key={label}
                data-capability
                className="pill flex items-center gap-2.5 px-5 py-2.5 font-display text-sm font-semibold text-ink transition-colors hover:border-signal"
              >
                <Icon className="h-4 w-4 text-accent-ink" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
};

export default About;
