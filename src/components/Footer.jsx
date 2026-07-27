import { Link, useLocation } from "react-router-dom";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { CV } from "../data/portfolioData";
import { useScrollToSection } from "../motion";

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

const Footer = () => {
  const { pathname } = useLocation();
  const scrollTo = useScrollToSection();
  const onHome = pathname === "/";

  const colHeading =
    "mb-5 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim";
  const linkClass =
    "block w-fit whitespace-nowrap font-mono text-xs uppercase tracking-[0.1em] text-ink-dim transition-colors hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60";

  return (
    <footer className="relative border-t border-line bg-background px-5 md:px-10 lg:pl-28 lg:pr-16">
      {/* Extra bottom clearance on small screens so the fixed FABs
          (terminal, chatbot) never sit on top of footer content */}
      <div className="mx-auto max-w-6xl pb-40 pt-16 sm:pb-28">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Identity + CTA */}
          <div className="md:col-span-5">
            <p className="font-mono text-sm tracking-[0.18em] text-ink">
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-signal align-middle" aria-hidden="true" />
              AASHIQ<span className="text-ink-dim">.DEV</span>
            </p>
            <p className="mt-5 max-w-sm font-display text-2xl font-semibold leading-tight tracking-tight text-ink">
              Have a system that needs building?
            </p>
            <a
              href={`mailto:${CV.contact.email}`}
              className="group mt-5 inline-flex items-center gap-2 border-b border-signal/40 pb-1 font-mono text-xs uppercase tracking-[0.15em] text-signal transition-colors hover:border-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            >
              {CV.contact.email}
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
            </a>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dim">
              {CV.contact.location} · UTC+5:45
            </p>
          </div>

          {/* Link groups share the remaining columns so none get squeezed */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7">
          {/* Sections */}
          <nav aria-label="Sections">
            <p className={colHeading}>
              <span className="text-signal">{"//"}</span> Sections
            </p>
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

          {/* Pages */}
          <nav aria-label="Pages">
            <p className={colHeading}>
              <span className="text-signal">{"//"}</span> Pages
            </p>
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

          {/* Elsewhere */}
          <nav aria-label="Social">
            <p className={colHeading}>
              <span className="text-signal">{"//"}</span> Elsewhere
            </p>
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

        {/* Baseline */}
        {/* pl clears the fixed terminal FAB, which sits bottom-left below lg */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-line pl-12 pt-6 lg:pl-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">
            © {new Date().getFullYear()} {CV.name} — built with React, GSAP &amp; Three.js
          </p>
          <button
            type="button"
            onClick={() => scrollTo("body")}
            className="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim transition-colors hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            Back to top
            <ArrowUp className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 motion-reduce:transition-none" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
