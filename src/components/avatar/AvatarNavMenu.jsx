import { useRef } from "react";
import PropTypes from "prop-types";
import { useGSAP } from "@gsap/react";
import { gsap, EASE, usePrefersReducedMotion } from "../../motion";
import trapTab from "../../lib/trapTab";
import { DESTINATIONS } from "./mood";

const ROW = 40; // px per destination on the desktop arc
const WIDTH = 232;
const ANCHOR = 32; // avatar centre, measured from the panel's right edge
const BULGE = 38; // how far the arc swings left at its middle

/** Arc offset for row i: 0 at the ends, BULGE in the middle. */
const bulge = (i) => Math.sin((i / (DESTINATIONS.length - 1)) * Math.PI) * BULGE;

/**
 * The navigator's destinations. Desktop: a curved column of nodes joined by a
 * thin connector that runs down into the avatar. Mobile: a bottom sheet with
 * large rows. One timeline per layout plays forward to open and backward to
 * close, so a quick re-toggle reverses from wherever it is.
 */
const AvatarNavMenu = ({ open, wide, activeId, isHome, onNavigate, onHoverDest, onTour, onHide, onClose }) => {
  const ref = useRef(null);
  const tl = useRef(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const t = gsap.timeline({ paused: true });
      if (wide) {
        const path = ref.current.querySelector("[data-connector]");
        const len = path.getTotalLength();
        t.fromTo("[data-panel]", { autoAlpha: 0, y: 10, scale: 0.97 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.3, ease: EASE.out })
          .fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.55, ease: EASE.inOut }, 0.05)
          .fromTo("[data-node]", { opacity: 0, x: 10 }, { opacity: 1, x: 0, duration: 0.35, ease: EASE.out, stagger: { each: 0.035, from: "end" } }, 0.08)
          .fromTo("[data-active-dot]", { scale: 0 }, { scale: 1, duration: 0.4, ease: EASE.strong }, 0.35);
      } else {
        t.fromTo("[data-backdrop]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: "none" })
          .fromTo("[data-panel]", { autoAlpha: 0, yPercent: 100 }, { autoAlpha: 1, yPercent: 0, duration: 0.45, ease: EASE.expo }, 0)
          .fromTo("[data-node]", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, ease: EASE.out, stagger: 0.035 }, 0.12);
      }
      tl.current = t;
    },
    { dependencies: [wide], scope: ref, revertOnUpdate: true },
  );

  useGSAP(
    () => {
      const t = tl.current;
      if (!t) return;
      if (reduced) t.progress(open ? 1 : 0).pause();
      else if (open) t.timeScale(1).play();
      else t.timeScale(1.7).reverse();
    },
    { dependencies: [open, reduced, wide], scope: ref },
  );

  const onKeyDown = (e) => {
    const step = { ArrowDown: 1, ArrowUp: -1 }[e.key];
    if (step) {
      const items = [...ref.current.querySelectorAll("[data-dest]")];
      const i = items.indexOf(document.activeElement);
      if (i >= 0) {
        e.preventDefault();
        items[(i + step + items.length) % items.length].focus();
      }
    } else if (!wide) {
      trapTab(e, ref.current.querySelector("[data-panel]"));
    }
  };

  const link = (d, i) => {
    const on = d.id === activeId;
    return (
      <a
        data-dest
        href={`/#${d.id}`}
        aria-current={on ? "location" : undefined}
        tabIndex={open ? undefined : -1}
        onClick={(e) => onNavigate(d.id, e)}
        onPointerEnter={() => onHoverDest(d.id)}
        onPointerLeave={() => onHoverDest(null)}
        onFocus={() => onHoverDest(d.id)}
        onBlur={() => onHoverDest(null)}
        className={
          wide
            ? "group flex h-10 items-center justify-end gap-3 rounded-full pl-3 outline-none focus-visible:ring-1 focus-visible:ring-signal"
            : "group flex min-h-12 items-center justify-between gap-4 rounded-lg px-3 text-lg outline-none focus-visible:ring-1 focus-visible:ring-signal active:bg-panel"
        }
        style={wide ? { paddingRight: ANCHOR + bulge(i) - 6 } : undefined}
      >
        <span
          className={`transition-[color,transform] duration-300 ease-out ${
            on ? "text-ink" : "text-ink-dim group-hover:text-ink group-focus-visible:text-ink"
          } ${wide ? "text-sm group-hover:-translate-x-1" : ""}`}
        >
          {d.label}
        </span>
        <span className="relative grid h-3 w-3 shrink-0 place-items-center" aria-hidden="true">
          <span className={`absolute inset-0 rounded-full border transition-colors duration-300 ${on ? "border-signal" : "border-ink-faint group-hover:border-ink"}`} />
          {on && <span data-active-dot className="h-1.5 w-1.5 rounded-full bg-signal" />}
        </span>
      </a>
    );
  };

  const actions = (
    <div data-node className={`flex gap-4 ${wide ? "justify-end pb-2 pr-3" : "justify-between px-3 pt-2"}`}>
      {isHome && (
        <button type="button" tabIndex={open ? undefined : -1} onClick={onTour} className="hud rounded-sm text-ink hover:text-signal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal">
          Take the tour
        </button>
      )}
      <button type="button" tabIndex={open ? undefined : -1} onClick={onHide} className="hud rounded-sm hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal">
        Hide guide
      </button>
    </div>
  );

  if (wide) {
    const pts = DESTINATIONS.map((_, i) => `${WIDTH - ANCHOR - bulge(i)},${i * ROW + ROW / 2}`);
    const h = DESTINATIONS.length * ROW;
    return (
      <div ref={ref} onKeyDown={onKeyDown} className="pointer-events-none absolute bottom-full right-0 mb-3">
        <nav
          id="avatar-nav"
          data-panel
          aria-label="Guide"
          style={{ width: WIDTH, visibility: "hidden" }}
          className={`relative rounded-2xl border border-line bg-background/80 pb-1 pt-3 shadow-2xl shadow-black/30 backdrop-blur-xl backdrop-saturate-150 [@media(prefers-reduced-transparency:reduce)]:bg-background ${
            open ? "pointer-events-auto" : ""
          }`}
        >
          {actions}
          <div className="relative" style={{ height: h }}>
            <svg aria-hidden="true" width={WIDTH} height={h + 28} className="pointer-events-none absolute left-0 top-0 overflow-visible">
              <polyline
                data-connector
                points={[...pts, `${WIDTH - ANCHOR},${h + 28}`].join(" ")}
                fill="none"
                stroke="rgb(var(--line))"
                strokeWidth="1"
              />
            </svg>
            <ul className="relative">
              {DESTINATIONS.map((d, i) => (
                <li key={d.id} data-node>
                  {link(d, i)}
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div ref={ref} onKeyDown={onKeyDown} className={`fixed inset-0 z-[125] ${open ? "" : "pointer-events-none"}`}>
      <div data-backdrop aria-hidden="true" onClick={onClose} style={{ visibility: "hidden" }} className="absolute inset-0 bg-background/70" />
      <nav
        id="avatar-nav"
        data-panel
        role="dialog"
        aria-modal="true"
        aria-label="Guide"
        style={{ visibility: "hidden" }}
        className="absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-line bg-panel px-[var(--gutter)] pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3"
      >
        <span aria-hidden="true" className="mx-auto mb-4 block h-1 w-10 rounded-full bg-line" />
        <p className="hud px-3 pb-2">Jump to</p>
        <ul>
          {DESTINATIONS.map((d, i) => (
            <li key={d.id} data-node>
              {link(d, i)}
            </li>
          ))}
        </ul>
        <div className="mt-3 border-t border-line pt-3">{actions}</div>
      </nav>
    </div>
  );
};

AvatarNavMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  wide: PropTypes.bool.isRequired,
  activeId: PropTypes.string,
  isHome: PropTypes.bool.isRequired,
  onNavigate: PropTypes.func.isRequired,
  onHoverDest: PropTypes.func.isRequired,
  onTour: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AvatarNavMenu;
