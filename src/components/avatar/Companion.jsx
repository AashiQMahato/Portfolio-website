import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap, EASE, usePrefersReducedMotion, useScrollToSection } from "../../motion";
import { CV, projects } from "../../data/portfolioData";
import { capabilities } from "../../data/stack";
import Avatar from "./Avatar";
import useAvatarMood from "./useAvatarMood";
import useAvatarTour from "./useAvatarTour";
import {
  ARRIVAL,
  AVATAR_SAY_EVENT,
  BEHAVIOR,
  DESTINATIONS,
  GREETING,
  PLAYFUL,
  PROJECT_FALLBACK,
  PROJECT_LINES,
  SECTION_ABOUT,
  reactAvatar,
} from "./mood";

const BASE = 64; // px the avatar renders at; scaled to each anchor's box
const FOCUS = 0.42; // anchors compete for this line of the viewport
const NAV = 72; // fixed header height
const SWITCH_MS = 220; // a new anchor must stay best this long (fast scrolls skip)
const ARRIVE_MS = 1200; // settle time before an arrival line may play
const INTERACTIVE = "a, button, input, textarea, select, [data-avatar]";
const QUIET_KEY = "companion:quiet";
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
      /* private mode */
    }
  },
};
const lerp = (a, b, t) => a + (b - a) * t;
const sectionOf = (el) => el.closest("section[id]")?.id ?? (el.closest("footer") ? "footer" : "page");
const FEATURED = ["studio-tools", "automated-attendance-system", "cable-network-website", "smart-school-management", "ultrasonic-blind-stick"];

/**
 * The site's one character. It has no fixed home: it settles into whichever
 * layout anchor (<SectionAvatar>) sits nearest the reading line, hopping a
 * short way or peeking out/in for longer jumps, and takes that anchor's mood.
 * It reacts to real events (project hover, capability choice, article pick),
 * speaks rarely, and a click starts a conversation with a few useful actions —
 * navigation is only the last of them.
 */
const Companion = () => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const reduced = usePrefersReducedMotion();
  const scrollTo = useScrollToSection();

  const rootRef = useRef(null);
  const bodyRef = useRef(null);
  const bubbleRef = useRef(null);
  const posRef = useRef(null); // live avatar box, shared with the bubble placement

  const [spot, setSpot] = useState(null); // { el, section, mood, hover }
  const [hot, setHot] = useState(null);
  const [bubble, setBubble] = useState(null); // { kind: "panel" | "message", text, view?, link?, actions? }
  const [quiet, setQuiet] = useState(() => store.get(QUIET_KEY) === "1");
  const clicks = useRef(0);
  const lastClick = useRef(0);
  const lastCapability = useRef(capabilities[0].id);
  const seen = useRef({ arrival: new Set(), projects: new Set() });
  const quietRef = useRef(quiet);
  quietRef.current = quiet;
  const bubbleOpen = useRef(false);
  bubbleOpen.current = Boolean(bubble);

  const tour = useAvatarTour({ scrollTo, reduced });
  const mood = useAvatarMood({ base: spot?.mood, hot, panelOpen: bubble?.kind === "panel", override: tour.step?.mood });

  const say = useCallback((text, extra = {}) => setBubble({ kind: "message", text, ...extra }), []);

  /* ---------------------------------------------------------- positioning */
  useEffect(() => {
    const root = rootRef.current;
    const body = bodyRef.current;
    const st = { anchor: null, cand: null, candAt: 0, from: null, blend: 1, shown: false, lastPick: 0 };

    const measure = (a) => {
      const r = a.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, s: r.width / BASE };
    };
    const pick = () => {
      let best = null;
      let bd = Infinity;
      document.querySelectorAll("[data-companion-anchor]").forEach((a) => {
        if (a.dataset.active === "false") return;
        const r = a.getBoundingClientRect();
        if (!r.width || r.bottom < NAV || r.top > window.innerHeight) return;
        const d = Math.abs(r.top + r.height / 2 - window.innerHeight * FOCUS);
        if (d < bd) {
          bd = d;
          best = a;
        }
      });
      return best;
    };
    const show = (on) => {
      if (on === st.shown) return;
      st.shown = on;
      root.style.pointerEvents = on ? "auto" : "none";
      gsap.to(body, { autoAlpha: on ? 1 : 0, scale: on ? 1 : 0.6, duration: reduced ? 0 : on ? 0.35 : 0.2, ease: on ? EASE.out : "power2.in", overwrite: "auto" });
    };
    const place = () => {
      if (!st.anchor) return;
      const m = measure(st.anchor);
      const b = st.blend;
      const p = b >= 1 || !st.from ? m : { x: lerp(st.from.x, m.x, b), y: lerp(st.from.y, m.y, b), s: lerp(st.from.s, m.s, b) };
      posRef.current = { x: p.x, y: p.y, size: BASE * p.s };
      root.style.transform = `translate3d(${p.x - BASE / 2}px, ${p.y - BASE / 2}px, 0) scale(${p.s})`;
    };
    const switchTo = (a) => {
      const prev = st.anchor;
      st.anchor = a;
      if (!a) {
        show(false);
        posRef.current = null;
        setSpot(null);
        return;
      }
      setSpot({ el: a, section: sectionOf(a), mood: a.dataset.mood, hover: a.dataset.hover });
      const next = measure(a);
      const cur = posRef.current;
      if (!prev || !st.shown || reduced || !cur) {
        st.blend = 1;
        place();
        show(true);
        return;
      }
      if (Math.hypot(next.x - cur.x, next.y - cur.y) > window.innerHeight * 0.45) {
        // Too far to walk: peek out here, peek in there.
        gsap.to(body, {
          autoAlpha: 0,
          scale: 0.6,
          duration: 0.18,
          ease: "power2.in",
          overwrite: "auto",
          onComplete: () => {
            st.blend = 1;
            place();
            gsap.to(body, { autoAlpha: 1, scale: 1, duration: 0.35, ease: EASE.out });
          },
        });
      } else {
        st.from = { x: cur.x, y: cur.y, s: cur.size / BASE };
        st.blend = 0;
        gsap.to(st, { blend: 1, duration: 0.6, ease: EASE.out, overwrite: "auto" });
      }
    };
    const tick = () => {
      const now = performance.now();
      if (now - st.lastPick > 150) {
        st.lastPick = now;
        const best = pick();
        if (best === st.anchor) st.cand = null;
        else if (best !== st.cand) {
          st.cand = best;
          st.candAt = now;
        } else if (now - st.candAt > SWITCH_MS) {
          st.cand = null;
          switchTo(best);
        }
      }
      place();
    };
    gsap.set(body, { autoAlpha: 0, scale: 0.6 });
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      gsap.killTweensOf([st, body]);
    };
  }, [reduced, pathname]);

  // The bubble sits beside the character on the side with more room (below it on phones).
  useEffect(() => {
    if (!bubble && !tour.active) return undefined;
    const placeBubble = () => {
      const el = bubbleRef.current;
      const p = posRef.current;
      if (!el || !p) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const bw = el.offsetWidth;
      const bh = el.offsetHeight;
      let left;
      let top;
      if (vw < 640) {
        left = Math.min(Math.max(p.x - bw / 2, 12), vw - bw - 12);
        top = p.y + p.size / 2 + 10;
        if (top + bh > vh - 12) top = p.y - p.size / 2 - 10 - bh;
      } else if (p.y - p.size / 2 - 10 - bh > NAV + 8) {
        // Anchors sit at the top of content blocks: the space above is usually empty.
        left = Math.min(Math.max(p.x - (p.x > vw * 0.55 ? bw - p.size / 2 : p.size / 2), 12), vw - bw - 12);
        top = p.y - p.size / 2 - 10 - bh;
      } else {
        left = p.x > vw * 0.55 ? p.x - p.size / 2 - 14 - bw : p.x + p.size / 2 + 14;
        top = Math.min(Math.max(p.y - p.size / 2, NAV + 8), vh - bh - 12);
      }
      el.style.transform = `translate3d(${Math.round(left)}px, ${Math.round(top)}px, 0)`;
    };
    placeBubble();
    gsap.ticker.add(placeBubble);
    if (!reduced) gsap.fromTo(bubbleRef.current, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: EASE.out });
    return () => gsap.ticker.remove(placeBubble);
  }, [bubble, tour.active, tour.index, reduced]);

  // No anchor on screen → nothing to talk from (the tour keeps its bubble).
  useEffect(() => {
    if (!spot && !tour.active) setBubble(null);
  }, [spot, tour.active]);

  /* ---------------------------------------------------------- reactions */

  // Hover inside the current section: expression only, with a short linger.
  useEffect(() => {
    if (!spot) return undefined;
    const scope = spot.el.closest("section, footer, main") ?? document.body;
    let t = 0;
    const onOver = (e) => {
      const el = e.target.closest?.(INTERACTIVE);
      const next = el && scope.contains(el) && !rootRef.current.contains(el) ? el.dataset.avatar || spot.hover || null : null;
      window.clearTimeout(t);
      if (next) setHot(next);
      else t = window.setTimeout(() => setHot(null), 450);
    };
    document.addEventListener("pointerover", onOver);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("pointerover", onOver);
      setHot(null);
    };
  }, [spot]);

  // Projects: a line on first hover of each; a cheer on open. Articles: a nod, then quiet.
  useEffect(() => {
    // Content scrolling under a still mouse also fires pointerover — only real pointer
    // movement counts as hovering a project.
    let moved = 0;
    const onMove = () => (moved = performance.now());
    const onOver = (e) => {
      if (performance.now() - moved > 120) return;
      const a = e.target.closest?.('a[href^="/projects/"]');
      if (!a || rootRef.current.contains(a)) return;
      const slug = a.getAttribute("href").split("/")[2];
      if (!slug || seen.current.projects.has(slug) || quietRef.current || bubbleOpen.current) return;
      seen.current.projects.add(slug);
      reactAvatar(BEHAVIOR.curious, 2500);
      say(PROJECT_LINES[slug] ?? PROJECT_FALLBACK);
    };
    const onClick = (e) => {
      if (rootRef.current.contains(e.target) || bubbleRef.current?.contains(e.target)) return;
      if (e.target.closest?.('a[href^="/projects/"]')) reactAvatar(BEHAVIOR.celebration, 1600);
      else if (e.target.closest?.('a[href^="/blog/"]') && !quietRef.current) say("Good pick. I'll keep quiet while you read.");
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("click", onClick);
    };
  }, [say]);

  // Lines from sections themselves (e.g. a capability was chosen).
  useEffect(() => {
    const onSay = ({ detail }) => {
      if (detail.context?.capability) lastCapability.current = detail.context.capability;
      if (quietRef.current || (bubbleOpen.current && bubbleRef.current?.dataset.kind === "panel")) return;
      if (detail.mood) reactAvatar(detail.mood, 2400);
      say(detail.text);
    };
    window.addEventListener(AVATAR_SAY_EVENT, onSay);
    return () => window.removeEventListener(AVATAR_SAY_EVENT, onSay);
  }, [say]);

  // Arrival lines: only after the character has settled in a section, once each.
  useEffect(() => {
    const section = spot?.section;
    if (!section || !isHome || !ARRIVAL[section] || seen.current.arrival.has(section)) return undefined;
    const t = window.setTimeout(() => {
      if (quietRef.current || bubbleOpen.current || tour.active) return;
      seen.current.arrival.add(section);
      say(ARRIVAL[section], { actions: true });
    }, ARRIVE_MS);
    return () => window.clearTimeout(t);
  }, [spot?.section, isHome, tour.active, say]);

  // Messages fade on their own; the panel waits for the visitor.
  useEffect(() => {
    if (bubble?.kind !== "message") return undefined;
    const t = window.setTimeout(() => setBubble(null), bubble.actions || bubble.link ? 7000 : 4500);
    return () => window.clearTimeout(t);
  }, [bubble]);

  // Escape or a click elsewhere closes the bubble.
  useEffect(() => {
    if (!bubble) return undefined;
    const onKey = (e) => e.key === "Escape" && setBubble(null);
    const onDown = (e) => {
      if (!rootRef.current.contains(e.target) && !bubbleRef.current?.contains(e.target)) setBubble(null);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [bubble]);

  /* ---------------------------------------------------------- the click */

  const onClick = (e) => {
    const now = Date.now();
    if (now - lastClick.current < 350) return; // no double-fire, no overlapping replies
    lastClick.current = now;
    if (!reduced) gsap.fromTo(bodyRef.current, { scale: 0.9 }, { scale: 1, duration: 0.45, ease: EASE.strong, overwrite: "auto" });
    if (bubble?.kind === "panel") {
      setBubble(null);
      return;
    }
    const n = clicks.current++;
    reactAvatar(n === 0 ? BEHAVIOR.greeting : BEHAVIOR.playful, 2200);
    setBubble({ kind: "panel", view: "main", text: n === 0 ? GREETING : PLAYFUL[(n - 1) % PLAYFUL.length] });
    // Keyboard activation: move focus into the conversation.
    if (e.detail === 0) window.setTimeout(() => bubbleRef.current?.querySelector("button, a")?.focus(), 60);
  };

  const section = spot?.section;
  const actions = [];
  if (SECTION_ABOUT[section]) {
    actions.push({
      label: "Tell me about this section",
      run: () => {
        reactAvatar(BEHAVIOR.thinking, 2200);
        setBubble((b) => ({ ...b, kind: "panel", text: SECTION_ABOUT[section], link: null }));
      },
    });
  }
  if (section === "work" || pathname.startsWith("/projects")) {
    actions.push({
      label: "Show me an interesting project",
      run: () => {
        const pool = FEATURED.map((s) => projects.find((p) => p.slug === s)).filter(Boolean);
        const p = pool[Math.floor(Math.random() * pool.length)];
        reactAvatar(BEHAVIOR.curious, 2200);
        setBubble((b) => ({ ...b, kind: "panel", text: `${p.title}: ${PROJECT_LINES[p.slug] ?? p.shortDesc}`, link: { to: `/projects/${p.slug}`, label: "Open the case study" } }));
      },
    });
  }
  if (section === "skills") {
    actions.push({
      label: "Find a related project",
      run: () => {
        const cap = capabilities.find((c) => c.id === lastCapability.current) ?? capabilities[0];
        const p = cap.projects[0];
        reactAvatar(BEHAVIOR.focused, 2200);
        setBubble((b) => ({ ...b, kind: "panel", text: p ? `${cap.label} in practice: ${p.title}.` : `${cap.label}: on the CV, no case study yet.`, link: p ? { to: p.href, label: "Open the case study" } : null }));
      },
    });
  }
  if (section === "contact") {
    actions.push({
      label: "Copy email",
      run: async () => {
        try {
          await navigator.clipboard.writeText(CV.contact.email);
          reactAvatar(BEHAVIOR.celebration, 1800);
          setBubble((b) => ({ ...b, kind: "panel", text: `Copied ${CV.contact.email}.`, link: { href: CV.contact.linkedin, label: "LinkedIn" } }));
        } catch {
          window.location.href = `mailto:${CV.contact.email}`;
        }
      },
    });
  }
  if (section === "top" && isHome) {
    actions.push({
      label: "Give me the 30-second tour",
      run: () => {
        setBubble(null);
        tour.start();
      },
    });
  }
  actions.push({ label: "Take me somewhere else", run: () => setBubble((b) => ({ ...b, kind: "panel", view: "places", text: "Where to?", link: null })) });
  actions.push({
    label: quiet ? "You can talk again" : "Be quiet for now",
    run: () => {
      const next = !quiet;
      setQuiet(next);
      store.set(QUIET_KEY, next ? "1" : "0");
      setBubble(next ? null : { kind: "message", text: "I'm back. I'll keep it short." });
    },
  });
  // An arrival message offers just the most relevant action.
  const offered = bubble?.actions ? actions.filter((a) => /interesting|related|Copy/.test(a.label)).slice(0, 1) : [];

  const goTo = (id, e) => {
    if (isHome) {
      e.preventDefault();
      scrollTo(`#${id}`);
      window.history.replaceState(null, "", `#${id}`);
    }
    setBubble(null);
  };

  const btn = "rounded-full border border-line px-3 py-1.5 text-left text-xs text-ink-dim transition-colors hover:border-ink-dim hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal";

  let content = null;
  if (tour.active) {
    content = (
      <>
        <p className="hud mb-1.5 tabular-nums">
          Tour {tour.index + 1}/{tour.total}
        </p>
        <p className="text-sm leading-snug text-ink">{tour.step.text}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {!reduced && (
            <button type="button" onClick={tour.togglePause} className={btn}>
              {tour.paused ? "Resume" : "Pause"}
            </button>
          )}
          <button type="button" onClick={tour.skip} className={btn}>
            {tour.index + 1 < tour.total ? (reduced ? "Next" : "Skip") : "Finish"}
          </button>
          <button type="button" onClick={tour.end} className={btn}>
            End tour
          </button>
        </div>
      </>
    );
  } else if (bubble) {
    const list = bubble.kind === "panel" ? (bubble.view === "places" ? [] : actions) : offered;
    content = (
      <>
        <p className="text-sm leading-snug text-ink">{bubble.text}</p>
        {bubble.link &&
          (bubble.link.to ? (
            <Link to={bubble.link.to} onClick={() => setBubble(null)} className="link-line mt-2 inline-block text-sm text-accent-ink">
              {bubble.link.label} →
            </Link>
          ) : (
            <a href={bubble.link.href} target="_blank" rel="noopener noreferrer" className="link-line mt-2 inline-block text-sm text-accent-ink">
              {bubble.link.label} ↗<span className="sr-only"> (opens in a new tab)</span>
            </a>
          ))}
        {bubble.view === "places" && (
          <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
            {DESTINATIONS.map((d) => (
              <li key={d.id}>
                <a href={`/#${d.id}`} onClick={(e) => goTo(d.id, e)} className="link-line text-sm text-ink-dim hover:text-ink">
                  {d.label}
                </a>
              </li>
            ))}
          </ul>
        )}
        {list.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {list.map((a) => (
              <button key={a.label} type="button" onClick={a.run} className={btn}>
                {a.label}
              </button>
            ))}
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div ref={rootRef} data-chrome className="pointer-events-none fixed left-0 top-0 z-[90] h-16 w-16 origin-center will-change-transform">
        <div ref={bodyRef} className="h-full w-full">
          <button
            type="button"
            onClick={onClick}
            aria-label={bubble?.kind === "panel" ? "Close the conversation" : "Talk to Aashik's sidekick"}
            aria-expanded={bubble?.kind === "panel"}
            aria-controls="companion-bubble"
            data-cursor="button"
            className="h-full w-full rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Avatar animation={spot || tour.active ? mood : undefined} className="h-full w-full" />
          </button>
        </div>
      </div>
      <div
        ref={bubbleRef}
        id="companion-bubble"
        data-chrome
        data-kind={bubble?.kind ?? ""}
        aria-live="polite"
        className={`fixed left-0 top-0 z-[91] w-[min(17rem,calc(100vw-1.5rem))] ${content ? "" : "hidden"}`}
      >
        {content && (
          <div className="rounded-2xl border border-line bg-panel/95 p-4 shadow-xl shadow-black/25 backdrop-blur-xl [@media(prefers-reduced-transparency:reduce)]:bg-panel">
            {content}
          </div>
        )}
      </div>
    </>
  );
};

export default Companion;
