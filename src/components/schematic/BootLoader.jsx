import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, usePrefersReducedMotion } from "../../motion";
import { isBootActive, markBootDone } from "../../motion/bootGate";

const LINES = [
  "> aashiq.dev — boot v2.0",
  "> modules ............ ok",
  "> signal check ....... ok",
  "> render :: ready",
];

/**
 * Brief boot sequence (~1.2s): mono self-test lines + a drawing hairline,
 * then a wipe. Skippable via click or any key; auto-skipped for reduced
 * motion and repeat visits this session. Content renders underneath the
 * whole time — nothing is gated on it.
 */
const BootLoader = () => {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const [show, setShow] = useState(isBootActive);
  const tlRef = useRef(null);

  // Reduced motion: no ceremony, just release the gate.
  useEffect(() => {
    if (show && reduced) {
      markBootDone();
      setShow(false);
    }
  }, [show, reduced]);

  useGSAP(
    () => {
      if (!show || reduced) return;
      const tl = gsap.timeline({
        onComplete: () => {
          markBootDone();
          setShow(false);
        },
      });
      tl.fromTo(
        "[data-boot-line]",
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.01, stagger: 0.16, ease: "none" },
      )
        .fromTo(
          "[data-boot-bar]",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.7, ease: "power1.inOut" },
          0,
        )
        .to(ref.current, { yPercent: -100, duration: 0.45, ease: "power3.inOut" }, 0.85);
      tlRef.current = tl;
    },
    { dependencies: [show, reduced], scope: ref },
  );

  // Skip on any interaction.
  useEffect(() => {
    if (!show) return undefined;
    const skip = () => tlRef.current?.progress(1);
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
      role="status"
      aria-label="Loading. Press any key to skip."
      className="fixed inset-0 z-[95] flex items-center justify-center bg-background"
    >
      <div className="w-72 px-6">
        <div className="space-y-2 font-mono text-xs leading-relaxed text-ink-dim">
          {LINES.map((line) => (
            <p key={line} data-boot-line className="opacity-0">
              {line.includes("ok") || line.includes("ready") ? (
                <>
                  {line.split(/(ok|ready)$/)[0]}
                  <span className="text-signal">{line.match(/(ok|ready)$/)?.[0]}</span>
                </>
              ) : (
                line
              )}
            </p>
          ))}
        </div>
        <div className="mt-6 h-px w-full bg-line">
          <div data-boot-bar className="h-full w-full origin-left bg-signal" />
        </div>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim/60">
          Click to skip
        </p>
      </div>
    </div>
  );
};

export default BootLoader;
