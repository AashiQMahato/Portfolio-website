import { useLayoutEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, EASE, usePrefersReducedMotion } from "../motion";

const NAME = "AASHIK KUMAR MAHATO";
const CHARS = NAME.split("");

/**
 * The footer signature: the full name set edge to edge — the type is sized
 * to the footer's width, so it always spans exactly gutter to gutter.
 *
 * Each letter is a hollow outline with a solid copy clipped inside it. As
 * the pointer moves across the footer, the letters nearest it fill from the
 * baseline up (ink fading to the signal colour), rise and stretch slightly,
 * with a gaussian falloff so a soft swell travels with the pointer. Letters
 * rise in on arrival and a single fill wave runs once across the name.
 *
 * Touch / no-hover devices get the name solid; reduced motion gets it solid
 * and still. Purely decorative (the name is in the copyright line), so it is
 * hidden from assistive tech and holds no focus.
 */
const FooterWordmark = () => {
  const ref = useRef(null);
  const lineRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const [size, setSize] = useState(null);

  // Fit: measure the line at a known size, then scale to the available width.
  useLayoutEffect(() => {
    const box = ref.current;
    const line = lineRef.current;
    if (!box || !line) return undefined;
    const fit = () => {
      const cs = getComputedStyle(box);
      const avail = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const prev = line.style.fontSize;
      line.style.fontSize = "100px";
      const w = line.scrollWidth;
      line.style.fontSize = prev;
      if (w > 0) setSize((100 * avail) / w);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, []);

  useGSAP(
    () => {
      const chars = gsap.utils.toArray("[data-wm-char]", ref.current);
      if (reduced) {
        gsap.set(chars, { "--f": 1 });
        return undefined;
      }

      gsap.fromTo(
        chars,
        { yPercent: 105 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: EASE.strong,
          stagger: 0.025,
          scrollTrigger: { trigger: ref.current, start: "top 95%", once: true },
        },
      );

      const mm = gsap.matchMedia();
      mm.add("(hover: none)", () => {
        gsap.set(chars, { "--f": 1 });
      });
      mm.add("(hover: hover)", () => {
        gsap.set(chars, { "--f": 0 });
        // One wave across the name on arrival — shows the letters can fill.
        const wave = gsap.timeline({
          paused: true,
          scrollTrigger: { trigger: ref.current, start: "top 80%", once: true, onEnter: () => wave.play() },
        });
        chars.forEach((c, i) => {
          wave.to(c, { "--f": 1, duration: 0.45, ease: EASE.soft }, 0.5 + i * 0.045);
          wave.to(c, { "--f": 0, duration: 0.9, ease: EASE.soft }, 0.95 + i * 0.045);
        });

        const fill = chars.map((c) => gsap.quickTo(c, "--f", { duration: 0.6, ease: EASE.soft }));
        const lift = chars.map((c) => gsap.quickTo(c, "y", { duration: 0.7, ease: EASE.soft }));
        const stretch = chars.map((c) => gsap.quickTo(c, "scaleY", { duration: 0.7, ease: EASE.soft }));
        const footer = ref.current.closest("footer") ?? ref.current;
        let centres = [];
        let band = null;
        let frame = 0;
        let last = null;

        const measure = () => {
          centres = chars.map((c) => {
            const r = c.getBoundingClientRect();
            return r.left + r.width / 2 + window.scrollX;
          });
          const r = lineRef.current.getBoundingClientRect();
          band = { top: r.top + window.scrollY, h: r.height };
        };
        const apply = () => {
          frame = 0;
          if (!last) return;
          if (!centres.length) measure();
          const fs = parseFloat(getComputedStyle(lineRef.current).fontSize);
          const sigma = fs * 0.75;
          const px = last.x + window.scrollX;
          const py = last.y + window.scrollY;
          // Strongest over the letters, easing off as the pointer moves away above them.
          const dy = Math.max(0, band.top - py, py - (band.top + band.h));
          const vy = Math.exp(-(dy * dy) / (2 * (band.h * 1.1) ** 2));
          centres.forEach((cx, i) => {
            if (CHARS[i] === " ") return;
            const dx = px - cx;
            const k = Math.exp(-(dx * dx) / (2 * sigma * sigma)) * vy;
            fill[i](Math.min(1, k * 1.35));
            lift[i](-fs * 0.11 * k);
            stretch[i](1 + 0.07 * k);
          });
        };
        const onMove = (e) => {
          if (e.pointerType !== "mouse") return;
          last = { x: e.clientX, y: e.clientY };
          if (!frame) frame = requestAnimationFrame(apply);
        };
        const onLeave = () => {
          last = null;
          fill.forEach((f) => f(0));
          lift.forEach((f) => f(0));
          stretch.forEach((f) => f(1));
        };
        const onResize = () => {
          centres = [];
        };
        footer.addEventListener("pointermove", onMove);
        footer.addEventListener("pointerleave", onLeave);
        window.addEventListener("resize", onResize);
        return () => {
          cancelAnimationFrame(frame);
          footer.removeEventListener("pointermove", onMove);
          footer.removeEventListener("pointerleave", onLeave);
          window.removeEventListener("resize", onResize);
        };
      });
      return () => mm.revert();
    },
    { dependencies: [reduced], scope: ref, revertOnUpdate: true },
  );

  return (
    <div ref={ref} aria-hidden="true" className="relative mt-20 select-none px-[var(--gutter)]">
      {/* soft light that pools under the name */}
      <div className="pointer-events-none absolute inset-x-[10%] bottom-0 h-1/2 bg-[radial-gradient(closest-side,rgb(var(--signal)/0.08),transparent)]" />
      <p
        ref={lineRef}
        className="line-mask relative -mt-[0.2em] w-max whitespace-nowrap pb-[0.06em] pt-[0.2em] font-semibold uppercase leading-[0.86] tracking-[-0.045em]"
        style={{ fontSize: size ? `${size}px` : "8.5vw" }}
      >
        {CHARS.map((ch, i) =>
          ch === " " ? (
            <span key={i} data-wm-char className="inline-block w-[0.22em]" />
          ) : (
            <span
              key={i}
              data-wm-char
              className="relative inline-block origin-bottom will-change-transform [--f:1]"
            >
              <span className="wordmark-ghost">{ch}</span>
              <span
                className="wordmark-fill absolute inset-0"
                style={{ clipPath: "inset(calc((1 - var(--f)) * 100%) 0 0 0)" }}
              >
                {ch}
              </span>
            </span>
          ),
        )}
      </p>
    </div>
  );
};

export default FooterWordmark;
