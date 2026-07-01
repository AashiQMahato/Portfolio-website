import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  ExternalLink,
  Github,
  Star,
  Calendar,
  Code2,
  Search,
  LayoutGrid,
  List,
  X,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Zap,
  Eye,
  GitFork,
  Rocket,
  ArrowRight,
  Mail,
} from "lucide-react";
import { TypeAnimation } from "react-type-animation";
import { Link } from "react-router-dom";
import { ScrollReveal, SpotlightCard } from "./ui";
import {
  projects,
  projectCategories as categories,
  TECH_ICONS,
} from "../data/portfolioData";

const getProjectImageSrc = (project) => {
  const img = project?.image;
  if (img) return img;
  const gallery = project?.gallery;
  if (Array.isArray(gallery) && gallery.length > 0) {
    const first = gallery[0];
    if (typeof first === "string") return first;
    return first?.src || first?.url || "";
  }
  return "";
};

const ProjectImage = ({ project, alt, className }) => {
  const src = getProjectImageSrc(project);
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-primary/10 via-card/40 to-secondary/10 ${className}`}
        role="img"
        aria-label={alt}>
        <Code2 className="w-7 h-7 text-muted-foreground" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  );
};

/* ═══════════════════ HELPER: counter hook ════════════════════ */

const useCounter = (end, duration = 2000, startCounting = false) => {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    if (!startCounting) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(p * end));
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [end, duration, startCounting]);
  return count;
};

/* ═══════════════════ HERO PARTICLES ═════════════════════════ */

const HeroParticles = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 2.5,
        dur: 5 + Math.random() * 8,
        del: Math.random() * 4,
        hue: 180 + Math.random() * 100,
      })),
    [],
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: `hsla(${p.hue}, 80%, 70%, 0.5)`,
          }}
          animate={{ y: [0, -25, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            delay: p.del,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

/* ═══════════════════ STAT CARD ═══════════════════════════════ */

const StatCard = ({ icon: Icon, number, suffix, title, index }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const count = useCounter(number, 2000, inView);
  return (
    <ScrollReveal delay={index * 0.1}>
      <div ref={ref} className="relative group">
        <div className="relative p-5 overflow-hidden text-center transition-all duration-300 border shadow-sm rounded-2xl bg-card/60 backdrop-blur border-border hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
          <div className="relative z-10">
            <div className="flex items-center justify-center mx-auto mb-2 w-11 h-11 rounded-xl bg-primary/10">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl font-bold font-display text-primary">
              {count}
              {suffix}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">{title}</div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

/* ═══════════════════ TECH ICON WITH TOOLTIP ═════════════════ */

const TechIcon = ({ name, size = 18, showTooltip = true }) => {
  const src = TECH_ICONS[name];
  return (
    <div className="relative group/tech">
      <div
        className="flex items-center justify-center transition-colors duration-200 border rounded-md border-border bg-card/50"
        style={{ width: size + 8, height: size + 8 }}>
        {src ? (
          <img
            src={src}
            alt={name}
            style={{ width: size, height: size }}
            loading="lazy"
          />
        ) : (
          <span
            className="font-semibold text-muted-foreground"
            style={{ fontSize: Math.max(size - 6, 10) }}>
            {name.charAt(0)}
          </span>
        )}
      </div>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-md text-[10px] font-medium whitespace-nowrap opacity-0 group-hover/tech:opacity-100 transition-opacity duration-200 pointer-events-none z-20 bg-card text-foreground border border-border shadow-md">
          {name}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════ STATUS BADGE ════════════════════════════ */

const StatusBadge = ({ status }) => {
  const conf = {
    live: {
      label: "Live",
      className: "bg-primary/10 border-primary/20 text-primary",
      dotClassName: "bg-primary",
      pulse: true,
    },
    "in-progress": {
      label: "In Progress",
      className: "bg-card/40 border-border text-muted-foreground",
      dotClassName: "bg-muted-foreground/60",
      pulse: false,
    },
    archived: {
      label: "Archived",
      className: "bg-card/40 border-border text-muted-foreground",
      dotClassName: "bg-muted-foreground/60",
      pulse: false,
    },
  }[status] || {
    label: status,
    className: "bg-card/40 border-border text-muted-foreground",
    dotClassName: "bg-muted-foreground/60",
    pulse: false,
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${conf.className}`}>
      <motion.span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${conf.dotClassName}`}
        animate={conf.pulse ? { scale: [1, 1.4, 1], opacity: [1, 0.6, 1] } : {}}
        transition={conf.pulse ? { duration: 1.5, repeat: Infinity } : {}}
      />
      {conf.label}
    </span>
  );
};

/* ═══════════════ PROJECT CARD (GRID MODE) ═══════════════════ */

const CARD_PATTERNS = {
  Hardware:
    "radial-gradient(ellipse at 30% 70%, rgb(var(--secondary) / 0.10), transparent 60%), radial-gradient(ellipse at 70% 30%, rgb(var(--primary) / 0.08), transparent 50%)",
  "Full-Stack":
    "radial-gradient(ellipse at 25% 80%, rgb(var(--primary) / 0.10), transparent 60%), radial-gradient(ellipse at 75% 20%, rgb(var(--secondary) / 0.08), transparent 50%)",
  "Web Dev":
    "radial-gradient(ellipse at 30% 60%, rgb(var(--primary) / 0.10), transparent 60%), radial-gradient(ellipse at 70% 30%, rgb(var(--accent) / 0.08), transparent 50%)",
  IoT: "radial-gradient(ellipse at 40% 80%, rgb(var(--accent) / 0.10), transparent 60%), radial-gradient(ellipse at 60% 20%, rgb(var(--secondary) / 0.08), transparent 50%)",
  "AI/ML":
    "radial-gradient(ellipse at 30% 70%, rgb(var(--secondary) / 0.10), transparent 60%), radial-gradient(ellipse at 70% 30%, rgb(var(--accent) / 0.08), transparent 50%)",
};

const ProjectCardGrid = ({ project, index, onOpenDetail }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      layout>
      <SpotlightCard
        className="h-full overflow-hidden transition-all duration-300 rounded-2xl group glass"
        spotlightColor="rgb(var(--primary) / 0.08)">
        <div
          className="flex flex-col h-full"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{ transition: "transform 0.3s ease, box-shadow 0.3s ease" }}>
          {/* ── Visual Header (~40%) ── */}
          <div className="relative overflow-hidden h-52">
            <ProjectImage
              project={project}
              alt={project.title}
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
            />
            {/* Dark overlay gradient */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgb(var(--background) / 0.95) 0%, rgb(var(--background) / 0.4) 40%, transparent 100%)",
              }}
            />
            {/* Category pattern overlay */}
            <div
              className="absolute inset-0 opacity-60"
              style={{
                backgroundImage:
                  CARD_PATTERNS[project.category] || CARD_PATTERNS["Web Dev"],
              }}
            />

            {/* Tech stack icons row overlay */}
            <div className="absolute bottom-3 left-4 right-4 flex gap-1.5 flex-wrap">
              {project.tags.slice(0, 5).map((t) => (
                <TechIcon key={t} name={t} size={16} />
              ))}
            </div>

            {/* Status badge top-right */}
            <div className="absolute top-3 right-3">
              <StatusBadge status={project.status} />
            </div>

            {/* Hover CTA overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: hovered ? 1 : 0 }}
              className="absolute inset-0 flex items-center justify-center gap-3 bg-background/70 backdrop-blur-sm">
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-transform duration-200 hover:scale-105 border border-primary/30 bg-primary text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
                  <ExternalLink className="w-3.5 h-3.5" /> View Live
                </a>
              )}
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-transform duration-200 hover:scale-105 border border-border bg-card/70 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
                <Github className="w-3.5 h-3.5" /> GitHub
              </a>
            </motion.div>
          </div>

          {/* ── Card Body (~60%) ── */}
          <div className="flex flex-col flex-1 p-5">
            {/* Title + underline */}
            <h3 className="mb-1 text-lg font-bold leading-tight transition-colors duration-300 font-display text-foreground group-hover:text-primary">
              {project.title}
            </h3>
            <motion.div
              className="h-0.5 rounded-full mb-3 w-24 bg-primary/70 origin-left"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            />

            {/* Category tag */}
            <span className="inline-flex mb-2 px-2.5 py-0.5 text-[10px] font-semibold rounded-full w-fit border border-border bg-card/40 text-muted-foreground">
              {project.category}
            </span>

            {/* Description */}
            <p className="flex-1 mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-3">
              {project.shortDesc}
            </p>

            {/* Metrics row */}
            <div className="flex items-center gap-4 mb-4 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                {project.stars}
              </span>
              <span className="flex items-center gap-1">
                <GitFork className="w-3 h-3" />
                {project.forks}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {project.views}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {project.year}
              </span>
            </div>

            {/* Bottom action strip */}
            <div className="flex items-center justify-between pt-3 border-t border-border/60">
              <Link
                to={`/projects/${project.slug}`}
                className="flex items-center gap-1 text-xs font-semibold transition-colors duration-200 rounded-md cursor-pointer text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
                Learn More <ArrowRight className="w-3 h-3" />
              </Link>
              <div className="flex items-center gap-2">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg transition-transform duration-200 hover:scale-110 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
                  <Github className="w-4 h-4" />
                </a>
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg transition-transform duration-200 hover:scale-110 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
};

/* ═══════════════ PROJECT CARD (LIST MODE) ═══════════════════ */

const ProjectCardList = ({ project, index, onOpenDetail }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.3, delay: index * 0.06 }}
    layout
    className="overflow-hidden transition-all duration-300 border shadow-sm rounded-2xl group hover:-translate-y-1 bg-card/60 backdrop-blur border-border hover:shadow-md">
    <div className="flex flex-col md:flex-row">
      {/* Image */}
      <div className="relative flex-shrink-0 w-full h-48 overflow-hidden md:w-64 md:h-auto">
        <ProjectImage
          project={project}
          alt={project.title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/80" />
        <div className="absolute top-3 left-3">
          <StatusBadge status={project.status} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-1 p-5">
        <div>
          <h3 className="mb-2 text-lg font-bold transition-colors font-display text-foreground group-hover:text-primary">
            {project.title}
          </h3>
          <p className="mb-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {project.shortDesc}
          </p>
          <div className="flex gap-1.5 flex-wrap mb-3">
            {project.tags.map((t) => (
              <TechIcon key={t} name={t} size={14} />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              {project.stars}
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="w-3 h-3" />
              {project.forks}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {project.year}
            </span>
          </div>
          <Link
            to={`/projects/${project.slug}`}
            className="flex items-center gap-1 text-xs font-semibold rounded-md cursor-pointer text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
            Details <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  </motion.div>
);

/* ═══════════════ PROJECT DETAIL MODAL ═══════════════════════ */

const ProjectModal = ({ project, onClose, onNavigate, allProjects }) => {
  const [copied, setCopied] = useState(false);
  const currentIdx = allProjects.findIndex((p) => p.title === project.title);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && currentIdx > 0)
        onNavigate(allProjects[currentIdx - 1]);
      if (e.key === "ArrowRight" && currentIdx < allProjects.length - 1)
        onNavigate(allProjects[currentIdx + 1]);
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [currentIdx, onClose, onNavigate, allProjects]);

  const copyLink = () => {
    navigator.clipboard.writeText(project.github || window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-[20px] z-10 border border-border bg-card/90 backdrop-blur-sm shadow-xl">
        {/* Close + Nav buttons */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-3 border-b sm:p-4 bg-card/80 border-border backdrop-blur-sm">
          <div className="flex items-center gap-2">
            {currentIdx > 0 && (
              <button
                onClick={() => onNavigate(allProjects[currentIdx - 1])}
                className="p-2 transition-colors border rounded-lg cursor-pointer border-border bg-card/60 text-muted-foreground hover:text-foreground hover:bg-card/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {currentIdx < allProjects.length - 1 && (
              <button
                onClick={() => onNavigate(allProjects[currentIdx + 1])}
                className="p-2 transition-colors border rounded-lg cursor-pointer border-border bg-card/60 text-muted-foreground hover:text-foreground hover:bg-card/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            <span className="ml-2 text-xs text-muted-foreground">
              {currentIdx + 1} / {allProjects.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 transition-colors border rounded-lg cursor-pointer border-border bg-card/60 text-muted-foreground hover:text-foreground hover:bg-card/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid gap-0 lg:grid-cols-2">
          {/* Left: Visual */}
          <div className="p-4 sm:p-6">
            {/* Browser mockup */}
            <div className="overflow-hidden border rounded-xl border-border">
              <div className="flex items-center gap-2 px-3 py-2 border-b sm:px-4 sm:py-2.5 bg-card/60 border-border">
                <div
                  className="flex-shrink-0 w-3 h-3 rounded-full"
                  style={{ backgroundColor: "#ff5f57" }}
                />
                <div
                  className="flex-shrink-0 w-3 h-3 rounded-full"
                  style={{ backgroundColor: "#febc2e" }}
                />
                <div
                  className="flex-shrink-0 w-3 h-3 rounded-full"
                  style={{ backgroundColor: "#28c840" }}
                />
                <div className="flex-1 min-w-0 mx-2 sm:mx-4 px-2 sm:px-3 py-1 rounded-md text-[10px] truncate border border-border bg-background/40 text-muted-foreground">
                  {project.github}
                </div>
              </div>
              <img
                src={getProjectImageSrc(project)}
                alt={project.title}
                className="object-cover w-full aspect-video"
              />
            </div>

            {/* Tech stack large */}
            <div className="mt-6">
              <h4 className="mb-3 text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <div
                    key={t}
                    className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-card/40 border-border">
                    <TechIcon name={t} size={20} showTooltip={false} />
                    <span className="text-xs text-muted-foreground">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="p-4 sm:p-6 lg:border-l border-border">
            <div className="flex items-center gap-3 mb-4">
              <StatusBadge status={project.status} />
              <span className="text-xs text-muted-foreground">
                {project.year} &middot; Team of {project.teamSize}
              </span>
            </div>

            <h2 className="mb-4 text-xl font-bold sm:text-2xl lg:text-3xl font-display gradient-text">
              {project.title}
            </h2>

            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              {project.fullDesc}
            </p>

            {/* Features */}
            <div className="mb-6">
              <h4 className="mb-3 text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                Key Features
              </h4>
              <div className="space-y-2">
                {project.features.map((f) => (
                  <div key={f} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights */}
            {project.highlights && (
              <div className="mb-6">
                <h4 className="mb-3 text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                  Technical Highlights
                </h4>
                <div className="space-y-2">
                  {project.highlights.map((h) => (
                    <div key={h} className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metrics */}
            <div className="flex flex-wrap items-center gap-3 mb-6 text-sm sm:gap-5 text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-primary" />
                {project.stars} stars
              </span>
              <span className="flex items-center gap-1.5">
                <GitFork className="w-4 h-4" />
                {project.forks} forks
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                {project.views} views
              </span>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-transform duration-200 hover:scale-105 border border-primary/30 bg-primary text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
                  <Rocket className="w-4 h-4" /> View Live
                </a>
              )}
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-transform duration-200 hover:scale-105 border border-border bg-card/60 text-foreground hover:bg-card/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
                <Star className="w-4 h-4" /> GitHub
              </a>
              <button
                onClick={copyLink}
                className="px-3 py-2.5 rounded-xl text-sm flex items-center gap-1.5 transition-colors cursor-pointer border border-border bg-card/60 text-muted-foreground hover:text-foreground hover:bg-card/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
                {copied ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ═══════════════ TECH USAGE VISUALIZATION ═══════════════════ */

const TechUsageSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  const techUsage = useMemo(() => {
    const map = {};
    projects.forEach((p) => {
      p.tags.forEach((t) => {
        if (!map[t]) map[t] = { name: t, count: 0, projects: [] };
        map[t].count++;
        map[t].projects.push(p.title);
      });
    });
    return Object.values(map).sort((a, b) => b.count - a.count);
  }, []);

  const maxCount = Math.max(...techUsage.map((t) => t.count));

  return (
    <ScrollReveal>
      <div ref={ref} className="p-8 mb-16 lg:p-12 rounded-2xl glass">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 border rounded-xl bg-primary/10 border-primary/15">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-bold font-display gradient-text">
              Technologies I Build With
            </h3>
            <p className="text-sm text-muted-foreground">Across all projects</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {techUsage.map((tech, i) => {
            const scale = 0.7 + (tech.count / maxCount) * 0.5;
            const src = TECH_ICONS[tech.name];
            return (
              <motion.div
                key={tech.name}
                className="relative flex flex-col items-center gap-2 p-4 transition-colors duration-300 border cursor-default group/bubble rounded-2xl border-border bg-card/40 hover:bg-card/50 hover:border-primary/20"
                style={{ transform: `scale(${scale})` }}
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: 1, scale } : {}}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -2 }}>
                <div className="flex items-center justify-center w-10 h-10">
                  {src ? (
                    <img
                      src={src}
                      alt={tech.name}
                      className="w-8 h-8"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-8 h-8 text-sm font-bold border rounded-lg text-primary bg-primary/10 border-primary/15">
                      {tech.name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {tech.name}
                </span>
                <span className="text-[10px] font-bold text-primary">
                  {tech.count} project{tech.count > 1 ? "s" : ""}
                </span>

                {/* Tooltip listing projects */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 rounded-lg text-[10px] whitespace-nowrap opacity-0 group-hover/bubble:opacity-100 transition-opacity duration-200 pointer-events-none z-30 border border-border bg-card/90 backdrop-blur-sm text-muted-foreground shadow-md">
                  {tech.projects.join(", ")}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </ScrollReveal>
  );
};
/* ═══════════════ BOTTOM CTA SECTION ═════════════════════════ */

const BottomCTA = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <ScrollReveal>
      <div className="relative p-10 overflow-hidden text-center rounded-2xl lg:p-16 glass">
        {/* Soft orbs (motion-safe) */}
        {!prefersReducedMotion && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute w-64 h-64 rounded-full blur bg-primary/10"
              style={{ top: "-20%", left: "-10%" }}
              animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute rounded-full w-60 h-60 blur bg-accent/10"
              style={{ bottom: "-20%", right: "-10%" }}
              animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        )}

        <div className="relative z-10">
          <h3 className="mb-4 text-3xl font-bold lg:text-4xl font-display gradient-text">
            Have a Project in Mind?
          </h3>
          <p className="max-w-lg mx-auto mb-8 text-muted-foreground">
            Let&apos;s collaborate and build something amazing together.
            I&apos;m always open to new challenges and exciting ideas.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contactus"
              className="px-7 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-transform duration-300 hover:scale-105 hover:-translate-y-0.5 border border-primary/30 bg-primary text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
              <Rocket className="w-4 h-4" /> Hire Me
            </Link>
            <Link
              to="/contactus"
              className="flex items-center gap-2 py-3 text-sm font-semibold transition-transform duration-300 bg-transparent border px-7 rounded-xl hover:scale-105 border-primary/30 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
              <Mail className="w-4 h-4" /> Get In Touch
            </Link>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

/* ═══════════════════════ MAIN PAGE ══════════════════════════ */

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const filteredProjects = useMemo(() => {
    let result = projects;
    if (activeCategory !== "All") {
      result = result.filter(
        (p) =>
          p.category === activeCategory ||
          (p.cats && p.cats.includes(activeCategory)),
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.shortDesc.toLowerCase().includes(q),
      );
    }
    return result;
  }, [activeCategory, searchQuery]);

  const featuredProject = useMemo(() => projects.find((p) => p.featured), []);

  const heroStats = [
    {
      icon: Code2,
      number: projects.length,
      suffix: "+",
      title: "Total Projects",
    },
    {
      icon: Star,
      number: projects.reduce((a, p) => a + p.stars, 0),
      suffix: "+",
      title: "GitHub Stars",
    },
    {
      icon: Zap,
      number: Object.keys(TECH_ICONS).length,
      suffix: "+",
      title: "Technologies Used",
    },
    {
      icon: Rocket,
      number: projects.filter((p) => p.status === "live").length,
      suffix: "",
      title: "Deployed Live",
    },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Decorative blurs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-0 h-[500px] bg-primary/10 rounded-full blur" />
        <div className="absolute bottom-0 left-0 h-[400px] bg-primary/10 rounded-full blur" />
        <div className="absolute rounded-full top-2/3 left-1/3 h-96 bg-primary/5 blur" />
      </div>

      <div className="relative z-10 section-padding pt-28">
        <div className="mx-auto max-w-7xl">
          {/* ══════ HERO ══════ */}
          <ScrollReveal className="relative mb-12 text-center lg:mb-16">
            <HeroParticles />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium border rounded-full border-border bg-card/60 backdrop-blur text-primary">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Portfolio
              </div>
              <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl font-display">
                Featured <span className="gradient-text">Projects</span>
              </h2>
              <div className="h-8 mb-3">
                <TypeAnimation
                  sequence={[
                    "Built with Passion",
                    2000,
                    "Engineered with Precision",
                    2000,
                    "Full-Stack & Hardware",
                    2000,
                    "Real-World Solutions",
                    2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                  className="text-lg font-medium md:text-xl text-muted-foreground"
                />
              </div>
              <p className="max-w-2xl mx-auto text-sm text-muted-foreground">
                A curated collection of projects spanning web development,
                electronics, and IoT systems
              </p>
            </div>
          </ScrollReveal>

          {/* ══════ HERO STATS ══════ */}
          <div className="grid grid-cols-2 gap-4 mb-16 md:grid-cols-4">
            {heroStats.map((stat, i) => (
              <StatCard key={stat.title} {...stat} index={i} />
            ))}
          </div>

          {/* ══════ FILTER BAR ══════ */}
          <div className="sticky top-[72px] z-30 mb-10">
            <div className="flex flex-col items-stretch gap-3 p-3 glass rounded-2xl md:flex-row md:items-center">
              {/* Category pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0 flex-1 min-w-0 scrollbar-hide">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex-shrink-0 px-4 py-2 text-xs font-semibold transition-colors duration-200 rounded-full cursor-pointer whitespace-nowrap border ${
                      activeCategory === cat
                        ? "bg-primary text-primary-foreground border-primary/30 shadow-sm"
                        : "bg-card/40 text-muted-foreground border-border hover:bg-card/60 hover:text-foreground"
                    }`}>
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search + View toggle */}
              <div className="flex items-center flex-shrink-0 gap-2">
                <div className="relative">
                  <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects..."
                    className="py-2 pr-4 text-xs border outline-none w-44 md:w-52 pl-9 rounded-xl border-border bg-card/40 text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
                  />
                </div>
                <div className="flex gap-1">
                  {[
                    { mode: "grid", Icon: LayoutGrid },
                    { mode: "list", Icon: List },
                  ].map(({ mode, Icon }) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`p-2 transition-colors duration-200 rounded-lg cursor-pointer border ${
                        viewMode === mode
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}>
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ══════ PROJECTS GRID / LIST ══════ */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory}-${searchQuery}-${viewMode}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={
                viewMode === "grid"
                  ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
                  : "flex flex-col gap-4 mb-16"
              }>
              {filteredProjects.length === 0 ? (
                <div className="py-20 text-center col-span-full">
                  <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium text-foreground">
                    No projects match your search
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try a different category or search term
                  </p>
                </div>
              ) : (
                filteredProjects.map((project, i) =>
                  viewMode === "grid" ? (
                    <ProjectCardGrid
                      key={project.title}
                      project={project}
                      index={i}
                    />
                  ) : (
                    <ProjectCardList
                      key={project.title}
                      project={project}
                      index={i}
                    />
                  ),
                )
              )}
            </motion.div>
          </AnimatePresence>

          {/* ══════ TECH USAGE ══════ */}
          <TechUsageSection />

          {/* ══════ BOTTOM CTA ══════ */}
          <BottomCTA />
        </div>
      </div>
    </div>
  );
};

export default Projects;
