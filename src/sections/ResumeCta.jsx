import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight, FileText } from "lucide-react";
import { Reveal, SplitText } from "../motion";
import { MagneticButton } from "../components/ui";
import SectionAvatar from "../components/avatar/SectionAvatar";

/** A short pause before the ending: the compact version, two ways. */
const ResumeCta = () => (
  <section id="resume-cta" aria-labelledby="resume-cta-title" className="relative">
    <div className="shell">
      <div className="micro-grid relative overflow-hidden rounded-xl border border-line px-[clamp(1.5rem,5vw,4.5rem)] py-[clamp(3.5rem,9vh,6rem)]">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="mb-6 flex items-center gap-4">
              <p className="hud">
                <span className="tabular-nums text-ink">(07)</span> — Résumé
              </p>
              <SectionAvatar mood="proud" hover="celebrate" className="-my-3 h-10 w-10 md:h-12 md:w-12" />
            </div>
            <Reveal variant="lines">
              <SplitText as="h2" id="resume-cta-title" lines={["Want the", "compact version?"]} className="text-display-2 text-ink" />
            </Reveal>
            <p className="mt-6 max-w-md text-ink-dim">
              One page: roles, education, projects and stack — printable, and kept up to date.
            </p>
          </div>
          <Reveal variant="rise" selector="[data-cta]" className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            {/* The real file, described truthfully (checked: 2-page PDF, ~57 KB). */}
            <a
              data-cta
              href="/AashikKumarMahatoResume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group mb-2 flex w-full items-center gap-4 rounded-lg border border-line bg-background/60 p-3 pr-4 transition-colors duration-300 hover:border-ink-dim focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal lg:max-w-sm"
            >
              <span className="grid h-12 w-10 shrink-0 place-items-center rounded-[3px] border border-line bg-panel transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:-rotate-3">
                <FileText aria-hidden="true" strokeWidth={1.5} className="h-5 w-5 text-ink-dim" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm text-ink">AashikKumarMahatoResume.pdf</span>
                <span className="hud mt-1 block">PDF · 2 pages · 57 KB</span>
              </span>
              <ArrowUpRight aria-hidden="true" className="ml-auto h-4 w-4 shrink-0 text-ink-dim transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              <span className="sr-only">(opens the PDF in a new tab)</span>
            </a>
            <span data-cta>
              <MagneticButton as={Link} to="/resume" variant="signal" size="lg" icon={ArrowUpRight}>
                View résumé
              </MagneticButton>
            </span>
            <span data-cta>
              <MagneticButton
                as="a"
                href="/AashikKumarMahatoResume.pdf"
                download="AashikKumarMahatoResume.pdf"
                variant="outline"
                size="lg"
                icon={ArrowDown}
                iconDirection="down"
              >
                Download CV
              </MagneticButton>
            </span>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

export default ResumeCta;
