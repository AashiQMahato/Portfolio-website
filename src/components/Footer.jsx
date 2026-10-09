import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, EASE, Magnetic, useLenis, usePrefersReducedMotion } from "../motion";
import { CV } from "../data/portfolioData";
import { LocalTime } from "./ui";
import SectionAvatar from "./avatar/SectionAvatar";

const PAGES = [
  { label: "Projects", to: "/projects" },
  { label: "Writing", to: "/blog" },
  { label: "Résumé", to: "/resume" },
  { label: "Now", to: "/now" },
  { label: "Timeline", to: "/timeline" },
  { label: "GitHub activity", to: "/developer-dashboard" },
];

const SOCIAL = [
  { label: "GitHub", href: CV.contact.github },
  { label: "LinkedIn", href: CV.contact.linkedin },
  { label: "Email", href: `mailto:${CV.contact.email}` },
];

/**
 * Minimal but final: the full name set wall-to-wall (letters rise in as the
 * footer arrives), the role and place, live Kathmandu time, and a magnetic
 * back-to-top whose arrow exits upward on hover.
 */
const Footer = () => {
  const ref = useRef(null);
  const lenis = useLenis();
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.fromTo(
        "[data-foot-char]",
        { yPercent: 105 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: EASE.strong,
          stagger: 0.025,
          scrollTrigger: { trigger: "[data-foot-mark]", start: "top 95%", once: true },
        },
      );
    },
    { dependencies: [reduced], scope: ref },
  );

  const toTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    document.getElementById("main-content")?.focus({ preventScroll: true });
  };

  return (
    <footer ref={ref} className="relative overflow-clip border-t border-line pt-16">
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionAvatar mood="playful" hover="happy" className="mb-6 h-14 w-14 md:h-16 md:w-16" />
            <p className="text-lede text-ink">
              Electronics Engineer
              <br />
              <span className="text-ink-dim">+</span> Full-Stack Developer
            </p>
            <p className="hud mt-6 flex flex-wrap gap-x-4 gap-y-1">
              <span>Kathmandu, Nepal</span>
              <LocalTime className="text-ink" />
            </p>
          </div>

          <nav aria-label="Pages" className="md:col-span-3">
            <h2 className="hud mb-4">Pages</h2>
            <ul className="space-y-1">
              {PAGES.map((p) => (
                <li key={p.to}>
                  <Link to={p.to} className="link-line inline-block py-1.5 text-ink-dim hover:text-ink">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Elsewhere" className="md:col-span-2">
            <h2 className="hud mb-4">Elsewhere</h2>
            <ul className="space-y-1">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    {...(s.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="link-line inline-block py-1.5 text-ink-dim hover:text-ink"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex md:col-span-2 md:justify-end">
            <Magnetic strength={0.4}>
              <button
                type="button"
                onClick={toTop}
                data-cursor="button"
                className="group flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-full border border-line text-ink transition-colors duration-300 hover:border-signal hover:bg-signal hover:text-primary-foreground"
              >
                <span className="relative h-4 w-4 overflow-hidden" aria-hidden="true">
                  <ArrowUp className="absolute inset-0 h-4 w-4 transition-transform duration-500 ease-out group-hover:-translate-y-[140%]" />
                  <ArrowUp className="absolute inset-0 h-4 w-4 translate-y-[140%] transition-transform duration-500 ease-out group-hover:translate-y-0" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em]">Top</span>
              </button>
            </Magnetic>
          </div>
        </div>
      </div>

      <p
        data-foot-mark
        aria-hidden="true"
        className="mt-20 select-none whitespace-nowrap px-[var(--gutter)] text-center text-[clamp(2.2rem,8vw,10rem)] font-semibold leading-[0.8] tracking-[-0.055em] text-ink"
      >
        <span className="line-mask pb-[0.12em]">
          {"Aashik Kumar Mahato".split("").map((ch, i) => (
            <span key={i} data-foot-char className="inline-block">
              {ch === " " ? " " : ch}
            </span>
          ))}
          <span data-foot-char className="inline-block text-signal">.</span>
        </span>
      </p>

      {/* Right padding keeps the baseline clear of the floating chat button. */}
      <div className="shell flex flex-wrap items-center justify-between gap-4 border-t border-line py-6 pr-[calc(var(--gutter)+4rem)]">
        <p className="hud">© {new Date().getFullYear()} {CV.name}</p>
        <p className="hud">Designed &amp; built by hand — React, GSAP, Lenis</p>
      </div>
    </footer>
  );
};

export default Footer;
