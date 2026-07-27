import { techPills } from "../data/portfolioData";
import { Ticker } from "../components/canvas";

/**
 * "Currently building in" — full-bleed tech marquee between statement and
 * process. CSS-only motion; freezes under reduced motion.
 */
const TechTicker = () => (
  <div
    className="relative border-y border-line/70 bg-panel/60 py-4 backdrop-blur-sm"
    aria-label="Technologies I build with"
  >
    <Ticker duration="45s">
      <span className="mx-6 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-accent-ink">
        <span aria-hidden="true">▶</span> Currently building in
      </span>
      {techPills.map((tech) => (
        <span
          key={tech}
          className="mx-6 flex items-center gap-6 font-display text-lg font-semibold text-ink"
        >
          {tech}
          <span aria-hidden="true" className="text-signal">
            ✦
          </span>
        </span>
      ))}
    </Ticker>
  </div>
);

export default TechTicker;
