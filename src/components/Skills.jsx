import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Code2,
  Globe,
  Cpu,
  Users,
  Zap,
  Star,
  Brain,
  Rocket,
  ClipboardList,
  Wifi,
  CircuitBoard,
} from "lucide-react";
import { TypeAnimation } from "react-type-animation";
import { ScrollReveal, SpotlightCard } from "./ui";

/* ───────────────────────────── DATA ───────────────────────────── */

const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const skillCategories = [
  {
    title: "Programming Languages",
    icon: Code2,
    skills: [
      {
        name: "JavaScript",
        level: 90,
        icon: `${DEVICON}/javascript/javascript-original.svg`,
        tags: ["Advanced", "Daily Use", "5+ yrs"],
      },
      {
        name: "Python",
        level: 85,
        icon: `${DEVICON}/python/python-original.svg`,
        tags: ["Advanced", "3+ yrs"],
      },
      {
        name: "C++",
        level: 80,
        icon: `${DEVICON}/cplusplus/cplusplus-original.svg`,
        tags: ["Intermediate", "2+ yrs"],
      },
      {
        name: "C",
        level: 85,
        icon: `${DEVICON}/c/c-original.svg`,
        tags: ["Advanced", "3+ yrs"],
      },
    ],
  },
  {
    title: "Web Development",
    icon: Globe,
    skills: [
      {
        name: "React.js",
        level: 95,
        icon: `${DEVICON}/react/react-original.svg`,
        tags: ["Expert", "Daily Use", "3+ yrs"],
      },
      {
        name: "Node.js",
        level: 88,
        icon: `${DEVICON}/nodejs/nodejs-original.svg`,
        tags: ["Advanced", "3+ yrs"],
      },
      {
        name: "Express.js",
        level: 85,
        icon: `${DEVICON}/express/express-original.svg`,
        tags: ["Advanced", "2+ yrs"],
      },
      {
        name: "MongoDB",
        level: 80,
        icon: `${DEVICON}/mongodb/mongodb-original.svg`,
        tags: ["Intermediate", "2+ yrs"],
      },
    ],
  },
  {
    title: "Hardware & Embedded",
    icon: Cpu,
    skills: [
      {
        name: "Arduino",
        level: 92,
        icon: `${DEVICON}/arduino/arduino-original.svg`,
        tags: ["Expert", "Daily Use", "4+ yrs"],
      },
      {
        name: "Raspberry Pi",
        level: 85,
        icon: `${DEVICON}/raspberrypi/raspberrypi-original.svg`,
        tags: ["Advanced", "3+ yrs"],
      },
      {
        name: "Circuit Design",
        level: 78,
        lucideIcon: CircuitBoard,
        tags: ["Intermediate", "3+ yrs"],
      },
      {
        name: "IoT Protocols",
        level: 75,
        lucideIcon: Wifi,
        tags: ["Intermediate", "2+ yrs"],
      },
    ],
  },
  {
    title: "Professional Skills",
    icon: Users,
    skills: [
      {
        name: "Problem Solving",
        level: 95,
        lucideIcon: Brain,
        tags: ["Expert", "Core Strength"],
      },
      {
        name: "Quick Learning",
        level: 98,
        lucideIcon: Rocket,
        tags: ["Expert", "Adaptive"],
      },
      {
        name: "Team Leadership",
        level: 88,
        lucideIcon: Users,
        tags: ["Advanced", "Collaborative"],
      },
      {
        name: "Project Management",
        level: 82,
        lucideIcon: ClipboardList,
        tags: ["Intermediate", "Agile"],
      },
    ],
  },
];

const statsData = [
  { number: 15, suffix: "+", title: "Technologies", icon: Zap },
  { number: 8, suffix: "+", title: "Projects", icon: Code2 },
  { number: 4, suffix: "+", title: "Years Exp.", icon: Star },
  { number: 3, suffix: "", title: "Specializations", icon: Cpu },
];

const learningCards = [
  {
    emoji: "🌐",
    title: "Advanced IoT Systems",
    description:
      "Building connected ecosystems with MQTT, WebSockets, and edge computing for real-time device management.",
    isLive: true,
  },
  {
    emoji: "🤖",
    title: "AI for Electronics",
    description:
      "Integrating machine learning models into embedded systems for predictive maintenance and smart automation.",
    isLive: true,
  },
  {
    emoji: "⚡",
    title: "Embedded Systems",
    description:
      "Deep-diving into RTOS, bare-metal programming, and efficient firmware architecture for resource-constrained devices.",
    isLive: false,
  },
  {
    emoji: "📡",
    title: "Signal Processing",
    description:
      "Mastering DSP techniques for audio engineering, communications systems, and sensor data analysis.",
    isLive: false,
  },
];

const radarData = [
  {
    category: "Frontend",
    skills: [
      { name: "React", level: 95 },
      { name: "HTML/CSS", level: 90 },
      { name: "Tailwind", level: 88 },
      { name: "Framer Motion", level: 85 },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Node.js", level: 88 },
      { name: "Express", level: 85 },
      { name: "MongoDB", level: 80 },
      { name: "REST APIs", level: 90 },
    ],
  },
  {
    category: "Hardware",
    skills: [
      { name: "Arduino", level: 92 },
      { name: "RPi", level: 85 },
      { name: "PCB", level: 78 },
      { name: "IoT", level: 75 },
    ],
  },
  {
    category: "Tools",
    skills: [
      { name: "Git", level: 88 },
      { name: "VS Code", level: 95 },
      { name: "Linux", level: 80 },
      { name: "Docker", level: 70 },
    ],
  },
  {
    category: "Languages",
    skills: [
      { name: "JavaScript", level: 90 },
      { name: "Python", level: 85 },
      { name: "C/C++", level: 82 },
      { name: "TypeScript", level: 75 },
    ],
  },
];

const techPills = [
  "React",
  "Python",
  "Arduino",
  "Node.js",
  "MongoDB",
  "IoT",
  "C++",
  "Express",
  "Tailwind",
  "Git",
  "Linux",
  "MQTT",
  "HTML5",
  "CSS3",
  "REST API",
  "Raspberry Pi",
];

/* ──────────────────────── HELPER HOOKS ──────────────────────── */

const useCounter = (end, duration = 2000, startCounting = false) => {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!startCounting) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [end, duration, startCounting]);

  return count;
};

/* ──────────────────── FLOATING PILLS BG ─────────────────────── */

const FloatingPills = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {techPills.map((pill, i) => (
      <motion.div
        key={pill}
        className="absolute px-3 py-1 text-xs font-medium border rounded-full text-white/15 border-white/5"
        style={{
          left: `${(i * 6.25) % 95}%`,
          top: `${(i * 17 + 10) % 85}%`,
        }}
        animate={{
          y: [0, -30, 0],
          opacity: [0.1, 0.22, 0.1],
        }}
        transition={{
          duration: 6 + (i % 4) * 1.5,
          repeat: Infinity,
          delay: i * 0.4,
          ease: "easeInOut",
        }}>
        {pill}
      </motion.div>
    ))}
  </div>
);

/* ────────────────────── STAT CARD ───────────────────────────── */

const StatCard = ({ stat, index }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const count = useCounter(stat.number, 2000, inView);
  const Icon = stat.icon;

  return (
    <ScrollReveal delay={index * 0.1}>
      <div ref={ref} className="relative group">
        <div
          className="relative p-6 text-center transition-all duration-300 rounded-2xl overflow-hidden
            bg-white/[0.04] backdrop-blur-xl border border-white/[0.08]
            hover:-translate-y-2 hover:border-cyan-400/30"
          style={{ transition: "all 0.3s ease" }}>
          {/* Neon hover glow */}
          <div
            className="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none rounded-2xl group-hover:opacity-100"
            style={{
              boxShadow:
                "0 0 30px rgba(0,245,255,0.12) inset, 0 0 60px rgba(0,245,255,0.06)",
            }}
          />
          <div className="relative z-10">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
              <Icon className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-3xl font-bold text-transparent font-display bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 bg-clip-text">
              {count}
              {stat.suffix}
            </div>
            <div className="mt-1 text-xs text-slate-400">{stat.title}</div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

/* ─────────────────── NEON SKILL BAR ──────────────────────────── */

const NeonSkillBar = ({ skill, delay, inView }) => {
  const [count, setCount] = useState(0);
  const LucideIcon = skill.lucideIcon;

  useEffect(() => {
    if (!inView) return;
    let start = null;
    let raf;
    const animate = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / (1200 + delay * 800), 1);
      setCount(Math.floor(progress * skill.level));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [inView, skill.level, delay]);

  return (
    <div className="mb-5 group/skill">
      <div className="flex items-center gap-3 mb-2">
        {/* Tech icon */}
        <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0 border border-white/[0.06]">
          {skill.icon ? (
            <img
              src={skill.icon}
              alt={skill.name}
              className="w-5 h-5"
              loading="lazy"
            />
          ) : LucideIcon ? (
            <LucideIcon className="w-4 h-4 text-cyan-400" />
          ) : null}
        </div>

        {/* Skill name */}
        <span className="text-sm font-semibold transition-colors duration-300 text-slate-200 group-hover/skill:text-cyan-300">
          {skill.name}
        </span>

        {/* Animated percentage */}
        <span className="ml-auto text-sm font-bold text-transparent tabular-nums bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
          {count}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay, ease: "easeOut" }}
          className="relative h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #00f5ff, #8b5cf6, #f0abfc)",
            boxShadow:
              "0 0 12px rgba(0,245,255,0.4), 0 0 24px rgba(139,92,246,0.2)",
          }}>
          {/* Shimmer */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
              backgroundSize: "200% 100%",
            }}
            animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: delay + 1,
              ease: "linear",
            }}
          />
        </motion.div>
      </div>

      {/* Tags */}
      {skill.tags && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {skill.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[10px] font-medium rounded-full
                bg-white/[0.06] backdrop-blur-sm text-slate-400 border border-white/[0.06]">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

/* ──────────────── SKILL CATEGORY CARD ────────────────────────── */

const SkillCard = ({ category, index }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const Icon = category.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}>
      <SpotlightCard
        className="h-full p-6 lg:p-8 transition-all duration-300 rounded-2xl group hover:-translate-y-1
          bg-white/[0.04] backdrop-blur-xl border border-white/[0.08]"
        spotlightColor="rgba(0, 245, 255, 0.08)">
        {/* Category Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 transition-transform duration-300 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 group-hover:scale-110">
            <Icon className="w-7 h-7 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-transparent font-display bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 bg-clip-text">
              {category.title}
            </h3>
            <p className="text-xs text-slate-500">
              {category.skills.length} Skills
            </p>
            {/* Pulsing underline */}
            <motion.div
              className="h-0.5 mt-2 rounded-full w-full"
              style={{
                background: "linear-gradient(90deg, #00f5ff, #8b5cf6, #f0abfc)",
              }}
              animate={{ opacity: [0.4, 0.8, 0.4], scaleX: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-1">
          {category.skills.map((skill, i) => (
            <NeonSkillBar
              key={skill.name}
              skill={skill}
              delay={index * 0.1 + i * 0.15}
              inView={inView}
            />
          ))}
        </div>
      </SpotlightCard>
    </motion.div>
  );
};

/* ───────────────── FLIP CARD ──────────────────────────────────── */

const FlipCard = ({ card, index }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <ScrollReveal delay={index * 0.15}>
      <div
        className="relative cursor-pointer h-52 perspective-1000"
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
        onClick={() => setIsFlipped((f) => !f)}>
        <motion.div
          className="relative w-full h-full preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}>
          {/* Front */}
          <div
            className="absolute inset-0 backface-hidden rounded-2xl p-6 flex flex-col items-center justify-center text-center
              bg-white/[0.04] backdrop-blur-xl border border-white/[0.08]
              hover:shadow-[0_0_25px_rgba(0,245,255,0.12)] transition-shadow duration-300">
            {card.isLive && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-semibold text-emerald-400">
                  Live
                </span>
              </div>
            )}
            <div className="mb-3 text-4xl">{card.emoji}</div>
            <p className="text-sm font-bold text-slate-200">{card.title}</p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl p-6 flex items-center justify-center text-center
              bg-white/[0.06] backdrop-blur-xl border border-cyan-400/20
              shadow-[0_0_25px_rgba(0,245,255,0.08)]">
            <p className="text-sm leading-relaxed text-slate-300">
              {card.description}
            </p>
          </div>
        </motion.div>
      </div>
    </ScrollReveal>
  );
};

/* ───────────────── TECH RADAR ─────────────────────────────────── */

const TechRadar = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });
  const cx = 200,
    cy = 200,
    maxR = 155;
  const rings = [40, 80, 120, 155];
  const labels = ["Learning", "Intermediate", "Advanced", "Expert"];
  const hueBase = [185, 210, 270, 330, 150]; // per-category hue

  return (
    <ScrollReveal>
      <div
        ref={ref}
        className="p-8 lg:p-12 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08]">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
            <Zap className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-transparent font-display bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 bg-clip-text">
              Tech Stack Radar
            </h3>
            <p className="text-sm text-slate-500">
              Proficiency overview at a glance
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <svg viewBox="0 0 400 400" className="w-full max-w-lg">
            {/* Concentric rings */}
            {rings.map((r, i) => (
              <g key={r}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1"
                />
                <text
                  x={cx + 4}
                  y={cy - r + 14}
                  fill="rgba(148,163,184,0.5)"
                  style={{ fontSize: "8px" }}>
                  {labels[i]}
                </text>
              </g>
            ))}

            {/* Axes & labels */}
            {radarData.map((cat, i) => {
              const angle = (Math.PI * 2 * i) / radarData.length - Math.PI / 2;
              const x2 = cx + Math.cos(angle) * maxR;
              const y2 = cy + Math.sin(angle) * maxR;
              const lx = cx + Math.cos(angle) * (maxR + 28);
              const ly = cy + Math.sin(angle) * (maxR + 28);
              return (
                <g key={cat.category}>
                  <line
                    x1={cx}
                    y1={cy}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="1"
                  />
                  <text
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#22d3ee"
                    fontWeight="600"
                    style={{ fontSize: "10px" }}>
                    {cat.category}
                  </text>
                </g>
              );
            })}

            {/* Data points */}
            {radarData.map((cat, ci) => {
              const angle = (Math.PI * 2 * ci) / radarData.length - Math.PI / 2;
              return cat.skills.map((sk, si) => {
                const r = (sk.level / 100) * maxR;
                const spread = ((si - 1.5) / 4) * 0.35;
                const x = cx + Math.cos(angle + spread) * r;
                const y = cy + Math.sin(angle + spread) * r;
                const hue = hueBase[ci];
                return (
                  <g key={`${ci}-${si}`}>
                    <motion.circle
                      cx={x}
                      cy={y}
                      r={0}
                      animate={inView ? { r: 5 } : {}}
                      transition={{
                        duration: 0.5,
                        delay: ci * 0.12 + si * 0.06,
                      }}
                      fill={`hsl(${hue},75%,60%)`}
                      opacity={0.85}
                    />
                    <motion.circle
                      cx={x}
                      cy={y}
                      r={0}
                      animate={inView ? { r: 10 } : {}}
                      transition={{
                        duration: 0.5,
                        delay: ci * 0.12 + si * 0.06,
                      }}
                      fill={`hsl(${hue},75%,60%)`}
                      opacity={0.12}
                    />
                    <title>
                      {sk.name}: {sk.level}%
                    </title>
                  </g>
                );
              });
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {radarData.map((cat, i) => (
            <div key={cat.category} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: `hsl(${hueBase[i]},75%,60%)` }}
              />
              <span className="text-xs text-slate-400">{cat.category}</span>
            </div>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
};

/* ──────────── GITHUB ACTIVITY HEATMAP ────────────────────────── */

const GitHubHeatmap = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  const weeks = useMemo(() => {
    const data = [];
    for (let w = 0; w < 52; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const seed = Math.sin(w * 0.5 + d * 0.3) * 0.5 + 0.5;
        const rng =
          (((Math.sin(w * 12.9898 + d * 78.233) * 43758.5453) % 1) + 1) % 1;
        const v = rng * 0.4 + seed * 0.6;
        week.push(v < 0.3 ? 0 : v < 0.5 ? 1 : v < 0.7 ? 2 : v < 0.85 ? 3 : 4);
      }
      data.push(week);
    }
    return data;
  }, []);

  const colors = [
    "rgba(255,255,255,0.04)",
    "rgba(0,245,255,0.15)",
    "rgba(0,245,255,0.3)",
    "rgba(139,92,246,0.5)",
    "rgba(139,92,246,0.8)",
  ];

  return (
    <ScrollReveal>
      <div
        ref={ref}
        className="p-8 lg:p-12 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08]">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
              <Code2 className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-transparent font-display bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 bg-clip-text">
                Coding Activity
              </h3>
              <p className="text-sm text-slate-500">Contribution overview</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Less</span>
            {colors.map((c, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: c }}
              />
            ))}
            <span>More</span>
          </div>
        </div>

        {/* Grid */}
        <div className="pb-2 overflow-x-auto">
          <div className="flex gap-[3px] min-w-[700px]">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((level, di) => (
                  <motion.div
                    key={`${wi}-${di}`}
                    className="w-[11px] h-[11px] rounded-sm"
                    style={{ backgroundColor: colors[level] }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{
                      duration: 0.15,
                      delay: wi * 0.008 + di * 0.004,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

/* ═════════════════════════ MAIN PAGE ══════════════════════════ */

const Skills = () => {
  return (
    <div className="relative min-h-screen">
      {/* Decorative blurs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-[128px]" />
        <div className="absolute top-3/4 left-1/2 w-72 h-72 bg-fuchsia-500/5 rounded-full blur-[128px]" />
      </div>

      {/* Floating tech pills */}
      <FloatingPills />

      <div className="relative z-10 section-padding pt-28">
        <div className="mx-auto max-w-7xl">
          {/* ── Hero Section ── */}
          <ScrollReveal className="mb-16 text-center lg:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium rounded-full glass text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Technical Expertise
            </div>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl font-display">
              Skills &{" "}
              <span className="text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 bg-clip-text">
                Expertise
              </span>
            </h2>
            <div className="h-8 mb-4">
              <TypeAnimation
                sequence={[
                  "Full-Stack Developer",
                  2000,
                  "Electronics Engineer",
                  2000,
                  "IoT Specialist",
                  2000,
                  "Problem Solver",
                  2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                className="text-lg font-medium md:text-xl text-slate-400"
              />
            </div>
            <p className="max-w-2xl mx-auto text-lg leading-relaxed text-slate-400">
              Combining Electronics Engineering expertise with Full-Stack Web
              Development skills to create innovative solutions.
            </p>
          </ScrollReveal>

          {/* ── Stats Bar ── */}
          <div className="grid grid-cols-2 gap-4 mb-20 md:grid-cols-4">
            {statsData.map((stat, i) => (
              <StatCard key={stat.title} stat={stat} index={i} />
            ))}
          </div>

          {/* ── Skill Category Cards ── */}
          <div className="grid gap-6 mb-20 md:grid-cols-2">
            {skillCategories.map((cat, i) => (
              <SkillCard key={cat.title} category={cat} index={i} />
            ))}
          </div>

          {/* ── Continuous Learning ── */}
          <ScrollReveal>
            <div className="mb-20 p-8 lg:p-12 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08]">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
                  <Star className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-transparent font-display bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 bg-clip-text">
                    Continuous Learning
                  </h3>
                  <p className="text-sm text-slate-500">
                    Always growing, always improving
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {learningCards.map((card, i) => (
                  <FlipCard key={card.title} card={card} index={i} />
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* ── Tech Stack Radar ── */}
          <div className="mb-20">
            <TechRadar />
          </div>

          {/* ── GitHub Heatmap ── */}
          <div className="mb-16">
            <GitHubHeatmap />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;
