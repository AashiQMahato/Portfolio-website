import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Reveal, SplitText } from "../motion";
import { MagneticButton } from "../components/ui";

/** A short pause before the ending: the compact version, two ways. */
const ResumeCta = () => (
  <section aria-labelledby="resume-cta-title" className="relative">
    <div className="shell">
      <div className="micro-grid relative overflow-hidden rounded-xl border border-line px-[clamp(1.5rem,5vw,4.5rem)] py-[clamp(3.5rem,9vh,6rem)]">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="hud mb-6">
              <span className="tabular-nums text-ink">(07)</span> — Résumé
            </p>
            <Reveal variant="lines">
              <SplitText as="h2" id="resume-cta-title" lines={["Want the", "compact version?"]} className="text-display-2 text-ink" />
            </Reveal>
            <p className="mt-6 max-w-md text-ink-dim">
              One page: roles, education, projects and stack — printable, and kept up to date.
            </p>
          </div>
          <Reveal variant="rise" selector="[data-cta]" className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
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
