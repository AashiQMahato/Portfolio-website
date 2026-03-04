import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  ExternalLink,
  Github,
  Star,
  Calendar,
  Cpu,
  Code2,
  Cloud,
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
  Crown,
  Rocket,
  ArrowRight,
  Mail,
} from "lucide-react";
import { TypeAnimation } from "react-type-animation";
import { Link } from "react-router-dom";
import { ScrollReveal, SpotlightCard } from "./ui";
import aams from "../assets/AAMS.png";

/* ════════════════════════ CONSTANTS ═══════════════════════════ */

const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const TECH_ICONS = {
  Arduino: `${DEVICON}/arduino/arduino-original.svg`,
  "GSM Module": null,
  GPS: null,
  Sensors: null,
  Python: `${DEVICON}/python/python-original.svg`,
  "Face Recognition": null,
  React: `${DEVICON}/react/react-original.svg`,
  "React.js": `${DEVICON}/react/react-original.svg`,
  MongoDB: `${DEVICON}/mongodb/mongodb-original.svg`,
  "Next.js": `${DEVICON}/nextjs/nextjs-original.svg`,
  OpenAI: null,
  TypeScript: `${DEVICON}/typescript/typescript-original.svg`,
  "Node.js": `${DEVICON}/nodejs/nodejs-original.svg`,
  "Express.js": `${DEVICON}/express/express-original.svg`,
  JavaScript: `${DEVICON}/javascript/javascript-original.svg`,
  "C++": `${DEVICON}/cplusplus/cplusplus-original.svg`,
  C: `${DEVICON}/c/c-original.svg`,
  "Raspberry Pi": `${DEVICON}/raspberrypi/raspberrypi-original.svg`,
  HTML: `${DEVICON}/html5/html5-original.svg`,
  CSS: `${DEVICON}/css3/css3-original.svg`,
  Tailwind: `${DEVICON}/tailwindcss/tailwindcss-original.svg`,
  Git: `${DEVICON}/git/git-original.svg`,
  Firebase: `${DEVICON}/firebase/firebase-plain.svg`,
  Docker: `${DEVICON}/docker/docker-original.svg`,
  Linux: `${DEVICON}/linux/linux-original.svg`,
  "VS Code": `${DEVICON}/vscode/vscode-original.svg`,
  "Framer Motion": null,
  MQTT: null,
  "REST API": null,
};

/* ═════════════════════ PROJECT DATA ══════════════════════════ */

const projects = [
  {
    title: "Ultrasonic Blind Stick with GSM/GPS",
    shortDesc:
      "An innovative assistive technology device that helps visually impaired individuals navigate safely with real-time obstacle detection and emergency alerts.",
    fullDesc:
      "This project addresses a critical need for visually impaired individuals by combining ultrasonic sensors with GSM/GPS technology. The device detects obstacles up to 2 meters ahead and provides haptic feedback through vibration motors. In emergency situations, the user can press a button to send their GPS location via SMS to pre-configured contacts. The system runs on an Arduino Mega with a 12-hour battery life, making it practical for daily use.",
    image:
      "https://media.springernature.com/lw685/springer-static/image/chp%3A10.1007%2F978-981-33-4866-0_23/MediaObjects/498359_1_En_23_Fig2_HTML.png",
    tags: ["Arduino", "GSM Module", "GPS", "Sensors"],
    features: [
      "2m ultrasonic obstacle detection",
      "Emergency SOS with GPS location via SMS",
      "Real-time GPS tracking on mobile",
      "12-hour rechargeable battery",
      "Haptic vibration feedback",
      "Weatherproof enclosure design",
    ],
    github:
      "https://github.com/Aashik9567/Arduino-projects-/tree/main/Ultrasonic-Blindstick-with-GSM-and-GPS-tracking-main",
    live: null,
    category: "Hardware",
    cats: ["Hardware", "IoT"],
    status: "live",
    stars: 12,
    forks: 5,
    views: 340,
    year: "2023",
    teamSize: 3,
    featured: false,
    highlights: [
      "Custom PCB design for compact form factor",
      "Power-efficient sleep mode for extended battery",
      "Waterproof ultrasonic sensor housing",
    ],
  },
  {
    title: "Automated Attendance System",
    shortDesc:
      "A web-integrated attendance management system using facial recognition that streamlines tracking for educational institutions.",
    fullDesc:
      "Built to eliminate manual attendance headaches in educational institutions, this system uses a Python-based facial recognition engine powered by the face_recognition library. Students register once with a photo, and the system recognizes them in real-time via webcam. The React frontend provides a clean dashboard for teachers, while the MongoDB backend stores all attendance data with timestamps. Reports can be generated as CSV exports with filtering by date, class, and student.",
    image: aams,
    tags: ["Python", "Face Recognition", "React", "MongoDB"],
    features: [
      "99.5% facial recognition accuracy",
      "Real-time webcam-based attendance capture",
      "Auto-generated CSV attendance reports",
      "Admin dashboard with analytics",
      "Multi-class and multi-section support",
      "Secure student data storage",
    ],
    github:
      "https://github.com/Aashik9567/Automated_Attendance_Management_System",
    live: null,
    category: "Full-Stack",
    cats: ["Full-Stack", "AI/ML"],
    status: "live",
    stars: 24,
    forks: 8,
    views: 580,
    year: "2024",
    teamSize: 4,
    featured: true,
    highlights: [
      "Face encoding stored as 128-d vectors for fast lookup",
      "Batch processing handles 50+ students in under 3 seconds",
      "Role-based access control for admins and teachers",
    ],
  },
  {
    title: "WeatherApp - AI Weather Dashboard",
    shortDesc:
      "A modern weather application built with Next.js 14 featuring OpenAI integration for intelligent weather insights.",
    fullDesc:
      "A fully responsive Progressive Web App built with Next.js 14 that goes beyond basic weather data. It integrates OpenAI to provide natural language weather summaries and actionable suggestions like 'Bring an umbrella today' or 'Great day for a run.' Data is sourced from OpenWeatherMap API with accurate 10-day forecasts, hourly breakdowns, and interactive radar maps. The PWA capabilities allow offline cached access to the last fetched data.",
    image:
      "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tags: ["Next.js", "React", "OpenAI", "TypeScript"],
    features: [
      "AI-powered weather summaries in natural language",
      "10-day forecast with hourly breakdowns",
      "Interactive radar and satellite maps",
      "PWA with offline cached data",
      "Location-based auto-detection",
      "Beautiful animated weather icons",
    ],
    github: "https://github.com/Aashik9567/weather-app-NextJs",
    live: null,
    category: "Web Dev",
    cats: ["Web Dev", "AI/ML"],
    status: "live",
    stars: 18,
    forks: 6,
    views: 420,
    year: "2023",
    teamSize: 2,
    featured: false,
    highlights: [
      "Server-side rendering for instant first paint",
      "OpenAI integration for human-like weather analysis",
      "Geolocation API for automatic city detection",
    ],
  },
];

const categories = [
  "All",
  "Web Dev",
  "Hardware",
  "IoT",
  "Full-Stack",
  "AI/ML",
  "Open Source",
];

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
        <div className="relative p-5 overflow-hidden text-center transition-all duration-300 rounded-2xl glass hover:-translate-y-2 hover:border-cyan-400/30">
          <div
            className="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none rounded-2xl group-hover:opacity-100"
            style={{
              boxShadow:
                "0 0 30px rgba(0,245,255,0.12) inset, 0 0 60px rgba(0,245,255,0.06)",
            }}
          />
          <div className="relative z-10">
            <div className="flex items-center justify-center mx-auto mb-2 w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
              <Icon className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-transparent font-display bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 bg-clip-text">
              {count}
              {suffix}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">{title}</div>
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
        className="flex items-center justify-center transition-all duration-200 rounded-md"
        style={{
          width: size + 8,
          height: size + 8,
          background: "rgba(255,255,255,0.06)",
        }}>
        {src ? (
          <img
            src={src}
            alt={name}
            style={{ width: size, height: size }}
            loading="lazy"
          />
        ) : (
          <span
            style={{
              fontSize: Math.max(size - 6, 10),
              color: "#94a3b8",
              fontWeight: 600,
            }}>
            {name.charAt(0)}
          </span>
        )}
      </div>
      {showTooltip && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-md text-[10px] font-medium whitespace-nowrap opacity-0 group-hover/tech:opacity-100 transition-opacity duration-200 pointer-events-none z-20"
          style={{
            background: "rgba(10,10,30,0.9)",
            color: "#e2e8f0",
            border: "1px solid rgba(255,255,255,0.1)",
          }}>
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
      dotColor: "#22c55e",
      label: "Live",
      bg: "rgba(34,197,94,0.15)",
      border: "rgba(34,197,94,0.3)",
    },
    "in-progress": {
      dotColor: "#3b82f6",
      label: "In Progress",
      bg: "rgba(59,130,246,0.15)",
      border: "rgba(59,130,246,0.3)",
    },
    archived: {
      dotColor: "#94a3b8",
      label: "Archived",
      bg: "rgba(148,163,184,0.1)",
      border: "rgba(148,163,184,0.2)",
    },
  }[status] || {
    dotColor: "#94a3b8",
    label: status,
    bg: "rgba(148,163,184,0.1)",
    border: "rgba(148,163,184,0.2)",
  };
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
      style={{
        background: conf.bg,
        border: `1px solid ${conf.border}`,
        color: conf.dotColor,
      }}>
      <motion.span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: conf.dotColor }}
        animate={
          status === "live" ? { scale: [1, 1.4, 1], opacity: [1, 0.6, 1] } : {}
        }
        transition={
          status === "live" ? { duration: 1.5, repeat: Infinity } : {}
        }
      />
      {conf.label}
    </span>
  );
};

/* ═══════════════ PROJECT CARD (GRID MODE) ═══════════════════ */

const ProjectCardGrid = ({ project, index, onOpenDetail }) => {
  const [hovered, setHovered] = useState(false);

  // Category-specific visual pattern
  const patterns = {
    Hardware:
      "radial-gradient(ellipse at 30% 70%, rgba(245,158,11,0.12), transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(0,245,255,0.08), transparent 50%)",
    "Full-Stack":
      "radial-gradient(ellipse at 25% 80%, rgba(99,102,241,0.12), transparent 60%), radial-gradient(ellipse at 75% 20%, rgba(0,245,255,0.1), transparent 50%)",
    "Web Dev":
      "radial-gradient(ellipse at 30% 60%, rgba(0,245,255,0.1), transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(139,92,246,0.1), transparent 50%)",
    IoT: "radial-gradient(ellipse at 40% 80%, rgba(6,182,212,0.12), transparent 60%), radial-gradient(ellipse at 60% 20%, rgba(139,92,246,0.08), transparent 50%)",
    "AI/ML":
      "radial-gradient(ellipse at 30% 70%, rgba(139,92,246,0.12), transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(240,171,252,0.1), transparent 50%)",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      layout>
      <SpotlightCard
        className="h-full overflow-hidden transition-all duration-300 rounded-2xl group glass"
        spotlightColor="rgba(0, 245, 255, 0.06)">
        <div
          className="flex flex-col h-full"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{ transition: "transform 0.3s ease, box-shadow 0.3s ease" }}>
          {/* ── Visual Header (~40%) ── */}
          <div className="relative overflow-hidden h-52">
            <img
              src={project.image}
              alt={project.title}
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            {/* Dark overlay gradient */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(3,7,18,0.95) 0%, rgba(3,7,18,0.4) 40%, transparent 100%)",
              }}
            />
            {/* Category pattern overlay */}
            <div
              className="absolute inset-0 opacity-60"
              style={{
                backgroundImage:
                  patterns[project.category] || patterns["Web Dev"],
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
              className="absolute inset-0 flex items-center justify-center gap-3"
              style={{
                background: "rgba(3,7,18,0.6)",
                backdropFilter: "blur(4px)",
              }}>
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #00f5ff, #8b5cf6)",
                    color: "#fff",
                  }}>
                  <ExternalLink className="w-3.5 h-3.5" /> View Live
                </a>
              )}
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 hover:scale-105"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff",
                }}>
                <Github className="w-3.5 h-3.5" /> GitHub
              </a>
            </motion.div>
          </div>

          {/* ── Card Body (~60%) ── */}
          <div className="flex flex-col flex-1 p-5">
            {/* Title + underline */}
            <h3 className="mb-1 text-lg font-bold leading-tight transition-colors duration-300 font-display text-slate-100 group-hover:text-cyan-300">
              {project.title}
            </h3>
            <motion.div
              className="h-0.5 rounded-full mb-3"
              style={{
                background: "linear-gradient(90deg, #00f5ff, #8b5cf6, #f0abfc)",
              }}
              initial={{ width: 0 }}
              whileInView={{ width: "40%" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            />

            {/* Category tag */}
            <span
              className="inline-block mb-2 px-2.5 py-0.5 text-[10px] font-semibold rounded-full w-fit bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                WebkitBackgroundClip: "initial",
                backgroundClip: "initial",
              }}>
              <span className="text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 bg-clip-text">
                {project.category}
              </span>
            </span>

            {/* Description */}
            <p className="flex-1 mb-4 text-sm leading-relaxed text-slate-400 line-clamp-3">
              {project.shortDesc}
            </p>

            {/* Metrics row */}
            <div className="flex items-center gap-4 mb-4 text-[11px] text-slate-500">
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
            <div
              className="flex items-center justify-between pt-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <button
                onClick={() => onOpenDetail(project)}
                className="flex items-center gap-1 text-xs font-semibold transition-colors duration-200 cursor-pointer"
                style={{ color: "#22d3ee" }}>
                Learn More <ArrowRight className="w-3 h-3" />
              </button>
              <div className="flex items-center gap-2">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
                  style={{ color: "#94a3b8" }}>
                  <Github className="w-4 h-4" />
                </a>
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
                    style={{ color: "#94a3b8" }}>
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
    className="overflow-hidden transition-all duration-300 glass rounded-2xl group hover:-translate-y-1">
    <div className="flex flex-col md:flex-row">
      {/* Image */}
      <div className="relative flex-shrink-0 w-full h-48 overflow-hidden md:w-64 md:h-auto">
        <img
          src={project.image}
          alt={project.title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, transparent 50%, rgba(3,7,18,0.8) 100%)",
          }}
        />
        <div className="absolute top-3 left-3">
          <StatusBadge status={project.status} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-1 p-5">
        <div>
          <h3 className="mb-2 text-lg font-bold transition-colors font-display text-slate-100 group-hover:text-cyan-300">
            {project.title}
          </h3>
          <p className="mb-3 text-sm leading-relaxed text-slate-400 line-clamp-2">
            {project.shortDesc}
          </p>
          <div className="flex gap-1.5 flex-wrap mb-3">
            {project.tags.map((t) => (
              <TechIcon key={t} name={t} size={14} />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
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
          <button
            onClick={() => onOpenDetail(project)}
            className="flex items-center gap-1 text-xs font-semibold cursor-pointer"
            style={{ color: "#22d3ee" }}>
            Details <ArrowRight className="w-3 h-3" />
          </button>
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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[20px] z-10"
        style={{
          background: "rgba(10, 10, 30, 0.95)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}>
        {/* Close + Nav buttons */}
        <div
          className="sticky top-0 z-20 flex items-center justify-between p-4"
          style={{
            background: "rgba(10,10,30,0.9)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
          <div className="flex items-center gap-2">
            {currentIdx > 0 && (
              <button
                onClick={() => onNavigate(allProjects[currentIdx - 1])}
                className="p-2 transition-colors rounded-lg cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "#94a3b8",
                }}>
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {currentIdx < allProjects.length - 1 && (
              <button
                onClick={() => onNavigate(allProjects[currentIdx + 1])}
                className="p-2 transition-colors rounded-lg cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "#94a3b8",
                }}>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            <span className="ml-2 text-xs text-slate-500">
              {currentIdx + 1} / {allProjects.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 transition-colors rounded-lg cursor-pointer"
            style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid gap-0 lg:grid-cols-2">
          {/* Left: Visual */}
          <div className="p-6">
            {/* Browser mockup */}
            <div
              className="overflow-hidden rounded-xl"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
              <div
                className="flex items-center gap-2 px-4 py-2.5"
                style={{ background: "rgba(255,255,255,0.04)" }}>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: "#ff5f57" }}
                />
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: "#febc2e" }}
                />
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: "#28c840" }}
                />
                <div
                  className="flex-1 mx-4 px-3 py-1 rounded-md text-[10px] text-slate-500"
                  style={{ background: "rgba(255,255,255,0.04)" }}>
                  {project.github}
                </div>
              </div>
              <img
                src={project.image}
                alt={project.title}
                className="object-cover w-full aspect-video"
              />
            </div>

            {/* Tech stack large */}
            <div className="mt-6">
              <h4 className="mb-3 text-xs font-semibold tracking-wider uppercase text-slate-500">
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <div
                    key={t}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}>
                    <TechIcon name={t} size={20} showTooltip={false} />
                    <span className="text-xs text-slate-300">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div
            className="p-6 lg:border-l"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-3 mb-4">
              <StatusBadge status={project.status} />
              <span className="text-xs text-slate-500">
                {project.year} &middot; Team of {project.teamSize}
              </span>
            </div>

            <h2 className="mb-4 text-2xl font-bold text-transparent lg:text-3xl font-display bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 bg-clip-text">
              {project.title}
            </h2>

            <p className="mb-6 text-sm leading-relaxed text-slate-400">
              {project.fullDesc}
            </p>

            {/* Features */}
            <div className="mb-6">
              <h4 className="mb-3 text-xs font-semibold tracking-wider uppercase text-slate-500">
                Key Features
              </h4>
              <div className="space-y-2">
                {project.features.map((f) => (
                  <div key={f} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-300">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights */}
            {project.highlights && (
              <div className="mb-6">
                <h4 className="mb-3 text-xs font-semibold tracking-wider uppercase text-slate-500">
                  Technical Highlights
                </h4>
                <div className="space-y-2">
                  {project.highlights.map((h) => (
                    <div key={h} className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-300">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metrics */}
            <div className="flex items-center gap-5 mb-6 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-yellow-400" />
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
            <div className="flex flex-wrap items-center gap-3">
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-200 hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #00f5ff, #8b5cf6)",
                    color: "#fff",
                  }}>
                  <Rocket className="w-4 h-4" /> View Live
                </a>
              )}
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-200 hover:scale-105"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(0,245,255,0.3)",
                  color: "#22d3ee",
                }}>
                <Star className="w-4 h-4" /> View on GitHub
              </a>
              <button
                onClick={copyLink}
                className="px-3 py-2.5 rounded-xl text-sm flex items-center gap-1.5 transition-all cursor-pointer"
                style={{ color: "#94a3b8" }}>
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ═══════════════ FEATURED SPOTLIGHT ═════════════════════════ */

const FeaturedSpotlight = ({ project, onOpenDetail }) => {
  const [ref] = useInView({ triggerOnce: true, threshold: 0.15 });
  return (
    <ScrollReveal>
      <div
        ref={ref}
        className="relative mb-16 overflow-hidden rounded-2xl glass group">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 20% 50%, rgba(0,245,255,0.06), transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(139,92,246,0.06), transparent 60%)",
          }}
        />
        <div className="relative grid gap-6 p-6 lg:grid-cols-2 lg:p-10">
          {/* Left: Mockup */}
          <div className="relative">
            {/* Featured badge */}
            <div
              className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold"
              style={{
                background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                color: "#1a1a2e",
              }}>
              <Crown className="w-3.5 h-3.5" /> Featured
            </div>
            {/* Laptop frame */}
            <div
              className="overflow-hidden rounded-xl"
              style={{
                border: "2px solid rgba(255,255,255,0.08)",
                boxShadow: "0 0 40px rgba(0,245,255,0.08)",
              }}>
              <div
                className="flex items-center gap-1.5 px-4 py-2"
                style={{ background: "rgba(255,255,255,0.04)" }}>
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: "#ff5f57" }}
                />
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: "#febc2e" }}
                />
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: "#28c840" }}
                />
              </div>
              <img
                src={project.image}
                alt={project.title}
                className="object-cover w-full aspect-video"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col justify-center">
            <StatusBadge status={project.status} />
            <h3 className="mt-4 mb-3 text-2xl font-bold text-transparent lg:text-3xl font-display bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 bg-clip-text">
              {project.title}
            </h3>
            <p className="mb-5 text-sm leading-relaxed text-slate-400">
              {project.fullDesc?.slice(0, 200) || project.shortDesc}...
            </p>

            {/* Tech icons */}
            <div className="flex flex-wrap gap-2 mb-5">
              {project.tags.map((t) => (
                <TechIcon key={t} name={t} size={20} />
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-5 mb-6 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-yellow-400" />
                {project.stars}
              </span>
              <span className="flex items-center gap-1.5">
                <GitFork className="w-4 h-4" />
                {project.forks}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {project.year}
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenDetail(project)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-200 hover:scale-105 cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #00f5ff, #8b5cf6)",
                  color: "#fff",
                }}>
                <Eye className="w-4 h-4" /> View Details
              </button>
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-200 hover:scale-105"
                style={{
                  border: "1px solid rgba(0,245,255,0.3)",
                  color: "#22d3ee",
                }}>
                <Github className="w-4 h-4" /> Source Code
              </a>
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
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
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
            <Zap className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-transparent font-display bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 bg-clip-text">
              Technologies I Build With
            </h3>
            <p className="text-sm text-slate-500">Across all projects</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {techUsage.map((tech, i) => {
            const scale = 0.7 + (tech.count / maxCount) * 0.5;
            const src = TECH_ICONS[tech.name];
            return (
              <motion.div
                key={tech.name}
                className="relative flex flex-col items-center gap-2 p-4 transition-all duration-300 cursor-default group/bubble rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  transform: `scale(${scale})`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: 1, scale } : {}}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{
                  boxShadow: "0 0 25px rgba(0,245,255,0.15)",
                  borderColor: "rgba(0,245,255,0.25)",
                }}>
                <div className="flex items-center justify-center w-10 h-10">
                  {src ? (
                    <img
                      src={src}
                      alt={tech.name}
                      className="w-8 h-8"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="flex items-center justify-center w-8 h-8 text-sm font-bold rounded-lg text-cyan-400"
                      style={{ background: "rgba(0,245,255,0.1)" }}>
                      {tech.name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium text-slate-300">
                  {tech.name}
                </span>
                <span className="text-[10px] font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {tech.count} project{tech.count > 1 ? "s" : ""}
                </span>

                {/* Tooltip listing projects */}
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 rounded-lg text-[10px] whitespace-nowrap opacity-0 group-hover/bubble:opacity-100 transition-opacity duration-200 pointer-events-none z-30"
                  style={{
                    background: "rgba(10,10,30,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#cbd5e1",
                  }}>
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

const BottomCTA = () => (
  <ScrollReveal>
    <div className="relative p-10 overflow-hidden text-center rounded-2xl lg:p-16 glass">
      {/* Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-80 h-80 rounded-full blur-[100px]"
          style={{
            top: "-20%",
            left: "-10%",
            background: "rgba(0,245,255,0.06)",
          }}
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-72 h-72 rounded-full blur-[100px]"
          style={{
            bottom: "-20%",
            right: "-10%",
            background: "rgba(240,171,252,0.06)",
          }}
          animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10">
        <h3 className="mb-4 text-3xl font-bold text-transparent lg:text-4xl font-display bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 bg-clip-text">
          Have a Project in Mind?
        </h3>
        <p className="max-w-lg mx-auto mb-8 text-slate-400">
          Let&apos;s collaborate and build something amazing together. I&apos;m
          always open to new challenges and exciting ideas.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/contactus"
            className="px-7 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #00f5ff, #8b5cf6)",
              color: "#fff",
              boxShadow: "0 0 25px rgba(0,245,255,0.2)",
            }}>
            <Rocket className="w-4 h-4" /> Hire Me
          </Link>
          <Link
            to="/contactus"
            className="flex items-center gap-2 py-3 text-sm font-semibold transition-all duration-300 px-7 rounded-xl hover:scale-105"
            style={{
              border: "1px solid rgba(0,245,255,0.3)",
              color: "#22d3ee",
            }}>
            <Mail className="w-4 h-4" /> Get In Touch
          </Link>
        </div>
      </div>
    </div>
  </ScrollReveal>
);

/* ═══════════════════════ MAIN PAGE ══════════════════════════ */

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [modalProject, setModalProject] = useState(null);

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
        <div className="absolute top-1/3 right-0 h-[500px] bg-purple-500/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 left-0 h-[400px] bg-cyan-500/5 rounded-full blur-[128px]" />
        <div className="absolute top-2/3 left-1/3 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 section-padding pt-28">
        <div className="mx-auto max-w-7xl">
          {/* ══════ HERO ══════ */}
          <ScrollReveal className="relative mb-12 text-center lg:mb-16">
            <HeroParticles />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium rounded-full glass text-cyan-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                Portfolio
              </div>
              <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl font-display">
                Featured{" "}
                <span className="text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 bg-clip-text">
                  Projects
                </span>
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
                  className="text-lg font-medium md:text-xl text-slate-400"
                />
              </div>
              <p className="max-w-2xl mx-auto text-sm text-slate-500">
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

          {/* ══════ FEATURED SPOTLIGHT ══════ */}
          {featuredProject && (
            <FeaturedSpotlight
              project={featuredProject}
              onOpenDetail={setModalProject}
            />
          )}

          {/* ══════ FILTER BAR ══════ */}
          <div className="sticky top-[72px] z-30 mb-10">
            <div className="flex flex-col items-stretch gap-3 p-3 glass rounded-2xl md:flex-row md:items-center">
              {/* Category pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0 flex-1 min-w-0 scrollbar-hide">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="flex-shrink-0 px-4 py-2 text-xs font-semibold transition-all duration-300 rounded-full cursor-pointer whitespace-nowrap"
                    style={
                      activeCategory === cat
                        ? {
                            background:
                              "linear-gradient(135deg, #00f5ff, #8b5cf6)",
                            color: "#fff",
                            boxShadow: "0 0 20px rgba(0,245,255,0.2)",
                          }
                        : {
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            color: "#94a3b8",
                          }
                    }>
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search + View toggle */}
              <div className="flex items-center flex-shrink-0 gap-2">
                <div className="relative">
                  <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects..."
                    className="py-2 pr-4 text-xs transition-all duration-300 outline-none pl-9 rounded-xl w-44 md:w-52"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#e2e8f0",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(0,245,255,0.3)";
                      e.target.style.boxShadow =
                        "0 0 12px rgba(0,245,255,0.08)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255,255,255,0.08)";
                      e.target.style.boxShadow = "none";
                    }}
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
                      className="p-2 transition-all duration-200 rounded-lg cursor-pointer"
                      style={
                        viewMode === mode
                          ? {
                              background: "rgba(0,245,255,0.12)",
                              color: "#22d3ee",
                            }
                          : { color: "#64748b" }
                      }>
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
                  <Search className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                  <p className="text-lg font-medium text-slate-400">
                    No projects match your search
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
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
                      onOpenDetail={setModalProject}
                    />
                  ) : (
                    <ProjectCardList
                      key={project.title}
                      project={project}
                      index={i}
                      onOpenDetail={setModalProject}
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

      {/* ══════ PROJECT MODAL ══════ */}
      <AnimatePresence>
        {modalProject && (
          <ProjectModal
            project={modalProject}
            onClose={() => setModalProject(null)}
            onNavigate={setModalProject}
            allProjects={projects}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
