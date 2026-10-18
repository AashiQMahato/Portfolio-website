import { Fragment, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, EASE, useMediaQuery, usePrefersReducedMotion } from "../../motion";
import SectionAvatar from "../../components/avatar/SectionAvatar";
import SignalPath from "./SignalPath";
import ProofStrip from "./ProofStrip";
import { STAGES } from "./stages";

/*
 * The statement, set as balanced display lines. Each emphasised word carries
 * the hue of the stages it belongs to, so the type and the diagram share one
 * colour language. Below sm the lines flow inline and wrap naturally.
 */
const LINES = [
  ["I", "build", "digital", "systems"],
  ["where", { w: "software", stage: "connect", after: "," }],
  [{ w: "electronics", stage: "sense" }, "and"],
  [{ w: "interaction", stage: "experience" }, "meet —"],
];
const TAIL = "from sensor traces on a breadboard to the interfaces people actually touch.";
const FULL = `${LINES.flat()
  .map((t) => (typeof t === "string" ? t : t.w + (t.after ?? "")))
  .join(" ")} ${TAIL}`;
const pad = (n) => String(Math.round(Number(n))).padStart(2, "0");
const wordOf = Object.fromEntries(STAGES.map((s) => [s.id, s.word]));

/**
 * (01) Statement — how Aashik approaches engineering, between the Hero (who)
 * and Selected Work (what). Left: the statement in large type. Right: the
 * signal path from a real sensor diagram to a real product screen. Bottom:
 * the proof strip.
 *
 * One entrance timeline tells it in order — index rule → heading → words
 * rise from their masks → emphasis words take their colour → plates open →
 * stage discs → the signal draws from first stage to last → readout → proof,
 * with counts ticking up once. Nothing pins. On desktop a light scrub drifts
 * the diagram against the type. Under reduced motion the whole composition
 * renders complete and every interaction still works.
 */
const Statement = () => {
  const ref = useRef(null);
  const played = useRef(false);
  const reduced = usePrefersReducedMotion();
  const tall = useMediaQuery("(min-width: 1024px)");
  const wide = useMediaQuery("(min-width: 768px)");
  const layout = tall ? "tall" : wide ? "wide" : "stack";

  // probe = hover / focus (transient), pinned = tapped / clicked.
  const [probe, setProbe] = useState(null);
  const [pinned, setPinned] = useState(null);
  const active = probe ?? pinned;
  const litWord = active ? wordOf[active] : null;

  useGSAP(
    () => {
      if (reduced || played.current) return undefined;
      const q = gsap.utils.selector(ref);
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: EASE.out },
        onComplete: () => {
          played.current = true;
        },
      });

      tl.fromTo(q("[data-intro-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: EASE.expo }, 0)
        .fromTo(q("[data-intro-meta]"), { opacity: 0 }, { opacity: 1, duration: 0.7, stagger: 0.08 }, 0.15)
        .fromTo(q("[data-heading]"), { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: EASE.strong }, 0.25)
        .fromTo(q("[data-word]"), { yPercent: 110 }, { yPercent: 0, duration: 1, ease: EASE.strong, stagger: 0.035 }, 0.35)
        .fromTo(q("[data-emph]"), { "--e": 0 }, { "--e": 1, duration: 0.8, ease: EASE.soft, stagger: 0.12 }, 1.05)
        .fromTo(q("[data-emph-line]"), { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: EASE.expo, stagger: 0.12 }, 1.1)
        .fromTo(q("[data-tail]"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9 }, 1.0)
        // The diagram assembles: backdrop, plates, discs, then the signal.
        .fromTo(q("[data-grid]"), { opacity: 0 }, { opacity: 1, duration: 1.2, ease: EASE.soft }, 0.5)
        .fromTo(
          q("[data-plate]"),
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: EASE.expo, stagger: 0.5 },
          0.6,
        )
        .fromTo(q("[data-plate-img]"), { scale: 1.12 }, { scale: 1, duration: 1.4, ease: EASE.expo, stagger: 0.5 }, 0.6)
                // clearProps hands transform back to CSS (the active disc scales up).
        .fromTo(q("[data-node-disc]"), { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.6)", stagger: 0.14, clearProps: "transform,opacity" }, 0.9)
        .fromTo(q("[data-node-label]"), { opacity: 0, x: -6 }, { opacity: 1, x: 0, duration: 0.6, stagger: 0.14, clearProps: "transform,opacity" }, 1.0)
        .fromTo(q("[data-wire='in']"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.35, ease: "none" }, 1.3)
        .fromTo(q("[data-wire='seg']"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.45, ease: "power1.inOut", stagger: 0.45 }, 1.65)
        .fromTo(q("[data-wire='out']"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.35, ease: "none" }, 3.0)
        .fromTo(q("[data-rail]"), { scaleY: 0 }, { scaleY: 1, duration: 1.6, ease: "power1.inOut" }, 1.0)
        .fromTo(q("[data-readout]"), { opacity: 0 }, { opacity: 1, duration: 0.8 }, 2.6);

      // Proof lands last; on a stacked layout it waits for its own scroll.
      const proof = gsap.timeline({ paused: true, defaults: { ease: EASE.out } });
      proof
        .fromTo(q("[data-proof-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: EASE.expo }, 0)
        .fromTo(q("[data-fact]"), { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 }, 0.1);
      q("[data-count]").forEach((el, i) => {
        const to = Number(el.dataset.count);
        if (!to) return;
        const c = { v: 0 };
        proof.to(c, { v: to, duration: 1.1, ease: "power2.out", onUpdate: () => (el.textContent = pad(c.v)) }, 0.1 + i * 0.1);
      });

      gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top 72%", once: true, onEnter: () => tl.play() },
      });
      gsap.timeline({
        scrollTrigger: { trigger: q("[data-proof]")[0], start: "top 88%", once: true, onEnter: () => proof.delay(tl.isActive() ? 0.6 : 0).play() },
      });

      // Attention drifts from the statement toward the path as the section passes.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const st = { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true };
        gsap.fromTo(q("[data-drift='visual']"), { yPercent: 4 }, { yPercent: -4, ease: "none", scrollTrigger: st });
        gsap.fromTo(q("[data-drift='type']"), { yPercent: -2 }, { yPercent: 3, ease: "none", scrollTrigger: st });
      });
      return () => {
        mm.revert();
        // Counters are written directly; restore their true values.
        q("[data-count]").forEach((el) => (el.textContent = pad(el.dataset.count)));
      };
    },
    { dependencies: [reduced, layout], scope: ref, revertOnUpdate: true },
  );

  return (
    <section ref={ref} aria-labelledby="statement-title" className="signal-flow relative py-[clamp(6rem,15vh,12rem)]">
      <div className="shell">
        {/* Index row — continues the Hero's ruled baseline */}
        <div className="mb-[clamp(2.5rem,7vh,4.5rem)] flex items-end gap-4">
          <div className="relative flex flex-1 flex-wrap items-center gap-x-4 gap-y-1 pt-4">
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-line" />
            <span aria-hidden="true" data-intro-rule className="signal-rail absolute inset-x-0 top-0 h-px origin-left [--rail-dir:to_right]" />
            <span data-intro-meta className="hud tabular-nums text-ink">(01)</span>
            <span data-intro-meta className="hud">Statement</span>
            <span data-intro-meta className="hud ml-auto hidden md:inline">
              Signal <span aria-hidden="true">→</span> Interface
            </span>
          </div>
          <SectionAvatar mood="thinking" className="-mb-1 h-10 w-10 md:h-12 md:w-12 lg:hidden" />
        </div>

        <div className="grid gap-x-12 gap-y-14 lg:grid-cols-12">
          {/* Left — the statement; holds its place beside the taller diagram */}
          <div className="lg:col-span-7">
            <div data-drift="type" className="lg:sticky lg:top-[calc(var(--nav-h)+3rem)]">
              <h2 id="statement-title" className="line-mask mb-6 md:mb-8">
                <span data-heading className="flex items-center gap-3 text-lede font-medium text-ink-dim">
                  <span aria-hidden="true" className="h-px w-8 bg-signal" />
                  What I do
                </span>
              </h2>

              <p className="text-[clamp(2.4rem,4.2vw,4rem)] font-medium leading-[1.02] tracking-[-0.045em] text-ink">
                <span className="sr-only">{FULL}</span>
                {LINES.map((line, li) => (
                  <Fragment key={li}>
                    <span aria-hidden="true" className="sm:block">
                      {line.map((t, wi) => {
                        const emph = typeof t !== "string";
                        const word = emph ? t.w : t;
                        const lit = emph && litWord === word;
                        const muted = emph && litWord && !lit;
                        return (
                          <Fragment key={wi}>
                            <span className="inline-block overflow-clip pb-[0.1em] -mb-[0.1em] align-top">
                              <span data-word className="inline-block will-change-transform">
                                {emph ? (
                                  <span
                                    data-emph
                                    className={`emph-word stage-${t.stage} relative inline-block transition-opacity duration-300 ${muted ? "opacity-45" : ""}`}
                                  >
                                    {word}
                                    <span
                                      data-emph-line
                                      className={`absolute inset-x-0 bottom-[0.02em] h-[0.06em] origin-left bg-[rgb(var(--stage))] transition-opacity duration-500 ${
                                        lit ? "opacity-100" : "opacity-35"
                                      }`}
                                    />
                                  </span>
                                ) : null}
                                {emph ? t.after : word}
                              </span>
                            </span>{" "}
                          </Fragment>
                        );
                      })}
                    </span>
                  </Fragment>
                ))}
              </p>

              <p data-tail aria-hidden="true" className="mt-6 max-w-[34rem] text-[clamp(1.2rem,1.8vw,1.6rem)] leading-[1.35] tracking-[-0.015em] text-ink-dim md:mt-8">
                {TAIL}
              </p>

              {/* Desktop: the companion rides in the sticky column, beside the
                  type, so it never drifts over the diagram as it scrolls. */}
              <div className="mt-10 hidden items-center gap-4 lg:flex">
                <SectionAvatar mood="thinking" hover="curious" className="h-12 w-12" />
                <p data-intro-meta aria-hidden="true" className="hud flex items-center gap-3">
                  <span className="font-mono text-ink">↘</span> Follow the signal — breadboard to browser
                </p>
              </div>
            </div>
          </div>

          {/* Right — the signal path */}
          <div data-drift="visual" className="lg:col-span-5 lg:pt-2">
            <div className="mx-auto w-full max-w-[34rem] lg:ml-auto lg:mr-0 lg:max-w-[30rem]">
              <SignalPath layout={layout} active={active} pinned={pinned} setProbe={setProbe} setPinned={setPinned} />
            </div>
          </div>
        </div>

        <ProofStrip />
      </div>
    </section>
  );
};

export default Statement;
