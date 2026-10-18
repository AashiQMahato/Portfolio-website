import { Layers, Briefcase, GraduationCap } from "lucide-react";
import { CV, projects } from "../../data/portfolioData";

const pad = (n) => String(n).padStart(2, "0");

/** Derived from the same data the rest of the site renders — never hand-typed. */
const FACTS = [
  { value: pad(projects.length), count: projects.length, label: "Projects shipped", sub: "hardware to web", Icon: Layers },
  { value: pad(CV.experience.length), count: CV.experience.length, label: "Industry roles", sub: "engineering + frontend", Icon: Briefcase },
  { value: "BE", label: "Bachelor of Engineering", sub: "Electronics, Communication & Information Eng.", Icon: GraduationCap },
];

/**
 * The evidence under the statement: one ruled strip, three readings split
 * by hairlines, each with a terminal dot on the rule like the path above.
 * Counts tick up once on entry (Statement's timeline); BE is a qualification,
 * not a number, so it only resolves.
 */
const ProofStrip = () => (
  <dl data-proof className="relative mt-[clamp(4.5rem,11vh,8rem)] grid sm:grid-cols-3">
    <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-line" />
    <span aria-hidden="true" data-proof-rule className="signal-rail absolute inset-x-0 top-0 h-px origin-left opacity-60 [--rail-dir:to_right]" />
    {FACTS.map((f, i) => (
      <div
        key={f.label}
        data-fact
        data-avatar="proud"
        className={`relative flex flex-col gap-4 py-7 sm:px-6 sm:py-9 ${
          i > 0 ? "border-t border-line sm:border-l sm:border-t-0" : "sm:pl-0"
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute -top-[3.5px] left-0 h-[7px] w-[7px] rounded-full border border-ink/40 bg-background ${i > 0 ? "sm:-left-[3.5px]" : ""}`}
        />
        <dt className="order-2 flex items-start gap-3">
          <f.Icon aria-hidden="true" strokeWidth={1.5} className="mt-0.5 h-4 w-4 shrink-0 text-ink-dim" />
          <span>
            <span className="block text-[0.95rem] font-medium leading-snug text-ink">{f.label}</span>
            <span className="block text-sm leading-snug text-ink-dim">{f.sub}</span>
          </span>
        </dt>
        <dd
          data-count={f.count}
          className="order-1 font-mono text-[clamp(3.5rem,7vw,6rem)] font-medium leading-[0.9] tracking-[-0.06em] text-ink tabular-nums"
        >
          {f.value}
        </dd>
      </div>
    ))}
  </dl>
);

export default ProofStrip;
