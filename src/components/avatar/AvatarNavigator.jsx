import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Compass, X } from "lucide-react";
import { useGSAP } from "@gsap/react";
import {
  gsap,
  EASE,
  ScrollTrigger,
  onBootDone,
  useMediaQuery,
  usePrefersReducedMotion,
  useScrollToSection,
} from "../../motion";
import useLauncherVisible from "../chrome/useLauncherVisible";
import Avatar from "./Avatar";
import AvatarNavMenu from "./AvatarNavMenu";
import useAvatarMood from "./useAvatarMood";
import useAvatarTour from "./useAvatarTour";
import { BEHAVIOR, SECTION_MESSAGES, SECTION_MOODS, TOUR_INVITE, reactAvatar } from "./mood";

// Per-visitor conveniences only (same approach as the theme preference).
const store = {
  get: (k) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k, v) => {
    try {
      localStorage.setItem(k, v);
    } catch {
      /* private mode: lasts for this page only */
    }
  },
};
const HIDDEN_KEY = "guide:hidden";
const OFFERED_KEY = "guide:tour-offered";
const MESSAGE_MS = 4500;
const RING = 2 * Math.PI * 30; // circumference of the r=30 progress ring

/**
 * The avatar as a site guide, fixed bottom-right. Click (or Enter/Space) opens
 * the destination menu; the face follows context through useAvatarMood; a
 * hairline ring shows page progress; one-line bubbles appear only on a first
 * visit to a section, an explicit action, or the optional tour.
 */
const AvatarNavigator = () => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const reduced = usePrefersReducedMotion();
  const wide = useMediaQuery("(min-width: 768px)");
  const finePointer = useMediaQuery("(pointer: fine)");
  const scrollTo = useScrollToSection();
  // Phones: stay out of the home hero (it would sit on the CTAs), like the other launchers.
  const pastHero = useLauncherVisible();
  const shown = wide || pastHero;

  const rootRef = useRef(null);
  const leanRef = useRef(null);
  const buttonRef = useRef(null);
  const ringRef = useRef(null);
  const bubbleRef = useRef(null);
  const seen = useRef(new Set());

  const [hidden, setHidden] = useState(() => store.get(HIDDEN_KEY) === "1");
  const [open, setOpen] = useState(false);
  const [hoverDest, setHoverDest] = useState(null);
  const [bubble, setBubble] = useState(null); // { kind: "invite" | "message", text }

  const tour = useAvatarTour({ scrollTo, reduced });
  const override = tour.step?.mood ?? (open && hoverDest ? SECTION_MOODS[hoverDest] : null);
  const { mood, section } = useAvatarMood({ menuOpen: open, override });

  const close = useCallback((refocus = true) => {
    setOpen(false);
    setHoverDest(null);
    if (refocus) buttonRef.current?.focus({ preventScroll: true });
  }, []);

  const [booted, setBooted] = useState(false);
  useEffect(() => onBootDone(() => setBooted(true)), []);

  // First appearance: one greeting, then (home, first visit) the tour invitation.
  const greeted = useRef(false);
  useEffect(() => {
    if (!booted || !shown || hidden || greeted.current) return undefined;
    const t = window.setTimeout(() => {
      greeted.current = true;
      reactAvatar(BEHAVIOR.greeting, 3200);
      if (isHome && !store.get(OFFERED_KEY)) setBubble({ kind: "invite", text: TOUR_INVITE });
    }, 1200);
    return () => window.clearTimeout(t);
  }, [booted, shown, hidden, isHome]);

  // A section's line, the first time it's reached (not during tour/menu/invite).
  useEffect(() => {
    if (!section || seen.current.has(section) || hidden || open || tour.active) return;
    seen.current.add(section);
    const text = SECTION_MESSAGES[section];
    if (text) setBubble((b) => (b?.kind === "invite" ? b : { kind: "message", text }));
  }, [section, hidden, open, tour.active]);

  useEffect(() => {
    if (bubble?.kind !== "message") return undefined;
    const t = window.setTimeout(() => setBubble(null), MESSAGE_MS);
    return () => window.clearTimeout(t);
  }, [bubble]);

  // Project links: a curious glance on hover (throttled), a cheer on click.
  useEffect(() => {
    let last = 0;
    const isProject = (t) => t.closest?.('a[href^="/projects/"]');
    const over = (e) => {
      if (!isProject(e.target) || Date.now() - last < 6000) return;
      last = Date.now();
      reactAvatar(BEHAVIOR.curious, 2500);
    };
    const click = (e) => isProject(e.target) && reactAvatar(BEHAVIOR.celebration, 1800);
    document.addEventListener("pointerover", over);
    document.addEventListener("click", click);
    return () => {
      document.removeEventListener("pointerover", over);
      document.removeEventListener("click", click);
    };
  }, []);

  // Escape closes the menu, then the bubble.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (open) close();
      else if (bubble?.kind === "message") setBubble(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, bubble, close]);

  // Page progress ring: written straight to the SVG, no React render per frame.
  useGSAP(
    () => {
      if (hidden || !ringRef.current) return;
      const set = (p) => ringRef.current && (ringRef.current.style.strokeDashoffset = String(RING * (1 - p)));
      const st = ScrollTrigger.create({ start: 0, end: "max", onUpdate: (self) => set(self.progress), onRefresh: (self) => set(self.progress) });
      set(st.progress);
    },
    { dependencies: [pathname, hidden], revertOnUpdate: true },
  );

  // Desktop: the guide leans a few px toward the pointer (wrapper only — the
  // renderer has no gaze API, so the face itself is never touched).
  useGSAP(
    () => {
      if (!finePointer || reduced || hidden) return undefined;
      const el = leanRef.current;
      const toX = gsap.quickTo(el, "x", { duration: 0.8, ease: EASE.soft });
      const toY = gsap.quickTo(el, "y", { duration: 0.8, ease: EASE.soft });
      const toR = gsap.quickTo(el, "rotation", { duration: 0.8, ease: EASE.soft });
      const onMove = (e) => {
        const r = buttonRef.current.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
        const dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
        toX(dx * 10);
        toY(dy * 8);
        toR(dx * 8);
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    },
    { dependencies: [finePointer, reduced, hidden], revertOnUpdate: true },
  );

  // Bubble in: a short rise from the avatar.
  useGSAP(
    () => {
      if (!bubble || reduced || !bubbleRef.current) return;
      gsap.fromTo(bubbleRef.current, { autoAlpha: 0, y: 8, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, ease: EASE.out });
    },
    { dependencies: [bubble?.text, tour.index] },
  );

  const toggle = () => {
    if (!reduced) {
      gsap.fromTo(buttonRef.current, { scale: 0.9 }, { scale: 1, duration: 0.45, ease: EASE.strong, overwrite: "auto" });
    }
    if (open) close(false);
    else {
      setBubble(null);
      setOpen(true);
    }
  };

  // Focus the active (or first) destination once the menu opens.
  useEffect(() => {
    if (!open) return undefined;
    // After the panel's first animation frame: hidden elements can't take focus.
    const t = window.setTimeout(() => {
      const items = [...(rootRef.current?.querySelectorAll("[data-dest]") ?? [])];
      (items.find((a) => a.getAttribute("aria-current")) ?? items[0])?.focus({ preventScroll: true });
    }, 60);
    return () => window.clearTimeout(t);
  }, [open]);

  const navigate = (id, e) => {
    // Off the home page the plain "/#id" link is handled by PageTransition.
    if (isHome) {
      e.preventDefault();
      scrollTo(`#${id}`);
      window.history.replaceState(null, "", `#${id}`);
    }
    close();
  };

  const startTour = () => {
    store.set(OFFERED_KEY, "1");
    setBubble(null);
    close(false);
    reactAvatar(BEHAVIOR.greeting, 2000);
    tour.start();
  };
  const declineTour = () => {
    store.set(OFFERED_KEY, "1");
    setBubble(null);
  };
  const hide = () => {
    store.set(HIDDEN_KEY, "1");
    tour.end();
    setBubble(null);
    setOpen(false);
    setHidden(true);
  };
  const show = () => {
    store.set(HIDDEN_KEY, "0");
    setHidden(false);
  };

  const pos = "fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5";

  if (hidden) {
    return (
      <button
        type="button"
        data-chrome
        onClick={show}
        aria-label="Show the site guide"
        className={`${pos} z-[103] flex h-9 items-center gap-2 rounded-full border border-line bg-panel px-3 text-ink-dim transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal`}
      >
        <Compass aria-hidden="true" className="h-4 w-4" />
        <span className="hud">Guide</span>
      </button>
    );
  }

  const tourBubble = tour.active && (
    <>
      <p className="hud mb-1.5 tabular-nums">
        Tour {tour.index + 1}/{tour.total}
      </p>
      <p className="text-sm leading-snug text-ink">{tour.step.text}</p>
      <div className="mt-3 flex gap-3">
        {!reduced && (
          <button type="button" onClick={tour.togglePause} className="hud text-ink hover:text-signal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal">
            {tour.paused ? "Resume" : "Pause"}
          </button>
        )}
        <button type="button" onClick={tour.skip} className="hud text-ink hover:text-signal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal">
          {tour.index + 1 < tour.total ? (reduced ? "Next" : "Skip") : "Finish"}
        </button>
        <button type="button" onClick={tour.end} className="hud ml-auto hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal">
          End tour
        </button>
      </div>
    </>
  );

  const bubbleBody =
    tourBubble ||
    (bubble?.kind === "invite" && (
      <>
        <p className="text-sm leading-snug text-ink">{bubble.text}</p>
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={startTour} className="rounded-full bg-signal px-3 py-1.5 text-xs font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-panel">
            Start tour
          </button>
          <button type="button" onClick={declineTour} className="rounded-full border border-line px-3 py-1.5 text-xs text-ink-dim hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal">
            Explore yourself
          </button>
        </div>
      </>
    )) ||
    (bubble?.kind === "message" && (
      <div className="flex items-start gap-3">
        <p className="text-sm leading-snug text-ink">{bubble.text}</p>
        <button type="button" onClick={() => setBubble(null)} aria-label="Dismiss message" className="-mr-1 -mt-0.5 shrink-0 rounded-full p-1 text-ink-dim hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal">
          <X aria-hidden="true" className="h-3.5 w-3.5" />
        </button>
      </div>
    ));

  return (
    <div
      ref={rootRef}
      data-chrome
      className={`${pos} z-[103] transition-[transform,opacity] duration-500 ease-out ${
        shown || open ? "" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      {/* Beside the avatar on wide screens (clear of the hero CTAs), above it on phones. */}
      <div aria-live="polite" className="absolute bottom-full right-0 mb-3 md:bottom-0 md:right-full md:mb-0 md:mr-4">
        {bubbleBody && !open && (
          <div
            ref={bubbleRef}
            className="w-[min(17rem,calc(100vw-2.5rem))] origin-bottom-right rounded-2xl rounded-br-sm md:w-[17rem] border border-line bg-panel/95 p-4 shadow-xl shadow-black/25 backdrop-blur-xl [@media(prefers-reduced-transparency:reduce)]:bg-panel"
          >
            {bubbleBody}
          </div>
        )}
      </div>

      <AvatarNavMenu
        open={open}
        wide={wide}
        activeId={isHome ? section : null}
        isHome={isHome}
        onNavigate={navigate}
        onHoverDest={setHoverDest}
        onTour={startTour}
        onHide={hide}
        onClose={() => close()}
      />

      <div ref={leanRef}>
        <button
          ref={buttonRef}
          type="button"
          data-cursor="button"
          onClick={toggle}
          aria-label={open ? "Close the site guide" : "Open the site guide"}
          aria-expanded={open}
          aria-controls="avatar-nav"
          tabIndex={shown || open ? undefined : -1}
          className="group relative grid h-14 w-14 place-items-center rounded-full border border-line bg-panel transition-colors duration-300 hover:border-ink-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-background md:h-16 md:w-16"
        >
          {/* Fallback mark: stays usable if the avatar runtime fails to start. */}
          <Compass aria-hidden="true" className="absolute h-5 w-5 text-ink-faint" />
          <Avatar animation={mood} className="relative h-full w-full p-1.5" />
          <svg aria-hidden="true" viewBox="0 0 64 64" className="pointer-events-none absolute -inset-[5px] h-[calc(100%+10px)] w-[calc(100%+10px)] -rotate-90">
            <circle cx="32" cy="32" r="30" fill="none" stroke="rgb(var(--line))" strokeWidth="1" />
            <circle ref={ringRef} cx="32" cy="32" r="30" fill="none" stroke="rgb(var(--signal))" strokeWidth="1.5" strokeLinecap="round" strokeDasharray={RING} strokeDashoffset={RING} />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AvatarNavigator;
