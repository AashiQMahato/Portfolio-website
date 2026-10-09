import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, EASE, ImageReveal, Reveal, usePrefersReducedMotion } from "../motion";
import { SectionHeader } from "../components/ui";
import { CV, projects, siteConfig } from "../data/portfolioData";
import portrait from "../assets/portrait.jpg";

const project = (slug) => {
  const p = projects.find((x) => x.slug === slug);
  return { title: p.title, href: `/projects/${p.slug}`, year: p.year };
};

const DISCIPLINES = [
  ["Engineering", "Circuits, sensors and the physics of making things work", project("ultrasonic-blind-stick")],
  ["Development", "React, Next.js and Node.js — the full stack above the hardware", project("smart-school-management")],
  ["IoT", "Devices that report home: GSM, GPS and MQTT telemetry", project("ultrasonic-blind-stick")],
  ["Embedded", "Firmware on Arduino, ESP and Raspberry Pi under real power budgets", project("ultrasonic-blind-stick")],
  ["AI", "Computer vision in production — YOLOv8 detection, FaceNet matching", project("automated-attendance-system")],
  ["UI / UX", "Interfaces that stay clear while doing something complicated", project("cable-network-website")],
];

const degree = CV.education[0];
const webx = CV.experience.find((e) => e.company === "WebX Nepal");
const startYear = (period) => period.match(/\d{4}/)[0];

// The path from electronics to full-stack, built only from CV + project data.
const PATH = [
  { year: startYear(degree.period), title: "BE, Electronics & Communication", note: "Circuits, signals and embedded design." },
  {
    year: project("ultrasonic-blind-stick").year,
    title: "Hardware + vision builds",
    links: [project("ultrasonic-blind-stick"), project("automated-attendance-system")],
  },
  { year: startYear(webx.period), title: `${webx.role}, ${webx.company}`, note: "React and Tailwind interfaces in production." },
  { year: project("studio-tools").year, title: "Full-stack products", links: [project("studio-tools")] },
];

const META = [
  ["Based in", "Kathmandu, Nepal"],
  ["Studied", `${degree.degree.replace("BE in ", "BE, ")} — ${degree.institution}`],
  ["Languages", CV.languages.join(", ")],
  ["Status", siteConfig.availability],
];

/**
 * The same signal-path motif as the hero, read as a career: a hairline that
 * draws across (down on phones) and four stops that settle onto it.
 */
const CareerPath = () => {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 82%", once: true } });
      tl.from("[data-path-line]", { scale: 0, duration: 1.1, ease: EASE.inOut })
        .from("[data-path-dot]", { scale: 0, duration: 0.5, ease: EASE.strong, stagger: 0.12 }, 0.25)
        .from("[data-path-stop]", { opacity: 0, y: 14, duration: 0.6, ease: EASE.out, stagger: 0.12 }, 0.3);
    },
    { dependencies: [reduced], scope: ref },
  );

  return (
    <div ref={ref} className="relative mt-[clamp(3rem,7vh,4.5rem)]">
      <h3 className="hud mb-6">The path so far</h3>
      <ol className="relative grid gap-8 pl-6 sm:grid-cols-4 sm:gap-6 sm:pl-0 sm:pt-6">
        <span
          data-path-line
          aria-hidden="true"
          className="absolute bottom-2 left-[3px] top-2 w-px origin-top bg-line sm:bottom-auto sm:left-0 sm:right-0 sm:top-[3px] sm:h-px sm:w-auto sm:origin-left"
        />
        {PATH.map((s) => (
          <li key={s.title} className="relative">
            <span
              data-path-dot
              aria-hidden="true"
              className="absolute -left-6 top-1.5 h-[7px] w-[7px] rounded-full border border-ink/50 bg-background sm:-top-6 sm:left-0"
            />
            <div data-path-stop>
              <p className="font-mono text-xs tabular-nums text-accent-ink">{s.year}</p>
              <p className="mt-2 font-medium leading-snug tracking-[-0.01em] text-ink">{s.title}</p>
              {s.note && <p className="mt-1.5 text-sm text-ink-dim">{s.note}</p>}
              {s.links && (
                <ul className="mt-1.5 space-y-1 text-sm">
                  {s.links.map((l) => (
                    <li key={l.href}>
                      <Link to={l.href} className="link-line text-ink-dim hover:text-ink">
                        {l.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

/**
 * About. A statement, then the story in layers: the portrait (iris reveal +
 * slow parallax), the short bio, the path from electronics to full-stack,
 * and a discipline index whose rows wipe in and each point to the project
 * where that discipline shows. Facts only, from the CV and project data.
 */
const About = () => (
  <section id="about" aria-labelledby="about-title" className="relative py-[clamp(7rem,16vh,13rem)]">
    <div className="shell">
      <SectionHeader
        index="03"
        avatar={{ mood: "happy", hover: "shy" }}
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
              <span>Fig. 03 — The engineer</span>
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

          <CareerPath />

          <h3 className="hud mb-2 mt-[clamp(3.5rem,8vh,5.5rem)]">Disciplines</h3>
          <Reveal as="ol" variant="clip" selector="[data-discipline]" stagger={0.08} className="border-t border-line">
            {DISCIPLINES.map(([name, line, seen], i) => (
              <li
                key={name}
                data-discipline
                className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 border-b border-line py-5 sm:grid-cols-[2.5rem_9rem_1fr] xl:grid-cols-[2.5rem_9rem_1fr_auto]"
              >
                <span className="font-mono text-xs tabular-nums text-ink-dim">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-xl font-medium tracking-[-0.02em] text-ink transition-transform duration-500 ease-out group-hover:translate-x-1.5">
                  {name}
                </span>
                <span className="col-start-2 mt-1 text-sm text-ink-dim sm:col-start-3 sm:mt-0">{line}</span>
                {/* Always visible below xl; on wide screens it surfaces on row hover or focus. */}
                <Link
                  to={seen.href}
                  aria-label={`${name}, seen in ${seen.title}`}
                  className="col-start-2 mt-2 inline-flex items-center gap-1 justify-self-start text-sm text-ink-dim transition-[opacity,color] duration-300 hover:text-ink focus-visible:opacity-100 sm:col-start-3 xl:col-start-4 xl:mt-0 xl:justify-self-end xl:opacity-0 xl:group-hover:opacity-100 xl:group-focus-within:opacity-100"
                >
                  <span className="hud">Seen in</span>
                  <span className="link-line">{seen.title}</span>
                  <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                </Link>
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
