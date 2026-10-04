import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, Reveal, SplitText, usePrefersReducedMotion } from "../../motion";
import { CV, siteConfig } from "../../data/portfolioData";
import CopyEmail from "./CopyEmail";
import ContactForm from "./ContactForm";

const LINKS = [
  { label: "LinkedIn", href: CV.contact.linkedin, external: true },
  { label: "GitHub", href: CV.contact.github, external: true },
  { label: "Instagram", href: "https://www.instagram.com/aashiq__mahato/", external: true },
  { label: "Résumé (PDF)", href: "/AashikKumarMahatoResume.pdf", external: false },
];

/**
 * The ending. A statement that drifts sideways with scroll (the last
 * scroll-linked type on the page), the email as the primary action, then a
 * quieter form for people who prefer one. Availability and response time
 * are stated plainly.
 */
const Contact = () => {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.matchMedia().add("(min-width: 768px)", () => {
        gsap.fromTo(
          "[data-contact-drift]",
          { xPercent: 4 },
          {
            xPercent: -4,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    { dependencies: [reduced], scope: ref },
  );

  return (
    <section ref={ref} id="contact" aria-labelledby="contact-title" className="relative overflow-clip py-[clamp(7rem,16vh,13rem)]">
      <div className="shell">
        <Reveal variant="clip" className="mb-10 flex items-center gap-4 border-t border-line pt-4">
          <span className="hud tabular-nums text-ink">(08)</span>
          <span className="hud">Contact</span>
          <span className="hud ml-auto flex items-center gap-2 text-ink">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
            {siteConfig.availability}
          </span>
        </Reveal>

        <div data-contact-drift>
          <Reveal variant="lines">
            <SplitText
              as="h2"
              id="contact-title"
              lines={["Let's build", "something useful."]}
              className="text-display text-ink"
              lineClassName="[&:nth-child(2)]:pl-[8vw]"
            />
          </Reveal>
        </div>

        <div className="mt-[clamp(4rem,10vh,7rem)] grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="mb-6 max-w-md text-ink-dim">
              Freelance build, contract work or a full-time role — IoT, embedded or the React
              ecosystem. Email is fastest; I usually reply within 24 hours (Kathmandu, UTC+5:45).
            </p>
            <CopyEmail email={CV.contact.email} />

            <ul className="mt-14 grid grid-cols-2 border-t border-line sm:grid-cols-4">
              {LINKS.map((l) => (
                <li key={l.label} className="border-b border-line sm:border-b-0">
                  <a
                    href={l.href}
                    {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : { download: "AashikKumarMahatoResume.pdf" })}
                    className="group flex min-h-11 items-center gap-2 py-5 pr-4 text-ink"
                  >
                    <span className="link-line">{l.label}</span>
                    <span aria-hidden="true" className="text-ink-dim transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal">
                      {l.external ? "↗" : "↓"}
                    </span>
                    {l.external && <span className="sr-only">(opens in a new tab)</span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <h3 className="hud mb-8 text-ink">Or leave a note</h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
