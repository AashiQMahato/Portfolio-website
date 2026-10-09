import { useRef } from "react";
import PropTypes from "prop-types";
import { useGSAP } from "@gsap/react";
import { gsap, EASE, usePrefersReducedMotion } from "../../motion";
import TechLogo from "./TechLogo";
import { capabilityShape } from "./shapes";

/**
 * The capability's technologies as a ruled grid of official marks — used on
 * touch / narrow screens and whenever WebGL is unavailable. Names are always
 * visible (nothing depends on hover); tapping a mark pins its detail.
 */
const TechGrid = ({ capability, pinned, onPick }) => {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.fromTo(
        "[data-grid-cell]",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, ease: EASE.out, stagger: 0.04 },
      );
    },
    { dependencies: [capability.id, reduced], scope: ref },
  );

  return (
    <ul
      ref={ref}
      aria-label={`${capability.label} technologies`}
      className="grid grid-cols-2 border-l border-t border-line sm:grid-cols-3"
    >
      {capability.techs.map((t) => {
        const on = pinned === t.name;
        return (
          <li key={t.name} data-grid-cell className="border-b border-r border-line">
            <button
              type="button"
              aria-pressed={on}
              aria-describedby="capability-detail"
              onClick={() => onPick(t.name)}
              className={`group relative flex h-full min-h-[7.5rem] w-full flex-col justify-between gap-6 p-4 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-signal ${
                on ? "bg-panel" : "active:bg-panel"
              }`}
            >
              <TechLogo tech={t} className="h-8 w-8" />
              <span className="flex items-end justify-between gap-2">
                <span className="text-sm font-medium text-ink">{t.name}</span>
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 shrink-0 rounded-full bg-signal transition-opacity duration-300 ${on ? "opacity-100" : "opacity-0"}`}
                />
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

TechGrid.propTypes = {
  capability: capabilityShape.isRequired,
  pinned: PropTypes.string,
  onPick: PropTypes.func.isRequired,
};

export default TechGrid;
