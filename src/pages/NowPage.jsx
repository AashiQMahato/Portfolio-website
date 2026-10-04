import { nowPageData, siteConfig } from "../data/portfolioData";
import { Reveal, SplitText } from "../motion";

const updated = new Date(nowPageData.lastUpdated).toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const COLUMNS = [
  { id: "learning", label: "Learning", items: nowPageData.learning },
  { id: "reading", label: "Reading", items: nowPageData.reading },
  { id: "experiments", label: "Experiments", items: nowPageData.experiments },
];

const NowPage = () => {
  return (
    <div className="shell pb-[clamp(5rem,12vh,9rem)] pt-[calc(var(--nav-h)+clamp(3rem,10vh,7rem))]">
      <header className="max-w-5xl">
        <Reveal variant="fade">
          <p className="hud">
            (Now) — Updated <time dateTime={nowPageData.lastUpdated}>{updated}</time>
          </p>
        </Reveal>
        <Reveal variant="lines" className="mt-6">
          <SplitText as="h1" text="Now" className="text-display text-ink" />
        </Reveal>
        <Reveal variant="rise" delay={0.2}>
          <p className="mt-8 max-w-2xl text-lede text-ink-dim">
            A snapshot of what I&apos;m currently focused on, learning, and building.
          </p>
        </Reveal>
      </header>

      <Reveal
        as="section"
        variant="rise"
        aria-labelledby="now-focus"
        className="mt-[clamp(4rem,10vh,7rem)] grid gap-6 border-t border-line pt-8 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-3">
          <h2 id="now-focus" className="hud">
            Current focus
          </h2>
          <p className="mt-3 flex items-center gap-2 text-sm text-ink-dim">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-signal" />
            {siteConfig.availability}
          </p>
        </div>
        <p className="text-statement text-ink md:col-span-9">{nowPageData.currentFocus}</p>
      </Reveal>

      <div className="mt-[clamp(4rem,10vh,7rem)] grid gap-12 md:grid-cols-3 md:gap-8">
        {COLUMNS.map((col, i) => (
          <Reveal
            key={col.id}
            as="section"
            variant="rise"
            delay={i * 0.08}
            aria-labelledby={`now-${col.id}`}
            className="border-t border-line pt-6">
            <p className="hud tabular-nums">{String(i + 1).padStart(2, "0")}</p>
            <h2 id={`now-${col.id}`} className="mt-3 text-2xl font-semibold tracking-tight text-ink">
              {col.label}
            </h2>
            <ul className="mt-6 divide-y divide-line border-t border-line">
              {col.items.map((item) => (
                <li key={item} className="py-4 text-ink-dim">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </div>
  );
};

export default NowPage;
