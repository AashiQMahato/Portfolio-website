import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Trash2, Sparkles } from "lucide-react";

const AVATAR_URL =
  "https://cdn.pixabay.com/photo/2024/03/17/09/13/ai-generated-8638571_1280.png";

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
  { emoji: "⚡", text: "View his top skills" },
  { emoji: "🛠️", text: "What projects has he built?" },
  { emoji: "📬", text: "How to hire him?" },
  { emoji: "🔧", text: "Hardware experience?" },
];

/* Animated avatar component */
const AvatarImage = ({ size = 40, ring = true }) => (
  <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
    {ring && (
      <>
        <motion.div
          style={{
            position: "absolute",
            inset: -3,
            borderRadius: "50%",
            background: "conic-gradient(from 0deg, #f9a825, #ff6f00, #e040fb, #00bcd4, #f9a825)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        <div
          style={{
            position: "absolute",
            inset: -1,
            borderRadius: "50%",
            background: "#0d0d1a",
          }}
        />
      </>
    )}
    <img
      src={AVATAR_URL}
      alt="AI Avatar"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        objectFit: "cover",
        objectPosition: "center top",
      }}
    />
  </div>
);

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
      if (!apiKey) throw new Error("API key not configured");

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...updatedMessages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
          ],
          temperature: 0.7,
          max_tokens: 300,
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      const aiContent =
        data.choices?.[0]?.message?.content ||
        "I'm sorry, I couldn't process that. Please try again!";
      setMessages((prev) => [...prev, { role: "assistant", content: aiContent }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having some trouble connecting right now. Feel free to reach out via the Contact page!",
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500&display=swap');

        .chat-scrollbar::-webkit-scrollbar { width: 4px; }
        .chat-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .chat-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(249,168,37,0.25);
          border-radius: 4px;
        }
        .chat-input::placeholder { color: rgba(255,255,255,0.25); }
        .chip-btn:hover {
          border-color: rgba(249,168,37,0.5) !important;
          background: rgba(249,168,37,0.08) !important;
          color: #f9a825 !important;
        }
      `}</style>

      {/* FAB */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 100,
          width: 68,
          height: 68,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          padding: 0,
          background: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.94 }}
        title="Chat with AI Assistant">
        {/* Outer glow pulse */}
        <motion.div
          style={{
            position: "absolute",
            inset: -6,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(249,168,37,0.35) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.25, 1], opacity: [0.7, 0.2, 0.7] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <AvatarImage size={68} ring={true} />

        {/* Sparkle badge */}
        <div
          style={{
            position: "absolute",
            top: 2,
            right: 2,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #f9a825, #ff6f00)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #0d0d1a",
          }}>
          <Sparkles size={9} color="#fff" />
        </div>

        {/* Tooltip */}
        <motion.div
          style={{
            position: "absolute",
            right: "calc(100% + 14px)",
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(13,13,26,0.95)",
            border: "1px solid rgba(249,168,37,0.3)",
            borderRadius: 10,
            padding: "7px 13px",
            fontSize: 12,
            fontFamily: "'DM Sans', sans-serif",
            color: "#f5e6c8",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
          initial={{ opacity: 0, x: 8 }}
          whileHover={{ opacity: 1, x: 0 }}>
          Chat with Aashiq&apos;s AI ✦
        </motion.div>
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
              onClick={() => setIsOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 101,
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(6px)",
                display: "none",
              }}
              className="md-overlay"
            />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              style={{
                position: "fixed",
                bottom: 108,
                right: 24,
                zIndex: 102,
                width: 400,
                height: 580,
                borderRadius: 24,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                background: "linear-gradient(160deg, #12111f 0%, #0d0c1a 50%, #111020 100%)",
                boxShadow:
                  "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(249,168,37,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
                fontFamily: "'DM Sans', sans-serif",
              }}>

              {/* Decorative top shimmer line */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "10%",
                  right: "10%",
                  height: 1,
                  background:
                    "linear-gradient(90deg, transparent, rgba(249,168,37,0.6), rgba(224,64,251,0.4), transparent)",
                  borderRadius: 1,
                }}
              />

              {/* Ambient glow blobs */}
              <div
                style={{
                  position: "absolute",
                  top: -40,
                  right: -30,
                  width: 180,
                  height: 180,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(224,64,251,0.08) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 60,
                  left: -40,
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(249,168,37,0.06) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              {/* ── HEADER ── */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "18px 20px 16px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.02)",
                  position: "relative",
                  zIndex: 1,
                }}>
                <AvatarImage size={46} ring={true} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 700,
                      fontSize: 15,
                      background: "linear-gradient(90deg, #f9a825, #ffcc02, #e040fb)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                      letterSpacing: 0.2,
                    }}>
                    Aashiq&apos;s AI Assistant
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginTop: 3,
                    }}>
                    <motion.div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "#4ade80",
                        flexShrink: 0,
                      }}
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    />
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", letterSpacing: 0.3 }}>
                      Online · Ask me anything
                    </span>
                  </div>
                </div>

                <button
                  onClick={clearChat}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 9,
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.4)",
                    flexShrink: 0,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#f9a825";
                    e.currentTarget.style.borderColor = "rgba(249,168,37,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                  title="Clear chat">
                  <Trash2 size={14} />
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 9,
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.4)",
                    flexShrink: 0,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  }}>
                  <X size={14} />
                </button>
              </div>

              {/* ── MESSAGES ── */}
              <div
                className="chat-scrollbar"
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "20px 18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  position: "relative",
                  zIndex: 1,
                }}>

                {/* Welcome state */}
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{ textAlign: "center", paddingTop: 10, paddingBottom: 8 }}>
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        margin: "0 auto 16px",
                        position: "relative",
                      }}>
                      <motion.div
                        style={{
                          position: "absolute",
                          inset: -8,
                          borderRadius: "50%",
                          background:
                            "conic-gradient(from 0deg, #f9a825, #ff6f00, #e040fb, #00bcd4, #f9a825)",
                          opacity: 0.35,
                        }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                      />
                      <img
                        src={AVATAR_URL}
                        alt="AI"
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          objectFit: "cover",
                          objectPosition: "center top",
                          border: "2px solid rgba(249,168,37,0.4)",
                        }}
                      />
                    </div>
                    <p
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#f5e6c8",
                        marginBottom: 6,
                      }}>
                      Hello there! ✦
                    </p>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>
                      I&apos;m Aashiq&apos;s personal AI assistant.<br />
                      Ask me anything about his work!
                    </p>
                  </motion.div>
                )}

                {/* Suggestion chips */}
                {showChips && messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                      justifyContent: "center",
                    }}>
                    {suggestedChips.map((chip, idx) => (
                      <motion.button
                        key={chip.text}
                        className="chip-btn"
                        onClick={() => sendMessage(chip.text)}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + idx * 0.07 }}
                        whileTap={{ scale: 0.96 }}
                        style={{
                          padding: "7px 14px",
                          fontSize: 12,
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 500,
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 20,
                          color: "rgba(255,255,255,0.6)",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          letterSpacing: 0.2,
                        }}>
                        {chip.emoji} {chip.text}
                      </motion.button>
                    ))}
                  </motion.div>
                )}

                {/* Messages */}
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28 }}
                    style={{
                      display: "flex",
                      gap: 10,
                      justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                      alignItems: "flex-end",
                    }}>
                    {msg.role === "assistant" && (
                      <div style={{ flexShrink: 0, marginBottom: 2 }}>
                        <img
                          src={AVATAR_URL}
                          alt="AI"
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            objectFit: "cover",
                            objectPosition: "center top",
                            border: "1.5px solid rgba(249,168,37,0.4)",
                          }}
                        />
                      </div>
                    )}

                    <div
                      style={
                        msg.role === "user"
                          ? {
                              maxWidth: "78%",
                              padding: "10px 16px",
                              borderRadius: "18px 18px 4px 18px",
                              fontSize: 13.5,
                              lineHeight: 1.6,
                              background: "linear-gradient(135deg, #f9a825, #ff6f00)",
                              color: "#fff",
                              fontFamily: "'DM Sans', sans-serif",
                              fontWeight: 400,
                              boxShadow: "0 4px 20px rgba(249,168,37,0.25)",
                            }
                          : {
                              maxWidth: "78%",
                              padding: "10px 16px",
                              borderRadius: "18px 18px 18px 4px",
                              fontSize: 13.5,
                              lineHeight: 1.6,
                              background: "rgba(255,255,255,0.05)",
                              border: "1px solid rgba(255,255,255,0.07)",
                              color: "rgba(255,255,255,0.85)",
                              fontFamily: "'DM Sans', sans-serif",
                              fontWeight: 400,
                            }
                      }>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}

                {/* Typing */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                    <img
                      src={AVATAR_URL}
                      alt="AI"
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        objectFit: "cover",
                        objectPosition: "center top",
                        border: "1.5px solid rgba(249,168,37,0.4)",
                        flexShrink: 0,
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        gap: 5,
                        alignItems: "center",
                        padding: "12px 16px",
                        borderRadius: "18px 18px 18px 4px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}>
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #f9a825, #e040fb)",
                          }}
                          animate={{ y: [-4, 4, -4], opacity: [1, 0.4, 1] }}
                          transition={{
                            duration: 0.7,
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

              {/* ── INPUT ── */}
              <div
                style={{
                  padding: "14px 16px 18px",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(0,0,0,0.2)",
                  position: "relative",
                  zIndex: 1,
                }}>
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 16,
                    padding: "6px 8px 6px 16px",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onFocusCapture={(e) => {
                    e.currentTarget.style.borderColor = "rgba(249,168,37,0.45)";
                    e.currentTarget.style.boxShadow = "0 0 20px rgba(249,168,37,0.1)";
                  }}
                  onBlurCapture={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about skills, projects…"
                    className="chat-input"
                    style={{
                      flex: 1,
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      fontSize: 13.5,
                      color: "#f5e6c8",
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 400,
                      padding: "6px 0",
                    }}
                  />

                  <motion.button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || isTyping}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 12,
                      border: "none",
                      background:
                        input.trim() && !isTyping
                          ? "linear-gradient(135deg, #f9a825, #ff6f00)"
                          : "rgba(255,255,255,0.07)",
                      color: input.trim() && !isTyping ? "#fff" : "rgba(255,255,255,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: input.trim() && !isTyping ? "pointer" : "not-allowed",
                      flexShrink: 0,
                      transition: "all 0.25s",
                      boxShadow:
                        input.trim() && !isTyping
                          ? "0 4px 14px rgba(249,168,37,0.35)"
                          : "none",
                    }}>
                    <Send size={15} />
                  </motion.button>
                </div>

                {/* Branding */}
                <div
                  style={{
                    textAlign: "center",
                    marginTop: 10,
                    fontSize: 10.5,
                    color: "rgba(255,255,255,0.2)",
                    letterSpacing: 0.5,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                  Powered by AI · Aashiq.dev
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