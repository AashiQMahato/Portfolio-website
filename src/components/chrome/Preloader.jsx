import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, EASE, isBootActive, markBootDone, usePrefersReducedMotion } from "../../motion";

/**
 * First-visit intro (~1.1s): status line → identity mark → counter and
 * signal line fill → the panel lifts away as the hero starts assembling
 * underneath. Runs once per session, is skippable by any input, is absent
 * under reduced motion, and is aria-hidden — the page beneath is already
 * rendered and readable by assistive tech the whole time.
 */
const Preloader = () => {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const [show, setShow] = useState(isBootActive);
  const tl = useRef(null);

  useEffect(() => {
    if (show && reduced) {
      markBootDone();
      setShow(false);
    }
  }, [show, reduced]);

  useGSAP(
    () => {
      if (!show || reduced) return;
      const counter = { v: 0 };
      const out = ref.current.querySelector("[data-count]");
      tl.current = gsap
        .timeline({ onComplete: () => setShow(false) })
        // Content starts at opacity 0 (in markup) so a late font swap in
        // the first frames can't register as a layout shift.
        .to("[data-status], [data-mark], [data-meter]", { opacity: 1, duration: 0.2, ease: "none" })
        .fromTo("[data-mark] [data-split-char]", { yPercent: 110 }, { yPercent: 0, duration: 0.55, ease: EASE.strong, stagger: 0.035 }, 0.1)
        .fromTo("[data-line]", { scaleX: 0 }, { scaleX: 1, duration: 0.85, ease: "power2.inOut" }, 0.1)
        .to(counter, {
          v: 100,
          duration: 0.85,
          ease: "power2.inOut",
          onUpdate: () => {
            out.textContent = String(Math.round(counter.v)).padStart(3, "0");
          },
        }, 0.1)
        .add(() => markBootDone(), 0.95)
        .to("[data-mark] [data-split-char]", { yPercent: -110, duration: 0.4, ease: EASE.inOut, stagger: 0.02 }, 0.9)
        .to(ref.current, { yPercent: -100, duration: 0.75, ease: EASE.inOut }, 0.95);
    },
    { dependencies: [show, reduced], scope: ref },
  );

  useEffect(() => {
    if (!show) return undefined;
    const skip = () => tl.current?.progress(1);
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    return () => {
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
  }, [show]);

  if (!show || reduced) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-chrome
      className="fixed inset-0 z-[160] flex flex-col justify-between bg-background p-[var(--gutter)] text-ink"
    >
      <div className="flex items-start justify-between">
        <p data-status className="hud opacity-0">Initializing — portfolio/2026</p>
        <p className="hud hidden sm:block">27.7172° N, 85.3240° E</p>
      </div>

      <div data-mark className="overflow-clip text-center opacity-0">
        <img
          src="/logo.svg"
          alt=""
          width="905"
          height="585"
          data-split-char
          className="mx-auto h-[clamp(4rem,14vw,10rem)] w-auto"
        />
      </div>

      <div data-meter className="opacity-0">
        <div className="mb-4 flex items-end justify-between">
          <p className="hud">Electronics × Software</p>
          <p className="font-mono text-sm tabular-nums text-ink">
            <span data-count>000</span>
            <span className="text-ink-dim">%</span>
          </p>
        </div>
        <div className="h-px w-full bg-line">
          <div data-line className="h-px w-full origin-left bg-signal" />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
