import { useState, useEffect, useRef, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { projects } from "../data/portfolioData";
import { gsap, EASE, DUR, usePrefersReducedMotion } from "../motion";

const PROMPT = "aashiq@portfolio:~$";

// `open <target>` destinations: home sections first, then routes.
const OPEN_TARGETS = {
  home: "/",
  work: "/#work",
  about: "/#about",
  experience: "/#experience",
  skills: "/#skills",
  writing: "/#writing",
  contact: "/#contact",
  projects: "/projects",
  blog: "/blog",
  resume: "/resume",
  now: "/now",
  timeline: "/timeline",
  dashboard: "/developer-dashboard",
};

const HELP_TEXT = `
Available commands:

  help          Show this help message
  whoami        About Aashiq
  projects      List all projects
  skills        List tech skills
  about         Short bio
  resume        Open resume page
  contact       Contact info
  github        Open GitHub profile
  open <page>   Go to a page or section
                (${Object.keys(OPEN_TARGETS).join(", ")})
  clear         Clear terminal

Use arrow keys for command history. Esc closes.
`;

const WHOAMI_TEXT = `
Aashiq Kumar Mahato
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Role     : Electronics Engineer & Full-Stack Developer
Location : Kathmandu, Nepal
Status   : ✅ Available for opportunities
`;

const SKILLS_TEXT = `
Tech Stack:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Frontend : React.js (95%), Next.js, TypeScript, Tailwind CSS
Backend  : Node.js (88%), Express.js, REST APIs
Database : MongoDB (80%), Mongoose
Hardware : Arduino (92%), Raspberry Pi, IoT, C/C++
AI/ML    : Python (85%), OpenAI API, Face Recognition
Tools    : Git, VS Code, Linux, Docker
`;

const ABOUT_TEXT = `
Dynamic IT professional with a strong foundation in modern web
development and electronics engineering. Skilled in the React
ecosystem, Next.js, TypeScript, and IoT systems. Adept at
translating complex technical concepts into clear, user-friendly
solutions. BE in Electronics, Communication & Information Engineering.
`;

const CONTACT_TEXT = `
Get in touch:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email    : aashikkrmahatoo@gmail.com
Phone    : +977-9808711811
GitHub   : github.com/AashiQMahato
LinkedIn : linkedin.com/in/aashiq-mahato-9a343b2b4/
Location : Shantinagar, Kathmandu
`;

const BOOT_SEQUENCE = [
  "> Initializing Aashiq OS v2026...",
  "> Loading modules: [react] [node] [arduino] [python] ✓",
  "> Establishing secure connection...",
  "> Portfolio loaded successfully.",
  '> Type "help" for available commands.',
  "",
];

// The terminal is always dark, so its colours are fixed rather than themed.
// Every value clears AA against #0d1117.
const LINE_COLOR = {
  prompt: "text-[#ff8052]",
  error: "text-[#ff7b72]",
  success: "text-[#7ee787]",
  boot: "text-[#79c0ff]",
  output: "text-[#e6edf3]/85",
};

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

const Terminal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [booted, setBooted] = useState(false);
  const [isBooting, setIsBooting] = useState(false);
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const outputRef = useRef(null);
  const navigate = useNavigate();
  const reduced = usePrefersReducedMotion();

  const addLine = useCallback((content, type = "output") => {
    setLines((prev) => [
      ...prev,
      { content, type, id: Date.now() + Math.random() },
    ]);
  }, []);

  const boot = useCallback(async () => {
    if (booted) return;
    setIsBooting(true);
    for (const line of BOOT_SEQUENCE) {
      await new Promise((r) => setTimeout(r, 120));
      addLine(line, "boot");
    }
    setIsBooting(false);
    setBooted(true);
  }, [booted, addLine]);

  useEffect(() => {
    if (isOpen && !booted) {
      boot();
    }
  }, [isOpen, booted, boot]);

  useEffect(() => {
    const el = outputRef.current;
    el?.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [lines, reduced]);

  // Listen for custom event from command palette
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("open-terminal", handler);
    return () => window.removeEventListener("open-terminal", handler);
  }, []);

  // Enter / exit. The panel stays mounted; autoAlpha hides it once faded out.
  useGSAP(
    () => {
      const panel = panelRef.current;
      if (isOpen) {
        gsap.set(panel, { visibility: "visible" });
        gsap.fromTo(
          panel,
          { opacity: 0, y: reduced ? 0 : 16 },
          { opacity: 1, y: 0, duration: DUR.fast, ease: EASE.out, overwrite: true },
        );
      } else {
        gsap.to(panel, {
          autoAlpha: 0,
          y: reduced ? 0 : 12,
          duration: 0.2,
          ease: EASE.soft,
          overwrite: true,
        });
      }
    },
    { dependencies: [isOpen, reduced], scope: panelRef },
  );

  // Move focus in on open, hand it back on close.
  useEffect(() => {
    if (!isOpen) return undefined;
    const previous = document.activeElement;
    inputRef.current?.focus({ preventScroll: true });
    return () => previous?.focus?.({ preventScroll: true });
  }, [isOpen]);

  const processCommand = useCallback(
    (cmd) => {
      const trimmed = cmd.trim().toLowerCase();
      addLine(`${PROMPT} ${cmd}`, "prompt");

      switch (trimmed) {
        case "help":
          addLine(HELP_TEXT);
          break;
        case "whoami":
          addLine(WHOAMI_TEXT);
          break;
        case "skills":
          addLine(SKILLS_TEXT);
          break;
        case "about":
          addLine(ABOUT_TEXT);
          break;
        case "contact":
          addLine(CONTACT_TEXT);
          break;
        case "resume":
          addLine("> Opening resume...", "success");
          setTimeout(() => {
            navigate("/resume");
            setIsOpen(false);
          }, 500);
          break;
        case "github":
          addLine("> Opening GitHub profile...", "success");
          setTimeout(
            () => window.open("https://github.com/AashiQMahato", "_blank"),
            300,
          );
          break;
        case "projects": {
          const list = projects
            .map((p, i) => `  ${i + 1}. ${p.title} [${p.category}]`)
            .join("\n");
          addLine(
            `\nProjects (${projects.length}):\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${list}\n\nRun "projects <number>" to view details.`,
          );
          break;
        }
        case "clear":
          setLines([]);
          return;
        case "":
          break;
        default: {
          // Handle "projects <n>"
          const projMatch = trimmed.match(/^projects\s+(\d+)$/);
          // Handle "open <page>"
          const openMatch = trimmed.match(/^open\s+(\S+)$/);
          if (projMatch) {
            const idx = parseInt(projMatch[1]) - 1;
            if (projects[idx]) {
              const p = projects[idx];
              addLine(
                `\n${p.title}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${p.shortDesc}\nTech: ${p.tags.join(", ")}\nGitHub: ${p.github || "N/A"}\nLive: ${p.live || "N/A"}`,
              );
            } else {
              addLine(
                `> Project ${projMatch[1]} not found. Run "projects" for the list.`,
                "error",
              );
            }
          } else if (openMatch && OPEN_TARGETS[openMatch[1]]) {
            addLine(`> Opening ${openMatch[1]}...`, "success");
            setTimeout(() => {
              navigate(OPEN_TARGETS[openMatch[1]]);
              setIsOpen(false);
            }, 300);
          } else if (openMatch) {
            addLine(
              `> Unknown page: "${openMatch[1]}". Try: ${Object.keys(OPEN_TARGETS).join(", ")}.`,
              "error",
            );
          } else {
            addLine(
              `> Command not found: "${trimmed}". Type "help" for options.`,
              "error",
            );
          }
        }
      }
    },
    [addLine, navigate],
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (!booted || isBooting) return;
      if (input.trim()) {
        setHistory((h) => [input, ...h]);
        setHistIdx(-1);
      }
      processCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(next);
      setInput(history[next] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? "" : history[next] || "");
    }
  };

  const onPanelKeyDown = (e) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      setIsOpen(false);
      return;
    }
    trapTab(e, panelRef.current);
  };

  return (
    <>
      {/* Window — intentionally dark in both themes */}
      <div
        ref={panelRef}
        id="terminal-window"
        role="dialog"
        aria-modal="true"
        aria-label="Terminal"
        data-chrome
        onKeyDown={onPanelKeyDown}
        style={{ visibility: "hidden", opacity: 0 }}
        className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-3 right-3 z-[150] overflow-hidden rounded-xl border border-white/10 bg-[#0d1117] shadow-2xl shadow-black/40 sm:left-5 sm:right-auto sm:w-[560px]">
        {/* Title bar */}
        <div className="flex items-center gap-3 border-b border-white/10 bg-[#161b22] py-2 pl-4 pr-2">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#ff8052]" />
          <span className="hud flex-1 truncate text-[#8b949e]">
            Terminal — aashiq@portfolio
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close terminal"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#8b949e] transition-colors duration-200 ease-out hover:bg-white/5 hover:text-[#e6edf3]">
            <X aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Output area */}
        <div
          ref={outputRef}
          data-lenis-prevent
          role="log"
          aria-live="polite"
          className="h-64 cursor-text overflow-y-auto p-4 font-mono text-xs leading-relaxed"
          onClick={() => inputRef.current?.focus()}>
          {lines.map((line) => (
            <pre
              key={line.id}
              className={`whitespace-pre-wrap break-words ${LINE_COLOR[line.type] ?? LINE_COLOR.output}`}>
              {line.content}
            </pre>
          ))}
        </div>

        {/* Input row */}
        <div className="flex items-center gap-2 border-t border-white/10 px-4 py-3">
          <span className="shrink-0 font-mono text-xs text-[#ff8052]">
            {PROMPT}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            readOnly={isBooting}
            className="min-w-0 flex-1 bg-transparent font-mono text-xs text-[#e6edf3] caret-[#ff8052] outline-none"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="Terminal input"
          />
          <span
            aria-hidden="true"
            className="h-4 w-2 bg-[#ff8052]/80 motion-safe:animate-pulse"
          />
        </div>
      </div>
    </>
  );
};

export default Terminal;
