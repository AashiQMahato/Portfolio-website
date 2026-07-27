import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Briefcase,
  Menu,
  Monitor,
  Moon,
  Search,
  Sun,
  X,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useRecruiterMode } from "../../context/RecruiterModeContext";
import { CV } from "../../data/portfolioData";
import { Magnetic, useActiveSection, useScrollToSection } from "../../motion";

export const HOME_SECTIONS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "testimonials", label: "Voices" },
  { id: "contact", label: "Contact" },
];

const ANCHOR_LINKS = [
  { hash: "#about", label: "About", sectionId: "about" },
  { hash: "#skills", label: "Skills", sectionId: "skills" },
  { hash: "#work", label: "Work", sectionId: "work" },
  { hash: "#contact", label: "Contact", sectionId: "contact" },
];

const ROUTE_LINKS = [
  { path: "/projects", label: "Projects" },
  { path: "/blog", label: "Blog" },
  { path: "/developer-dashboard", label: "Dashboard" },
  { path: "/now", label: "Now" },
  { path: "/timeline", label: "Timeline" },
  { path: "/resume", label: "Resume" },
];

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const themes = ["dark", "light", "system"];
  const idx = Math.max(0, themes.indexOf(theme));
  const iconMap = {
    dark: { Icon: Moon, label: "Dark" },
    light: { Icon: Sun, label: "Light" },
    system: { Icon: Monitor, label: "System" },
  };
  const { Icon, label } = iconMap[theme] || iconMap.dark;

  return (
    <button
      type="button"
      onClick={() => setTheme(themes[(idx + 1) % themes.length])}
      className="flex h-9 w-9 items-center justify-center border border-line bg-background/60 text-ink-dim transition-colors hover:border-ink-dim hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
      title={`Theme: ${label} (click to cycle)`}
      aria-label={`Theme toggle. Current: ${label}`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
};

/** Top navigation — mono "schematic" bar with current-section indication. */
const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { isRecruiterMode, toggleRecruiterMode } = useRecruiterMode();
  const scrollTo = useScrollToSection();
  const onHome = pathname === "/";
  const activeSection = useActiveSection(
    onHome ? HOME_SECTIONS.map((s) => s.id) : [],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle("overflow-hidden", menuOpen);
    return () => document.documentElement.classList.remove("overflow-hidden");
  }, [menuOpen]);

  const anchorClicked = (hash) => {
    setMenuOpen(false);
    if (onHome) scrollTo(hash);
  };

  const linkBase =
    "font-mono text-[11px] uppercase tracking-[0.2em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[60] border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
          scrolled || menuOpen
            ? "border-line/80 bg-background/85 backdrop-blur"
            : "border-transparent bg-transparent"
        }`}
        style={{
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:px-8">
          {/* Wordmark */}
          <Link
            to="/"
            onClick={() => onHome && scrollTo("body")}
            className="group flex items-center gap-2.5 font-mono text-sm tracking-[0.18em] text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            AASHIQ<span className="text-ink-dim group-hover:text-signal transition-colors">.DEV</span>
          </Link>

          {/* Desktop links */}
          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
            {ANCHOR_LINKS.map((link) => {
              const isActive = onHome && activeSection === link.sectionId;
              return (
                <Link
                  key={link.hash}
                  to={{ pathname: "/", hash: link.hash }}
                  onClick={() => anchorClicked(link.hash)}
                  aria-current={isActive ? "true" : undefined}
                  className={`${linkBase} ${
                    isActive ? "text-signal" : "text-ink-dim hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/blog"
              aria-current={pathname.startsWith("/blog") ? "page" : undefined}
              className={`${linkBase} ${
                pathname.startsWith("/blog")
                  ? "text-signal"
                  : "text-ink-dim hover:text-ink"
              }`}
            >
              Blog
            </Link>
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(
                  new KeyboardEvent("keydown", { key: "k", metaKey: true }),
                )
              }
              className="hidden h-9 items-center gap-2 border border-line bg-background/60 px-3 font-mono text-[11px] tracking-widest text-ink-dim transition-colors hover:border-ink-dim hover:text-ink md:flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
              title="Search (Cmd+K)"
            >
              <Search className="h-3.5 w-3.5" aria-hidden="true" />
              ⌘K
            </button>

            <ThemeToggle />

            <button
              type="button"
              onClick={toggleRecruiterMode}
              className={`hidden h-9 w-9 items-center justify-center border transition-colors md:flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 ${
                isRecruiterMode
                  ? "border-signal/60 bg-signal/10 text-signal"
                  : "border-line bg-background/60 text-ink-dim hover:border-ink-dim hover:text-ink"
              }`}
              title="Toggle Recruiter Mode"
              aria-label="Toggle Recruiter Mode"
              aria-pressed={isRecruiterMode}
            >
              <Briefcase className="h-4 w-4" />
            </button>

            <Magnetic strength={0.2} className="hidden md:inline-block">
              <Link
                to={{ pathname: "/", hash: "#contact" }}
                onClick={() => anchorClicked("#contact")}
                className="flex h-9 items-center border border-signal px-4 font-mono text-[11px] uppercase tracking-[0.2em] text-signal transition-colors hover:bg-signal hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
              >
                Hire me
              </Link>
            </Magnetic>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center border border-line bg-background/60 text-ink-dim transition-colors hover:text-ink lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Recruiter banner */}
      {isRecruiterMode && (
        <div className="fixed inset-x-0 top-16 z-50 border-b border-signal/40 bg-background/95 px-4 py-2.5 backdrop-blur">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-x-6 gap-y-1 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-dim sm:justify-between">
            <span>
              <span className="text-signal">Recruiter mode</span> — simplified,
              scan-friendly layout
            </span>
            <span className="flex items-center gap-4">
              <span>{CV.experience.length}+ roles</span>
              <span className="hidden sm:inline">React · Node.js · Arduino</span>
              <Link to="/resume" className="text-signal underline underline-offset-4 hover:text-ink">
                View resume
              </Link>
            </span>
          </div>
        </div>
      )}

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 pt-24 backdrop-blur-md animate-fade-in lg:hidden">
          <nav
            aria-label="Mobile"
            className="mx-auto flex h-full max-w-[1440px] flex-col gap-1 overflow-y-auto px-6 pb-10"
            data-lenis-prevent
          >
            {ANCHOR_LINKS.map((link, i) => (
              <Link
                key={link.hash}
                to={{ pathname: "/", hash: link.hash }}
                onClick={() => anchorClicked(link.hash)}
                className="flex items-baseline gap-4 border-b border-line/60 py-4 text-ink hover:text-signal transition-colors"
              >
                <span className="font-mono text-[10px] tracking-[0.2em] text-signal">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-3xl font-semibold uppercase tracking-tight">
                  {link.label}
                </span>
              </Link>
            ))}
            <div className="mt-6 grid grid-cols-2 gap-x-6">
              {ROUTE_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-line/40 py-3 font-mono text-xs uppercase tracking-[0.2em] text-ink-dim hover:text-ink transition-colors"
                >
                  {link.label} <span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Nav;
