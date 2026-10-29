import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap, EASE, usePrefersReducedMotion, useScrollToSection } from "../../motion";
import { CV, projects } from "../../data/portfolioData";
import { capabilities } from "../../data/stack";
import Avatar from "./Avatar";
import useAvatarMood from "./useAvatarMood";
import useAvatarTour from "./useAvatarTour";
import {
  AVATAR_SAY_EVENT,
  BEHAVIOR,
  CHOICE_LINE,
  DESTINATIONS,
  GREETING,
  PLAYFUL,
  PROJECT_FALLBACK,
  PROJECT_LINES,
  SECTION_ABOUT,
  TIPS,
  TOUCH_TIPS,
  reactAvatar,
} from "./mood";

const BASE = 64; // px the avatar renders at; scaled to each anchor's box
const FOCUS = 0.42; // anchors compete for this line of the viewport
const NAV = 72; // fixed header height
const SWITCH_MS = 120; // a new anchor must stay best this long (a flick past a section skips it)
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
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const MAX_SPEED = 1.8; // px per ms
const TIP_MS = 5500; // how long a section tip stays up
const sectionOf = (el) => {
  const s = el.closest("[data-tip-section], section[id]");
  return s?.dataset.tipSection ?? s?.id ?? (el.closest("footer") ? "footer" : "page");
};
const FEATURED = ["studio-tools", "automated-attendance-system", "cable-network-website", "smart-school-management", "ultrasonic-blind-stick"];

/**
 * The site's one character. It has no fixed home: it settles into whichever
 * layout anchor (<SectionAvatar>) sits nearest the reading line and glides
 * there as you scroll — riding the screen edge between sections, leaning
 * into the move — and takes that anchor's mood.
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
  const tipRef = useRef(null);
  const posRef = useRef(null); // live avatar box, shared with the bubble placement

  const [spot, setSpot] = useState(null); // { el, section, mood, hover }
  const [motionMood, setMotionMood] = useState(null); // excited / curious / searching while travelling
  const [hot, setHot] = useState(null);
  const [bubble, setBubble] = useState(null); // { kind: "panel", text, view?, link? } — the conversation the visitor opened
  const [tip, setTip] = useState(null); // { section, text, kind: "tip" | "say" } — the chat bubble beside the character
  const [typing, setTyping] = useState(false);
  const [quiet, setQuiet] = useState(() => store.get(QUIET_KEY) === "1");
  const clicks = useRef(0);
  const lastClick = useRef(0);
  const lastCapability = useRef(capabilities[0].id);
  const seen = useRef({ tips: new Set(), projects: new Set() });
  const quietRef = useRef(quiet);
  quietRef.current = quiet;
  const bubbleOpen = useRef(false);
  bubbleOpen.current = Boolean(bubble);

  const tour = useAvatarTour({ scrollTo, reduced });
  const mood = useAvatarMood({ base: spot?.mood, hot, panelOpen: bubble?.kind === "panel", override: tour.step?.mood ?? motionMood });

  // Short lines go in the chat bubble beside the character (section: null — they leave with the section).
  const say = useCallback((text) => setTip({ section: null, text, kind: "say" }), []);

  /* ---------------------------------------------------------- positioning */
  useEffect(() => {
    const root = rootRef.current;
    const body = bodyRef.current;
    const st = { anchor: null, cand: null, candAt: 0, shown: false, lastPick: 0, pos: null, v: { x: 0, y: 0 }, stride: 0, tilt: 0, motion: null, px: -999, py: -999 };
    const onPointer = (e) => {
      st.px = e.clientX;
      st.py = e.clientY;
    };
    // A happy little landing when a trip ends.
    const onArrive = () => {
      reactAvatar(BEHAVIOR.greeting, 1200);
      gsap.fromTo(body, { scaleX: 1.12, scaleY: 0.88 }, { scaleX: 1, scaleY: 1, duration: 0.6, ease: "elastic.out(1, 0.45)", overwrite: "auto" });
    };

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
    // Where the character wants to be: its spot, but kept on screen — when the
    // spot scrolls away it rides the viewport edge until the next spot takes over.
    const target = (a) => {
      const m = measure(a);
      const half = (BASE * m.s) / 2;
      const x = clamp(m.x, half + 12, window.innerWidth - half - 12);
      const y = clamp(m.y, NAV + half + 12, window.innerHeight - half - 96); // 96: clear of the chat button
      return { x, y, s: m.s, riding: x !== m.x || y !== m.y };
    };
    // Spring physics (per ms): a little momentum and overshoot, so moves read as a body travelling.
    const OMEGA = 0.009; // stiffness: ~0.7 s to settle a long move
    const ZETA = 0.78; // damping ratio: <1 = slight, soft overshoot
    const place = (dt) => {
      if (!st.anchor) return;
      const t = target(st.anchor);
      if (!st.pos || reduced) {
        st.pos = { x: t.x, y: t.y, s: t.s };
        st.v = { x: 0, y: 0 };
      } else {
        const v = st.v;
        for (const ax of ["x", "y"]) {
          v[ax] += ((t[ax] - st.pos[ax]) * OMEGA * OMEGA - 2 * ZETA * OMEGA * v[ax]) * dt;
        }
        // Speed cap: long cross-screen trips become an even glide rather than a dart.
        const speed = Math.hypot(v.x, v.y);
        if (speed > MAX_SPEED) {
          v.x *= MAX_SPEED / speed;
          v.y *= MAX_SPEED / speed;
        }
        st.pos.x += v.x * dt;
        st.pos.y += v.y * dt;
        st.pos.s += (t.s - st.pos.s) * (1 - Math.exp(-dt / 200));
      }
      const { x, y, s } = st.pos;
      const speed = Math.hypot(st.v.x, st.v.y);
      let tf = `translate3d(${x - BASE / 2}px, ${y - BASE / 2}px, 0)`;
      if (!reduced) {
        // A hop rhythm tied to distance travelled, so it bounds along rather than slides.
        st.stride = (st.stride + speed * dt * 0.012) % Math.PI;
        const hop = speed > 0.12 ? -Math.sin(st.stride) * Math.min(speed * 7, 7) : 0;
        // Stretch along the direction of travel, squash across it (volume-preserving).
        const stretch = 1 + Math.min(speed * 0.12, 0.2);
        const ang = (Math.atan2(st.v.y, st.v.x) * 180) / Math.PI;
        // Lean into the move; at rest, lean a little toward a nearby pointer.
        const near = Math.hypot(st.px - x, st.py - y) < 180;
        const tilt = speed > 0.05 ? clamp(st.v.x * 14, -14, 14) : near ? clamp((st.px - x) / 18, -9, 9) : 0;
        st.tilt += (tilt - st.tilt) * (1 - Math.exp(-dt / 120));
        tf += ` translateY(${hop}px) rotate(${ang}deg) scale(${stretch}, ${1 / stretch}) rotate(${-ang}deg) rotate(${st.tilt}deg)`;
      }
      root.style.transform = `${tf} scale(${s})`;
      posRef.current = { x, y, size: BASE * s };

      // Moods from motion — React hears only the transitions.
      const riding = t.riding;
      const moving = speed > 0.08 || Math.hypot(t.x - x, t.y - y) > 24;
      const next = reduced ? null : riding ? "searching" : moving ? (speed > 0.9 ? "excited" : "curious") : null;
      if (next !== st.motion) {
        // Celebrate only reaching a new section, not every pause in scrolling.
        if (!next && st.arrivedAt !== sectionOf(st.anchor)) {
          st.arrivedAt = sectionOf(st.anchor);
          if (st.motion) onArrive();
        }
        st.motion = next;
        setMotionMood(next);
      }
    };
    const switchTo = (a) => {
      st.anchor = a;
      if (!a) {
        show(false);
        st.pos = null;
        posRef.current = null;
        setSpot(null);
        return;
      }
      setSpot({ el: a, section: sectionOf(a), mood: a.dataset.mood, hover: a.dataset.hover });
      if (!st.shown) {
        st.pos = null; // first appearance: start on the spot, no glide in from the corner
        show(true);
      }
    };
    const tick = (time, deltaTime) => {
      const now = performance.now();
      if (now - st.lastPick > 150) {
        st.lastPick = now;
        const best = pick();
        // Nothing on screen right now (between sections): keep the current spot and ride the edge.
        if (!best) {
          if (st.anchor && !st.anchor.isConnected) switchTo(null);
          st.cand = null;
        } else if (best === st.anchor) st.cand = null;
        else if (best !== st.cand) {
          st.cand = best;
          st.candAt = now;
        } else if (now - st.candAt > SWITCH_MS) {
          st.cand = null;
          switchTo(best);
        }
      }
      place(Math.min(deltaTime, 50));
    };
    gsap.set(body, { autoAlpha: 0, scale: 0.6 });
    gsap.ticker.add(tick);
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", onPointer);
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
      else if (e.target.closest?.('a[href="/resume"], a[href$=".pdf"]') && !quietRef.current) {
        reactAvatar(BEHAVIOR.celebration, 1600);
        say(CHOICE_LINE);
      }
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

  // Section tips: once the character has settled in a section, once each per visit.
  useEffect(() => {
    const section = spot?.section;
    if (!section || !isHome || !TIPS[section] || seen.current.tips.has(section)) return undefined;
    // Settle first; if a message is still up, wait for it rather than talking over it.
    let t = 0;
    const attempt = () => {
      if (quietRef.current || tour.active) return;
      if (bubbleOpen.current) {
        t = window.setTimeout(attempt, 700);
        return;
      }
      seen.current.tips.add(section);
      const touch = window.matchMedia("(hover: none)").matches;
      setTip({ section, text: (touch && TOUCH_TIPS[section]) || TIPS[section], kind: "tip" });
    };
    t = window.setTimeout(attempt, ARRIVE_MS);
    return () => window.clearTimeout(t);
  }, [spot?.section, isHome, tour.active]);

  // A tip belongs to its section and steps aside for anything bigger.
  useEffect(() => {
    setTip((t) => (t && t.section !== spot?.section ? null : t));
  }, [spot?.section]);
  useEffect(() => {
    if (bubble || tour.active || quiet) setTip(null);
  }, [bubble, tour.active, quiet]);
  useEffect(() => {
    if (!tip) return undefined;
    // A beat of "typing" first, like a chat message arriving.
    setTyping(!reduced);
    const k = window.setTimeout(() => setTyping(false), reduced ? 0 : 550);
    const t = window.setTimeout(() => setTip(null), TIP_MS + (reduced ? 0 : 550));
    const onKey = (e) => e.key === "Escape" && setTip(null);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(k);
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [tip, reduced]);

  // The tip sits right beside the character, its tail pointing back at it.
  useEffect(() => {
    const el = tipRef.current;
    if (!tip || !el) return undefined;
    const GAP = 12;
    const placeTip = () => {
      const p = posRef.current;
      if (!p) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const bw = el.offsetWidth;
      const bh = el.offsetHeight;
      const r = p.size / 2;
      let side = p.x > vw * 0.55 ? "left" : "right";
      let left = side === "right" ? p.x + r + GAP : p.x - r - GAP - bw;
      let top = p.y - bh / 2;
      if (left < 8 || left + bw > vw - 8) {
        // No room beside it (phones): above, or below when it hugs the header.
        side = p.y - r - GAP - bh > NAV + 8 ? "top" : "bottom";
        left = p.x - bw / 2;
        top = side === "top" ? p.y - r - GAP - bh : p.y + r + GAP;
      }
      left = clamp(left, 8, vw - bw - 8);
      top = clamp(top, NAV + 8, vh - bh - 8);
      el.dataset.side = side;
      // Tail offset along the bubble edge, aimed at the character's centre.
      const along = side === "left" || side === "right" ? clamp(p.y - top, 14, bh - 14) : clamp(p.x - left, 16, bw - 16);
      el.style.setProperty("--tail", `${Math.round(along)}px`);
      el.style.transform = `translate3d(${Math.round(left)}px, ${Math.round(top)}px, 0)`;
    };
    placeTip();
    gsap.ticker.add(placeTip);
    const card = el.firstElementChild;
    if (!reduced && card) {
      const origin = { left: "100% 50%", right: "0% 50%", top: "50% 100%", bottom: "50% 0%" }[el.dataset.side];
      gsap.fromTo(card, { autoAlpha: 0, scale: 0.8, transformOrigin: origin }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(1.8)" });
    }
    return () => gsap.ticker.remove(placeTip);
  }, [tip, reduced]);

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
    setTip(null);
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
      primary: true,
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
      primary: true,
      run: () => {
        const cap = capabilities.find((c) => c.id === lastCapability.current) ?? capabilities[0];
        const p = cap.projects[0];
        reactAvatar(BEHAVIOR.focused, 2200);
        setBubble((b) => ({ ...b, kind: "panel", text: p ? `${cap.label} in practice: ${p.title}.` : `${cap.label}: on the CV, no case study yet.`, link: p ? { to: p.href, label: "Open the case study" } : null }));
      },
    });
  }
  if (section === "resume-cta") {
    actions.push({ label: "View résumé", primary: true, to: "/resume" });
    actions.push({ label: "Download CV", primary: true, href: "/AashikKumarMahatoResume.pdf", download: "AashikKumarMahatoResume.pdf" });
  }
  if (section === "footer" && isHome) {
    actions.push({
      label: "Back to the top",
      primary: true,
      run: () => {
        setBubble(null);
        scrollTo("#top");
      },
    });
  }
  if (section === "contact") {
    actions.push({
      label: "Copy email",
      primary: true,
      run: async () => {
        try {
          await navigator.clipboard.writeText(CV.contact.email);
          reactAvatar(BEHAVIOR.celebration, 1800);
          setBubble((b) => ({ ...b, kind: "panel", text: `Copied ${CV.contact.email}.`, link: null }));
        } catch {
          // No clipboard access: never claim a copy — open the mail app instead.
          window.location.href = `mailto:${CV.contact.email}`;
        }
      },
    });
    actions.push({ label: "Open LinkedIn ↗", primary: true, href: CV.contact.linkedin, external: true });
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
      setBubble(null);
      if (!next) say("I'm back. I'll keep it short.");
    },
  });

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
    const list = bubble.view === "places" ? [] : actions;
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
            {list.map((a) =>
              a.to ? (
                <Link key={a.label} to={a.to} onClick={() => setBubble(null)} className={btn}>
                  {a.label}
                </Link>
              ) : a.href ? (
                <a
                  key={a.label}
                  href={a.href}
                  onClick={() => setBubble(null)}
                  {...(a.external ? { target: "_blank", rel: "noopener noreferrer" } : { download: a.download })}
                  className={btn}
                >
                  {a.label}
                  {a.external && <span className="sr-only"> (opens in a new tab)</span>}
                </a>
              ) : (
                <button key={a.label} type="button" onClick={a.run} className={btn}>
                  {a.label}
                </button>
              ),
            )}
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
            onPointerEnter={(e) => {
              if (e.pointerType !== "mouse" || reduced) return;
              reactAvatar(BEHAVIOR.playful, 1500);
              gsap.fromTo(bodyRef.current, { scaleX: 1.1, scaleY: 0.9 }, { scaleX: 1, scaleY: 1, duration: 0.7, ease: "elastic.out(1, 0.4)", overwrite: "auto" });
            }}
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
        aria-live={bubble?.kind === "panel" || tour.active ? "polite" : "off"}
        className={`fixed left-0 top-0 z-[91] w-[min(17rem,calc(100vw-1.5rem))] ${content ? "" : "hidden"}`}
      >
        {content && (
          <div className="rounded-2xl border border-line bg-panel/95 p-4 shadow-xl shadow-black/25 backdrop-blur-xl [@media(prefers-reduced-transparency:reduce)]:bg-panel">
            {content}
          </div>
        )}
      </div>
      {/* Section tip: small, beside the character; a click opens the full conversation. */}
      <div ref={tipRef} data-chrome className={`companion-tip fixed left-0 top-0 z-[91] w-max max-w-[min(15rem,calc(100vw-1rem))] ${tip ? "" : "hidden"}`}>
        {tip && (
          <button
            type="button"
            onClick={onClick}
            data-cursor="button"
            className="companion-tip-card relative block rounded-2xl border px-3.5 py-2.5 text-left text-[0.8125rem] leading-snug text-ink shadow-lg backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3d8bfd]"
          >
            {tip.kind === "tip" && <span className="mb-0.5 block font-mono text-[0.625rem] uppercase tracking-[0.16em] text-[#7fb2ff]">Tip</span>}
            {typing ? (
              <span aria-hidden="true" className="flex h-[1.15rem] items-center gap-1 px-0.5">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="companion-typing-dot h-1.5 w-1.5 rounded-full bg-[#7fb2ff]" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </span>
            ) : (
              tip.text
            )}
            {typing && <span className="sr-only">{tip.text}</span>}
            <span className="sr-only"> — open the sidekick&apos;s menu</span>
            <span aria-hidden="true" className="companion-tip-tail" />
          </button>
        )}
      </div>
    </>
  );
};

export default Companion;
