import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../../motion";
import { useRecruiterMode } from "../../context/RecruiterModeContext";
import ClockBadge from "./ClockBadge";

const TICKS = {
  backgroundImage:
    "repeating-linear-gradient(to right, rgb(var(--ink) / 0.35) 0 1px, transparent 1px 10px)," +
    "repeating-linear-gradient(to right, rgb(var(--ink) / 0.5) 0 1px, transparent 1px 100px)",
  backgroundSize: "100% 6px, 100% 12px",
  backgroundPosition: "bottom left, bottom left",
  backgroundRepeat: "repeat-x",
};

/**
 * Figma-style top ruler strip: tick marks (pure CSS gradients — no per-tick
 * DOM), a scroll-progress % chip + marker driven by one ScrollTrigger via
 * refs (zero React re-renders), and the LIVE studio clock on the right.
 * Desktop only; decorative chrome, so aria-hidden. Hidden in recruiter mode.
 */
const Ruler = () => {
  const pctRef = useRef(null);
  const markerRef = useRef(null);
  const { isRecruiterMode } = useRecruiterMode();

  useGSAP(() => {
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const pct = Math.round(self.progress * 100);
        if (pctRef.current) pctRef.current.textContent = `${pct}%`;
        if (markerRef.current)
          markerRef.current.style.left = `${self.progress * 100}%`;
      },
    });
  }, []);

  if (isRecruiterMode) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] hidden h-7 select-none items-center border-b border-line/70 bg-panel/90 backdrop-blur md:flex"
    >
      {/* scroll % chip */}
      <span className="ml-3 mr-2 inline-flex min-w-[3.25rem] items-center justify-center rounded-md bg-signal px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wider text-white">
        <span ref={pctRef}>0%</span>
      </span>

      {/* ticks + progress marker */}
      <div className="relative h-full flex-1 overflow-hidden" style={TICKS}>
        <span
          ref={markerRef}
          className="absolute bottom-0 h-full w-px -translate-x-1/2 bg-signal"
          style={{ left: "0%" }}
        />
      </div>

      <ClockBadge className="ml-2 mr-3" pill={false} />
    </div>
  );
};

export default Ruler;
