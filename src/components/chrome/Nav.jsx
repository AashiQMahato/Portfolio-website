import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Moon, Search, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { gsap, EASE, ScrollTrigger, useActiveSection, useScrollToSection } from "../../motion";
import MobileMenu from "./MobileMenu";

/** Home sections reachable from the nav, in page order. */
export const NAV_SECTIONS = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "writing", label: "Writing" },
  { id: "contact", label: "Contact" },
];

/** Route → nav item that should read as "current" off the home page. */
const ROUTE_ACTIVE = { "/projects": "work", "/blog": "writing" };

const openPalette = () =>
  window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));

const Nav = () => {
  const { pathname } = useLocation();
  const onHome = pathname === "/";
  const scrollTo = useScrollToSection();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const listRef = useRef(null);
  const pillRef = useRef(null);
  const progressRef = useRef(null);

  const sectionActive = useActiveSection(onHome ? NAV_SECTIONS.map((s) => s.id) : []);
  const routeKey = Object.keys(ROUTE_ACTIVE).find((r) => pathname === r || pathname.startsWith(`${r}/`));
  const active = onHome ? sectionActive : ROUTE_ACTIVE[routeKey] ?? null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Page progress hairline — scrubbed, transform-only.
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => gsap.set(progressRef.current, { scaleX: self.progress }),
    });
    return () => st.kill();
  }, [pathname]);

  // Active indicator glides between items (starts from its live position,
  // so rapid section changes never jump).
  useLayoutEffect(() => {
    const pill = pillRef.current;
    const el = active && listRef.current?.querySelector(`[data-nav="${active}"]`);
    if (!el) {
      gsap.to(pill, { opacity: 0, duration: 0.25 });
      return;
    }
    gsap.to(pill, {
      x: el.offsetLeft,
      width: el.offsetWidth,
      opacity: 1,
      duration: 0.5,
      ease: EASE.out,
    });
  }, [active]);

  const go = (e, id) => {
    if (!onHome) return; // a real link to /#id — PageTransition handles it
    e.preventDefault();
    scrollTo(`#${id}`);
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <>
      <header
        data-chrome
        className={`fixed inset-x-0 top-0 z-[100] transition-[background-color,border-color,backdrop-filter] duration-500 ease-out ${
          scrolled
            ? "border-b border-line/70 bg-background/75 backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent"
        }`}
      >
        <nav
          aria-label="Primary"
          className={`shell flex items-center justify-between transition-[height] duration-500 ease-out ${
            scrolled ? "h-14" : "h-[var(--nav-h)]"
          }`}
        >
          <Link
            to="/"
            className="group flex items-center gap-3 text-[1.05rem] font-semibold tracking-[-0.03em] text-ink"
          >
            <img
              src="/logo.svg"
              alt="Aashik Kumar Mahato, home"
              width="905"
              height="585"
              className="h-8 w-auto transition-transform duration-500 ease-out group-hover:-translate-y-0.5"
            />
            <span className="hud hidden lg:inline">Engineer / Developer</span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <ul ref={listRef} className="relative flex items-center">
              <span
                ref={pillRef}
                aria-hidden="true"
                className="absolute left-0 top-1/2 h-8 -translate-y-1/2 rounded-full bg-ink/[0.07] opacity-0"
              />
              {NAV_SECTIONS.map(({ id, label }) => (
                <li key={id}>
                  <a
                    href={`/#${id}`}
                    data-nav={id}
                    onClick={(e) => go(e, id)}
                    aria-current={active === id ? (onHome ? "location" : "page") : undefined}
                    className={`relative block rounded-full px-3.5 py-1.5 text-sm transition-colors duration-300 ${
                      active === id ? "text-ink" : "text-ink-dim hover:text-ink"
                    }`}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>

            <span aria-hidden="true" className="h-4 w-px bg-line" />

            <div className="flex items-center gap-1">
              <Link
                to="/resume"
                className="rounded-full px-3 py-1.5 text-sm text-ink-dim transition-colors hover:text-ink"
              >
                Résumé
              </Link>
              <button
                type="button"
                onClick={openPalette}
                aria-label="Open command palette ⌘K"
                aria-keyshortcuts="Meta+K Control+K"
                className="flex h-9 items-center gap-1.5 rounded-full px-3 text-ink-dim transition-colors hover:text-ink"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                <kbd className="font-mono text-[11px]">⌘K</kbd>
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                className="grid h-9 w-9 place-items-center rounded-full text-ink-dim transition-colors hover:text-ink"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Moon className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="flex h-11 items-center gap-3 rounded-full pl-3 text-sm font-medium text-ink md:hidden"
          >
            Menu
            <span aria-hidden="true" className="flex w-5 flex-col gap-[5px]">
              <span className="h-px w-full bg-ink" />
              <span className="h-px w-3/5 self-end bg-ink" />
            </span>
          </button>
        </nav>

        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px">
          <div ref={progressRef} className="h-px w-full origin-left scale-x-0 bg-signal" />
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        sections={NAV_SECTIONS}
        active={active}
        onSection={(id) => (onHome ? scrollTo(`#${id}`) : null)}
        onHome={onHome}
      />
    </>
  );
};

export default Nav;
