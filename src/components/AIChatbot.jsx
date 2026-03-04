import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Trash2 } from "lucide-react";

/* ── 3D Avatar SVG component ── */
const AvatarIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    className={className}>
    <defs>
      <linearGradient
        id="av-grad"
        x1="0"
        y1="0"
        x2="64"
        y2="64"
        gradientUnits="userSpaceOnUse">
        <stop stopColor="#00f5ff" />
        <stop offset="0.5" stopColor="#8b5cf6" />
        <stop offset="1" stopColor="#f0abfc" />
      </linearGradient>
      <radialGradient
        id="av-face"
        cx="32"
        cy="26"
        r="18"
        gradientUnits="userSpaceOnUse">
        <stop stopColor="#fde7d0" />
        <stop offset="1" stopColor="#f0c9a0" />
      </radialGradient>
      <linearGradient
        id="av-hair"
        x1="18"
        y1="8"
        x2="46"
        y2="28"
        gradientUnits="userSpaceOnUse">
        <stop stopColor="#1a1a2e" />
        <stop offset="1" stopColor="#2d2d44" />
      </linearGradient>
    </defs>
    {/* Body / Shoulders */}
    <ellipse
      cx="32"
      cy="56"
      rx="22"
      ry="14"
      fill="url(#av-grad)"
      opacity="0.9"
    />
    {/* Neck */}
    <rect x="27" y="38" width="10" height="8" rx="4" fill="url(#av-face)" />
    {/* Head */}
    <ellipse cx="32" cy="26" rx="14" ry="16" fill="url(#av-face)" />
    {/* Hair */}
    <path
      d="M18 22c0-8 6-16 14-16s14 8 14 16c0-2-4-10-14-10S18 20 18 22z"
      fill="url(#av-hair)"
    />
    {/* Eyes */}
    <ellipse cx="26" cy="27" rx="2.2" ry="2.5" fill="#1a1a2e" />
    <ellipse cx="38" cy="27" rx="2.2" ry="2.5" fill="#1a1a2e" />
    <circle cx="25" cy="26" r="0.8" fill="white" />
    <circle cx="37" cy="26" r="0.8" fill="white" />
    {/* Smile */}
    <path
      d="M27 32 Q32 37 37 32"
      stroke="#c07a5a"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    {/* Eyebrows */}
    <path
      d="M23 22 Q26 20 29 22"
      stroke="#1a1a2e"
      strokeWidth="1.2"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M35 22 Q38 20 41 22"
      stroke="#1a1a2e"
      strokeWidth="1.2"
      strokeLinecap="round"
      fill="none"
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
        <AvatarIcon size={40} />
        {/* Pulsing ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-cyan-400/30"
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
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #00f5ff, #8b5cf6)",
                  }}>
                  <AvatarIcon size={36} />
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
                  className="p-2 rounded-lg transition-colors flex-shrink-0"
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
                  className="p-2 rounded-lg transition-colors flex-shrink-0"
                  style={{ color: "#94a3b8" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#94a3b8")
                  }>
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Welcome */}
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8">
                    <div
                      className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center overflow-hidden"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(0,245,255,0.15), rgba(139,92,246,0.15))",
                      }}>
                      <AvatarIcon size={56} />
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
                  <div className="flex flex-wrap gap-2 justify-center">
                    {suggestedChips.map((chip) => (
                      <motion.button
                        key={chip.text}
                        onClick={() => sendMessage(chip.text)}
                        className="px-3 py-2 text-xs font-medium rounded-full cursor-pointer transition-all duration-300"
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
                        className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-1 overflow-hidden"
                        style={{
                          background:
                            "linear-gradient(135deg, #00f5ff, #8b5cf6)",
                        }}>
                        <AvatarIcon size={20} />
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
                    className="flex gap-2 items-center">
                    <div
                      className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden"
                      style={{
                        background: "linear-gradient(135deg, #00f5ff, #8b5cf6)",
                      }}>
                      <AvatarIcon size={20} />
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
                    className="flex-1 px-4 py-3 text-sm rounded-xl outline-none transition-all duration-300"
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
                    className="px-4 py-3 rounded-xl disabled:opacity-40 transition-all duration-300 cursor-pointer"
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
