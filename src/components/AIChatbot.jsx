import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Trash2 } from "lucide-react";

/* ── 3D Robotic Avatar SVG ── */
const RobotAvatar = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}>
    <defs>
      {/* Metallic head/body gradient */}
      <linearGradient
        id="r-metal"
        x1="14"
        y1="4"
        x2="50"
        y2="42"
        gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#e2e8f0" />
        <stop offset="45%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
      {/* Purple body gradient */}
      <linearGradient
        id="r-body"
        x1="11"
        y1="38"
        x2="53"
        y2="64"
        gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#818cf8" />
        <stop offset="55%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#3730a3" />
      </linearGradient>
      {/* Cyan visor gradient */}
      <linearGradient
        id="r-visor"
        x1="17"
        y1="18"
        x2="47"
        y2="18"
        gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.5" />
        <stop offset="50%" stopColor="#22d3ee" />
        <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.5" />
      </linearGradient>
      {/* Chest inset gradient */}
      <linearGradient
        id="r-chest"
        x1="19"
        y1="43"
        x2="45"
        y2="60"
        gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0f172a" />
        <stop offset="100%" stopColor="#1e293b" />
      </linearGradient>
      {/* Eye glow */}
      <radialGradient id="r-eye" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#22d3ee" />
      </radialGradient>
      {/* Antenna glow */}
      <radialGradient id="r-ant" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#00f5ff" />
      </radialGradient>
      {/* Glow blur */}
      <filter id="r-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="r-glow-sm" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="0.7" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* ── Antenna ── */}
    <rect x="30" y="1" width="4" height="8" rx="1.5" fill="#64748b" />
    <circle cx="32" cy="1.5" r="3.5" fill="url(#r-ant)" filter="url(#r-glow)" />
    <circle cx="32" cy="1.5" r="1.5" fill="white" opacity="0.95" />

    {/* ── Ear panels ── */}
    <rect x="9" y="13" width="5" height="17" rx="2.5" fill="#64748b" />
    <rect x="50" y="13" width="5" height="17" rx="2.5" fill="#64748b" />
    {/* Ear indicator lights */}
    <rect
      x="10"
      y="15"
      width="3"
      height="3"
      rx="1"
      fill="#0ea5e9"
      opacity="0.7"
      filter="url(#r-glow-sm)"
    />
    <rect
      x="51"
      y="15"
      width="3"
      height="3"
      rx="1"
      fill="#0ea5e9"
      opacity="0.7"
      filter="url(#r-glow-sm)"
    />
    <rect
      x="10"
      y="21"
      width="3"
      height="2"
      rx="1"
      fill="#a78bfa"
      opacity="0.6"
    />
    <rect
      x="51"
      y="21"
      width="3"
      height="2"
      rx="1"
      fill="#a78bfa"
      opacity="0.6"
    />

    {/* ── Head ── */}
    <rect x="13" y="8" width="38" height="32" rx="7" fill="url(#r-metal)" />
    {/* Top bevel highlight */}
    <rect
      x="13"
      y="8"
      width="38"
      height="8"
      rx="7"
      fill="rgba(255,255,255,0.22)"
    />
    {/* Left bevel highlight */}
    <rect
      x="13"
      y="8"
      width="5"
      height="32"
      rx="7"
      fill="rgba(255,255,255,0.1)"
    />
    {/* Bottom shadow */}
    <rect x="13" y="33" width="38" height="7" rx="7" fill="rgba(0,0,0,0.15)" />
    {/* Head screws */}
    <circle
      cx="18"
      cy="12"
      r="1.8"
      fill="#64748b"
      stroke="#475569"
      strokeWidth="0.5"
    />
    <line
      x1="16.5"
      y1="12"
      x2="19.5"
      y2="12"
      stroke="#475569"
      strokeWidth="0.7"
    />
    <line
      x1="18"
      y1="10.5"
      x2="18"
      y2="13.5"
      stroke="#475569"
      strokeWidth="0.7"
    />
    <circle
      cx="46"
      cy="12"
      r="1.8"
      fill="#64748b"
      stroke="#475569"
      strokeWidth="0.5"
    />
    <line
      x1="44.5"
      y1="12"
      x2="47.5"
      y2="12"
      stroke="#475569"
      strokeWidth="0.7"
    />
    <line
      x1="46"
      y1="10.5"
      x2="46"
      y2="13.5"
      stroke="#475569"
      strokeWidth="0.7"
    />

    {/* ── Visor background ── */}
    <rect x="17" y="17" width="30" height="14" rx="3.5" fill="#0f172a" />
    <rect
      x="17"
      y="17"
      width="30"
      height="14"
      rx="3.5"
      fill="url(#r-visor)"
      opacity="0.12"
    />
    {/* Visor scan-line */}
    <rect
      x="17"
      y="23.5"
      width="30"
      height="0.8"
      fill="#22d3ee"
      opacity="0.15"
    />

    {/* ── Eyes ── */}
    {/* Left eye socket */}
    <rect x="19.5" y="19.5" width="11" height="8" rx="2.5" fill="#0a0f1e" />
    {/* Right eye socket */}
    <rect x="33.5" y="19.5" width="11" height="8" rx="2.5" fill="#0a0f1e" />
    {/* Left eye glow bar */}
    <rect
      x="20.5"
      y="20.5"
      width="9"
      height="6"
      rx="2"
      fill="url(#r-eye)"
      opacity="0.95"
      filter="url(#r-glow)"
    />
    {/* Right eye glow bar */}
    <rect
      x="34.5"
      y="20.5"
      width="9"
      height="6"
      rx="2"
      fill="url(#r-eye)"
      opacity="0.95"
      filter="url(#r-glow)"
    />
    {/* Eye inner specular */}
    <rect
      x="21.5"
      y="21"
      width="3.5"
      height="2"
      rx="1"
      fill="rgba(255,255,255,0.85)"
    />
    <rect
      x="35.5"
      y="21"
      width="3.5"
      height="2"
      rx="1"
      fill="rgba(255,255,255,0.85)"
    />
    {/* Pupil dots */}
    <circle cx="25" cy="23.5" r="1.5" fill="#0f172a" opacity="0.6" />
    <circle cx="39" cy="23.5" r="1.5" fill="#0f172a" opacity="0.6" />

    {/* ── Mouth LED dots ── */}
    <circle
      cx="26"
      cy="34"
      r="1.8"
      fill="#22d3ee"
      opacity="0.85"
      filter="url(#r-glow-sm)"
    />
    <circle cx="32" cy="34" r="1.8" fill="#94a3b8" opacity="0.45" />
    <circle
      cx="38"
      cy="34"
      r="1.8"
      fill="#22d3ee"
      opacity="0.85"
      filter="url(#r-glow-sm)"
    />

    {/* ── Neck ── */}
    <rect x="27" y="39" width="10" height="5" rx="2" fill="#64748b" />
    <rect x="28.5" y="39" width="3" height="5" fill="#475569" opacity="0.5" />
    <rect x="32.5" y="39" width="3" height="5" fill="#475569" opacity="0.5" />

    {/* ── Body ── */}
    <rect x="11" y="42" width="42" height="21" rx="6" fill="url(#r-body)" />
    {/* Body top highlight */}
    <rect
      x="11"
      y="42"
      width="42"
      height="6"
      rx="6"
      fill="rgba(255,255,255,0.18)"
    />
    {/* Shoulder bolts */}
    <circle
      cx="14.5"
      cy="46"
      r="3.5"
      fill="#94a3b8"
      stroke="#64748b"
      strokeWidth="1"
    />
    <circle
      cx="49.5"
      cy="46"
      r="3.5"
      fill="#94a3b8"
      stroke="#64748b"
      strokeWidth="1"
    />
    <circle cx="14.5" cy="46" r="1.5" fill="#cbd5e1" />
    <circle cx="49.5" cy="46" r="1.5" fill="#cbd5e1" />

    {/* ── Chest panel ── */}
    <rect
      x="19"
      y="47"
      width="26"
      height="13"
      rx="3"
      fill="url(#r-chest)"
      stroke="rgba(255,255,255,0.06)"
      strokeWidth="0.5"
    />
    {/* LED indicators */}
    <circle
      cx="24"
      cy="52"
      r="2.2"
      fill="#22d3ee"
      filter="url(#r-glow-sm)"
      opacity="0.9"
    />
    <circle
      cx="31.5"
      cy="52"
      r="2.2"
      fill="#a78bfa"
      filter="url(#r-glow-sm)"
      opacity="0.9"
    />
    <circle
      cx="39"
      cy="52"
      r="2.2"
      fill="#22d3ee"
      filter="url(#r-glow-sm)"
      opacity="0.7"
    />
    {/* Charge bar track */}
    <rect
      x="21"
      y="56.5"
      width="22"
      height="2"
      rx="1"
      fill="rgba(255,255,255,0.08)"
    />
    {/* Charge bar fill */}
    <rect
      x="21"
      y="56.5"
      width="14"
      height="2"
      rx="1"
      fill="#22d3ee"
      opacity="0.75"
      filter="url(#r-glow-sm)"
    />
  </svg>
);

const SYSTEM_PROMPT = `You are Aashiq's AI Assistant on his portfolio website (Aashiq.dev). You are knowledgeable, friendly, and professional.

About Aashiq:
- Full name: Aashiq Mahato
- Roles: Electronics Engineer & Full-Stack Web Developer
- Skills: JavaScript, Python, C, C++, React.js, Node.js, Express.js, MongoDB, Arduino, Raspberry Pi, Circuit Design, IoT Protocols
- Experience: 4+ years in development, worked on 8+ projects, proficient in 15+ technologies across 3 specializations
- Specializations: Full-Stack Web Development, Hardware & Embedded Systems (Arduino, Raspberry Pi, IoT), Electronics Engineering
- Projects: Ultrasonic Blind Stick with GSM/GPS (Arduino, hardware), Automated Attendance System (Python, Face Recognition, React, MongoDB), WeatherApp - AI Weather Dashboard (Next.js, OpenAI), and more
- Currently Learning: Advanced IoT Systems, AI for Electronics, Embedded Systems, Signal Processing
- Availability: Available for freelance/contract work and full-time opportunities
- Education: Electronics Engineering background
- Strengths: Problem Solving (95%), Quick Learning (98%), Team Leadership (88%), Project Management (82%)
- Top Tech: React.js (95%), Arduino (92%), JavaScript (90%), Node.js (88%), Python (85%)

Your behavior:
- Answer questions about Aashiq's skills, experience, projects, background, and availability concisely, friendly, and professionally.
- If asked something outside the scope of Aashiq's portfolio, politely redirect: "I'm here to tell you about Aashiq — want to know about his skills or projects?"
- Keep responses brief (2-4 sentences typically).
- Be enthusiastic about Aashiq's capabilities.
- When discussing skills, mention specific technologies and proficiency levels.
- If asked about hiring, mention he's open to opportunities and suggest visiting the Contact page.`;

const suggestedChips = [
  { emoji: "🚀", text: "View his top skills" },
  { emoji: "💼", text: "What projects has he built?" },
  { emoji: "📬", text: "How to hire him?" },
  { emoji: "🔧", text: "Hardware experience?" },
];

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showChips, setShowChips] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = { role: "user", content: text.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setShowChips(false);
    setIsTyping(true);

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) {
        throw new Error("API key not configured");
      }

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...updatedMessages.slice(-10).map((m) => ({
                role: m.role,
                content: m.content,
              })),
            ],
            temperature: 0.7,
            max_tokens: 300,
          }),
        },
      );

      if (!response.ok) {
        const errBody = await response.text().catch(() => "");
        console.error("Groq API error:", response.status, errBody);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const aiContent =
        data.choices?.[0]?.message?.content ||
        "I'm sorry, I couldn't process that. Please try again!";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiContent },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having some trouble connecting right now. Please try again in a moment, or feel free to reach out via the Contact page!",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setShowChips(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* FAB - Floating Action Button with 3D Avatar */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[100] w-16 h-16 rounded-full flex items-center justify-center cursor-pointer group"
        style={{
          background: "linear-gradient(135deg, #00f5ff, #8b5cf6, #f0abfc)",
        }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            "0 0 20px rgba(0,245,255,0.3), 0 0 40px rgba(139,92,246,0.15)",
            "0 0 30px rgba(0,245,255,0.5), 0 0 60px rgba(139,92,246,0.3)",
            "0 0 20px rgba(0,245,255,0.3), 0 0 40px rgba(139,92,246,0.15)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        title="Chat with AI Assistant">
        <RobotAvatar size={40} />
        {/* Pulsing ring */}
        <motion.div
          className="absolute inset-0 border-2 rounded-full border-cyan-400/30"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Tooltip */}
        <div
          className="absolute right-full mr-3 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: "rgba(10,10,30,0.85)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#e2e8f0",
          }}>
          Chat with AI Assistant
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[101] bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed z-[102] flex flex-col overflow-hidden
                bottom-4 right-4 left-4 top-[10vh]
                md:bottom-24 md:right-6 md:left-auto md:top-auto
                md:w-[400px] md:h-[560px] rounded-2xl"
              style={{
                background: "rgba(10, 10, 30, 0.92)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid transparent",
                backgroundImage:
                  "linear-gradient(rgba(10,10,30,0.92), rgba(10,10,30,0.92)), linear-gradient(135deg, rgba(0,245,255,0.4), rgba(139,92,246,0.4), rgba(240,171,252,0.4))",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
              }}>
              {/* Header */}
              <div
                className="flex items-center gap-3 p-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {/* AI Avatar */}
                <div
                  className="flex items-center justify-center flex-shrink-0 w-10 h-10 overflow-hidden rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #00f5ff, #8b5cf6)",
                  }}>
                  <RobotAvatar size={36} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className="text-sm font-bold"
                    style={{
                      background: "linear-gradient(90deg, #22d3ee, #a78bfa)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }}>
                    Aashiq&apos;s AI Assistant
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                    <span style={{ fontSize: "10px", color: "#94a3b8" }}>
                      Online &middot; Ask me anything about Aashiq
                    </span>
                  </div>
                </div>
                <button
                  onClick={clearChat}
                  className="flex-shrink-0 p-2 transition-colors rounded-lg"
                  style={{ color: "#94a3b8" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#94a3b8")
                  }
                  title="Clear chat">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-shrink-0 p-2 transition-colors rounded-lg"
                  style={{ color: "#94a3b8" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#94a3b8")
                  }>
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {/* Welcome */}
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-8 text-center">
                    <div
                      className="flex items-center justify-center w-20 h-20 mx-auto mb-4 overflow-hidden rounded-full"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(0,245,255,0.15), rgba(139,92,246,0.15))",
                      }}>
                      <RobotAvatar size={56} />
                    </div>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#cbd5e1",
                      }}>
                      Hi! I&apos;m Aashiq&apos;s AI assistant.
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        marginTop: "4px",
                      }}>
                      Ask me anything about his skills, projects, or experience!
                    </p>
                  </motion.div>
                )}

                {/* Suggestion Chips */}
                {showChips && messages.length === 0 && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {suggestedChips.map((chip) => (
                      <motion.button
                        key={chip.text}
                        onClick={() => sendMessage(chip.text)}
                        className="px-3 py-2 text-xs font-medium transition-all duration-300 rounded-full cursor-pointer"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "#cbd5e1",
                        }}
                        whileHover={{
                          scale: 1.05,
                          borderColor: "rgba(0,245,255,0.3)",
                        }}
                        whileTap={{ scale: 0.95 }}>
                        {chip.emoji} {chip.text}
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Message Bubbles */}
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "assistant" && (
                      <div
                        className="flex items-center justify-center flex-shrink-0 w-6 h-6 mt-1 overflow-hidden rounded-full"
                        style={{
                          background:
                            "linear-gradient(135deg, #00f5ff, #8b5cf6)",
                        }}>
                        <RobotAvatar size={20} />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "rounded-2xl rounded-br-md"
                          : "rounded-2xl rounded-bl-md"
                      }`}
                      style={
                        msg.role === "user"
                          ? {
                              background:
                                "linear-gradient(135deg, #00c8ff, #8b5cf6)",
                              color: "#ffffff",
                            }
                          : {
                              background: "rgba(255,255,255,0.06)",
                              border: "1px solid rgba(255,255,255,0.06)",
                              color: "#e2e8f0",
                            }
                      }>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2">
                    <div
                      className="flex items-center justify-center flex-shrink-0 w-6 h-6 overflow-hidden rounded-full"
                      style={{
                        background: "linear-gradient(135deg, #00f5ff, #8b5cf6)",
                      }}>
                      <RobotAvatar size={20} />
                    </div>
                    <div
                      className="px-4 py-3 rounded-2xl flex gap-1.5"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}>
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full"
                          style={{
                            background:
                              "linear-gradient(135deg, #00f5ff, #8b5cf6)",
                          }}
                          animate={{ y: [-3, 3, -3] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.15,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div
                className="p-4"
                style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about skills, projects, experience..."
                    className="flex-1 px-4 py-3 text-sm transition-all duration-300 outline-none rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#f1f5f9",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(0,245,255,0.4)";
                      e.target.style.boxShadow = "0 0 15px rgba(0,245,255,0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255,255,255,0.08)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <motion.button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || isTyping}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-3 transition-all duration-300 cursor-pointer rounded-xl disabled:opacity-40"
                    style={{
                      background: "linear-gradient(135deg, #00f5ff, #8b5cf6)",
                      color: "#ffffff",
                    }}>
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;
