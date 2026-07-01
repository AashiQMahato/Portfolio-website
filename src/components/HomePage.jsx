import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Download,
  Github,
  Linkedin,
  Mail,
  ChevronDown,
  FileText,
  X,
  ZoomIn,
  ZoomOut,
  ExternalLink,
  Cpu,
  Globe,
  Code2,
  Zap,
  GraduationCap,
  Briefcase,
  MapPin,
  ChevronRight,
  Phone,
  Layers,
  Star,
  Calendar,
  Users,
  Lightbulb,
} from "lucide-react";
import { SplitText, RotatingText, Magnet, ScrollReveal } from "./ui";
import profileImage from "../assets/12.jpg";

/* ─── CV DATA ─────────────────────────────────────────────── */
const CV = {
  name: "Aashik Kumar Mahato",
  title: "Electronics Engineer & Full-Stack Developer",
  contact: {
    location: "Shantinagar, Kathmandu",
    phone: "9808711811",
    email: "aashikkrmahatoo@gmail.com",
    github: "https://github.com/Aashik9567",
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
      url: "https://github.com/Aashik9567/Automated_Attendance_Management_System",
      bullets: [
        "Automated attendance using YOLOv8 and FaceNet for real-time face recognition.",
        "Built a web platform with React, Node.js, and MongoDB for live tracking.",
        "Implemented email notifications for low attendance alerts.",
      ],
    },
    {
      name: "WeatherApp – AI-Enhanced Weather Dashboard",
      stack: "Next.js, OpenAI, Responsive UI",
      url: "https://github.com/Aashik9567/weather-app-NextJs",
      bullets: [
        "Real-time weather data with auto-refresh and AI-powered analysis.",
        "Interactive location search with GPS support and 10-day forecast.",
        "Dark theme with glassmorphism UI and fully responsive design.",
      ],
    },
    {
      name: "Smart School Management System",
      stack: "React, Node.js, Express, MongoDB",
      url: "https://github.com/Aashik9567/Smart-School-management-system-Frontend",
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

/* ─── RESUME DOCUMENT (print-safe, no Tailwind) ──────────── */
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
            <div>🔗 github.com/Aashik9567</div>
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

/* ─── PROJECTS DATA ───────────────────────────────────────── */
const projects = [
  {
    name: "Automated Attendance System",
    description:
      "YOLOv8 + FaceNet AI face recognition with real-time tracking, MongoDB, and automated email alerts.",
    stack: ["YOLOv8", "FaceNet", "React", "Node.js", "MongoDB"],
    url: "https://github.com/Aashik9567/Automated_Attendance_Management_System",
    color: "from-blue-500/20 to-cyan-500/10",
    border: "border-blue-500/25",
    accent: "#3b82f6",
    icon: Cpu,
    tag: "AI · Computer Vision",
  },
  {
    name: "Smart School Management",
    description:
      "Full-stack system with role-based dashboards for Admin, Teacher, Student & Parent. AI analytics built in.",
    stack: ["React", "Node.js", "Express", "MongoDB"],
    url: "https://github.com/Aashik9567/Smart-School-management-system-Frontend",
    color: "from-purple-500/20 to-violet-500/10",
    border: "border-purple-500/25",
    accent: "#8b5cf6",
    icon: Users,
    tag: "Full-Stack · SaaS",
  },
  {
    name: "Cable Network Website",
    description:
      "Production ISP website with 3D React Three Fiber visuals, TypeScript, Ant Design, and theme switching.",
    stack: ["Next.js", "TypeScript", "R3F", "Ant Design"],
    url: "https://raghunathpurcable.com.np/",
    color: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/25",
    accent: "#10b981",
    icon: Globe,
    tag: "Production · 3D",
  },
  {
    name: "AI Weather Dashboard",
    description:
      "Real-time GPS weather data, AI-powered analysis, 10-day forecast, and dark glassmorphism UI.",
    stack: ["Next.js", "OpenAI", "GPS API"],
    url: "https://github.com/Aashik9567/weather-app-NextJs",
    color: "from-amber-500/20 to-orange-500/10",
    border: "border-amber-500/25",
    accent: "#f59e0b",
    icon: Zap,
    tag: "AI · Real-time",
  },
];

/* ─── TIMELINE DATA ───────────────────────────────────────── */
const timeline = [
  {
    date: "Jan 2021",
    title: "Started Engineering Degree",
    subtitle: "Advanced College of Engineering and Management",
    desc: "Enrolled in BE Electronics, Communication & Information Engineering in Kathmandu.",
    icon: GraduationCap,
    color: "#6366f1",
    type: "education",
  },
  {
    date: "Jan 2025",
    title: "Graduated — BE Electronics",
    subtitle: "Advanced College of Engineering and Management",
    desc: "Completed Bachelor's in Electronics, Communication & Information Engineering.",
    icon: GraduationCap,
    color: "#8b5cf6",
    type: "education",
  },
  {
    date: "Jun – Sep 2025",
    title: "Frontend Developer",
    subtitle: "WebX Nepal, Lazimpat",
    desc: "Built responsive React & Tailwind CSS interfaces, converting UI/UX designs into interactive applications.",
    icon: Code2,
    color: "#3b82f6",
    type: "work",
  },
  {
    date: "Nov 2025 – Feb 2026",
    title: "Technical Writer – Electronics",
    subtitle: "Entegra Sources Pvt. Ltd, Buddhanagar",
    desc: "Drafted Career Episodes, technical reports, and engineering documentation aligned with competency standards.",
    icon: Briefcase,
    color: "#10b981",
    type: "work",
  },
];

/* ─── MAIN HOMEPAGE ───────────────────────────────────────── */
const HomePage = () => {
  const roles = [
    "Electronics Engineer",
    "Full Stack Developer",
    "IoT Specialist",
    "Problem Solver",
  ];
  const shouldReduceMotion = useReducedMotion();
  const [showResume, setShowResume] = useState(false);

  const socialLinks = [
    { icon: Github, href: "https://github.com/aashik9567", label: "GitHub" },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/aashiq-mahato-9a343b2b4/",
      label: "LinkedIn",
    },
    { icon: Mail, href: "mailto:aashikkrmahatoo@gmail.com", label: "Email" },
  ];

  const hardwareSkills = [
    "Arduino",
    "ESP32",
    "Raspberry Pi",
    "Python",
    "C/C++",
    "IoT Protocols",
    "Circuit Design",
  ];
  const webSkills = [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "MongoDB",
    "Tailwind CSS",
    "Express",
  ];

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence>
        {showResume && <ResumeModal onClose={() => setShowResume(false)} />}
      </AnimatePresence>

      {/* ══════ HERO ══════ */}
      <div className="relative flex items-center min-h-screen">
        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-[420px] h-[420px] bg-primary/10 rounded-full blur opacity-60" />
          <div className="absolute bottom-1/4 -right-32 w-[380px] h-[380px] bg-primary/10 rounded-full blur opacity-50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-primary/5 rounded-full blur opacity-50" />
        </div>

        <div className="relative z-10 w-full section-padding pt-28 lg:pt-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
              {/* Left — Text */}
              <div className="order-2 lg:order-1">
                {/* Status badge */}
                <ScrollReveal delay={0.1}>
                  <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium border rounded-full border-border bg-card/60 backdrop-blur text-primary">
                    <span className="relative flex w-2.5 h-2.5">
                      <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-emerald-400" />
                      <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    </span>
                    Open to Opportunities · Kathmandu &amp; Remote
                  </div>
                </ScrollReveal>

                {/* Headline */}
                <div className="mb-2">
                  <SplitText
                    text="Hi, I'm"
                    tag="h1"
                    className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl font-display text-foreground"
                    delay={40}
                    splitType="chars"
                  />
                </div>
                <div className="mb-6">
                  <SplitText
                    text="Aashiq Mahato"
                    tag="h1"
                    className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl font-display text-primary"
                    delay={40}
                    splitType="chars"
                  />
                </div>

                {/* Subline */}
                <ScrollReveal delay={0.25}>
                  <p className="mb-5 text-sm font-medium tracking-wide uppercase text-muted-foreground">
                    Engineering the Invisible, Building the Visible.
                  </p>
                </ScrollReveal>

                {/* Rotating role */}
                <ScrollReveal delay={0.3}>
                  <div className="flex items-center h-10 gap-3 mb-8">
                    <span className="font-mono text-lg text-muted-foreground">
                      &lt;
                    </span>
                    <RotatingText
                      words={roles}
                      interval={3000}
                      className="text-xl font-semibold sm:text-2xl text-primary font-display"
                    />
                    <span className="font-mono text-lg text-muted-foreground">
                      /&gt;
                    </span>
                  </div>
                </ScrollReveal>

                {/* Description */}
                <ScrollReveal delay={0.4}>
                  <p className="max-w-2xl mb-10 text-lg leading-relaxed text-muted-foreground">
                    Electronics Engineer &amp; Full-Stack Developer bridging the
                    physical world with scalable digital ecosystems.
                    Specializing in IoT, embedded systems, and modern web
                    technologies.
                  </p>
                </ScrollReveal>

                {/* CTAs */}
                <ScrollReveal delay={0.5}>
                  <div className="flex flex-wrap gap-4 mb-10">
                    <Magnet strength={0.15}>
                      <Link
                        to="/projects"
                        className="inline-flex items-center h-11 gap-2 px-6 rounded-xl font-semibold bg-primary text-primary-foreground shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60">
                        Explore Projects <ArrowRight className="w-5 h-5" />
                      </Link>
                    </Magnet>
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setShowResume(true)}
                      className="inline-flex items-center gap-2 px-6 font-semibold transition-all duration-300 border shadow-sm h-11 rounded-xl border-border bg-card/60 backdrop-blur text-foreground hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
                      <FileText className="w-5 h-5" /> View Resume
                    </motion.button>
                  </div>
                </ScrollReveal>

                {/* Social */}
                <ScrollReveal delay={0.6}>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      Connect:
                    </span>
                    <div className="flex gap-3">
                      {socialLinks.map((social) => {
                        const Icon = social.icon;
                        return (
                          <Magnet key={social.label} strength={0.2}>
                            <a
                              href={social.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center transition-colors duration-200 border w-11 h-11 rounded-xl border-border bg-card/60 backdrop-blur text-muted-foreground hover:text-primary hover:bg-card/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                              aria-label={social.label}>
                              <Icon className="w-5 h-5" />
                            </a>
                          </Magnet>
                        );
                      })}
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              {/* Right — Avatar */}
              <ScrollReveal
                direction="right"
                delay={0.3}
                className="flex justify-center order-1 lg:order-2">
                <Magnet strength={0.1}>
                  <div className="relative">
                    <div className="absolute pointer-events-none -inset-6 rounded-3xl bg-gradient-to-br from-primary-500/25 via-secondary-500/10 to-accent-500/20 blur-2xl opacity-80 dark:opacity-95" />
                    {/* floating chips */}
                    <motion.div
                      animate={
                        shouldReduceMotion ? undefined : { y: [0, -8, 0] }
                      }
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute -top-4 -left-4 z-20 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg border border-blue-500/40 bg-blue-500/15 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300 backdrop-blur">
                      ⚡ IoT Engineer
                    </motion.div>
                    <motion.div
                      animate={
                        shouldReduceMotion ? undefined : { y: [0, 8, 0] }
                      }
                      transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5,
                      }}
                      className="absolute -bottom-4 -right-4 z-20 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg border border-purple-500/40 bg-purple-500/15 text-purple-700 dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-300 backdrop-blur">
                      🚀 Full-Stack Dev
                    </motion.div>
                    <motion.div
                      animate={
                        shouldReduceMotion ? undefined : { y: [0, -5, 0] }
                      }
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                      }}
                      className="absolute top-1/2 -right-8 z-20 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg border border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 backdrop-blur">
                      🛠 Arduino
                    </motion.div>

                    <div className="relative overflow-hidden border shadow-sm w-60 h-60 rounded-3xl sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 border-border bg-card">
                      <img
                        src={profileImage}
                        alt="Aashiq Mahato"
                        className="object-cover w-full h-full"
                        loading="eager"
                        decoding="async"
                      />
                    </div>
                  </div>
                </Magnet>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>

      {/* ══════ DUAL IDENTITY MATRIX ══════ */}
      <section className="py-24 section-padding">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border border-border bg-card/60 text-muted-foreground mb-4">
                Core Expertise
              </span>
              <h2 className="text-3xl font-bold font-display text-foreground">
                Two Worlds. <span className="gradient-text">One Engineer.</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Hardware */}
            <ScrollReveal direction="left" delay={0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                className="relative h-full p-8 overflow-hidden border cursor-default group rounded-2xl border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-red-500/5">
                <div className="absolute w-32 h-32 transition-all duration-500 rounded-full -top-8 -right-8 bg-orange-500/10 blur group-hover:bg-orange-500/20" />
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-5 transition-transform duration-300 shadow-lg w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 group-hover:scale-110">
                    <Cpu className="text-white w-7 h-7" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold font-display text-foreground">
                    Hardware Engineer
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                    Designing smart hardware prototypes and IoT systems that
                    interact with the physical world — from sensor networks to
                    embedded firmware.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {hardwareSkills.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1 text-xs font-semibold text-orange-700 border rounded-lg bg-orange-500/15 border-orange-500/25 dark:text-orange-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>

            {/* Web */}
            <ScrollReveal direction="right" delay={0.2}>
              <motion.div
                whileHover={{ y: -4 }}
                className="relative h-full p-8 overflow-hidden border cursor-default group rounded-2xl border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/5">
                <div className="absolute w-32 h-32 transition-all duration-500 rounded-full -top-8 -right-8 bg-primary/10 blur group-hover:bg-primary/20" />
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-5 transition-transform duration-300 shadow-lg w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 group-hover:scale-110">
                    <Globe className="text-white w-7 h-7" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold font-display text-foreground">
                    Full-Stack Developer
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                    Building performance-optimized, interactive web
                    architectures — from blazing-fast Next.js frontends to
                    robust Express APIs.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {webSkills.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1 text-xs font-semibold border rounded-lg bg-primary/15 border-primary/25 text-primary-700 dark:text-primary-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ══════ FEATURED PROJECTS ══════ */}
      <section className="py-24 section-padding bg-card/20">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border border-border bg-card/60 text-muted-foreground mb-4">
                Featured Work
              </span>
              <h2 className="text-3xl font-bold font-display text-foreground">
                Projects That <span className="gradient-text">Ship.</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid gap-5 sm:grid-cols-2">
            {projects.map((p, i) => {
              const Icon = p.icon;
              return (
                <ScrollReveal key={p.name} delay={i * 0.1}>
                  <motion.a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -5 }}
                    className={`group relative flex flex-col p-6 rounded-2xl border ${p.border} bg-gradient-to-br ${p.color} overflow-hidden cursor-pointer h-full no-underline transition-all duration-300 hover:shadow-xl`}>
                    <div
                      className="absolute w-24 h-24 transition-opacity duration-500 rounded-full -top-6 -right-6 opacity-20 group-hover:opacity-40 blur"
                      style={{ background: p.accent }}
                    />
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className="flex items-center justify-center w-10 h-10 rounded-xl"
                          style={{
                            background: `${p.accent}22`,
                            border: `1px solid ${p.accent}44`,
                          }}>
                          <Icon size={18} style={{ color: p.accent }} />
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full border text-muted-foreground"
                            style={{
                              borderColor: `${p.accent}33`,
                              background: `${p.accent}11`,
                            }}>
                            {p.tag}
                          </span>
                          <ExternalLink
                            size={14}
                            className="transition-colors text-muted-foreground group-hover:text-foreground"
                          />
                        </div>
                      </div>
                      <h3 className="mb-2 text-base font-bold text-foreground font-display">
                        {p.name}
                      </h3>
                      <p className="flex-1 mb-5 text-sm leading-relaxed text-muted-foreground">
                        {p.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {p.stack.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 text-[10px] font-mono font-medium rounded-md bg-background/40 border border-border text-muted-foreground">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.a>
                </ScrollReveal>
              );
            })}
          </div>

          <ScrollReveal delay={0.4}>
            <div className="mt-10 text-center">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 text-sm font-semibold transition-colors text-primary hover:text-primary/80 group">
                View all projects{" "}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════ CREDENTIAL TIMELINE ══════ */}
      <section className="py-24 section-padding">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border border-border bg-card/60 text-muted-foreground mb-4">
                Journey
              </span>
              <h2 className="text-3xl font-bold font-display text-foreground">
                Education &amp;{" "}
                <span className="gradient-text">Experience</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="relative">
            {/* vertical line */}
            <div className="absolute top-0 bottom-0 w-px left-6 bg-gradient-to-b from-transparent via-border to-transparent" />

            <div className="pl-16 space-y-8">
              {timeline.map((item, i) => {
                const Icon = item.icon;
                return (
                  <ScrollReveal key={item.title} delay={i * 0.12}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="relative group">
                      {/* dot */}
                      <div
                        className="absolute -left-[52px] top-1 w-8 h-8 rounded-full flex items-center justify-center border-2 border-background shadow-sm transition-transform duration-300 group-hover:scale-110"
                        style={{ background: item.color }}>
                        <Icon size={14} color="#fff" />
                      </div>
                      {/* card */}
                      <div className="p-5 transition-colors border rounded-2xl border-border bg-card/60 backdrop-blur hover:bg-card/80">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-1">
                          <h4 className="text-sm font-bold text-foreground font-display">
                            {item.title}
                          </h4>
                          <span className="text-xs font-mono text-muted-foreground px-2 py-0.5 rounded-full bg-muted/50 border border-border whitespace-nowrap">
                            {item.date}
                          </span>
                        </div>
                        <p
                          className="mb-2 text-xs font-semibold"
                          style={{ color: item.color }}>
                          {item.subtitle}
                        </p>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {item.desc}
                        </p>
                        <div className="mt-2">
                          <span
                            className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${item.type === "work" ? "bg-blue-500/15 text-blue-700 border border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20" : "bg-violet-500/15 text-violet-700 border border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/20"}`}>
                            {item.type === "work" ? "💼 Work" : "🎓 Education"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
