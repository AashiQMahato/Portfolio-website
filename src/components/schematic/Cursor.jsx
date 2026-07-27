import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import {
  gsap,
  useMediaQuery,
  usePrefersReducedMotion,
} from "../../motion";

const INTERACTIVE =
  "a, button, [role='button'], label, summary, [data-cursor='link']";
const TEXT_FIELDS = "input, textarea, select, [contenteditable='true']";

/**
 * Custom crosshair cursor: a signal dot that tracks tightly plus a lagging
 * reticle ring. Contextual states — ring grows over interactive elements,
 * expands into a [ VIEW ] badge over project media, and yields to the
 * native caret over text fields. Fine-pointer devices only; native cursor
 * under reduced motion or on touch.
 */
const Cursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const fine = useMediaQuery("(pointer: fine)");
  const enabled = fine && !reduced;

  // Hide the native cursor only while the custom one is live.
  useEffect(() => {
    document.documentElement.classList.toggle("custom-cursor", enabled);
    return () => document.documentElement.classList.remove("custom-cursor");
  }, [enabled]);

  useGSAP(
    (context, contextSafe) => {
      if (!enabled) return undefined;
      const dot = dotRef.current;
      const ring = ringRef.current;
      const label = labelRef.current;

      gsap.set([dot, ring], { xPercent: -50, yPercent: -50, autoAlpha: 0 });
      const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" });
      const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" });
      const ringX = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
      const ringY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });

      let seen = false;
      const onMove = contextSafe((e) => {
        if (!seen) {
          seen = true;
          gsap.set([dot, ring], { x: e.clientX, y: e.clientY });
          gsap.to([dot, ring], { autoAlpha: 1, duration: 0.2 });
        }
        dotX(e.clientX);
        dotY(e.clientY);
        ringX(e.clientX);
        ringY(e.clientY);
      });

      const setState = contextSafe((state) => {
        const view = state === "view";
        const hover = state === "hover";
        gsap.to(ring, {
          scale: view ? 2.4 : hover ? 1.6 : 1,
          backgroundColor: view ? "rgb(var(--signal))" : "rgba(0,0,0,0)",
          borderColor: view
            ? "rgba(0,0,0,0)"
            : hover
              ? "rgb(var(--signal))"
              : "rgb(var(--ink-dim) / 0.6)",
          duration: 0.25,
          ease: "power3.out",
        });
        gsap.to(label, { autoAlpha: view ? 1 : 0, duration: 0.15 });
        gsap.to(dot, { scale: view ? 0 : hover ? 0.5 : 1, duration: 0.2 });
      });

      const onOver = contextSafe((e) => {
        const t = e.target;
        if (t.closest?.("[data-cursor='view']")) setState("view");
        else if (t.closest?.(TEXT_FIELDS)) {
          gsap.to([dot, ring], { autoAlpha: 0, duration: 0.15 });
          return;
        } else if (t.closest?.(INTERACTIVE)) setState("hover");
        else setState("default");
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.15 });
      });

      const onLeaveWindow = contextSafe(() => {
        seen = false;
        gsap.to([dot, ring], { autoAlpha: 0, duration: 0.2 });
      });

      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerover", onOver, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeaveWindow);
      return () => {
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerover", onOver);
        document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
      };
    },
    { dependencies: [enabled] },
  );

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[200]">
      <div
        ref={ringRef}
        className="fixed left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-ink-dim/60"
      >
        <span
          ref={labelRef}
          className="font-mono text-[8px] font-semibold uppercase tracking-widest text-background opacity-0"
        >
          View
        </span>
      </div>
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-signal"
      />
    </div>
  );
};

export default Cursor;
