import { useMemo, useState, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { X, Send, Trash2 } from "lucide-react";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import jsxLang from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import jsLang from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import tsLang from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import pyLang from "react-syntax-highlighter/dist/esm/languages/prism/python";
import bashLang from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import jsonLang from "react-syntax-highlighter/dist/esm/languages/prism/json";
import cssLang from "react-syntax-highlighter/dist/esm/languages/prism/css";
import cLang from "react-syntax-highlighter/dist/esm/languages/prism/c";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

import { useTheme } from "../context/ThemeContext";
import useLauncherVisible from "./chrome/useLauncherVisible";
import { gsap, EASE, DUR, usePrefersReducedMotion, useMediaQuery } from "../motion";
import assistantAvatar from "../assets/assistant-avatar.png";
import { CV, projects, siteConfig } from "../data/portfolioData";

[
  ["jsx", jsxLang],
  ["javascript", jsLang],
  ["typescript", tsLang],
  ["python", pyLang],
  ["bash", bashLang],
  ["json", jsonLang],
  ["css", cssLang],
  ["c", cLang],
].forEach(([name, lang]) => SyntaxHighlighter.registerLanguage(name, lang));

// Self-hosted: the remote CDN set third-party cookies on every load.
const AVATAR_URL = assistantAvatar;

// Built from the same data the site renders, so the assistant can only
// repeat facts that are on the page — and stays in sync when they change.
const SYSTEM_PROMPT = `You are the AI assistant on the portfolio of ${CV.name} (also written Aashiq Mahato). Be friendly, concise and professional.

About him:
- ${CV.title}, based in Kathmandu, Nepal. ${siteConfig.availability}.
- ${CV.summary}
- Education: ${CV.education[0].degree}, ${CV.education[0].institution} (${CV.education[0].period}).
- Experience:
${CV.experience.map((e) => `  - ${e.role}, ${e.company} (${e.period})`).join("\n")}
- Skills: ${CV.skills.join(", ")}.

Projects (ALWAYS link as [Title](/projects/slug)):
${projects.map((p) => `- [${p.title}](/projects/${p.slug}) — ${p.year}; ${p.tags.join(", ")}. ${p.shortDesc}`).join("\n")}

Rules:
- Only state facts listed above. If something isn't covered, say you don't know and suggest the [Contact section](/#contact).
- Keep answers brief and skimmable: short bullets, bold for emphasis, Markdown links for projects.
- For hiring or collaboration, point to the [Contact section](/#contact) or ${CV.contact.email}.`;

const normalizeAssistantMarkdown = (content) => {
  const text = String(content ?? "").trim();
  if (!text) return "";
  // If the model returns a single dense paragraph, encourage line breaks.
  // (We keep this conservative to avoid mangling valid Markdown.)
  return text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n");
};

const MarkdownMessage = ({ content, isDark }) => {
  const markdown = useMemo(
    () => normalizeAssistantMarkdown(content),
    [content],
  );

  return (
    <div className="w-full min-w-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children, ...props }) => (
            <h1
              className="mt-2 mb-2 text-base font-semibold tracking-tight"
              {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="mt-3 mb-2 text-sm font-semibold" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-sm font-semibold mt-3 mb-1.5" {...props}>
              {children}
            </h3>
          ),
          p: ({ children, ...props }) => (
            <p className="my-2 leading-relaxed break-words text-ink" {...props}>
              {children}
            </p>
          ),
          ul: ({ children, ...props }) => (
            <ul className="pl-5 my-2 space-y-1 list-disc" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="pl-5 my-2 space-y-1 list-decimal" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="leading-relaxed break-words" {...props}>
              {children}
            </li>
          ),
          a: ({ children, href, ...props }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="underline text-accent-ink underline-offset-4 hover:opacity-90"
              {...props}>
              {children}
            </a>
          ),
          table: ({ children, ...props }) => (
            <div className="max-w-full my-3 overflow-x-auto border rounded-lg border-line">
              <table className="w-full text-left border-collapse" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-ink/[0.04]" {...props}>
              {children}
            </thead>
          ),
          th: ({ children, ...props }) => (
            <th
              className="px-3 py-2 text-[12.5px] font-semibold text-ink border-b border-line"
              {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td
              className="px-3 py-2 text-[12.5px] text-ink border-b border-line align-top"
              {...props}>
              {children}
            </td>
          ),
          code: ({ inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const language = match?.[1];
            const codeText = String(children ?? "").replace(/\n$/, "");

            if (inline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded-md border border-line bg-ink/[0.04] font-mono text-[12.5px]"
                  {...props}>
                  {children}
                </code>
              );
            }

            return (
              <div className="my-3 overflow-hidden border rounded-lg border-line bg-panel">
                <div className="px-3 py-2 border-b border-line">
                  <span className="hud">{language || "code"}</span>
                </div>
                <div className="max-w-full overflow-x-auto">
                  <SyntaxHighlighter
                    language={language}
                    style={isDark ? oneDark : oneLight}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      background: "transparent",
                      fontSize: "12.5px",
                      lineHeight: "1.6",
                    }}
                    codeTagProps={{
                      style: { fontFamily: "var(--app-font-mono, monospace)" },
                    }}
                    {...props}>
                    {codeText}
                  </SyntaxHighlighter>
                </div>
              </div>
            );
          },
        }}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

MarkdownMessage.propTypes = {
  content: PropTypes.string,
  isDark: PropTypes.bool,
};

const suggestedChips = [
  "View his top skills",
  "What projects has he built?",
  "How to hire him?",
  "Hardware experience?",
];

/* Keep Tab inside the dialog. */
const trapTab = (e, root) => {
  if (e.key !== "Tab" || !root) return;
  const nodes = root.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
  );
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  if (!first) return;
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
};

// Sits above the FAB: safe-area offset + FAB size + a 12–16px gap.
const PANEL_POSITION =
  "bottom-[calc(max(1.25rem,env(safe-area-inset-bottom))_+_3.75rem)] md:bottom-[calc(max(1.25rem,env(safe-area-inset-bottom))_+_4.5rem)]";

const AIChatbot = () => {
  const launcherShown = useLauncherVisible();
  // Full-screen sheet with a backdrop on phones (modal); a parallel,
  // non-blocking panel on wider screens, so the page stays reachable.
  const isModal = !useMediaQuery("(min-width: 768px)");
  const themeContext = useTheme();
  const isDark = (themeContext?.theme ?? "dark") !== "light";
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showChips, setShowChips] = useState(true);
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = listRef.current;
    el?.scrollTo({
      top: el.scrollHeight,
      behavior: reduced ? "auto" : "smooth",
    });
  }, [messages, isTyping, reduced]);

  // Enter / exit. The root stays mounted; autoAlpha hides it once faded out.
  useGSAP(
    () => {
      if (isOpen) {
        gsap.set(rootRef.current, { visibility: "visible" });
        gsap.to(rootRef.current, {
          opacity: 1,
          duration: 0.2,
          ease: EASE.out,
          overwrite: true,
        });
        gsap.fromTo(
          panelRef.current,
          { y: reduced ? 0 : 16 },
          { y: 0, duration: DUR.fast, ease: EASE.out, overwrite: true },
        );
      } else {
        gsap.to(rootRef.current, {
          autoAlpha: 0,
          duration: 0.2,
          ease: EASE.soft,
          overwrite: true,
        });
      }
    },
    { dependencies: [isOpen, reduced], scope: rootRef },
  );

  // Newest message rises in.
  useGSAP(
    () => {
      const nodes = panelRef.current.querySelectorAll("[data-msg]");
      const last = nodes[nodes.length - 1];
      if (!last) return;
      gsap.from(last, {
        opacity: 0,
        y: reduced ? 0 : 8,
        duration: DUR.fast,
        ease: EASE.out,
      });
    },
    { dependencies: [messages.length], scope: panelRef },
  );

  // Move focus in on open, hand it back on close.
  useEffect(() => {
    if (!isOpen) return undefined;
    const previous = document.activeElement;
    inputRef.current?.focus({ preventScroll: true });
    return () => previous?.focus?.({ preventScroll: true });
  }, [isOpen]);

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
            max_tokens: 520,
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
        { role: "assistant", content: normalizeAssistantMarkdown(aiContent) },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "### Connection issue\n\nI'm having trouble connecting right now. Feel free to reach out via the **Contact** section!",
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
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const onPanelKeyDown = (e) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      setIsOpen(false);
      return;
    }
    if (isModal) trapTab(e, panelRef.current);
  };

  const canSend = input.trim().length > 0 && !isTyping;

  return (
    <>
      {/* FAB */}
      <button
        type="button"
        data-chrome
        data-cursor="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close AI assistant" : "Chat with Aashiq's AI assistant"}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="ai-chat-window"
        className={`fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-[102] flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-line bg-panel text-ink transition-[transform,opacity,border-color] duration-500 ease-out hover:border-ink-dim active:scale-95 md:h-14 md:w-14 ${
          launcherShown || isOpen ? "" : "pointer-events-none translate-y-4 opacity-0"
        }`}
        tabIndex={launcherShown || isOpen ? undefined : -1}>
        {isOpen ? (
          <X aria-hidden="true" className="h-5 w-5" />
        ) : (
          <img
            src={AVATAR_URL}
            alt=""
            className="h-full w-full object-cover object-top"
            loading="lazy"
          />
        )}
      </button>

      {/* Chat layer */}
      <div
        ref={rootRef}
        data-chrome
        style={{ visibility: "hidden", opacity: 0 }}
        className="pointer-events-none fixed inset-0 z-[101]">
        {/* Mobile backdrop */}
        <div
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
          className="pointer-events-auto absolute inset-0 bg-background/80 md:hidden"
        />

        <div
          ref={panelRef}
          id="ai-chat-window"
          role="dialog"
          aria-modal={isModal}
          aria-label="Chat with Aashiq's AI assistant"
          onKeyDown={onPanelKeyDown}
          className={`pointer-events-auto absolute left-3 right-3 flex h-[min(580px,calc(100dvh_-_7rem))] flex-col overflow-hidden rounded-xl border border-line bg-panel shadow-2xl shadow-black/40 md:left-auto md:right-5 md:w-[400px] ${PANEL_POSITION}`}>
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-line px-4 py-3">
            <img
              src={AVATAR_URL}
              alt=""
              className="h-10 w-10 shrink-0 rounded-full border border-line object-cover object-top"
              loading="lazy"
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-ink">
                Aashiq&apos;s AI Assistant
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-signal"
                />
                <span className="hud">Online · Ask me anything</span>
              </div>
            </div>

            <button
              type="button"
              onClick={clearChat}
              aria-label="Clear conversation"
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink-dim transition-colors duration-200 ease-out hover:bg-ink/[0.06] hover:text-ink">
              <Trash2 aria-hidden="true" size={15} />
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink-dim transition-colors duration-200 ease-out hover:bg-ink/[0.06] hover:text-ink">
              <X aria-hidden="true" size={15} />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            data-lenis-prevent
            role="log"
            aria-live="polite"
            aria-label="Conversation"
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {/* Welcome */}
            {messages.length === 0 && (
              <div className="pb-1 pt-2 text-center">
                <img
                  src={AVATAR_URL}
                  alt=""
                  className="mx-auto mb-4 h-16 w-16 rounded-full border border-line object-cover object-top"
                  loading="lazy"
                />
                <p className="mb-1 text-base font-semibold text-ink">
                  Hello there!
                </p>
                <p className="text-sm leading-relaxed text-ink-dim">
                  I&apos;m Aashiq&apos;s personal AI assistant.
                  <br />
                  Ask me anything about his work!
                </p>
              </div>
            )}

            {/* Suggested chips */}
            {showChips && messages.length === 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {suggestedChips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => sendMessage(chip)}
                    className="rounded-full border border-line px-3.5 py-1.5 text-xs font-medium text-ink-dim transition-colors duration-200 ease-out hover:border-ink-dim hover:text-ink">
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Conversation */}
            {messages.map((msg, i) => (
              <div
                key={i}
                data-msg
                className={`flex items-end gap-2.5 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}>
                {msg.role === "assistant" && (
                  <img
                    src={AVATAR_URL}
                    alt=""
                    className="h-7 w-7 shrink-0 rounded-full border border-line object-cover object-top"
                    loading="lazy"
                  />
                )}

                <div
                  className={
                    msg.role === "user"
                      ? "max-w-[86%] rounded-xl rounded-br-sm bg-signal px-4 py-2.5 text-sm leading-relaxed text-primary-foreground sm:max-w-[78%]"
                      : "max-w-[92%] rounded-xl rounded-bl-sm border border-line bg-background px-4 py-2.5 text-[13.5px] leading-relaxed text-ink sm:max-w-[78%] sm:text-sm"
                  }>
                  {msg.role === "assistant" ? (
                    <MarkdownMessage content={msg.content} isDark={isDark} />
                  ) : (
                    <span className="whitespace-pre-wrap break-words">
                      {msg.content}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Typing */}
            {isTyping && (
              <div className="flex items-end gap-2.5">
                <img
                  src={AVATAR_URL}
                  alt=""
                  className="h-7 w-7 shrink-0 rounded-full border border-line object-cover object-top"
                  loading="lazy"
                />
                <div
                  role="status"
                  aria-label="Assistant is typing"
                  className="flex items-center gap-1.5 rounded-xl rounded-bl-sm border border-line bg-background px-4 py-3">
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-ink-dim motion-safe:animate-pulse"
                      style={{ animationDelay: `${dot * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-line px-4 pb-3 pt-3">
            <div className="flex items-center gap-2 rounded-full border border-line bg-background py-1.5 pl-4 pr-1.5 transition-colors duration-200 ease-out focus-within:border-ink-dim">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about skills, projects…"
                aria-label="Message"
                className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-dim"
              />

              <button
                type="button"
                onClick={() => sendMessage(input)}
                disabled={!canSend}
                aria-label="Send message"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-signal text-primary-foreground transition-opacity duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-40">
                <Send aria-hidden="true" size={15} />
              </button>
            </div>

            <div className="hud mt-2 text-center">Powered by AI · Aashiq.dev</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIChatbot;
