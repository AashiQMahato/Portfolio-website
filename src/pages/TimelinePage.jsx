import PropTypes from "prop-types";
import { CV } from "../data/portfolioData";
import { Reveal, SplitText } from "../motion";

// Grouped rather than date-sorted: experience → education → projects
// (projects carry no dates in the CV data).
const EVENTS = [
  ...CV.experience.map((exp, i) => ({
    id: `exp-${i}`,
    kind: "Experience",
    title: exp.role,
    subtitle: exp.company,
    location: exp.location,
    date: exp.period,
    content: exp.bullets,
  })),
  ...CV.education.map((edu, i) => ({
    id: `edu-${i}`,
    kind: "Education",
    title: edu.degree,
    subtitle: edu.institution,
    location: edu.location,
    date: edu.period,
    content: [],
  })),
  ...CV.projects.map((proj, i) => ({
    id: `proj-${i}`,
    kind: "Project",
    title: proj.name,
    subtitle: proj.stack,
    location: "",
    date: "",
    content: proj.bullets,
  })),
];

// Shared by the rail and every marker so they stay on one line.
const RAIL = "left-0 md:left-1/4";

const TimelineNode = ({ event }) => (
  <Reveal as="li" variant="rise" className="relative grid pb-14 pl-8 md:grid-cols-12 md:pl-0">
    <span
      aria-hidden="true"
      className={`absolute top-1 h-2 w-2 -translate-x-1/2 rounded-full bg-signal ${RAIL}`}
    />
    <div className="md:col-span-3 md:pr-10 md:text-right">
      {event.date && <p className="hud tabular-nums text-ink">{event.date}</p>}
      <p className="hud mt-1">{event.kind}</p>
    </div>
    <div className="mt-4 md:col-span-9 md:mt-0 md:pl-10">
      <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-3xl">{event.title}</h2>
      <p className="mt-2 text-ink-dim">
        {event.subtitle}
        {event.location && <span> · {event.location}</span>}
      </p>
      {event.content.length > 0 && (
        <ul className="mt-5 max-w-2xl divide-y divide-line border-t border-line">
          {event.content.map((bullet) => (
            <li key={bullet} className="py-3 text-sm leading-relaxed text-ink-dim">
              {bullet}
            </li>
          ))}
        </ul>
      )}
    </div>
  </Reveal>
);

TimelineNode.propTypes = {
  event: PropTypes.shape({
    kind: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    location: PropTypes.string,
    date: PropTypes.string,
    content: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

const TimelinePage = () => {
  return (
    <div className="shell pb-[clamp(5rem,12vh,9rem)] pt-[calc(var(--nav-h)+clamp(3rem,10vh,7rem))]">
      <header className="max-w-5xl">
        <Reveal variant="fade">
          <p className="hud">(Timeline) — Experience, education &amp; projects</p>
        </Reveal>
        <Reveal variant="lines" className="mt-6">
          <SplitText as="h1" text="Timeline" className="text-display text-ink" />
        </Reveal>
        <Reveal variant="rise" delay={0.2}>
          <p className="mt-8 max-w-2xl text-lede text-ink-dim">
            A chronological look at my education, experience, and key projects.
          </p>
        </Reveal>
      </header>

      <div className="relative mt-[clamp(4rem,10vh,7rem)] border-t border-line pt-12">
        <span aria-hidden="true" className={`absolute bottom-0 top-12 w-px bg-line ${RAIL}`} />
        <ol>
          {EVENTS.map((event) => (
            <TimelineNode key={event.id} event={event} />
          ))}
        </ol>
        <Reveal variant="fade" className="relative grid pl-8 md:grid-cols-12 md:pl-0">
          <span
            aria-hidden="true"
            className={`absolute top-1 h-2 w-2 -translate-x-1/2 rounded-full border border-signal bg-background ${RAIL}`}
          />
          <p className="hud md:col-span-9 md:col-start-4 md:pl-10">What&apos;s next?</p>
        </Reveal>
      </div>
    </div>
  );
};

export default TimelinePage;
