import { useEffect, useRef } from "react";
import { gsap, EASE, usePrefersReducedMotion, useMediaQuery } from "../../motion";

/**
 * Desktop cursor: a 6px dot plus a hairline ring that trails it. State comes
 * from the nearest [data-cursor] ancestor (or the element type):
 *
 *   default   dot + resting ring
 *   link      ring grows, dot hides (a, role=button)
 *   button    magnetic: the ring wraps the control's own shape and leans
 *             a little with the pointer ([data-cursor="button"], <button>)
 *   view | explore | read | drag | copy   signal pill with a label
 *   external  ring + ↗ (target=_blank links)
 *   text      the dot becomes a thin caret over selectable text (only where
 *             the element under the pointer directly holds text)
 *   hide      nothing — inputs, textareas, iframes get the native cursor
 *
 * `data-cursor-label` overrides the label. Everything is written straight
 * to the DOM (no React renders while the pointer moves); the layer is
 * aria-hidden and pointer-events:none, so clicks and selection pass through.
 * Absent on touch / coarse pointers and under reduced motion.
 */
const LABELS = {
  view: "View project ↗",
  explore: "Explore",
  read: "Read ↗",
  drag: "Drag",
  copy: "Copy",
};
const RING = { default: 34, link: 56, external: 56, text: 0, hide: 0 };
const INTERACTIVE = "[data-cursor], a, button, [role='button'], summary, label[for], input, textarea, select, iframe";
// The caret shows only over an element that itself holds text — not the empty
// part of a block (e.g. the space beside the hero name).
const holdsText = (el) => el && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
const MAGNET_PAD = 8; // px of ring around a magnetic control
const MAGNET_LEAN = 0.18; // how far the wrapped ring follows the pointer off-centre

const Cursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const enabled = fine && !reduced;

  useEffect(() => {
    if (!enabled) return undefined;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100, autoAlpha: 0 });
    const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: EASE.out });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: EASE.out });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.42, ease: EASE.out });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.42, ease: EASE.out });

    let kind = "default";
    let magnet = null; // element the ring is wrapped around
    let visible = false;
    let px = -100;
    let py = -100;

    const resolve = (target) => {
      const el = target?.closest?.(INTERACTIVE);
      if (!el) return { kind: holdsText(target) ? "text" : "default", el: null };
      const k = el.getAttribute("data-cursor");
      if (k) return { kind: k, el };
      if (el.matches("input, textarea, select, iframe")) return { kind: "hide", el };
      if (el.matches("a[target='_blank']")) return { kind: "external", el };
      if (el.matches("button")) return { kind: "button", el };
      return { kind: "link", el };
    };

    const apply = (next, el) => {
      const labelText = el?.getAttribute("data-cursor-label") || LABELS[next] || "";
      const isPill = Boolean(labelText) && next !== "link" && next !== "button";
      // Only small controls are wrapped; big surfaces would turn the ring into a box.
      const r = el?.getBoundingClientRect();
      const wrap = next === "button" && r && r.width <= 260 && r.height <= 96 ? el : null;
      if (next === kind && wrap === magnet) return;
      kind = next;
      magnet = wrap;
      ring.dataset.state = isPill ? "pill" : wrap ? "magnet" : next;
      label.textContent = isPill ? labelText : next === "external" ? "↗" : "";

      let w = RING[next] ?? RING.link;
      let h = w;
      let radius = 999;
      if (isPill) {
        w = Math.max(84, labelText.length * 7.2 + 34);
        h = 34;
      } else if (wrap) {
        w = r.width + MAGNET_PAD * 2;
        h = r.height + MAGNET_PAD * 2;
        radius = Math.min(parseFloat(getComputedStyle(wrap).borderRadius) || 0, h / 2) + MAGNET_PAD;
      }
      gsap.to(ring, { width: w, height: h, borderRadius: radius, duration: 0.45, ease: EASE.out, overwrite: "auto" });
      gsap.to(dot, {
        scale: next === "default" ? 1 : next === "text" ? 1 : 0,
        width: next === "text" ? 2 : 6,
        height: next === "text" ? 22 : 6,
        borderRadius: next === "text" ? 1 : 999,
        duration: 0.25,
        ease: EASE.out,
        overwrite: "auto",
      });
      gsap.to(ring, { autoAlpha: visible && next !== "hide" && next !== "text" ? 1 : 0, duration: 0.2, overwrite: false });
    };

    const follow = () => {
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        ringX(cx + (px - cx) * MAGNET_LEAN);
        ringY(cy + (py - cy) * MAGNET_LEAN);
      } else {
        ringX(px);
        ringY(py);
      }
    };

    const onMove = (e) => {
      px = e.clientX;
      py = e.clientY;
      if (!visible) {
        visible = true;
        gsap.set([dot, ring], { x: px, y: py });
        gsap.to(dot, { autoAlpha: 1, duration: 0.2 });
        apply(resolve(e.target).kind, resolve(e.target).el);
        gsap.to(ring, { autoAlpha: kind === "hide" || kind === "text" ? 0 : 1, duration: 0.2 });
      }
      dotX(px);
      dotY(py);
      follow();
    };
    const onOver = (e) => {
      const { kind: k, el } = resolve(e.target);
      apply(k, el);
      follow();
    };
    // Scrolling moves content under a still pointer: re-resolve and keep a wrapped ring attached.
    const onScroll = () => {
      if (!visible) return;
      const { kind: k, el } = resolve(document.elementFromPoint(px, py));
      apply(k, el);
      follow();
    };
    const onLeaveWindow = () => {
      visible = false;
      gsap.to([dot, ring], { autoAlpha: 0, duration: 0.2 });
    };
    const onDown = () => gsap.to(ring, { scale: 0.88, duration: 0.15, ease: EASE.out });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.45, ease: "back.out(2)" });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    root.addEventListener("pointerleave", onLeaveWindow);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("scroll", onScroll);
      root.removeEventListener("pointerleave", onLeaveWindow);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      gsap.killTweensOf([dot, ring]);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" data-chrome>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[200] h-1.5 w-1.5 rounded-full bg-white mix-blend-difference"
      />
      <div
        ref={ringRef}
        data-state="default"
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-[199] flex h-[34px] w-[34px] items-center justify-center rounded-full border border-ink/35"
      >
        <span
          ref={labelRef}
          className="whitespace-nowrap font-mono text-[10px] font-medium uppercase tracking-[0.14em]"
        />
      </div>
    </div>
  );
};

export default Cursor;
