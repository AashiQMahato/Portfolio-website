import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Zap, BookOpen, FlaskConical, Calendar, ArrowRight } from 'lucide-react';
import { nowPageData, siteConfig } from '../data/portfolioData';
import { ScrollReveal } from '../components/ui';

const NowPage = () => {
  return (
    <div className="relative min-h-screen">
      {/* Decorative */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl section-padding pt-28">
        <ScrollReveal className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium border rounded-full border-border bg-card/60 backdrop-blur text-primary">
            <Compass className="w-4 h-4" />
            What I'm doing now
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6 tracking-tight">
            Now
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A snapshot of what I'm currently focused on, learning, and building.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-xs text-muted-foreground font-mono">
            <Calendar className="w-3.5 h-3.5" />
            Last updated: {new Date(nowPageData.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </ScrollReveal>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Status & Focus */}
          <ScrollReveal delay={0.1} className="md:col-span-2">
            <div className="p-8 rounded-3xl border border-border bg-card/40 backdrop-blur shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${siteConfig.statusColor}`} />
                <h2 className="text-xl font-bold font-display">Current Status</h2>
              </div>
              <p className="text-lg mb-6 text-foreground/90 leading-relaxed">
                {siteConfig.availability}. {nowPageData.currentFocus}
              </p>
            </div>
          </ScrollReveal>

          {/* Learning */}
          <ScrollReveal delay={0.2}>
            <div className="h-full p-8 rounded-3xl border border-border bg-card/20 hover:bg-card/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Learning</h3>
              <ul className="space-y-3">
                {nowPageData.learning.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* Reading */}
          <ScrollReveal delay={0.3}>
            <div className="h-full p-8 rounded-3xl border border-border bg-card/20 hover:bg-card/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 border border-secondary/20">
                <BookOpen className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-4">Reading</h3>
              <ul className="space-y-3">
                {nowPageData.reading.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <ArrowRight className="w-4 h-4 text-secondary-foreground shrink-0 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* Experiments */}
          <ScrollReveal delay={0.4} className="md:col-span-2">
            <div className="p-8 rounded-3xl border border-border bg-card/20 hover:bg-card/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 border border-accent/20">
                <FlaskConical className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-4">Experiments</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {nowPageData.experiments.map((item, i) => (
                  <div key={i} className="px-5 py-4 rounded-2xl border border-border/50 bg-background/50 text-muted-foreground">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default NowPage;
