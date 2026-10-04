import { ImageReveal, Reveal } from "../motion";
import { SectionHeader } from "../components/ui";
import { CV, siteConfig } from "../data/portfolioData";
import portrait from "../assets/portrait.jpg";

const DISCIPLINES = [
  ["Engineering", "Circuits, sensors and the physics of making things work"],
  ["Development", "React, Next.js and Node.js — the full stack above the hardware"],
  ["IoT", "Devices that report home: GSM, GPS and MQTT telemetry"],
  ["Embedded", "Firmware on Arduino, ESP and Raspberry Pi under real power budgets"],
  ["AI", "Computer vision in production — YOLOv8 detection, FaceNet matching"],
  ["UI / UX", "Interfaces that stay clear while doing something complicated"],
];

const degree = CV.education[0];

const META = [
  ["Based in", "Kathmandu, Nepal"],
  ["Studied", `${degree.degree.replace("BE in ", "BE, ")} — ${degree.institution}`],
  ["Languages", CV.languages.join(", ")],
  ["Status", siteConfig.availability],
];

/**
 * About. A statement, then three layers that arrive in sequence: the
 * portrait (iris reveal + slow parallax), the short bio, and a discipline
 * index whose rows wipe in one by one. Facts only, from the CV data.
 */
const About = () => (
  <section id="about" aria-labelledby="about-title" className="relative py-[clamp(7rem,16vh,13rem)]">
    <div className="shell">
      <SectionHeader
        index="03"
        label="About"
        id="about-title"
        title={["I like building things", "that sit between software", "and the physical world."]}
      />

      <div className="grid gap-[clamp(3rem,6vw,6rem)] lg:grid-cols-12">
        <div className="lg:col-span-5">
          {/* Source portrait is 460px — keep it near 1:1 on retina screens. */}
          <figure className="max-w-[22rem] lg:sticky lg:top-[calc(var(--nav-h)+2rem)]">
            <ImageReveal
              src={portrait}
              alt="Aashik Kumar Mahato standing at a railing above a river valley"
              width={460}
              height={460}
              variant="iris"
              drift={10}
              data-cursor="explore"
              data-cursor-label="Hello"
              className="aspect-[4/5] rounded-lg bg-panel"
              imgClassName="object-[50%_30%] grayscale-[0.35] transition-[filter] duration-700 hover:grayscale-0"
            />
            <figcaption className="hud mt-4 flex justify-between">
              <span>Fig. 02 — The engineer</span>
              <span>Nepal</span>
            </figcaption>
          </figure>
        </div>

        <div className="lg:col-span-7">
          <Reveal variant="rise" selector="[data-bio]" className="max-w-2xl space-y-6">
            <p data-bio className="text-lede text-ink">
              I started on the hardware side — sensors, microcontrollers and the physics of making
              things work in the real world — and grew into building the software above it.
            </p>
            <p data-bio className="text-ink-dim">{CV.summary}</p>
            <p data-bio className="text-ink-dim">
              Whether it&apos;s a GSM module or a React tree, I care about how the whole signal path
              behaves: what the sensor reads, what the server believes, and what the person on the
              other end actually sees.
            </p>
          </Reveal>

          <h3 className="hud mb-2 mt-[clamp(3.5rem,8vh,5.5rem)]">Disciplines</h3>
          <Reveal as="ol" variant="clip" selector="[data-discipline]" stagger={0.08} className="border-t border-line">
            {DISCIPLINES.map(([name, line], i) => (
              <li
                key={name}
                data-discipline
                className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 border-b border-line py-5 sm:grid-cols-[2.5rem_11rem_1fr]"
              >
                <span className="font-mono text-xs tabular-nums text-ink-dim">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-xl font-medium tracking-[-0.02em] text-ink transition-transform duration-500 ease-out group-hover:translate-x-1.5">
                  {name}
                </span>
                <span className="col-start-2 mt-1 text-sm text-ink-dim sm:col-start-3 sm:mt-0">{line}</span>
              </li>
            ))}
          </Reveal>

          <Reveal as="dl" variant="fade" selector="[data-meta]" className="mt-12 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {META.map(([k, v]) => (
              <div key={k} data-meta>
                <dt className="hud">{k}</dt>
                <dd className="mt-1.5 text-ink">{v}</dd>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

export default About;
