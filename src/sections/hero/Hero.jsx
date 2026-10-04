import { useRef } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import {
  gsap,
  EASE,
  onBootDone,
  usePrefersReducedMotion,
  useScrollToSection,
} from "../../motion";
import { MagneticButton, LocalTime } from "../../components/ui";
import { siteConfig } from "../../data/portfolioData";
import SignalField from "./SignalField";

const NAME = ["Aashik", "Kumar", "Mahato"];
const BUILDS = ["Web platforms", "Embedded firmware", "IoT systems", "Interactive interfaces"];

/** Max pointer offset in px per layer — far layers move least. */
const DEPTH = { field: 14, name: 6, meta: 18 };

/**
 * Identity statement. The name is the composition; a live signal trace runs
 * beneath it. Entrance is one timeline (gated on the preloader): field →
 * nav → eyebrow → name → roles → CTAs → metadata. On desktop the name lines
 * drift apart with scroll and layers respond to the pointer at different
 * depths. Under reduced motion everything renders in place, the trace is a
 * single still frame.
 */
const Hero = () => {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const scrollTo = useScrollToSection();

  useGSAP(
    () => {
      if (reduced) return undefined;
      const q = gsap.utils.selector(ref);
      const nav = document.querySelector("header[data-chrome]");

      gsap.set(q("[data-hero-fade]"), { opacity: 0 });
      gsap.set(q("[data-hero-char]"), { yPercent: 115 });
      gsap.set(q("[data-hero-rise]"), { opacity: 0, y: 24 });
      gsap.set(nav, { opacity: 0, y: -12 });

      const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.out } });
      tl.to(q("[data-hero-field]"), { opacity: 1, duration: 1.6, ease: EASE.soft }, 0)
        .to(nav, { opacity: 1, y: 0, duration: 0.8 }, 0.1)
        .to(q("[data-hero-eyebrow]"), { opacity: 1, duration: 0.8, stagger: 0.08 }, 0.2)
        .to(q("[data-hero-char]"), {
          yPercent: 0,
          duration: 1.25,
          ease: EASE.strong,
          stagger: { each: 0.035, from: "start" },
        }, 0.25)
        .to(q("[data-hero-rise]"), { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.9)
        .to(q("[data-hero-meta]"), { opacity: 1, duration: 0.8, stagger: 0.06 }, 1.15);

      const release = onBootDone(() => tl.play());

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        // Scroll: the three name lines part ways as the hero leaves.
        const st = { trigger: ref.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to(q("[data-name-line='0']"), { xPercent: -7, ease: "none", scrollTrigger: st });
        gsap.to(q("[data-name-line='1']"), { xPercent: 5, ease: "none", scrollTrigger: st });
        gsap.to(q("[data-name-line='2']"), { xPercent: -3, ease: "none", scrollTrigger: st });
        gsap.to(q("[data-hero-field-wrap]"), { yPercent: 18, ease: "none", scrollTrigger: st });
        gsap.to(q("[data-hero-lower]"), { opacity: 0, y: -40, ease: "none", scrollTrigger: { ...st, end: "60% top" } });
      });
      mm.add("(min-width: 1024px) and (hover: hover) and (pointer: fine)", () => {
        const layers = Object.entries(DEPTH).map(([key, px]) => ({
          px,
          x: gsap.quickTo(q(`[data-depth='${key}']`), "x", { duration: 1, ease: EASE.soft }),
          y: gsap.quickTo(q(`[data-depth='${key}']`), "y", { duration: 1, ease: EASE.soft }),
        }));
        const onMove = (e) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          layers.forEach((l) => {
            l.x(-nx * l.px * 2);
            l.y(-ny * l.px * 2);
          });
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
      });

      return () => {
        release();
        mm.revert();
        gsap.set(nav, { clearProps: "opacity,transform" });
      };
    },
    { dependencies: [reduced], scope: ref },
  );

  return (
    <section
      ref={ref}
      id="top"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] flex-col overflow-clip pt-[var(--nav-h)]"
    >
      {/* Layer 1 — the signal field */}
      <div data-hero-field-wrap aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[17%] h-[34%] md:top-[12%] md:h-[70%]">
        <div data-depth="field" data-hero-field className={`h-full w-full ${reduced ? "" : "opacity-0"}`}>
          <SignalField static={reduced} />
        </div>
      </div>

      <div className="shell relative flex flex-1 flex-col justify-between pb-8 pt-6 lg:pb-10">
        {/* Eyebrow */}
        <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-2">
          <p data-hero-eyebrow data-hero-fade className="hud">
            Portfolio <span aria-hidden="true">/</span> 2026
          </p>
          <p data-hero-eyebrow data-hero-fade className="hud hidden sm:block">
            Kathmandu, Nepal <span aria-hidden="true">—</span> 27.71° N 85.32° E
          </p>
          <p data-hero-eyebrow data-hero-fade className="hud text-ink">
            <LocalTime />
          </p>
        </div>

        {/* Name */}
        <h1
          id="hero-title"
          aria-label="Aashik Kumar Mahato — Electronics Engineer and Full-Stack Developer"
          data-depth="name"
          className="my-[clamp(2.5rem,8vh,5rem)] text-display-xl text-ink"
        >
          {NAME.map((line, i) => (
            <span
              key={line}
              aria-hidden="true"
              data-name-line={i}
              className={`line-mask ${i === 1 ? "pl-[12vw] lg:pl-[20vw]" : ""}`}
            >
              <span className="inline-block whitespace-nowrap">
                {line.split("").map((ch, j) => (
                  <span key={j} data-hero-char className="inline-block will-change-transform">
                    {ch}
                  </span>
                ))}
                {i === NAME.length - 1 && (
                  <span data-hero-char className="inline-block text-signal">.</span>
                )}
              </span>
            </span>
          ))}
        </h1>

        {/* Roles · builds · actions */}
        <div data-hero-lower className="grid gap-10 border-t border-line pt-6 lg:grid-cols-12 lg:gap-6">
          <p data-hero-rise className="text-lede text-ink lg:col-span-4">
            Electronics Engineer
            <br />
            <span className="text-ink-dim">+</span> Full-Stack Developer
          </p>

          <div data-hero-rise className="lg:col-span-4">
            <p className="hud mb-3">Builds</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[0.95rem] text-ink-dim">
              {BUILDS.map((b, i) => (
                <li key={b} className="flex gap-2.5">
                  <span className="font-mono text-xs leading-6 text-ink-dim" aria-hidden="true">
                    0{i + 1}
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div data-hero-rise className="flex flex-wrap items-start gap-3 lg:col-span-4 lg:justify-end">
            <MagneticButton
              variant="signal"
              icon={ArrowDown}
              iconDirection="down"
              onClick={() => scrollTo("#work")}
            >
              Selected work
            </MagneticButton>
            <MagneticButton variant="outline" icon={ArrowUpRight} onClick={() => scrollTo("#contact")}>
              Get in touch
            </MagneticButton>
          </div>
        </div>

        <div data-depth="meta" className="mt-10 flex items-center justify-between">
          <p data-hero-meta data-hero-fade className="hud flex items-center gap-2.5 text-ink">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full rounded-full bg-signal opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            {siteConfig.availability}
          </p>
          <p data-hero-meta data-hero-fade className="hud hidden items-center gap-3 sm:flex" aria-hidden="true">
            Scroll
            <span className="relative block h-px w-12 overflow-hidden bg-line">
              <span className="absolute inset-0 origin-left bg-ink motion-safe:animate-[scrollcue_2.4s_cubic-bezier(0.87,0,0.13,1)_infinite]" />
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
