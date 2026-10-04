import {
  Download,
  Printer,
  Mail,
  MapPin,
  Phone,
  Github,
  Linkedin,
  Briefcase,
  GraduationCap,
  Code,
} from "lucide-react";
import { CV } from "../data/portfolioData";

const ResumePage = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen pb-[clamp(5rem,12vh,9rem)] pt-[var(--nav-h)] print:p-0">
      {/* Site chrome: sticky toolbar under the fixed nav, never printed */}
      <div
        data-chrome
        className="sticky top-[var(--nav-h)] z-40 border-b border-line bg-background print:hidden">
        <div className="shell flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="hud">(Résumé) — Printable document</p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/AashikKumarMahatoResume.pdf"
              download="Aashik_Kumar_Mahato_Resume.pdf"
              className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink">
              <Download className="h-4 w-4" aria-hidden="true" /> Download PDF
            </a>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-[filter] hover:brightness-110">
              <Printer className="h-4 w-4" aria-hidden="true" /> Print / Save
            </button>
          </div>
        </div>
      </div>

      {/* A4 paper sheet — a light document in both themes, so its accent is
          the light-theme accent-ink value (AA on white), not the themed token */}
      <div className="shell flex justify-center pt-10 print:m-0 print:p-0">
        <div className="w-full max-w-[850px] rounded-sm bg-white p-8 text-black ring-1 ring-line sm:p-12 md:p-16 print:w-full print:max-w-none print:p-0 print:ring-0">
          {/* Header */}
          <header className="border-b-2 border-gray-900 pb-6 mb-6">
            <h1 className="text-4xl sm:text-5xl font-black font-display text-gray-900 uppercase tracking-tight mb-3">
              {CV.name}
            </h1>
            <div className="text-lg sm:text-xl text-[#A6360A] font-bold mb-4">
              {CV.title}
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 font-medium">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4" aria-hidden="true" /> {CV.contact.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4" aria-hidden="true" /> {CV.contact.phone}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" aria-hidden="true" /> {CV.contact.location}
              </span>
              <a
                href={CV.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-[#A6360A]">
                <Github className="w-4 h-4" aria-hidden="true" /> github.com/AashiQMahato
              </a>
              <a
                href={CV.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-[#A6360A]">
                <Linkedin className="w-4 h-4" aria-hidden="true" /> LinkedIn
              </a>
            </div>
          </header>

          {/* Summary */}
          <section className="mb-8">
            <p className="text-gray-700 leading-relaxed text-justify">
              {CV.summary}
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Left Column (Main Experience) */}
            <div className="md:col-span-2 space-y-8">
              {/* Experience */}
              <section>
                <h2 className="flex items-center gap-2 text-xl font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-2 mb-4">
                  <Briefcase className="w-5 h-5 text-[#A6360A]" aria-hidden="true" /> Experience
                </h2>
                <div className="space-y-6">
                  {CV.experience.map((exp, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {exp.role}
                        </h3>
                        <span className="text-sm font-semibold text-gray-500 whitespace-nowrap">
                          {exp.period}
                        </span>
                      </div>
                      <div className="text-[#A6360A] font-semibold text-sm mb-2">
                        {exp.company} | {exp.location}
                      </div>
                      <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm leading-relaxed">
                        {exp.bullets.map((bullet, j) => (
                          <li key={j}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* Projects */}
              <section>
                <h2 className="flex items-center gap-2 text-xl font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-2 mb-4">
                  <Code className="w-5 h-5 text-[#A6360A]" aria-hidden="true" /> Projects
                </h2>
                <div className="space-y-6">
                  {CV.projects.map((proj, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {proj.name}
                        </h3>
                        <a
                          href={proj.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#A6360A] font-mono truncate max-w-[200px] hover:underline">
                          Source<span className="sr-only"> code for {proj.name}</span>
                        </a>
                      </div>
                      <div className="text-gray-600 font-medium text-xs mb-2 italic">
                        Stack: {proj.stack}
                      </div>
                      <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm leading-relaxed">
                        {proj.bullets.map((bullet, j) => (
                          <li key={j}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column (Education & Skills) */}
            <div className="space-y-8">
              {/* Education */}
              <section>
                <h2 className="flex items-center gap-2 text-xl font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-2 mb-4">
                  <GraduationCap className="w-5 h-5 text-[#A6360A]" aria-hidden="true" /> Education
                </h2>
                <div className="space-y-5">
                  {CV.education.map((edu, i) => (
                    <div key={i}>
                      <h3 className="font-bold text-gray-900 text-sm leading-snug">
                        {edu.degree}
                      </h3>
                      <div className="text-[#A6360A] text-xs font-semibold my-1">
                        {edu.institution}
                      </div>
                      <div className="text-gray-500 text-xs">{edu.period}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Skills */}
              <section>
                <h2 className="text-xl font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-2 mb-4">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {CV.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-gray-100 border border-gray-200 text-gray-800 text-xs font-semibold rounded-md">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              {/* Languages */}
              <section>
                <h2 className="text-xl font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-2 mb-4">
                  Languages
                </h2>
                <div className="text-sm text-gray-700 font-medium space-y-1">
                  {CV.languages.map((lang, i) => (
                    <div key={i}>• {lang}</div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Print: edge-to-edge sheet with exact colours */}
      <style>{`
        @media print {
          @page { margin: 0; }
          body { 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact;
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ResumePage;
