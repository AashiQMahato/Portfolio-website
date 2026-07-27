import PropTypes from "prop-types";
import { CV, projects } from "../data/portfolioData";
import SectionHeading from "../components/schematic/SectionHeading";
import { Reveal } from "../motion";

const STATS = [
  { value: String(projects.length).padStart(2, "0"), label: "Projects shipped" },
  { value: String(CV.experience.length).padStart(2, "0"), label: "Industry roles" },
  { value: "B.E.", label: "Electronics, Comm. & Info. Eng." },
  { value: CV.languages.join(" · "), label: "Languages" },
];

const TimelineItem = ({ period, title, subtitle, bullets }) => (
  <li data-timeline-item className="relative border-l border-line pb-9 pl-6 last:pb-0">
    <span
      className="absolute -left-[3.5px] top-1.5 block h-[7px] w-[7px] rounded-full border border-signal bg-background"
      aria-hidden="true"
    />
    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
      {period}
    </p>
    <h4 className="mt-2 font-display text-lg font-semibold text-ink">{title}</h4>
    <p className="mt-0.5 text-sm text-ink-dim">{subtitle}</p>
    {bullets?.length ? (
      <ul className="mt-3 space-y-1.5 text-sm text-ink-dim">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2.5">
            <span className="mt-[0.55em] block h-px w-3 shrink-0 bg-line" aria-hidden="true" />
            {bullet}
          </li>
        ))}
      </ul>
    ) : null}
  </li>
);

TimelineItem.propTypes = {
  period: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  bullets: PropTypes.arrayOf(PropTypes.string),
};

const About = () => (
  <section
    id="about"
    data-section
    aria-labelledby="about-heading"
    className="relative px-5 py-[clamp(6rem,14vh,11rem)] md:px-10 lg:pl-28 lg:pr-16"
  >
    <div className="mx-auto max-w-6xl">
      <SectionHeading
        index="01"
        label="About"
        title={
          <span id="about-heading">
            From copper traces
            <br />
            to interfaces<span className="text-signal">.</span>
          </span>
        }
      />

      <div className="grid gap-14 lg:grid-cols-12">
        {/* Bio + stats */}
        <Reveal className="lg:col-span-5" selector="[data-about-block]">
          <p data-about-block className="text-lg leading-relaxed text-ink">
            {CV.summary}
          </p>
          <p data-about-block className="mt-5 leading-relaxed text-ink-dim">
            I started on the hardware side — sensors, microcontrollers, and the
            physics of making things work in the real world — and grew into
            building the software above it. The common thread is systems
            thinking: whether it&apos;s a GSM module or a React tree, I care
            about how the whole signal path behaves.
          </p>

          <dl data-about-block className="mt-10 grid grid-cols-2 gap-px border border-line bg-line">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-background p-5">
                <dd className="font-display text-2xl font-semibold text-signal">
                  {stat.value}
                </dd>
                <dt className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-dim">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>

          <p data-about-block className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dim">
            Based in {CV.contact.location}
          </p>
        </Reveal>

        {/* Experience + education timelines */}
        <div className="grid gap-14 sm:grid-cols-2 lg:col-span-7">
          <Reveal as="div" selector="[data-timeline-item]">
            <h3 className="mb-8 font-mono text-xs uppercase tracking-[0.25em] text-ink">
              <span className="text-signal">{"//"}</span> Experience
            </h3>
            <ul>
              {CV.experience.map((job) => (
                <TimelineItem
                  key={job.role + job.company}
                  period={job.period}
                  title={job.role}
                  subtitle={`${job.company} — ${job.location}`}
                  bullets={job.bullets}
                />
              ))}
            </ul>
          </Reveal>

          <Reveal as="div" selector="[data-timeline-item]">
            <h3 className="mb-8 font-mono text-xs uppercase tracking-[0.25em] text-ink">
              <span className="text-signal">{"//"}</span> Education
            </h3>
            <ul>
              {CV.education.map((entry) => (
                <TimelineItem
                  key={entry.degree}
                  period={entry.period}
                  title={entry.degree}
                  subtitle={`${entry.institution} — ${entry.location}`}
                />
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

export default About;
