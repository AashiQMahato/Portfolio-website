import { Fragment, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, EASE, usePrefersReducedMotion } from "../../motion";
import SectionAvatar from "../../components/avatar/SectionAvatar";
import SignalPath from "./SignalPath";
import ProofStrip from "./ProofStrip";
import { STAGES } from "./stages";

/*
 * The statement, set as seven balanced display lines from sm up (below
 * that the words flow and wrap). Plain words are set light; the three
 * disciplines are set heavier in their own gradient, and the one belonging
 * to the selected stage lights up.
 */
const LINES = [
  ["I", "build", "digital", "systems"],
  ["where", { w: "software", after: "," }],
  [{ w: "electronics" }, "and"],
  [{ w: "interaction" }, "meet."]
];
const FULL = LINES.flat()
  .map((t) => (typeof t === "string" ? t : t.w + (t.after ?? "")))
  .join(" ");
const pad = (n) => String(Math.round(Number(n))).padStart(2, "0");
const wordOf = Object.fromEntries(STAGES.map((s) => [s.id, s.word]));

/**
 * (01) Statement — "From Signal to Interface": how Aashik approaches
 * engineering, between the Hero (who) and Selected Work (what). Always on a
 * near-black stage. Left: the statement in oversized light type. Right: the
 * four-stage signal chain, from a sensor on a breadboard to the AttendEase
 * screen, joined by one glowing wire. Below: the proof strip.
 *
 * One entrance timeline tells it in order — index rule → words rise from
 * their masks → the discipline words sweep into colour → chain labels →
 * stage discs → plates open behind image masks → the wire draws stage to
 * stage → pills and readout → proof, with counts ticking up once. Nothing
 * pins. On desktop the plates drift with scroll and lean toward the
 * pointer. Under reduced motion the whole composition renders complete and
 * every interaction still works.
 */
const Statement = () => {
  const ref = useRef(null);
  const played = useRef(false);
  const reduced = usePrefersReducedMotion();

  // probe = hover / focus (transient), pinned = tapped / clicked.
  const [probe, setProbe] = useState(null);
  const [pinned, setPinned] = useState(null);
  const active = probe ?? pinned;
  const litWord = active ? wordOf[active] : null;

  useGSAP(
    () => {
      if (reduced) return undefined;
      const q = gsap.utils.selector(ref);

      if (!played.current) {
        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: EASE.out },
          onComplete: () => {
            played.current = true;
          },
        });
        tl.fromTo(q("[data-intro-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: EASE.expo }, 0)
          .fromTo(q("[data-intro-meta]"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.1)
          .fromTo(q("[data-word]"), { yPercent: 115 }, { yPercent: 0, duration: 1.1, ease: EASE.strong, stagger: 0.028 }, 0.2)
          .fromTo(q("[data-emph]"), { "--e": 0 }, { "--e": 1, duration: 1, ease: "power2.inOut", stagger: 0.14 }, 0.9)
          .fromTo(q("[data-chain]"), { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.8, stagger: 0.12 }, 0.4)
          .fromTo(q("[data-node-disc]"), { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.7)", stagger: 0.12, clearProps: "transform,opacity" }, 0.6)
          .fromTo(q("[data-node-text]"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, clearProps: "transform,opacity" }, 0.7)
          // Plates open behind a rising mask while the picture settles inside it.
          .fromTo(
            q("[data-frame]"),
            { clipPath: "inset(100% 0% 0% 0% round 12px)" },
            { clipPath: "inset(0% 0% 0% 0% round 12px)", duration: 1.3, ease: EASE.expo, stagger: 0.16, clearProps: "clipPath" },
            0.9,
          )
          .fromTo(q("[data-scene]"), { scale: 1.14, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 1.6, ease: EASE.expo, stagger: 0.16 }, 0.9)
          // The wire: terminals blink on, then each leg (and its glow) draws in turn.
          .fromTo(q("[data-terminal]"), { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.42 }, 1.35)
          .fromTo(q("[data-wire='leg']"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.55, ease: "power1.inOut", stagger: 0.42 }, 1.4)
          .fromTo(q("[data-wire='glow']"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.55, ease: "power1.inOut", stagger: 0.42 }, 1.4)
          .fromTo(q("[data-wire='link']"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, ease: "power1.out", stagger: 0.42 }, 1.75)
          .fromTo(q("[data-pill]"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 }, 1.7)
          .fromTo(q("[data-readout]"), { opacity: 0 }, { opacity: 1, duration: 0.8 }, 2.3);

        // Proof lands last; on a stacked layout it waits for its own scroll.
        const proof = gsap.timeline({ paused: true, defaults: { ease: EASE.out } });
        proof
          .fromTo(q("[data-proof-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: EASE.expo }, 0)
          .fromTo(q("[data-fact]"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 }, 0.1);
        q("[data-count]").forEach((el, i) => {
          const to = Number(el.dataset.count);
          if (!to) return;
          const c = { v: 0 };
          proof.to(c, { v: to, duration: 1.2, ease: "power2.out", onUpdate: () => (el.textContent = pad(c.v)) }, 0.15 + i * 0.1);
        });

        gsap.timeline({
          scrollTrigger: { trigger: ref.current, start: "top 70%", once: true, onEnter: () => tl.play() },
        });
        gsap.timeline({
          scrollTrigger: {
            trigger: q("[data-proof]")[0],
            start: "top 90%",
            once: true,
            onEnter: () => proof.delay(tl.isActive() ? 0.8 : 0).play(),
          },
        });
      }

      // Desktop depth: the type and the chain drift apart with scroll, each
      // plate at its own rate, and the plates lean toward the pointer.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1280px) and (hover: hover)", () => {
        const st = { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true };
        gsap.fromTo(q("[data-drift='type']"), { yPercent: 3 }, { yPercent: -3, ease: "none", scrollTrigger: st });
        q("[data-scene]").forEach((el, i) => {
          const depth = [10, 16, 8, 14][i] ?? 10;
          gsap.fromTo(el, { y: depth }, { y: -depth, ease: "none", scrollTrigger: st });
        });

        const visual = q("[data-drift='visual']")[0];
        const xs = q("[data-scene]").map((el) => gsap.quickTo(el, "x", { duration: 0.9, ease: EASE.soft }));
        const onMove = (e) => {
          const r = visual.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          xs.forEach((to, i) => to(nx * [10, 14, 8, 16][i]));
        };
        const onLeave = () => xs.forEach((to) => to(0));
        visual.addEventListener("pointermove", onMove);
        visual.addEventListener("pointerleave", onLeave);
        return () => {
          visual.removeEventListener("pointermove", onMove);
          visual.removeEventListener("pointerleave", onLeave);
        };
      });
      return () => {
        mm.revert();
        // Counters are written directly; restore their true values.
        q("[data-count]").forEach((el) => {
          if (el.dataset.count) el.textContent = pad(el.dataset.count);
        });
      };
    },
    { dependencies: [reduced], scope: ref, revertOnUpdate: true },
  );

  return (
    <section
      ref={ref}
      aria-labelledby="statement-title"
      data-tip-section="statement"
      onKeyDown={(e) => {
        if (e.key === "Escape" && (pinned || probe)) {
          setPinned(null);
          setProbe(null);
        }
      }}
      className="statement-scope relative isolate overflow-x-clip py-[clamp(5rem,13vh,9.5rem)]"
    >
      {/* Ambient: faint coloured light pooled behind the chain, a vignette at the edges */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute right-[-10%] top-[18%] h-[60%] w-[70%] bg-[radial-gradient(closest-side,rgb(var(--c-process)/0.09),transparent)]" />
        <div className="absolute left-[-15%] top-[5%] h-[55%] w-[45%] bg-[radial-gradient(closest-side,rgb(var(--c-sense)/0.05),transparent)]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[rgb(var(--background))] to-transparent" />
      </div>

      <div className="shell">
        <div className="grid gap-x-[clamp(1.5rem,2.6vw,3rem)] gap-y-16 xl:grid-cols-[minmax(0,0.62fr)_minmax(0,1fr)]">
          {/* Left — index row and the statement */}
          <div data-drift="type" className="relative">
            <div className="mb-[clamp(2rem,5.5vh,3.75rem)] flex items-center gap-4">
              <span data-intro-meta className="text-[1rem] tabular-nums text-[rgb(var(--c-connect))]">
                (01)
              </span>
              <h2 id="statement-title" data-intro-meta className="text-[1.0625rem] font-medium tracking-[-0.01em] text-ink">
                Statement
              </h2>
              <span aria-hidden="true" className="relative ml-3 h-px w-[clamp(6rem,15vw,13.5rem)]">
                <span
                  data-intro-rule
                  className="absolute inset-0 origin-left bg-[linear-gradient(90deg,rgb(var(--c-sense)/0.9),rgb(var(--c-process)/0.5)_70%,transparent)]"
                />
              </span>
              <SectionAvatar mood="thinking" hover="curious" className="w-10 h-10 ml-auto md:h-12 md:w-12" />
            </div>

            <p className="text-[clamp(2rem,5vw,3rem)] xl:text-[clamp(2rem,2.82vw,3rem)] font-light leading-[1.28] tracking-[-0.03em] text-ink">
              <span className="sr-only">{FULL}</span>
              {LINES.map((line, li) => (
                <span key={li} aria-hidden="true" className="sm:block sm:whitespace-nowrap">
                  {line.map((t, wi) => {
                    const emph = typeof t !== "string";
                    const word = emph ? t.w : t;
                    const lit = emph && litWord === word;
                    const muted = emph && litWord && !lit;
                    return (
                      <Fragment key={wi}>
                        <span className="inline-block overflow-clip pb-[0.12em] -mb-[0.12em] align-top">
                          <span data-word className="inline-block will-change-transform">
                            {emph ? (
                              <span
                                data-emph
                                className={`emph-word emph-${word} relative inline-block font-semibold tracking-[-0.04em] transition-opacity duration-500 ${
                                  muted ? "opacity-40" : ""
                                }`}
                              >
                                {word}
                                <span
                                  className={`absolute inset-x-0 bottom-[0.04em] h-[0.06em] origin-left rounded-full bg-[linear-gradient(90deg,var(--g1),var(--g2))] shadow-[0_0_14px_var(--g1)] transition-transform duration-500 ease-out ${
                                    lit ? "scale-x-100" : "scale-x-0"
                                  }`}
                                />
                              </span>
                            ) : (
                              word
                            )}
                            {emph && t.after}
                          </span>
                        </span>{" "}
                      </Fragment>
                    );
                  })}
                </span>
              ))}
            </p>
          </div>

          {/* Right — the signal chain */}
          <div data-drift="visual" className="xl:pt-[0.3rem]">
            <SignalPath active={active} pinned={pinned} setProbe={setProbe} setPinned={setPinned} />
          </div>
        </div>

        <ProofStrip />
      </div>
    </section>
  );
};

export default Statement;
