import React from 'react';
import { Download, Mail, MapPin, Phone, Github, Linkedin, Briefcase, GraduationCap, Code } from 'lucide-react';
import { CV } from '../data/portfolioData';

const ResumePage = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* Non-print controls */}
      <div className="print:hidden sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border py-4 px-6 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold font-display">Resume</h1>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <Download className="w-4 h-4" /> Download PDF
        </button>
      </div>

      {/* A4 Paper Container for Print & Desktop */}
      <div className="section-padding py-10 print:p-0 print:m-0 flex justify-center">
        <div className="w-full max-w-[850px] bg-white text-black p-8 sm:p-12 md:p-16 rounded-sm shadow-2xl print:shadow-none print:w-full print:max-w-none print:p-0">
          
          {/* Header */}
          <header className="border-b-2 border-gray-900 pb-6 mb-6">
            <h1 className="text-4xl sm:text-5xl font-black font-display text-gray-900 uppercase tracking-tight mb-3">
              {CV.name}
            </h1>
            <div className="text-lg sm:text-xl text-primary font-bold mb-4">{CV.title}</div>
            
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 font-medium">
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {CV.contact.email}</span>
              <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {CV.contact.phone}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {CV.contact.location}</span>
              <a href={CV.contact.github} className="flex items-center gap-1.5 hover:text-primary"><Github className="w-4 h-4" /> github.com/Aashik9567</a>
              <a href={CV.contact.linkedin} className="flex items-center gap-1.5 hover:text-primary"><Linkedin className="w-4 h-4" /> LinkedIn</a>
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
                  <Briefcase className="w-5 h-5 text-primary" /> Experience
                </h2>
                <div className="space-y-6">
                  {CV.experience.map((exp, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-lg font-bold text-gray-900">{exp.role}</h3>
                        <span className="text-sm font-semibold text-gray-500 whitespace-nowrap">{exp.period}</span>
                      </div>
                      <div className="text-primary font-semibold text-sm mb-2">{exp.company} | {exp.location}</div>
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
                  <Code className="w-5 h-5 text-primary" /> Projects
                </h2>
                <div className="space-y-6">
                  {CV.projects.map((proj, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-lg font-bold text-gray-900">{proj.name}</h3>
                        <a href={proj.url} className="text-xs text-primary font-mono truncate max-w-[200px] hover:underline">Link</a>
                      </div>
                      <div className="text-gray-600 font-medium text-xs mb-2 italic">Stack: {proj.stack}</div>
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
                  <GraduationCap className="w-5 h-5 text-primary" /> Education
                </h2>
                <div className="space-y-5">
                  {CV.education.map((edu, i) => (
                    <div key={i}>
                      <h3 className="font-bold text-gray-900 text-sm leading-snug">{edu.degree}</h3>
                      <div className="text-primary text-xs font-semibold my-1">{edu.institution}</div>
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
                    <span key={i} className="px-2.5 py-1 bg-gray-100 border border-gray-200 text-gray-800 text-xs font-semibold rounded-md">
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

      {/* Global CSS for printing */}
      <style>{`
        @media print {
          @page { margin: 0; }
          body { 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact;
            background: white !important;
          }
          .section-padding { padding: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default ResumePage;
