import { useRef } from "react";
import PropTypes from "prop-types";
import { useGSAP } from "@gsap/react";
import { gsap, useActiveSection, usePrefersReducedMotion, useScrollToSection } from "../../motion";

/**
 * Case-study contents: built from the chapters this page actually has,
 * current chapter highlighted by the shared section observer, plus a thin
 * reading-progress line under the nav (written straight to the DOM).
 */
const CaseNav = ({ chapters, articleRef, accent }) => {
  const barRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const scrollTo = useScrollToSection();
  const active = useActiveSection(chapters.map((c) => c.id));

  useGSAP(
    () => {
      if (!articleRef.current) return;
      gsap.fromTo(
        barRef.current,
        { scaleX: 0 },
        { scaleX: 1, ease: "none", scrollTrigger: { trigger: articleRef.current, start: "top top", end: "bottom bottom", scrub: reduced ? true : 0.3 } },
      );
    },
    { dependencies: [chapters.length, reduced], revertOnUpdate: true },
  );

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-[var(--nav-h)] z-[95] h-[2px]">
        <div ref={barRef} className="h-full origin-left" style={{ background: accent, transform: "scaleX(0)" }} />
      </div>
      <nav aria-label="Case study contents" className="hidden lg:sticky lg:top-[calc(var(--nav-h)+2.5rem)] lg:block">
        <p className="hud mb-4">Contents</p>
        <ol className="space-y-1 border-l border-line">
          {chapters.map((c, i) => {
            const on = active === c.id;
            return (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  aria-current={on ? "location" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(`#${c.id}`);
                  }}
                  className={`-ml-px flex gap-3 border-l py-1.5 pl-4 text-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal ${
                    on ? "text-ink" : "border-transparent text-ink-dim hover:text-ink"
                  }`}
                  style={on ? { borderColor: accent } : undefined}
                >
                  <span className="font-mono text-[11px] tabular-nums leading-5">{String(i + 1).padStart(2, "0")}</span>
                  {c.title}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

CaseNav.propTypes = {
  chapters: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired, title: PropTypes.string.isRequired })).isRequired,
  articleRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
  accent: PropTypes.string.isRequired,
};

export default CaseNav;
