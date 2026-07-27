import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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
  ZoomIn,
  ZoomOut,
  Download,
  X,
  FileText,
  Github,
  Linkedin,
  ExternalLink,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import { ScrollReveal, SectionHeader } from "./ui";
import profileImage from "../assets/12.jpg";

const CV = {
  name: "Aashik Kumar Mahato",
  title: "Electronics Engineer & Full-Stack Developer",
  contact: {
    location: "Shantinagar, Kathmandu",
    phone: "9808711811",
    email: "aashikkrmahatoo@gmail.com",
    github: "https://github.com/AashiQMahato",
    linkedin: "https://www.linkedin.com/in/aashiq-mahato-9a343b2b4/",
  },
  summary:
    "Dynamic IT professional with a strong foundation in modern web development and electronics engineering. Skilled in the React ecosystem, Next.js, TypeScript, and IoT systems. Adept at translating complex technical concepts into clear, user-friendly solutions.",
  experience: [
    {
      role: "Technical Writer – Electronics",
      company: "Entegra Sources Pvt. Ltd",
      location: "Buddhanagar",
      period: "Nov 2025 – Feb 2026",
      bullets: [
        "Prepared Career Episodes, technical reports, and engineering documentation.",
        "Drafted, edited, and designed technical content aligned with competency standards.",
        "Translated complex engineering narratives into structured professional documents.",
      ],
    },
    {
      role: "Frontend Developer",
      company: "WebX Nepal",
      location: "Lazimpat",
      period: "Jun 2025 – Sep 2025",
      bullets: [
        "Designed and developed responsive web interfaces using React and Tailwind CSS.",
        "Converted UI/UX designs into interactive web applications with performance optimization.",
        "Ensured cross-browser compatibility and visually appealing digital experiences.",
      ],
    },
  ],
  education: [
    {
      degree: "BE in Electronics, Communication & Information Engineering",
      institution: "Advanced College of Engineering and Management",
      location: "Kathmandu",
      period: "Jan 2021 – Jan 2025",
    },
    {
      degree: "Class 12",
      institution: "Prasadi Academy",
      location: "Kathmandu",
      period: "Jul 2018 – Jul 2019",
    },
    {
      degree: "SEE",
      institution: "Swastik Pathshala",
      location: "Mirchaiya",
      period: "Mar 2012 – Mar 2017",
    },
  ],
  projects: [
    {
      name: "Automated Attendance Management System",
      stack: "YOLOv8, FaceNet, React, Node.js, MongoDB",
      url: "https://github.com/AashiQMahato/Automated_Attendance_Management_System",
      bullets: [
        "Automated attendance using YOLOv8 and FaceNet for real-time face recognition.",
        "Built a web platform with React, Node.js, and MongoDB for live tracking.",
        "Implemented email notifications for low attendance alerts.",
      ],
    },
    {
      name: "WeatherApp – AI-Enhanced Weather Dashboard",
      stack: "Next.js, OpenAI, Responsive UI",
      url: "https://github.com/AashiQMahato/weather-app-NextJs",
      bullets: [
        "Real-time weather data with auto-refresh and AI-powered analysis.",
        "Interactive location search with GPS support and 10-day forecast.",
        "Dark theme with glassmorphism UI and fully responsive design.",
      ],
    },
    {
      name: "Smart School Management System",
      stack: "React, Node.js, Express, MongoDB",
      url: "https://github.com/AashiQMahato/Smart-School-management-system-Frontend",
      bullets: [
        "Role-based dashboards for Admin, Teacher, Student, and Parent.",
        "Modules for attendance, timetable, marks, fee monitoring, and notifications.",
        "AI-powered analytics and student performance insights.",
      ],
    },
    {
      name: "Cable Network Website",
      stack: "Next.js, TypeScript, Tailwind CSS, Ant Design, React Three Fiber",
      url: "https://raghunathpurcable.com.np/",
      bullets: [
        "Modern ISP website with dark/light/system theme support.",
        "Animated 3D visuals using React Three Fiber and smooth transitions.",
        "Scalable frontend architecture with reusable components.",
      ],
    },
  ],
  skills: [
    "HTML",
    "CSS",
    "JavaScript",
    "React JS",
    "Next JS",
    "TypeScript",
    "Node JS (Express)",
    "MongoDB (Mongoose)",
    "Python",
    "C/C++",
    "Git/GitHub",
    "Arduino",
    "ESP",
    "Raspberry Pi",
  ],
  languages: ["English", "Nepali"],
};

/* ─── RESUME DOCUMENT ─────────────────────────────────────── */
const ResumeDocument = ({ zoom, isMobile }) => {
  const effectiveZoom = isMobile ? Math.min(zoom, 0.55) : zoom;
  return (
    <div
      style={{
        transform: `scale(${effectiveZoom})`,
        transformOrigin: "top center",
        transition: "transform 0.3s ease",
        width: isMobile ? "100vw" : "860px",
        minWidth: isMobile ? "auto" : 700,
        margin: "0 auto",
        backgroundColor: "#ffffff",
        color: "#111827",
        borderRadius: isMobile ? 12 : 16,
        overflow: "hidden",
        boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)",
          color: "#fff",
          padding: isMobile ? "20px 18px" : "32px 40px",
        }}>
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "flex-end",
            gap: 12,
          }}>
          <div>
            <h1
              style={{
                fontSize: isMobile ? 20 : 28,
                fontWeight: 800,
                margin: 0,
                letterSpacing: -0.5,
              }}>
              {CV.name}
            </h1>
            <p
              style={{
                margin: "5px 0 0",
                fontSize: isMobile ? 11 : 13,
                color: "#9ca3af",
                fontWeight: 500,
              }}>
              {CV.title}
            </p>
          </div>
          <div
            style={{
              fontSize: isMobile ? 10 : 11,
              color: "#6b7280",
              lineHeight: 1.8,
              textAlign: isMobile ? "left" : "right",
            }}>
            <div>📍 {CV.contact.location}</div>
            <div>📞 {CV.contact.phone}</div>
            <div>✉️ {CV.contact.email}</div>
            <div>🔗 github.com/AashiQMahato</div>
            <div>🔗 linkedin/aashiq-mahato</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "210px 1fr",
        }}>
        {/* Sidebar */}
        <div
          style={{
            background: "#f9fafb",
            borderRight: isMobile ? "none" : "1px solid #f3f4f6",
            borderBottom: isMobile ? "1px solid #f3f4f6" : "none",
            padding: isMobile ? "18px 18px" : "28px 20px",
            display: "flex",
            flexDirection: isMobile ? "row" : "column",
            flexWrap: isMobile ? "wrap" : "nowrap",
            gap: isMobile ? 16 : 24,
          }}>
          {/* Skills */}
          <div style={{ flex: isMobile ? "1 1 100%" : "unset" }}>
            <p
              style={{
                fontSize: 9,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 2,
                color: "#9ca3af",
                marginBottom: 8,
              }}>
              Core Skills
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {CV.skills.map((s) => (
                <span
                  key={s}
                  style={{
                    padding: "2px 7px",
                    background: "#e5e7eb",
                    borderRadius: 20,
                    fontSize: 9.5,
                    fontWeight: 500,
                    color: "#374151",
                  }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
          {/* Education */}
          <div style={{ flex: isMobile ? "1 1 45%" : "unset" }}>
            <p
              style={{
                fontSize: 9,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 2,
                color: "#9ca3af",
                marginBottom: 8,
              }}>
              Education
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {CV.education.map((e) => (
                <div
                  key={e.degree}
                  style={{ borderLeft: "2px solid #d1d5db", paddingLeft: 8 }}>
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#111827",
                      margin: 0,
                      lineHeight: 1.4,
                    }}>
                    {e.degree}
                  </p>
                  <p
                    style={{
                      fontSize: 9,
                      color: "#6b7280",
                      margin: "2px 0 0",
                    }}>
                    {e.institution}
                  </p>
                  <p
                    style={{
                      fontSize: 8.5,
                      color: "#9ca3af",
                      margin: "2px 0 0",
                    }}>
                    {e.period}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {/* Languages */}
          <div style={{ flex: isMobile ? "1 1 45%" : "unset" }}>
            <p
              style={{
                fontSize: 9,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 2,
                color: "#9ca3af",
                marginBottom: 8,
              }}>
              Languages
            </p>
            {CV.languages.map((l) => (
              <div
                key={l}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  marginBottom: 4,
                }}>
                <div
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "#9ca3af",
                  }}
                />
                <span style={{ fontSize: 10, color: "#374151" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main */}
        <div
          style={{
            padding: isMobile ? "18px 18px" : "28px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}>
          {/* Summary */}
          <div>
            <p
              style={{
                fontSize: 9,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 2,
                color: "#9ca3af",
                marginBottom: 6,
              }}>
              Profile
            </p>
            <p
              style={{
                fontSize: isMobile ? 10.5 : 11,
                lineHeight: 1.7,
                color: "#4b5563",
                margin: 0,
              }}>
              {CV.summary}
            </p>
          </div>
          {/* Experience */}
          <div>
            <p
              style={{
                fontSize: 9,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 2,
                color: "#9ca3af",
                marginBottom: 8,
              }}>
              Experience
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {CV.experience.map((exp) => (
                <div
                  key={exp.role}
                  style={{ borderLeft: "2px solid #111827", paddingLeft: 12 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 8,
                      flexWrap: "wrap",
                    }}>
                    <div>
                      <p
                        style={{
                          fontSize: isMobile ? 11 : 12,
                          fontWeight: 700,
                          color: "#111827",
                          margin: 0,
                        }}>
                        {exp.role}
                      </p>
                      <p
                        style={{
                          fontSize: 9.5,
                          color: "#6b7280",
                          margin: "2px 0 0",
                          fontWeight: 500,
                        }}>
                        {exp.company} · {exp.location}
                      </p>
                    </div>
                    <span
                      style={{
                        fontSize: 9,
                        color: "#9ca3af",
                        whiteSpace: "nowrap",
                      }}>
                      {exp.period}
                    </span>
                  </div>
                  <ul
                    style={{
                      margin: "6px 0 0",
                      padding: 0,
                      listStyle: "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                    }}>
                    {exp.bullets.map((b, i) => (
                      <li
                        key={i}
                        style={{
                          display: "flex",
                          gap: 5,
                          fontSize: isMobile ? 9.5 : 10,
                          color: "#4b5563",
                          lineHeight: 1.5,
                        }}>
                        <span style={{ color: "#9ca3af", marginTop: 1 }}>
                          ›
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          {/* Projects */}
          <div>
            <p
              style={{
                fontSize: 9,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 2,
                color: "#9ca3af",
                marginBottom: 8,
              }}>
              Projects
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {CV.projects.map((p) => (
                <div
                  key={p.name}
                  style={{ borderLeft: "2px solid #d1d5db", paddingLeft: 12 }}>
                  <p
                    style={{
                      fontSize: isMobile ? 10.5 : 11,
                      fontWeight: 700,
                      color: "#111827",
                      margin: 0,
                    }}>
                    {p.name}
                  </p>
                  <p
                    style={{
                      fontSize: 9,
                      color: "#9ca3af",
                      fontFamily: "monospace",
                      margin: "2px 0 5px",
                    }}>
                    {p.stack}
                  </p>
                  <ul
                    style={{
                      margin: 0,
                      padding: 0,
                      listStyle: "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}>
                    {p.bullets.map((b, i) => (
                      <li
                        key={i}
                        style={{
                          display: "flex",
                          gap: 5,
                          fontSize: isMobile ? 9.5 : 10,
                          color: "#4b5563",
                          lineHeight: 1.5,
                        }}>
                        <span style={{ color: "#9ca3af", marginTop: 1 }}>
                          ›
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── RESUME MODAL ────────────────────────────────────────── */
const ResumeModal = ({ onClose }) => {
  const [zoom, setZoom] = useState(1);
  const isMobile = window.innerWidth < 640;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/src/assets/AashikKumarMahatoResume.pdf";
    link.download = "Aashik_Kumar_Mahato_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.88)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        display: "flex",
        flexDirection: "column",
        overflowY: "hidden",
      }}>
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isMobile ? "10px 12px" : "12px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(10,10,25,0.97)",
          flexShrink: 0,
          flexWrap: "wrap",
          gap: 8,
        }}>
        {/* Title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            minWidth: 0,
          }}>
          <FileText size={15} color="#6366f1" style={{ flexShrink: 0 }} />
          <span
            style={{
              fontSize: isMobile ? 12 : 14,
              fontWeight: 600,
              color: "#f1f5f9",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
            {isMobile ? "Resume" : `Resume — ${CV.name}`}
          </span>
        </div>

        {/* Controls */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? 6 : 8,
            flexWrap: "nowrap",
          }}>
          {/* Zoom — hide on very small screens */}
          {!isMobile && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                overflow: "hidden",
              }}>
              <button
                onClick={() => setZoom((z) => Math.max(z - 0.1, 0.4))}
                style={{
                  padding: "7px 10px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                }}>
                <ZoomOut size={13} />
              </button>
              <span
                style={{
                  fontSize: 11,
                  fontFamily: "monospace",
                  color: "#64748b",
                  minWidth: 40,
                  textAlign: "center",
                }}>
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom((z) => Math.min(z + 0.1, 1.4))}
                style={{
                  padding: "7px 10px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                }}>
                <ZoomIn size={13} />
              </button>
            </div>
          )}

          {/* Mobile zoom buttons simplified */}
          {isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button
                onClick={() => setZoom((z) => Math.max(z - 0.1, 0.3))}
                style={{
                  padding: "6px 8px",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  cursor: "pointer",
                  color: "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                }}>
                <ZoomOut size={13} />
              </button>
              <span
                style={{
                  fontSize: 10,
                  fontFamily: "monospace",
                  color: "#64748b",
                  minWidth: 32,
                  textAlign: "center",
                }}>
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom((z) => Math.min(z + 0.1, 1.2))}
                style={{
                  padding: "6px 8px",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  cursor: "pointer",
                  color: "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                }}>
                <ZoomIn size={13} />
              </button>
            </div>
          )}

          <button
            onClick={handleDownload}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: isMobile ? "7px 10px" : "8px 16px",
              borderRadius: 10,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              border: "none",
              color: "#fff",
              fontSize: isMobile ? 11 : 12,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}>
            <Download size={12} />
            {!isMobile && "Download PDF"}
            {isMobile && "Save"}
          </button>

          <button
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: isMobile ? "7px 10px" : "8px 14px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#94a3b8",
              fontSize: isMobile ? 11 : 12,
              fontWeight: 600,
              cursor: "pointer",
            }}>
            <X size={12} />
            {!isMobile && "Close"}
          </button>
        </div>
      </div>

      {/* Scrollable document area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "auto",
          padding: isMobile ? "16px 8px 32px" : "32px 16px 48px",
          WebkitOverflowScrolling: "touch",
        }}>
        <ResumeDocument zoom={zoom} isMobile={isMobile} />
      </div>
    </motion.div>
  );
};

/* ─── SKILL COLORS ────────────────────────────────────────── */
const skillColors = [
  "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-700 dark:text-cyan-300",
  "from-green-500/20 to-green-600/10 border-green-500/30 text-green-700 dark:text-green-300",
  "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-800 dark:text-yellow-300",
  "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-800 dark:text-amber-300",
  "from-slate-400/20 to-slate-500/10 border-slate-400/30 text-slate-700 dark:text-slate-300",
  "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-700 dark:text-blue-300",
  "from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 text-indigo-700 dark:text-indigo-300",
  "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-700 dark:text-purple-300",
  "from-rose-500/20 to-rose-600/10 border-rose-500/30 text-rose-700 dark:text-rose-300",
  "from-teal-500/20 to-teal-600/10 border-teal-500/30 text-teal-700 dark:text-teal-300",
  "from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-800 dark:text-orange-300",
  "from-red-500/20 to-red-600/10 border-red-500/30 text-red-700 dark:text-red-300",
  "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300",
  "from-sky-500/20 to-sky-600/10 border-sky-500/30 text-sky-700 dark:text-sky-300",
];

/* ─── ABOUT COMPONENT ─────────────────────────────────────── */
const About = () => {
  const shouldReduceMotion = useReducedMotion();
  const [showResumeModal, setShowResumeModal] = useState(false);

  const stats = [
    { value: "14", label: "Technologies", icon: Cpu },
    { value: "4+", label: "Projects", icon: Lightbulb },
    { value: "~7mo", label: "Industry Exp.", icon: Calendar },
    { value: "10+", label: "Collaborations", icon: Users },
  ];

  const personalInfo = [
    { icon: MapPin, label: "Location", value: "Kathmandu, Nepal" },
    { icon: Mail, label: "Email", value: "aashikkrmahatoo@gmail.com" },
    { icon: Phone, label: "Phone", value: "+977-9808711811" },
    { icon: GraduationCap, label: "Degree", value: "BE Electronics (2025)" },
  ];

  const skills = CV.skills.map((name, i) => ({
    name,
    color: skillColors[i % skillColors.length],
  }));

  const values = [
    {
      title: "Innovation",
      icon: Lightbulb,
      description:
        "Developing creative solutions that bridge hardware and software, turning ideas into real-world impact.",
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
        "Maintaining high standards in every line of code — from embedded firmware to modern web applications.",
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
        "Working effectively in cross-functional teams to deliver complex projects combining diverse expertise.",
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
        "Staying current with emerging technologies and frameworks to tackle next-generation engineering challenges.",
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
      {/* Resume Modal */}
      <AnimatePresence>
        {showResumeModal && (
          <ResumeModal onClose={() => setShowResumeModal(false)} />
        )}
      </AnimatePresence>

      {/* Background blobs */}
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

          {/* ── Main Grid ── */}
          <div className="grid gap-8 mb-20 lg:grid-cols-5 lg:gap-10">
            {/* LEFT */}
            <ScrollReveal className="lg:col-span-2" direction="left">
              <div className="space-y-6">
                {/* Profile image */}
                <div className="relative w-64 h-64 mx-auto lg:w-full lg:h-80">
                  <div className="absolute -inset-3 rounded-3xl bg-primary/10 blur" />
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
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/70 to-transparent rounded-b-2xl" />
                  </div>
                </div>

                {/* Personal info */}
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

            {/* RIGHT */}
            <div className="space-y-6 lg:col-span-3">
              {/* Bio card */}
              <ScrollReveal delay={0.2}>
                <div className="relative overflow-hidden border shadow-sm rounded-2xl border-border bg-card/60 backdrop-blur">
                  <div className="relative z-10 space-y-5 p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                          <span className="text-xs font-medium tracking-wide text-green-700 uppercase dark:text-green-400">
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
                      <div className="flex items-center justify-center w-10 h-10 border shrink-0 rounded-xl border-border bg-muted/60">
                        <Zap className="w-5 h-5 text-primary" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        I'm{" "}
                        <span className="font-semibold text-foreground">
                          Aashik Kumar Mahato
                        </span>
                        , an Electronics, Communication, and Information
                        Engineering graduate from{" "}
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
                      onClick={() => setShowResumeModal(true)}
                      className="flex items-center gap-2 text-sm font-medium transition-colors text-primary hover:text-primary/80 group">
                      View my full resume
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </motion.button>
                  </div>
                </div>
              </ScrollReveal>

              {/* Stats */}
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

              {/* Tech stack */}
              <ScrollReveal delay={0.4}>
                <div className="p-5 border shadow-sm rounded-2xl border-border bg-card/60 backdrop-blur">
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

          {/* ── Values ── */}
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
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${value.bgGlow} opacity-60 group-hover:opacity-100 transition-opacity`}
                    />
                    <div
                      className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${value.gradient} opacity-10 group-hover:opacity-20 transition-opacity blur`}
                    />
                    <div className="relative z-10">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
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
