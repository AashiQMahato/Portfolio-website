import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  MapPin,
  Calendar,
  Mail,
  Phone,
  Award,
  Users,
  Lightbulb,
  BookOpen,
  Cpu,
  Globe,
  Zap,
  Code2,
  GraduationCap,
  Layers,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { ScrollReveal, GlassCard, SectionHeader } from "./ui";
import profileImage from "../assets/12.jpg";

const About = () => {
  const shouldReduceMotion = useReducedMotion();
  const stats = [
    { value: "15+", label: "Technologies", icon: Cpu },
    { value: "8+", label: "Projects", icon: Lightbulb },
    { value: "4+", label: "Years Exp.", icon: Calendar },
    { value: "10+", label: "Collaborations", icon: Users },
  ];

  const personalInfo = [
    { icon: MapPin, label: "Location", value: "Kathmandu, Nepal" },
    { icon: Mail, label: "Email", value: "aashikmahato9567@gmail.com" },
    { icon: Phone, label: "Phone", value: "+977-9808711811" },
    { icon: Calendar, label: "Experience", value: "4+ Years" },
  ];

  const skills = [
    {
      name: "React",
      color: "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-300",
    },
    {
      name: "Node.js",
      color:
        "from-green-500/20 to-green-600/10 border-green-500/30 text-green-300",
    },
    {
      name: "Python",
      color:
        "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-300",
    },
    {
      name: "JavaScript",
      color:
        "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-300",
    },
    {
      name: "TypeScript",
      color: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-300",
    },
    {
      name: "Arduino",
      color: "from-teal-500/20 to-teal-600/10 border-teal-500/30 text-teal-300",
    },
    {
      name: "Raspberry Pi",
      color: "from-red-500/20 to-red-600/10 border-red-500/30 text-red-300",
    },
    {
      name: "IoT",
      color:
        "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-300",
    },
    {
      name: "MongoDB",
      color:
        "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-300",
    },
    {
      name: "Express.js",
      color: "from-gray-400/20 to-gray-500/10 border-gray-400/30 text-gray-300",
    },
    {
      name: "C/C++",
      color:
        "from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 text-indigo-300",
    },
    {
      name: "Git",
      color:
        "from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-300",
    },
    {
      name: "Tailwind CSS",
      color: "from-sky-500/20 to-sky-600/10 border-sky-500/30 text-sky-300",
    },
    {
      name: "Next.js",
      color:
        "from-slate-400/20 to-slate-500/10 border-slate-400/30 text-slate-300",
    },
    {
      name: "TensorFlow",
      color: "from-rose-500/20 to-rose-600/10 border-rose-500/30 text-rose-300",
    },
  ];

  const values = [
    {
      title: "Innovation",
      icon: Lightbulb,
      description:
        "Developing creative solutions that bridge the gap between hardware and software, turning ideas into real-world impact.",
      gradient: "from-amber-500 to-orange-500",
      bgGlow: "from-amber-500/10 to-orange-500/5",
      border: "border-amber-500/20",
      iconBg: "bg-amber-500/10",
      tag: "Creative Thinking",
    },
    {
      title: "Excellence",
      icon: Award,
      description:
        "Maintaining high standards in every line of code — whether building embedded firmware or deploying modern web applications.",
      gradient: "from-primary-500 to-primary-600",
      bgGlow: "from-primary-500/10 to-primary-600/5",
      border: "border-primary-500/20",
      iconBg: "bg-primary-500/10",
      tag: "Quality First",
    },
    {
      title: "Collaboration",
      icon: Users,
      description:
        "Working effectively in cross-functional teams to deliver complex projects by combining diverse perspectives and expertise.",
      gradient: "from-secondary-500 to-secondary-600",
      bgGlow: "from-secondary-500/10 to-secondary-600/5",
      border: "border-secondary-500/20",
      iconBg: "bg-secondary-500/10",
      tag: "Team Player",
    },
    {
      title: "Learning",
      icon: BookOpen,
      description:
        "Staying current with emerging technologies and frameworks, constantly evolving to tackle next-generation engineering challenges.",
      gradient: "from-violet-500 to-purple-600",
      bgGlow: "from-violet-500/10 to-purple-600/5",
      border: "border-violet-500/20",
      iconBg: "bg-violet-500/10",
      tag: "Growth Mindset",
    },
  ];

  const highlights = [
    {
      icon: GraduationCap,
      text: "Electronics, Communication & Information Engineering",
    },
    { icon: Globe, text: "Full-Stack Web Development" },
    { icon: Cpu, text: "IoT & Embedded Systems" },
    { icon: Code2, text: "Smart Hardware Prototyping" },
  ];

  return (
    <div className="relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 -left-40 h-[420px] w-[420px] bg-primary/8 rounded-full blur opacity-60" />
        <div className="absolute bottom-1/4 -right-40 h-[360px] w-[360px] bg-primary/8 rounded-full blur opacity-55" />
        <div className="absolute top-2/3 left-1/2 h-[280px] w-[280px] bg-primary/6 rounded-full blur opacity-50" />
      </div>

      <div className="relative z-10 section-padding pt-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            badge="About Me"
            title={
              <>
                Get to Know <span className="gradient-text">Me Better</span>
              </>
            }
            description="Electronics Engineer & Full Stack Developer based in Kathmandu, Nepal. Passionate about building innovative solutions at the intersection of hardware and software."
          />

          {/* ── Main Content Grid ── */}
          <div className="grid gap-8 mb-20 lg:grid-cols-5 lg:gap-10">
            {/* LEFT — Photo & Info */}
            <ScrollReveal className="lg:col-span-2" direction="left">
              <div className="space-y-6">
                {/* Profile Image */}
                <div className="relative w-64 h-64 mx-auto lg:w-full lg:h-80">
                  <div className="absolute -inset-3 rounded-3xl bg-primary/10 blur" />
                  {/* floating badge */}
                  <motion.div
                    animate={shouldReduceMotion ? undefined : { y: [0, -6, 0] }}
                    transition={
                      shouldReduceMotion
                        ? undefined
                        : { duration: 3, repeat: Infinity, ease: "easeInOut" }
                    }
                    className="absolute -top-3 -right-3 z-10 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-sm flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    Available for work
                  </motion.div>
                  <div className="relative w-full h-full rounded-2xl overflow-hidden glass p-[2px]">
                    <img
                      src={profileImage}
                      alt="Aashiq Mahato"
                      className="object-cover w-full h-full rounded-2xl"
                    />
                    {/* subtle overlay gradient at bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/70 to-transparent rounded-b-2xl" />
                  </div>
                </div>

                {/* Personal Info */}
                <div className="space-y-2.5">
                  {personalInfo.map((info) => {
                    const Icon = info.icon;
                    return (
                      <motion.div
                        key={info.label}
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-3 p-3 transition-all rounded-xl glass glass-hover">
                        <div className="flex items-center justify-center rounded-lg w-9 h-9 bg-gradient-to-br from-primary-500/20 to-secondary-500/10 shrink-0">
                          <Icon className="w-4 h-4 text-primary-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">
                            {info.label}
                          </p>
                          <p className="text-sm font-medium truncate text-foreground">
                            {info.value}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>

            {/* RIGHT — Bio Card + Stats + Skills */}
            <div className="space-y-6 lg:col-span-3">
              {/* ── BIO CARD ── */}
              <ScrollReveal delay={0.2}>
                <div className="relative overflow-hidden border rounded-2xl border-border bg-card/60 backdrop-blur shadow-sm">
                  <div className="relative z-10 space-y-5 p-7">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                          <span className="text-xs font-medium tracking-wide text-green-400 uppercase">
                            Open to opportunities
                          </span>
                        </div>
                        <h3 className="text-xl font-bold leading-snug font-display">
                          Electronics Engineer &{" "}
                          <span className="gradient-text">
                            Full-Stack Developer
                          </span>
                        </h3>
                      </div>
                      <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-xl border border-border bg-muted/60">
                        <Zap className="w-5 h-5 text-primary" />
                      </div>
                    </div>

                    {/* Bio paragraphs */}
                    <div className="space-y-3">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        I'm{" "}
                        <span className="font-semibold text-foreground">
                          Aashik Kumar Mahato
                        </span>
                        , an Electronics, Communication, and Information
                        Engineering student at the{" "}
                        <span className="font-medium text-primary">
                          Advanced College of Engineering and Management
                        </span>
                        , Kathmandu. With a passion for bridging the physical
                        and digital worlds, I specialize in IoT systems,
                        embedded programming, and modern web development.
                      </p>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        My journey spans from designing smart hardware
                        prototypes to building full-stack web applications. I
                        believe in continuous learning and delivering excellent
                        experiences through thoughtful engineering.
                      </p>
                    </div>

                    {/* Highlights */}
                    <div className="grid grid-cols-2 gap-2">
                      {highlights.map((h) => {
                        const Icon = h.icon;
                        return (
                          <div
                            key={h.text}
                            className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50 border border-border">
                            <Icon className="w-3.5 h-3.5 text-primary-400 shrink-0" />
                            <span className="text-xs leading-snug text-muted-foreground">
                              {h.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* CTA */}
                    <motion.button
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-2 text-sm font-medium transition-colors text-primary hover:text-primary/80 group">
                      View my full resume
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </motion.button>
                  </div>
                </div>
              </ScrollReveal>

              {/* Stats Grid */}
              <ScrollReveal delay={0.3}>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={stat.label}
                        whileHover={{ y: -3 }}
                        className="relative p-4 overflow-hidden text-center rounded-xl glass glass-hover group">
                        <div className="absolute inset-0 transition-opacity opacity-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 group-hover:opacity-100" />
                        <div className="flex items-center justify-center mx-auto mb-2 rounded-lg w-9 h-9 bg-gradient-to-br from-primary-500/20 to-secondary-500/20">
                          <Icon className="w-4 h-4 text-primary-400" />
                        </div>
                        <div className="text-2xl font-bold text-foreground font-display">
                          {stat.value}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {stat.label}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </ScrollReveal>

              {/* Skill Pills */}
              <ScrollReveal delay={0.4}>
                <div className="p-5 border rounded-2xl border-border bg-card/60 backdrop-blur shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Layers className="w-4 h-4 text-primary-400" />
                    <h4 className="text-sm font-semibold tracking-wide uppercase font-display text-foreground">
                      Tech Stack
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <motion.span
                        key={skill.name}
                        whileHover={{ scale: 1.06, y: -2 }}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-br border cursor-default transition-all ${skill.color}`}>
                        {skill.name}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* ── Values Section ── */}
          <ScrollReveal delay={0.1}>
            <div className="flex items-center gap-3 mb-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border/70 to-transparent" />
              <span className="px-4 text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                What Drives Me
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border/70 to-transparent" />
            </div>
          </ScrollReveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <ScrollReveal key={value.title} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    className={`relative h-full p-6 rounded-2xl overflow-hidden border ${value.border} group cursor-default transition-all duration-300`}>
                    {/* bg glow */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${value.bgGlow} opacity-60 group-hover:opacity-100 transition-opacity`}
                    />
                    {/* top-right decorative circle */}
                    <div
                      className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${value.gradient} opacity-10 group-hover:opacity-20 transition-opacity blur`}
                    />

                    <div className="relative z-10">
                      {/* icon */}
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      {/* tag pill */}
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${value.iconBg} border ${value.border} mb-3`}>
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                          {value.tag}
                        </span>
                      </div>

                      <h4 className="mb-2 text-lg font-bold font-display text-foreground">
                        {value.title}
                      </h4>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {value.description}
                      </p>

                      {/* bottom accent line */}
                      <div
                        className={`mt-5 h-0.5 w-full scale-x-0 group-hover:scale-x-100 origin-left bg-gradient-to-r ${value.gradient} rounded-full transition-transform duration-500`}
                      />
                    </div>
                  </motion.div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
