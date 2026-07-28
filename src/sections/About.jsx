import { CV, projects, techPills } from "../data/portfolioData";
import { Reveal } from "../motion";
import {
  FrameLabel,
  SelectionBox,
  CountUp,
  TapeLabel,
} from "../components/canvas";

const METRICS = [
  { value: projects.length, label: "Projects shipped", suffix: "" },
  { value: CV.experience.length, label: "Industry roles", suffix: "" },
  { value: techPills.length, label: "Technologies in rotation", suffix: "+" },
  { value: 2, label: "Languages spoken", suffix: "" },
];

const CAPABILITIES = [
  "Electronics",
  "IoT Systems",
  "React / Next.js",
  "Node.js APIs",
  "Firmware",
  "UI Engineering",
];

/**
 * statement.txt — who this is, in one confident line, with count-up
 * metrics and capability chips on the canvas.
 */
const About = () => (
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

      <Reveal selector="[data-about-line]" className="mt-8">
        <h2
          id="about-heading"
          data-about-line
          className="max-w-3xl font-display text-display-2 text-ink"
        >
          I make hardware and software stop talking past each other
          <span className="text-signal">.</span>
        </h2>
        <p data-about-line className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-dim">
          {CV.summary}
        </p>
        <p data-about-line className="mt-4 max-w-2xl leading-relaxed text-ink-dim">
          I started on the hardware side — sensors, microcontrollers, and the
          physics of making things work in the real world — and grew into
          building the software above it. Whether it&apos;s a GSM module or a
          React tree, I care about how the whole signal path behaves.
        </p>
        <p
          data-about-line
          className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dim"
        >
          <span>Aashiq Mahato, since 2021 · {CV.contact.location}</span>
        </p>
      </Reveal>

      {/* Metrics strip */}
      <Reveal className="mt-14">
        <SelectionBox name="metrics" tone="accent" className="panel rounded-2xl border-solid">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-line md:grid-cols-4">
            {METRICS.map((metric) => (
              <div key={metric.label} className="bg-panel p-6 text-center">
                <dd className="font-display text-4xl font-bold text-ink">
                  <CountUp
                    value={metric.value}
                    suffix={metric.suffix}
                    format={(v) => String(Math.round(v)).padStart(2, "0")}
                  />
                </dd>
                <dt className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-dim">
                  {metric.label}
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
          {CAPABILITIES.map((capability) => (
            <li
              key={capability}
              data-capability
              className="pill px-5 py-2.5 font-display text-sm font-semibold text-ink transition-colors hover:border-signal"
            >
              {capability}
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  </section>
);

export default About;
