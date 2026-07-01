import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Briefcase, GraduationCap, Code, Rocket } from 'lucide-react';
import { CV } from '../data/portfolioData';
import { ScrollReveal } from '../components/ui';

// Combine and sort events
const generateTimelineEvents = () => {
  const events = [];

  CV.experience.forEach((exp, i) => {
    events.push({
      id: `exp-${i}`,
      type: 'experience',
      icon: Briefcase,
      title: exp.role,
      subtitle: exp.company,
      location: exp.location,
      date: exp.period,
      content: exp.bullets,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    });
  });

  CV.education.forEach((edu, i) => {
    events.push({
      id: `edu-${i}`,
      type: 'education',
      icon: GraduationCap,
      title: edu.degree,
      subtitle: edu.institution,
      location: edu.location,
      date: edu.period,
      content: [],
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30'
    });
  });

  CV.projects.forEach((proj, i) => {
    // Just mapping some projects to timeline to fill it up
    events.push({
      id: `proj-${i}`,
      type: 'project',
      icon: Code,
      title: proj.name,
      subtitle: proj.stack,
      location: '',
      date: 'Project',
      content: proj.bullets,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30'
    });
  });

  // Simplified sorting: in a real scenario you'd parse the dates. 
  // Here we just group them: Experience -> Education -> Projects
  return events;
};

const TimelineNode = ({ event, index }) => {
  const isEven = index % 2 === 0;
  const Icon = event.icon;

  return (
    <ScrollReveal>
      <div className={`relative flex flex-col md:flex-row items-center justify-between mb-16 ${isEven ? 'md:flex-row-reverse' : ''}`}>
        
        {/* Timeline Line & Dot (Desktop) */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 flex-col items-center justify-center">
          <div className={`w-12 h-12 rounded-full border-4 border-background flex items-center justify-center shadow-xl ${event.bgColor} z-10`}>
            <Icon className={`w-5 h-5 ${event.color}`} />
          </div>
        </div>

        {/* Content Card */}
        <div className={`w-full md:w-[45%] flex ${isEven ? 'justify-start' : 'justify-end'}`}>
          <div className="relative w-full p-6 md:p-8 rounded-3xl border border-border bg-card/40 backdrop-blur hover:bg-card/60 transition-colors shadow-sm">
            {/* Mobile icon */}
            <div className={`md:hidden w-10 h-10 rounded-full mb-4 flex items-center justify-center ${event.bgColor}`}>
              <Icon className={`w-5 h-5 ${event.color}`} />
            </div>

            <div className="flex flex-col gap-1 mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{event.date}</span>
              <h3 className="text-xl md:text-2xl font-bold font-display">{event.title}</h3>
              <div className="text-sm text-foreground/80 font-medium">
                {event.subtitle} {event.location && <span className="opacity-60 block mt-0.5">{event.location}</span>}
              </div>
            </div>

            {event.content.length > 0 && (
              <ul className="space-y-2 mt-4 pt-4 border-t border-border/50">
                {event.content.map((bullet, i) => (
                  <li key={i} className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </ScrollReveal>
  );
};

const TimelinePage = () => {
  const events = generateTimelineEvents();

  return (
    <div className="relative min-h-screen">
      {/* Decorative */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl section-padding pt-28">
        <ScrollReveal className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium border rounded-full border-border bg-card/60 backdrop-blur text-primary">
            <Clock className="w-4 h-4" />
            My Journey
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6 tracking-tight">
            Timeline
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A chronological look at my education, experience, and key projects.
          </p>
        </ScrollReveal>

        <div className="relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {events.map((event, index) => (
            <TimelineNode key={event.id} event={event} index={index} />
          ))}

          {/* End cap */}
          <ScrollReveal>
            <div className="relative flex justify-center mt-12 mb-8">
              <div className="w-12 h-12 rounded-full border-4 border-background bg-primary/10 flex items-center justify-center z-10">
                <Rocket className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-center text-muted-foreground font-medium pb-20">What's next?</p>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default TimelinePage;
