import { Box, BriefcaseBusiness, GraduationCap } from "lucide-react";
import { CV, projects } from "../../data/portfolioData";

const pad = (n) => String(n).padStart(2, "0");

/** Derived from the same data the rest of the site renders — never hand-typed. */
const FACTS = [
  { value: pad(projects.length), count: projects.length, label: "Projects shipped", sub: "Hardware to web", Icon: Box, stage: "sense" },
  { value: pad(CV.experience.length), count: CV.experience.length, label: "Industry roles", sub: "In engineering and frontend", Icon: BriefcaseBusiness, stage: "process" },
  {
    value: "BE",
    title: "Bachelor of Engineering",
    label: ["Electronics, Communication &", "Information Engineering"],
    Icon: GraduationCap,
    stage: "connect",
  },
];

/**
 * The evidence under the statement: one full-width strip, a hairline above,
 * three readings split by fading verticals — icon in its stage hue, the big
 * figure, then what it counts. Counts tick up once on entry (Statement's
 * timeline); BE is a qualification, not a number, so it only resolves.
 */
const ProofStrip = () => (
  <dl data-proof className="relative mt-[clamp(3rem,7vh,5rem)] grid sm:grid-cols-3">
    <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-line" />
    <span
      aria-hidden="true"
      data-proof-rule
      className="absolute inset-x-0 top-0 h-px origin-left bg-[linear-gradient(90deg,transparent,rgb(var(--c-sense)/0.5)_20%,rgb(var(--c-connect)/0.5)_80%,transparent)]"
    />
    {FACTS.map((f, i) => (
      <div
        key={f.value}
        data-fact
        data-avatar="proud"
        className={`stage-${f.stage} relative flex items-center gap-[clamp(0.875rem,1.6vw,1.75rem)] py-8 sm:py-[clamp(2.5rem,7vh,4rem)] ${
          i > 0 ? "border-t border-line sm:border-t-0 sm:pl-[clamp(1rem,3.4vw,3.25rem)]" : ""
        }`}
      >
        {i > 0 && (
          <span
            aria-hidden="true"
            className="absolute bottom-[18%] left-0 top-[18%] hidden w-px bg-[linear-gradient(transparent,rgb(var(--line)),transparent)] sm:block"
          />
        )}
        <f.Icon aria-hidden="true" strokeWidth={1.4} className="order-1 h-[clamp(1.75rem,2.6vw,2.5rem)] w-[clamp(1.75rem,2.6vw,2.5rem)] shrink-0 text-[rgb(var(--stage))]" />
        <dt className="order-3 min-w-0">
          {f.sub ? (
            <>
              <span className="block text-[clamp(0.95rem,1.15vw,1.0625rem)] font-medium leading-snug text-ink">{f.label}</span>
              <span className="mt-1 block text-[clamp(0.85rem,1vw,0.9375rem)] leading-snug text-ink-dim">{f.sub}</span>
            </>
          ) : (
            <span className="block text-[clamp(0.9rem,1.1vw,1.0625rem)] leading-snug text-ink-dim">
              <span className="sr-only">{f.title}, </span>
              <span className="xl:whitespace-nowrap">{f.label[0]}</span> <br className="hidden xl:block" />
              {f.label[1]}
            </span>
          )}
        </dt>
        <dd
          data-count={f.count}
          className="order-2 shrink-0 text-[clamp(2.75rem,4.6vw,4.5rem)] font-semibold leading-none tracking-[-0.045em] text-ink tabular-nums"
        >
          {f.title ? (
            <abbr title={f.title} className="no-underline">
              {f.value}
            </abbr>
          ) : (
            f.value
          )}
        </dd>
      </div>
    ))}
  </dl>
);

export default ProofStrip;
