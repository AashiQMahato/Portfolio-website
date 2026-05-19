import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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
  <div className="relative shrink-0" style={{ width: size, height: size }}>
    {ring && (
      <>
        <motion.div
          className="absolute rounded-full -inset-1 bg-gradient-to-r from-primary via-accent to-primary opacity-70"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute -inset-[1px] rounded-full bg-background" />
      </>
    )}
    <img
      src={AVATAR_URL}
      alt="AI Avatar"
      className="absolute inset-0 object-cover object-top w-full h-full rounded-full"
      loading="lazy"
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
  const prefersReducedMotion = useReducedMotion();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, prefersReducedMotion]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      const timeoutId = window.setTimeout(
        () => inputRef.current?.focus(),
        prefersReducedMotion ? 0 : 250,
      );
      return () => window.clearTimeout(timeoutId);
    }
  }, [isOpen, prefersReducedMotion]);

  const sendMessage = async (text) => {
    if (isTyping) return;

    const trimmed = String(text ?? "").trim();
    if (!trimmed) return;

    const userMessage = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setShowChips(false);
    setIsTyping(true);

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) throw new Error("API key not configured");

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
              ...updatedMessages
                .slice(-10)
                .map((m) => ({ role: m.role, content: m.content })),
            ],
            temperature: 0.7,
            max_tokens: 300,
          }),
        },
      );

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      const aiContent =
        data.choices?.[0]?.message?.content ||
        "I'm sorry, I couldn't process that. Please try again!";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiContent },
      ]);
    } catch {
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
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const canSend = input.trim().length > 0 && !isTyping;

  return (
    <>
      {/* FAB */}
      <motion.button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-controls="ai-chat-window"
        className="fixed bottom-7 right-7 z-[100] w-[68px] h-[68px] rounded-full bg-transparent flex items-center justify-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.94 }}
        title="Chat with AI Assistant">
        {/* Outer glow pulse (motion-safe) */}
        {!prefersReducedMotion && (
          <motion.div
            className="absolute rounded-full -inset-2"
            style={{
              background:
                "radial-gradient(circle, rgb(var(--primary) / 0.35) 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.25, 1], opacity: [0.7, 0.2, 0.7] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        <AvatarImage size={68} ring={true} />

        {/* Sparkle badge */}
        <div className="absolute top-1.5 right-1.5 w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground flex items-center justify-center border-2 border-background">
          <Sparkles size={9} />
        </div>

        {/* Tooltip */}
        <div className="absolute right-[calc(100%+14px)] top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg text-xs whitespace-nowrap pointer-events-none opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 border border-border bg-card/90 backdrop-blur-sm text-foreground shadow-md">
          Chat with Aashiq&apos;s AI
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
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[101] bg-black/60 backdrop-blur md:hidden"
            />

            <motion.div
              id="ai-chat-window"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              className="fixed bottom-28 right-6 z-[102] w-[400px] max-w-[calc(100vw-2rem)] h-[580px] max-h-[calc(100vh-8rem)] rounded-2xl overflow-hidden flex flex-col border border-border bg-card/90 backdrop-blur-sm shadow-xl">
              {/* Decorative top shimmer line */}
              <div className="absolute top-0 left-[10%] right-[10%] h-px rounded-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

              {/* Ambient blobs */}
              <div
                className="absolute rounded-full pointer-events-none -top-10 -right-8 w-44 h-44"
                style={{
                  background:
                    "radial-gradient(circle, rgb(var(--accent) / 0.10) 0%, transparent 70%)",
                }}
              />
              <div
                className="absolute rounded-full pointer-events-none bottom-16 -left-10 w-52 h-52"
                style={{
                  background:
                    "radial-gradient(circle, rgb(var(--primary) / 0.08) 0%, transparent 70%)",
                }}
              />

              {/* Header */}
              <div className="relative z-10 flex items-center gap-3 px-5 py-4 border-b border-border bg-card/60">
                <AvatarImage size={46} ring={true} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold truncate font-display gradient-text">
                    Aashiq&apos;s AI Assistant
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-primary"
                      animate={
                        prefersReducedMotion ? {} : { opacity: [1, 0.4, 1] }
                      }
                      transition={
                        prefersReducedMotion
                          ? {}
                          : { duration: 1.8, repeat: Infinity }
                      }
                    />
                    <span className="text-[11px] text-muted-foreground">
                      Online · Ask me anything
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={clearChat}
                  className="w-8 h-8 border rounded-lg border-border bg-card/50 text-muted-foreground hover:text-foreground hover:bg-card/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  title="Clear chat">
                  <Trash2 size={14} className="mx-auto" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 border rounded-lg border-border bg-card/50 text-muted-foreground hover:text-foreground hover:bg-card/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  title="Close chat">
                  <X size={14} className="mx-auto" />
                </button>
              </div>

              {/* Messages */}
              <div className="relative z-10 flex-1 px-4 py-4 space-y-3 overflow-y-auto">
                {/* Welcome */}
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="pt-2 pb-1 text-center">
                    <div className="w-20 h-20 mx-auto mb-4">
                      <AvatarImage size={80} ring={true} />
                    </div>
                    <p className="mb-1 text-base font-bold font-display text-foreground">
                      Hello there!
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      I&apos;m Aashiq&apos;s personal AI assistant.
                      <br />
                      Ask me anything about his work!
                    </p>
                  </motion.div>
                )}

                {/* Suggested chips */}
                {showChips && messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="flex flex-wrap justify-center gap-2">
                    {suggestedChips.map((chip, idx) => (
                      <motion.button
                        key={chip.text}
                        type="button"
                        onClick={() => sendMessage(chip.text)}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + idx * 0.07 }}
                        whileTap={{ scale: 0.96 }}
                        className="px-3.5 py-1.5 text-xs font-medium rounded-full border border-border bg-card/40 text-muted-foreground hover:text-foreground hover:bg-card/60 hover:border-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
                        {chip.emoji} {chip.text}
                      </motion.button>
                    ))}
                  </motion.div>
                )}

                {/* Conversation */}
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28 }}
                    className={`flex gap-2.5 items-end ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}>
                    {msg.role === "assistant" && (
                      <img
                        src={AVATAR_URL}
                        alt="AI"
                        className="object-cover object-top border rounded-full w-7 h-7 border-primary/20 shrink-0"
                        loading="lazy"
                      />
                    )}

                    <div
                      className={
                        msg.role === "user"
                          ? "max-w-[78%] px-4 py-2.5 rounded-[18px] rounded-br-md text-sm leading-relaxed border border-primary/30 bg-primary text-primary-foreground"
                          : "max-w-[78%] px-4 py-2.5 rounded-[18px] rounded-bl-md text-sm leading-relaxed border border-border bg-card/60 text-foreground"
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
                    className="flex gap-2.5 items-end">
                    <img
                      src={AVATAR_URL}
                      alt="AI"
                      className="object-cover object-top border rounded-full w-7 h-7 border-primary/20 shrink-0"
                      loading="lazy"
                    />
                    <div className="flex gap-1.5 items-center px-4 py-3 rounded-[18px] rounded-bl-md border border-border bg-card/60">
                      {[0, 1, 2].map((dot) => (
                        <motion.div
                          key={dot}
                          className="w-2 h-2 rounded-full bg-primary"
                          animate={
                            prefersReducedMotion
                              ? {}
                              : { y: [-3, 3, -3], opacity: [1, 0.4, 1] }
                          }
                          transition={
                            prefersReducedMotion
                              ? {}
                              : {
                                  duration: 0.7,
                                  repeat: Infinity,
                                  delay: dot * 0.15,
                                }
                          }
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="relative z-10 px-4 pt-3 pb-4 border-t border-border bg-card/60">
                <div className="flex items-center gap-2 px-3 py-2 border rounded-xl border-border bg-background/40 focus-within:ring-2 focus-within:ring-ring/50 focus-within:border-primary/30">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about skills, projects…"
                    className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                  />

                  <motion.button
                    type="button"
                    onClick={() => sendMessage(input)}
                    disabled={!canSend}
                    whileHover={canSend ? { scale: 1.06 } : {}}
                    whileTap={canSend ? { scale: 0.94 } : {}}
                    className={
                      canSend
                        ? "w-10 h-10 rounded-lg border border-primary/30 bg-primary text-primary-foreground flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                        : "w-10 h-10 rounded-lg border border-border bg-card/40 text-muted-foreground/50 flex items-center justify-center cursor-not-allowed"
                    }>
                    <Send size={15} />
                  </motion.button>
                </div>

                <div className="text-center mt-2 text-[10.5px] text-muted-foreground/60 tracking-wide">
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
