import { lazy, Suspense, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import {
  gsap,
  DUR,
  EASE,
  Magnetic,
  useMediaQuery,
  usePrefersReducedMotion,
  useScrollToSection,
} from "../motion";
import { BOOT_DONE_EVENT, isBootActive } from "../motion/bootGate";
import { useWebGLSupport } from "../scene";
import { CV } from "../data/portfolioData";
import RotatingText from "../components/ui/RotatingText";

// Lazy so three.js lives in its own async chunk and never blocks first paint.
const HeroScene = lazy(() => import("../scene/HeroScene"));

const ROLES = [
  "Electronics Engineer",
  "Full-Stack Developer",
  "IoT Specialist",
  "Problem Solver",
];

const SOCIALS = [
  { label: "GitHub", href: CV.contact.github },
  { label: "LinkedIn", href: CV.contact.linkedin },
  { label: "Email", href: `mailto:${CV.contact.email}` },
];

/**
 * Typographic hero. The [data-hero-canvas] layer is reserved for the
 * Phase-5 WebGL circuit board; until then it carries the blueprint grid.
 */
const Hero = () => {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const scrollTo = useScrollToSection();
  const isWide = useMediaQuery("(min-width: 768px)");
  const webglOk = useWebGLSupport();
  const showScene =
    !reduced && isWide && webglOk && !navigator?.connection?.saveData;

  useGSAP(
    () => {
      if (reduced) return undefined;
      // Hold the entrance until the boot overlay clears.
      const tl = gsap.timeline({
        defaults: { ease: EASE.out },
        paused: isBootActive(),
      });
      const onBootDone = () => tl.play();
      if (isBootActive()) {
        window.addEventListener(BOOT_DONE_EVENT, onBootDone, { once: true });
      }
      tl.fromTo(
        "[data-hero-status]",
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: DUR.sm },
      )
        .fromTo(
          "[data-hero-line]",
          { yPercent: 110 },
          { yPercent: 0, duration: DUR.lg, stagger: 0.12 },
          "-=0.2",
        )
        .fromTo(
          "[data-hero-sub]",
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: DUR.md, stagger: 0.1 },
          "-=0.55",
        )
        .fromTo(
          "[data-hero-cta]",
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: DUR.sm, stagger: 0.08 },
          "-=0.45",
        )
        .fromTo(
          "[data-hero-cue]",
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: DUR.sm },
          "-=0.2",
        );
      return () => window.removeEventListener(BOOT_DONE_EVENT, onBootDone);
    },
    { dependencies: [reduced], scope: ref },
  );

  return (
    <section
      ref={ref}
      id="hero"
      aria-label="Introduction"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-5 pt-16 md:px-10 lg:pl-28 lg:pr-16"
    >
      {/* WebGL layer over the blueprint grid; grid doubles as the static
          fallback (reduced motion / no WebGL / small screens / Save-Data) */}
      <div data-hero-canvas className="absolute inset-0" aria-hidden="true">
        <div className="schematic-grid absolute inset-0 opacity-60" />
        {showScene ? (
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        ) : null}
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        <p
          data-hero-status
          className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-dim md:text-xs"
        >
          <span className="flex items-center gap-2 text-signal">
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="absolute h-full w-full animate-ping rounded-full bg-signal opacity-60 motion-reduce:hidden" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-signal" />
            </span>
            Open to opportunities
          </span>
          <span aria-hidden="true">{"//"}</span>
          Kathmandu · Remote
        </p>

        <h1 className="font-display text-[clamp(3.25rem,11vw,8.5rem)] font-bold uppercase leading-[0.95] tracking-[-0.03em] text-ink">
          <span className="block overflow-hidden pb-[0.05em]">
            <span data-hero-line className="block">
              Aashiq
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.05em]">
            <span data-hero-line className="block">
              Mahato
              <span className="text-signal">.</span>
            </span>
          </span>
        </h1>

        <p
          data-hero-sub
          className="mt-6 font-mono text-sm uppercase tracking-[0.2em] text-signal md:text-base"
        >
          <RotatingText words={ROLES} />
        </p>

        <p data-hero-sub className="mt-5 max-w-xl text-base text-ink-dim md:text-lg">
          Engineering the invisible, building the visible — from sensor traces
          and microcontrollers to full-stack products in the React ecosystem.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Magnetic>
            <button
              data-hero-cta
              type="button"
              onClick={() => scrollTo("#work")}
              className="group flex h-12 items-center gap-3 border border-signal px-6 font-mono text-xs uppercase tracking-[0.2em] text-signal transition-colors hover:bg-signal hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            >
              View work
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
            </button>
          </Magnetic>
          <Magnetic>
            <Link
              data-hero-cta
              to="/resume"
              className="flex h-12 items-center gap-3 border border-line px-6 font-mono text-xs uppercase tracking-[0.2em] text-ink-dim transition-colors hover:border-ink-dim hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            >
              Resume
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Magnetic>

          <span data-hero-cta className="ml-1 flex items-center gap-5">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dim underline-offset-4 transition-colors hover:text-signal hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
              >
                {social.label}
              </a>
            ))}
          </span>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        data-hero-cue
        className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
        aria-hidden="true"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-dim">
          Scroll
        </span>
        <span className="block h-10 w-px overflow-hidden bg-line">
          <span className="block h-1/2 w-full animate-slide-down-loop bg-signal motion-reduce:hidden" />
        </span>
      </div>
    </section>
  );
};

export default Hero;
