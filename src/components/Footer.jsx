import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { CV } from "../data/portfolioData";
import {
  animate,
  stagger,
  ANIME,
  usePrefersReducedMotion,
  useScrollToSection,
} from "../motion";
import { ClockBadge, FrameLabel } from "./canvas";

const SECTION_LINKS = [
  { label: "About", hash: "#about" },
  { label: "Skills", hash: "#skills" },
  { label: "Work", hash: "#work" },
  { label: "Contact", hash: "#contact" },
];

const PAGE_LINKS = [
  { label: "Projects", path: "/projects" },
  { label: "Blog", path: "/blog" },
  { label: "Dashboard", path: "/developer-dashboard" },
  { label: "Timeline", path: "/timeline" },
  { label: "Now", path: "/now" },
  { label: "Resume", path: "/resume" },
];

const SOCIAL = [
  { href: CV.contact.github, label: "GitHub" },
  { href: CV.contact.linkedin, label: "LinkedIn" },
  { href: "https://www.instagram.com/aashiq__mahato/", label: "Instagram" },
];

const WORDMARK = "aashiq.dev";

const Footer = () => {
  const { pathname } = useLocation();
  const scrollTo = useScrollToSection();
  const onHome = pathname === "/";
  const wordmarkRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  // Letter-by-letter cascade the first time the wordmark scrolls into view
  // (IntersectionObserver detects, anime performs).
  useEffect(() => {
    const el = wordmarkRef.current;
    if (!el || reduced) return undefined;
    let anim = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        anim = animate(el.querySelectorAll("[data-footer-letter]"), {
          opacity: [0, 1],
          translateY: ["0.35em", "0"],
          rotate: [8, 0],
          duration: ANIME.dur.md,
          ease: ANIME.ease.pop,
          delay: stagger(45),
        });
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      anim?.pause();
    };
  }, [reduced]);

  const colHeading =
    "mb-5 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim";
  const linkClass =
    "block w-fit whitespace-nowrap font-mono text-xs uppercase tracking-[0.1em] text-ink-dim transition-colors hover:text-accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70";

  return (
    <footer className="relative z-10 px-3 pb-4 md:px-6">
      <div className="panel mx-auto max-w-6xl overflow-hidden rounded-3xl">
        {/* Extra bottom clearance on small screens so the fixed FABs
            (terminal, chatbot) never sit on top of footer content */}
        <div className="px-6 pb-40 pt-10 sm:pb-16 md:px-10">
          <FrameLabel index="99" name="footer.frame" />

          <div className="mt-10 grid gap-12 md:grid-cols-12">
            {/* Identity + CTA */}
            <div className="md:col-span-5">
              <p className="font-display text-2xl font-bold leading-tight tracking-tight text-ink md:text-3xl">
                Have an idea worth building?
              </p>
              <a
                href={`mailto:${CV.contact.email}`}
                className="group mt-5 inline-flex items-center gap-2 border-b border-signal/50 pb-1 font-mono text-xs uppercase tracking-[0.15em] text-accent-ink transition-colors hover:border-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
              >
                {CV.contact.email}
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </a>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dim">
                {CV.contact.location} · UTC+5:45
              </p>
              <ClockBadge className="mt-4" />
            </div>

            {/* Link groups share the remaining columns so none get squeezed */}
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7">
              <nav aria-label="Sections">
                <p className={colHeading}>Sections</p>
                <ul className="flex flex-col gap-3">
                  {SECTION_LINKS.map((link) => (
                    <li key={link.hash}>
                      <Link
                        to={{ pathname: "/", hash: link.hash }}
                        onClick={() => onHome && scrollTo(link.hash)}
                        className={linkClass}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <nav aria-label="Pages">
                <p className={colHeading}>Pages</p>
                <ul className="flex flex-col gap-3">
                  {PAGE_LINKS.map((link) => (
                    <li key={link.path}>
                      <Link to={link.path} className={linkClass}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <nav aria-label="Social">
                <p className={colHeading}>Connect</p>
                <ul className="flex flex-col gap-3">
                  {SOCIAL.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClass}
                      >
                        {social.label} <span aria-hidden="true">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          {/* Giant letter-by-letter wordmark */}
          <p
            ref={wordmarkRef}
            aria-label={WORDMARK}
            className="mt-14 select-none whitespace-nowrap text-center font-display font-bold leading-none tracking-tight text-ink/90"
            style={{ fontSize: "clamp(2.5rem, 9.5vw, 8rem)" }}
          >
            {WORDMARK.split("").map((ch, i) => (
              <span key={i} aria-hidden="true" data-footer-letter className="inline-block">
                {ch}
              </span>
            ))}
          </p>

          {/* Baseline */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">
              © {new Date().getFullYear()} {CV.name} — made by hand, not a template
            </p>
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ember" />
              </span>
              2 cursors online
            </p>
            <button
              type="button"
              onClick={() => scrollTo("body")}
              className="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim transition-colors hover:text-accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
            >
              Back to top
              <ArrowUp
                className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
