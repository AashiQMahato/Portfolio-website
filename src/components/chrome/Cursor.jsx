import { useEffect, useRef, useState } from "react";
import { gsap } from "../../motion/gsapSetup";
import { usePrefersReducedMotion, useMediaQuery } from "../../motion";

/**
 * Desktop cursor. A precise dot plus a lagging follower that changes state
 * from the nearest [data-cursor] ancestor:
 *
 *   link      (default for a / button) follower ring, dot hides
 *   button    larger ring around magnetic CTAs
 *   view | explore | read | drag | copy   filled disc with a label
 *   external  ring + ↗
 *   hide      nothing (text inputs, iframes)
 *
 * `data-cursor-label` overrides the label text. Purely decorative: it is
 * aria-hidden, pointer-events:none, and the native cursor returns for
 * touch, coarse pointers and reduced motion.
 */
const LABELS = {
  view: "View project",
  explore: "Explore",
  read: "Read",
  drag: "Drag",
  copy: "Copy",
};

const SIZE = { default: 0, link: 44, button: 72, external: 52, label: 104, hide: 0 };

const Cursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const enabled = fine && !reduced;
  const [state, setState] = useState({ kind: "default", label: "" });

  useEffect(() => {
    if (!enabled) return undefined;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    const dot = dotRef.current;
    const ring = ringRef.current;
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    let visible = false;
    const onMove = (e) => {
      if (!visible) {
        visible = true;
        gsap.set([dot, ring], { x: e.clientX, y: e.clientY });
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.2 });
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const resolve = (target) => {
      const el = target?.closest?.(
        "[data-cursor], a, button, [role='button'], summary, label, input, textarea, select, iframe",
      );
      if (!el) return { kind: "default", label: "" };
      const kind = el.getAttribute("data-cursor");
      if (kind) return { kind, label: el.getAttribute("data-cursor-label") || LABELS[kind] || "" };
      if (el.matches("input, textarea, select, iframe")) return { kind: "hide", label: "" };
      if (el.matches("a[target='_blank']")) return { kind: "external", label: "" };
      return { kind: "link", label: "" };
    };

    const onOver = (e) => setState(resolve(e.target));
    const onLeaveWindow = () => {
      visible = false;
      gsap.to([dot, ring], { autoAlpha: 0, duration: 0.2 });
    };
    const onDown = () => gsap.to(ring, { scale: 0.86, duration: 0.15 });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.4, ease: "power3.out" });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  // Resize the follower per state (width/height on a fixed, composited
  // layer with no layout dependants — cheaper than a scale that would blur
  // the label text).
  useEffect(() => {
    if (!enabled) return;
    const isLabel = Boolean(LABELS[state.kind] || (state.label && state.kind !== "link"));
    const size = isLabel ? SIZE.label : SIZE[state.kind] ?? SIZE.link;
    gsap.to(ringRef.current, {
      width: size,
      height: size,
      duration: 0.45,
      ease: "power3.out",
      overwrite: "auto",
    });
    gsap.to(dotRef.current, {
      scale: state.kind === "default" ? 1 : 0,
      duration: 0.25,
      overwrite: "auto",
    });
  }, [state, enabled]);

  if (!enabled) return null;

  const isLabel = Boolean(LABELS[state.kind] || (state.label && state.kind !== "link"));

  return (
    <div aria-hidden="true" data-chrome>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[200] h-2 w-2 rounded-full bg-white opacity-0 mix-blend-difference"
      />
      <div
        ref={ringRef}
        className={`pointer-events-none fixed left-0 top-0 z-[199] flex h-0 w-0 items-center justify-center rounded-full opacity-0 transition-[background-color,border-color] duration-300 ${
          isLabel
            ? "bg-signal text-primary-foreground"
            : "border border-ink/40 bg-ink/[0.03] backdrop-blur-[2px]"
        }`}
      >
        <span
          className={`whitespace-nowrap font-mono text-[10px] font-medium uppercase tracking-[0.14em] transition-opacity duration-200 ${
            isLabel || state.kind === "external" ? "opacity-100" : "opacity-0"
          }`}
        >
          {isLabel ? state.label : state.kind === "external" ? "↗" : ""}
        </span>
      </div>
    </div>
  );
};

export default Cursor;
