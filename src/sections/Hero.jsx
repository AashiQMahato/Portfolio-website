import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import {
  createTimeline,
  utils,
  ANIME,
  usePrefersReducedMotion,
  useScrollToSection,
} from "../motion";
import { BOOT_DONE_EVENT, isBootActive } from "../motion/bootGate";
import { CV } from "../data/portfolioData";
import RotatingText from "../components/ui/RotatingText";
import { SelectionBox, PillButton, HUDLabel, ClockBadge } from "../components/canvas";

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
 * Centered canvas hero over the sky scene. Entrance is an anime.js
 * timeline (time-indexed work) held until the BootLoader releases the
 * bootGate; reduced motion renders everything immediately.
 */
const Hero = () => {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const scrollTo = useScrollToSection();

  useEffect(() => {
    if (reduced) return undefined;
    const scope = ref.current;
    if (!scope) return undefined;
    const $ = (sel) => scope.querySelectorAll(sel);

    // Hide everything up front (utils.set applies immediately), then build
    // the entrance and hold it until the boot overlay clears.
    utils.set($("[data-hero-status], [data-hero-sub], [data-hero-cta], [data-hero-cue], [data-hero-box]"), {
      opacity: 0,
    });
    utils.set($("[data-hero-line]"), { translateY: "112%" });

    const tl = createTimeline({
      autoplay: false,
      defaults: { ease: ANIME.ease.out },
    });
    tl.add($("[data-hero-status]"), {
      opacity: [0, 1],
      translateY: [12, 0],
      duration: ANIME.dur.sm,
    })
      .add(
        $("[data-hero-line]"),
        {
          translateY: ["112%", "0%"],
          duration: ANIME.dur.lg,
          delay: (el, i) => i * 120,
        },
        "-=200",
      )
      .add(
        $("[data-hero-sub]"),
        {
          opacity: [0, 1],
          translateY: [16, 0],
          duration: ANIME.dur.md,
          delay: (el, i) => i * 100,
        },
        "-=550",
      )
      .add(
        $("[data-hero-box]"),
        { opacity: [0, 1], duration: ANIME.dur.md },
        "-=400",
      )
      .add(
        $("[data-hero-cta]"),
        {
          opacity: [0, 1],
          scale: [0.9, 1],
          duration: ANIME.dur.sm,
          ease: ANIME.ease.pop,
          delay: (el, i) => i * 80,
        },
        "-=350",
      )
      .add(
        $("[data-hero-cue]"),
        { opacity: [0, 1], duration: ANIME.dur.sm },
        "-=150",
      );

    const play = () => tl.play();
    if (isBootActive()) {
      window.addEventListener(BOOT_DONE_EVENT, play, { once: true });
    } else {
      play();
    }
    return () => {
      window.removeEventListener(BOOT_DONE_EVENT, play);
      tl.pause();
    };
  }, [reduced]);

  return (
    <section
      ref={ref}
      id="hero"
      aria-label="Introduction"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pb-24 pt-28 text-center md:px-10 md:pt-36"
    >
      {/* Status pill */}
      <p
        data-hero-status
        className="pill mb-8 flex items-center gap-2.5 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dim"
      >
        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
          <span className="absolute h-full w-full animate-ping rounded-full bg-signal opacity-60 motion-reduce:hidden" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-signal" />
        </span>
        <span className="text-accent-ink">Open to opportunities</span>
        <span aria-hidden="true" className="text-line">|</span>
        Kathmandu · Remote
      </p>

      <h1 className="font-display text-display font-bold uppercase text-ink">
        <span className="block overflow-hidden pb-[0.06em]">
          <span data-hero-line className="block">
            Aashiq
          </span>
        </span>
        <span className="block overflow-hidden pb-[0.06em]">
          <span data-hero-line className="block">
            Mahato
            <span className="text-signal">.</span>
          </span>
        </span>
      </h1>

      <p
        data-hero-sub
        className="mt-6 font-mono text-sm uppercase tracking-[0.2em] text-accent-ink md:text-base"
      >
        <RotatingText words={ROLES} />
      </p>

      {/* Sub-copy in a Figma selection frame */}
      <div data-hero-box className="mt-8 max-w-2xl">
        <SelectionBox
          note="do not drag"
          tone="ember"
          className="rounded-xl px-6 py-5"
        >
          <p className="text-balance text-base leading-relaxed text-ink-dim md:text-lg">
            Engineering the invisible, building the visible — from sensor
            traces and microcontrollers to full-stack products your eyes
            don&apos;t scroll past.
          </p>
        </SelectionBox>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <span data-hero-cta>
          <PillButton onClick={() => scrollTo("#contact")}>
            Hire me
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </PillButton>
        </span>
        <span data-hero-cta>
          <PillButton variant="outline" onClick={() => scrollTo("#work")}>
            See the work
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </PillButton>
        </span>
      </div>

      <p data-hero-cta className="mt-8 flex items-center gap-6">
        {SOCIALS.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target={social.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dim underline-offset-4 transition-colors hover:text-accent-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
          >
            {social.label}
          </a>
        ))}
      </p>

      {/* Corner HUD */}
      <HUDLabel
        className="absolute bottom-8 left-6 hidden text-left lg:block"
        title="Based in Kathmandu"
        sub="Works everywhere"
      />
      <div className="absolute bottom-8 right-6 hidden text-right lg:block">
        <HUDLabel title="Open for 2026" sub="Your timezone, handled" />
        <ClockBadge className="mt-2" pill={false} seconds={false} />
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
        <span className="block h-10 w-px overflow-hidden bg-ink/20">
          <span className="block h-1/2 w-full animate-slide-down-loop bg-signal motion-reduce:hidden" />
        </span>
      </div>
    </section>
  );
};

export default Hero;
