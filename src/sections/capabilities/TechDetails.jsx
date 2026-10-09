import { useRef } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, EASE, usePrefersReducedMotion } from "../../motion";
import TechLogo from "./TechLogo";
import { capabilityShape, techShape } from "./shapes";

/**
 * What the visitor is looking at, traced to real work. With a technology in
 * focus: its mark, what it is, and the projects, roles and writing it appears
 * in. Otherwise: the capability's summary and the projects that use it.
 * Fixed min-height and a short cross-fade, so swapping content never jumps.
 */
const TechDetails = ({ capability, tech }) => {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const key = tech ? tech.name : capability.id;

  useGSAP(
    () => {
      if (reduced) return;
      gsap.fromTo("[data-detail] > *", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: EASE.out, stagger: 0.04 });
    },
    { dependencies: [key, reduced], scope: ref },
  );

  return (
    <div ref={ref} id="capability-detail" aria-live="polite" className="min-h-[11.5rem] border-t border-line pt-6">
      {tech ? (
        <div data-detail key={key} className="grid gap-6 md:grid-cols-[minmax(0,16rem)_1fr] md:gap-10">
          <div>
            <div className="flex items-center gap-3">
              <TechLogo tech={tech} className="h-7 w-7" />
              <p className="text-2xl font-medium tracking-[-0.03em] text-ink">{tech.name}</p>
            </div>
            <p className="mt-3 max-w-xs text-sm text-ink-dim">{tech.blurb}</p>
            {tech.listed && !tech.projects.length && !tech.roles.length && !tech.posts.length && (
              <p className="mt-2 max-w-xs text-xs text-ink-faint">On my CV skill list — not yet in a published case study.</p>
            )}
          </div>
          <dl className="grid gap-5 text-sm sm:grid-cols-3">
            <Trace label="Projects" items={tech.projects} />
            <Trace label="Roles" items={tech.roles.map((r) => ({ title: r }))} />
            <Trace label="Writing" items={tech.posts} />
          </dl>
        </div>
      ) : (
        <div data-detail key={key} className="grid gap-6 md:grid-cols-[minmax(0,16rem)_1fr] md:gap-10">
          <div>
            <p className="hud">
              <span className="text-ink">{capability.index}</span> — {capability.techs.length} technologies
            </p>
            <p className="mt-3 max-w-xs text-sm text-ink-dim">{capability.summary}</p>
          </div>
          <div>
            <p className="hud mb-3">Shipped with it</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {capability.projects.map((p) => (
                <li key={p.href}>
                  <Link to={p.href} className="group inline-flex items-center gap-1.5 text-sm text-ink hover:text-signal">
                    <span className="link-line">{p.title}</span>
                    <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-ink-faint">Point at, focus or tap a mark to trace where it was used.</p>
          </div>
        </div>
      )}
    </div>
  );
};

const Trace = ({ label, items }) => (
  <div>
    <dt className="hud mb-2">{label}</dt>
    {items.length ? (
      items.map((it) => (
        <dd key={it.title} className="mb-1.5 text-ink">
          {it.href ? (
            <Link to={it.href} className="link-line hover:text-signal">
              {it.title}
            </Link>
          ) : (
            it.title
          )}
        </dd>
      ))
    ) : (
      <dd className="text-ink-faint">—</dd>
    )}
  </div>
);

Trace.propTypes = {
  label: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({ title: PropTypes.string.isRequired, href: PropTypes.string })).isRequired,
};

TechDetails.propTypes = { capability: capabilityShape.isRequired, tech: techShape };

export default TechDetails;
