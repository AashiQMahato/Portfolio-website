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
 * Custom design-tool cursor: an orange Figma-style arrow that tracks
 * tightly plus a lagging "aashiq" name-tag pill — as if the owner's
 * multiplayer cursor is yours. Contextual states — the tag brightens over
 * interactive elements, flips to [ VIEW ] over project media, and yields to
 * the native caret over text fields. Fine-pointer devices only; native
 * cursor under reduced motion or on touch.
 */
const Cursor = () => {
  const arrowRef = useRef(null);
  const tagRef = useRef(null);
  const tagTextRef = useRef(null);
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
      const arrow = arrowRef.current;
      const tag = tagRef.current;
      const tagText = tagTextRef.current;

      gsap.set([arrow, tag], { autoAlpha: 0 });
      const arrowX = gsap.quickTo(arrow, "x", { duration: 0.06, ease: "power2.out" });
      const arrowY = gsap.quickTo(arrow, "y", { duration: 0.06, ease: "power2.out" });
      const tagX = gsap.quickTo(tag, "x", { duration: 0.28, ease: "power3.out" });
      const tagY = gsap.quickTo(tag, "y", { duration: 0.28, ease: "power3.out" });

      let seen = false;
      const onMove = contextSafe((e) => {
        if (!seen) {
          seen = true;
          gsap.set([arrow, tag], { x: e.clientX, y: e.clientY });
          gsap.to([arrow, tag], { autoAlpha: 1, duration: 0.2 });
        }
        arrowX(e.clientX);
        arrowY(e.clientY);
        tagX(e.clientX);
        tagY(e.clientY);
      });

      const setState = contextSafe((state) => {
        const view = state === "view";
        const hover = state === "hover";
        if (tagText)
          tagText.textContent = view ? "view" : "aashiq";
        gsap.to(tag, {
          scale: view ? 1.15 : 1,
          backgroundColor: view
            ? "rgb(var(--ember))"
            : hover
              ? "rgb(var(--signal))"
              : "rgb(var(--signal) / 0.9)",
          duration: 0.25,
          ease: "power3.out",
        });
        gsap.to(arrow, { scale: hover || view ? 0.85 : 1, duration: 0.2 });
      });

      const onOver = contextSafe((e) => {
        const t = e.target;
        if (t.closest?.("[data-cursor='view']")) setState("view");
        else if (t.closest?.(TEXT_FIELDS)) {
          gsap.to([arrow, tag], { autoAlpha: 0, duration: 0.15 });
          return;
        } else if (t.closest?.(INTERACTIVE)) setState("hover");
        else setState("default");
        gsap.to([arrow, tag], { autoAlpha: 1, duration: 0.15 });
      });

      const onLeaveWindow = contextSafe(() => {
        seen = false;
        gsap.to([arrow, tag], { autoAlpha: 0, duration: 0.2 });
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
      {/* Lagging name-tag pill (offset below-right of the hotspot) */}
      <div
        ref={tagRef}
        className="fixed left-0 top-0 origin-top-left rounded-full bg-signal/90 px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-white"
        style={{ marginLeft: 14, marginTop: 18 }}
      >
        <span ref={tagTextRef}>aashiq</span>
      </div>
      {/* Arrow — hotspot at top-left of the SVG */}
      <svg
        ref={arrowRef}
        className="fixed left-0 top-0"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="rgb(var(--signal))"
        stroke="rgb(var(--panel))"
        strokeWidth="1.5"
      >
        <path d="M4 2l16 8-7 2-3 7z" />
      </svg>
    </div>
  );
};

export default Cursor;
