import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, usePrefersReducedMotion } from "../../motion";
import { isBootActive, markBootDone } from "../../motion/bootGate";

/**
 * Quick (~0.9s) "opening portfolio.fig" intro: a cream file card with a
 * filling progress pill on the sky ground, then a wipe. Keeps the bootGate
 * contract (hero choreography waits for BOOT_DONE_EVENT). Skippable via
 * click or any key; auto-skipped for reduced motion and repeat visits this
 * session. Content renders underneath the whole time.
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
        "[data-boot-card]",
        { autoAlpha: 0, y: 14, scale: 0.96 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.3, ease: "power3.out" },
      )
        .fromTo(
          "[data-boot-bar]",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.55, ease: "power1.inOut" },
          0.1,
        )
        .to(
          ref.current,
          { yPercent: -100, duration: 0.45, ease: "power3.inOut" },
          0.75,
        );
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
      className="fixed inset-0 z-[95] flex items-center justify-center"
      style={{
        background:
          "linear-gradient(to bottom, rgb(var(--sky-high)), rgb(var(--sky-low)))",
      }}
    >
      <div
        data-boot-card
        className="panel w-72 px-6 py-5 opacity-0"
      >
        <div className="flex items-center gap-2.5 font-mono text-xs text-ink">
          <span className="h-2 w-2 rounded-full bg-signal" aria-hidden="true" />
          portfolio<span className="-ml-2 text-ink-dim">.fig</span>
          <span className="ml-auto text-[10px] uppercase tracking-[0.2em] text-ink-dim">
            opening
          </span>
        </div>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            data-boot-bar
            className="h-full w-full origin-left rounded-full bg-signal"
          />
        </div>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim/70">
          Click to skip
        </p>
      </div>
    </div>
  );
};

export default BootLoader;
