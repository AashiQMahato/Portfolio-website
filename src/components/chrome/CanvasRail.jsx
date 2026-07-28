import { useRef } from "react";
import PropTypes from "prop-types";
import { useGSAP } from "@gsap/react";
import {
  gsap,
  useActiveSection,
  useScrollToSection,
  usePrefersReducedMotion,
} from "../../motion";

/**
 * The canvas "layers panel": a fixed hairline down the left margin whose
 * orange fill draws with scroll progress. Section indices act as both
 * wayfinding and shortcuts. Desktop only.
 */
const CanvasRail = ({ sections }) => {
  const fillRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const active = useActiveSection(sections.map((s) => s.id));
  const scrollTo = useScrollToSection();

  useGSAP(
    () => {
      if (reduced) {
        gsap.set(fillRef.current, { scaleY: 1 });
        return;
      }
      gsap.fromTo(
        fillRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );
    },
    { dependencies: [reduced] },
  );

  return (
    <nav
      aria-label="Section navigation"
      className="fixed left-8 top-0 bottom-0 z-40 hidden lg:flex flex-col items-center"
    >
      {/* Track + progress fill */}
      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-line" aria-hidden="true" />
      <div
        ref={fillRef}
        className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 origin-top bg-signal"
        aria-hidden="true"
      />

      {/* Section shortcuts */}
      <ul className="relative z-10 my-auto flex flex-col gap-10">
        {sections.map((section, i) => {
          const isActive = active === section.id;
          return (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => scrollTo(`#${section.id}`)}
                aria-label={`Go to ${section.label}`}
                aria-current={isActive ? "true" : undefined}
                className={`group flex flex-col items-center gap-1 rounded-full bg-panel px-1.5 py-2 font-mono text-[10px] tracking-[0.2em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 ${
                  isActive ? "text-accent-ink" : "text-ink-dim hover:text-ink"
                }`}
              >
                <span
                  className={`block h-1.5 w-1.5 rounded-full transition-colors ${
                    isActive ? "bg-signal" : "bg-line group-hover:bg-ink-dim"
                  }`}
                  aria-hidden="true"
                />
                {String(i + 1).padStart(2, "0")}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

CanvasRail.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default CanvasRail;
