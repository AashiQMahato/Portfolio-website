import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap, EASE, useLenis, usePrefersReducedMotion } from "../../motion";
import { useTheme } from "../../context/ThemeContext";
import { CV } from "../../data/portfolioData";

/**
 * Full-screen mobile navigation. One timeline, played forward to open and
 * reversed to close, so the exit retraces the entrance exactly:
 * panel wipes down → items rise in sequence → active marker → secondary
 * links. It is a modal dialog: focus moves in, Tab is trapped, Escape and
 * any link close it, and the page behind stops scrolling.
 */
const MobileMenu = ({ open, onClose, sections, active, onSection, onHome }) => {
  const ref = useRef(null);
  const tl = useRef(null);
  const opener = useRef(null);
  const lenis = useLenis();
  const reduced = usePrefersReducedMotion();
  const { theme, toggleTheme } = useTheme();

  useGSAP(
    () => {
      tl.current = gsap
        .timeline({
          paused: true,
          defaults: { ease: EASE.strong },
          onReverseComplete: () => gsap.set(ref.current, { visibility: "hidden" }),
        })
        .set(ref.current, { visibility: "visible" })
        .fromTo(ref.current, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: EASE.inOut })
        .fromTo("[data-menu-item]", { yPercent: 110 }, { yPercent: 0, duration: 0.8, stagger: 0.06 }, "-=0.35")
        .fromTo("[data-menu-marker]", { scale: 0 }, { scale: 1, duration: 0.4 }, "-=0.45")
        .fromTo("[data-menu-secondary]", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05 }, "-=0.5");
    },
    { scope: ref },
  );

  useEffect(() => {
    const t = tl.current;
    if (!t) return undefined;
    if (open) {
      lenis?.stop();
      opener.current = document.activeElement;
      // Visible now (not on the timeline's first tick) so focus can land.
      gsap.set(ref.current, { visibility: "visible" });
      if (reduced) t.progress(1);
      else t.timeScale(1).play();
      ref.current.querySelector("a, button")?.focus({ preventScroll: true });
    } else if (t.progress() > 0) {
      lenis?.start();
      opener.current?.focus?.({ preventScroll: true });
      if (reduced) t.progress(0);
      else t.timeScale(1.4).reverse();
    }
    return undefined;
  }, [open, lenis, reduced]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab") return;
      const nodes = [...ref.current.querySelectorAll("a, button")];
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const pick = (e, id) => {
    if (onHome) {
      e.preventDefault();
      onClose();
      // Let the panel start retracting before the page moves beneath it.
      setTimeout(() => onSection(id), reduced ? 0 : 250);
    } else {
      onClose();
    }
  };

  return (
    <div
      ref={ref}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      data-chrome
      style={{ visibility: "hidden" }}
      className="fixed inset-0 z-[120] flex flex-col bg-background px-[var(--gutter)] pb-8 pt-5 md:hidden"
    >
      <div className="flex h-11 items-center justify-between">
        <span className="hud">Index</span>
        <button
          type="button"
          onClick={onClose}
          className="flex h-11 items-center gap-3 text-sm font-medium text-ink"
        >
          Close
          <span aria-hidden="true" className="relative block h-5 w-5">
            <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-ink" />
            <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-ink" />
          </span>
        </button>
      </div>

      <nav aria-label="Mobile" className="mt-12 flex-1">
        <ul className="space-y-1">
          {sections.map(({ id, label }, i) => (
            <li key={id} className="overflow-clip">
              <a
                href={`/#${id}`}
                onClick={(e) => pick(e, id)}
                data-menu-item
                aria-current={active === id ? "location" : undefined}
                className="flex items-baseline gap-4 py-1 text-[clamp(2.75rem,13vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-ink"
              >
                <span className="hud w-6 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                {label}
                <span
                  data-menu-marker
                  aria-hidden="true"
                  className={`h-2.5 w-2.5 self-center rounded-full bg-signal ${active === id ? "" : "hidden"}`}
                />
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="grid grid-cols-2 gap-y-3 border-t border-line pt-6 text-sm">
        <Link data-menu-secondary to="/resume" onClick={onClose} className="text-ink">Résumé</Link>
        <Link data-menu-secondary to="/blog" onClick={onClose} className="text-ink">Blog</Link>
        <a data-menu-secondary href={`mailto:${CV.contact.email}`} className="text-ink">Email</a>
        <a data-menu-secondary href={CV.contact.github} target="_blank" rel="noopener noreferrer" className="text-ink">GitHub ↗</a>
        <a data-menu-secondary href={CV.contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-ink">LinkedIn ↗</a>
        <button data-menu-secondary type="button" onClick={toggleTheme} className="text-left text-ink">
          {theme === "dark" ? "Light theme" : "Dark theme"}
        </button>
      </div>
    </div>
  );
};

MobileMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  sections: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string, label: PropTypes.string })).isRequired,
  active: PropTypes.string,
  onSection: PropTypes.func.isRequired,
  onHome: PropTypes.bool.isRequired,
};

export default MobileMenu;
