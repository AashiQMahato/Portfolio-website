import { useRef } from "react";
import PropTypes from "prop-types";
import { useGSAP } from "@gsap/react";
import { gsap, EASE, usePrefersReducedMotion } from "../../motion";

/**
 * The project's real components as a signal chain, in the order the data
 * lists them: a row with drawn connectors on wide screens, a vertical
 * sequence on narrow ones. Nodes settle in one after another.
 */
const ArchitectureFlow = ({ nodes, accent }) => {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 80%", once: true } });
      tl.from("[data-arch-node]", { opacity: 0, y: 24, duration: 0.6, ease: EASE.out, stagger: 0.12 }).from(
        "[data-arch-link]",
        { scaleX: 0, scaleY: 0, duration: 0.5, ease: EASE.inOut, stagger: 0.12 },
        0.2,
      );
    },
    { dependencies: [reduced, nodes.length], scope: ref },
  );

  return (
    <ol ref={ref} className={`grid gap-4 ${nodes.length >= 4 ? "xl:grid-cols-4" : "xl:grid-cols-3"} xl:gap-0`}>
      {nodes.map((n, i) => (
        <li key={n.component} className="relative flex xl:pr-8">
          <div data-arch-node className="relative z-[1] flex w-full flex-col rounded-xl border border-line bg-background p-5">
            <span className="font-mono text-[11px] tabular-nums" style={{ color: accent }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 text-lg font-medium tracking-[-0.02em] text-ink">{n.component}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-dim">{n.desc}</p>
          </div>
          {i < nodes.length - 1 && (
            <>
              {/* connector: right on wide screens, down on narrow */}
              <span
                data-arch-link
                aria-hidden="true"
                className="absolute right-0 top-1/2 hidden h-px w-8 origin-left xl:block"
                style={{ background: accent }}
              />
              <span
                data-arch-link
                aria-hidden="true"
                className="absolute -bottom-4 left-6 h-4 w-px origin-top xl:hidden"
                style={{ background: accent }}
              />
            </>
          )}
        </li>
      ))}
    </ol>
  );
};

ArchitectureFlow.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.shape({ component: PropTypes.string.isRequired, desc: PropTypes.string.isRequired })).isRequired,
  accent: PropTypes.string.isRequired,
};

export default ArchitectureFlow;
