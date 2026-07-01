import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Minus, Square, Terminal as TerminalIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { projects } from '../data/portfolioData';

const PROMPT = 'aashiq@portfolio:~$';

const HELP_TEXT = `
Available commands:

  help        Show this help message
  whoami      About Aashiq
  projects    List all projects
  skills      List tech skills
  about       Short bio
  resume      Open resume page
  contact     Contact info
  github      Open GitHub profile
  clear       Clear terminal

Use arrow keys for command history.
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
GitHub   : github.com/Aashik9567
LinkedIn : linkedin.com/in/aashiq-mahato-9a343b2b4/
Location : Shantinagar, Kathmandu
`;

const BOOT_SEQUENCE = [
  '> Initializing Aashiq OS v2026...',
  '> Loading modules: [react] [node] [arduino] [python] ✓',
  '> Establishing secure connection...',
  '> Portfolio loaded successfully.',
  '> Type "help" for available commands.',
  '',
];

const Terminal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [booted, setBooted] = useState(false);
  const [isBooting, setIsBooting] = useState(false);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  const addLine = useCallback((content, type = 'output') => {
    setLines(prev => [...prev, { content, type, id: Date.now() + Math.random() }]);
  }, []);

  const boot = useCallback(async () => {
    if (booted) return;
    setIsBooting(true);
    for (const line of BOOT_SEQUENCE) {
      await new Promise(r => setTimeout(r, 120));
      addLine(line, 'boot');
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
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  // Listen for custom event from command palette
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener('open-terminal', handler);
    return () => window.removeEventListener('open-terminal', handler);
  }, []);

  const processCommand = useCallback((cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    addLine(`${PROMPT} ${cmd}`, 'prompt');

    switch (trimmed) {
      case 'help':
        addLine(HELP_TEXT);
        break;
      case 'whoami':
        addLine(WHOAMI_TEXT);
        break;
      case 'skills':
        addLine(SKILLS_TEXT);
        break;
      case 'about':
        addLine(ABOUT_TEXT);
        break;
      case 'contact':
        addLine(CONTACT_TEXT);
        break;
      case 'resume':
        addLine('> Opening resume...', 'success');
        setTimeout(() => { navigate('/resume'); setIsOpen(false); }, 500);
        break;
      case 'github':
        addLine('> Opening GitHub profile...', 'success');
        setTimeout(() => window.open('https://github.com/Aashik9567', '_blank'), 300);
        break;
      case 'projects': {
        const list = projects.map((p, i) => `  ${i + 1}. ${p.title} [${p.category}]`).join('\n');
        addLine(`\nProjects (${projects.length}):\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${list}\n\nRun "projects <number>" to view details.`);
        break;
      }
      case 'clear':
        setLines([]);
        return;
      case '':
        break;
      default: {
        // Handle "projects <n>"
        const projMatch = trimmed.match(/^projects\s+(\d+)$/);
        if (projMatch) {
          const idx = parseInt(projMatch[1]) - 1;
          if (projects[idx]) {
            const p = projects[idx];
            addLine(`\n${p.title}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${p.shortDesc}\nTech: ${p.tags.join(', ')}\nGitHub: ${p.github || 'N/A'}\nLive: ${p.live || 'N/A'}`);
          } else {
            addLine(`> Project ${projMatch[1]} not found. Run "projects" for the list.`, 'error');
          }
        } else {
          addLine(`> Command not found: "${trimmed}". Type "help" for options.`, 'error');
        }
      }
    }
  }, [addLine, navigate]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (!booted || isBooting) return;
      if (input.trim()) {
        setHistory(h => [input, ...h]);
        setHistIdx(-1);
      }
      processCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(next);
      setInput(history[next] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? '' : history[next] || '');
    }
  };

  const lineColor = (type) => {
    switch (type) {
      case 'prompt': return 'text-primary';
      case 'error': return 'text-red-400';
      case 'success': return 'text-green-400';
      case 'boot': return 'text-cyan-400/80';
      default: return 'text-foreground/80';
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        title="Open Terminal (developer mode)"
        className="fixed bottom-28 left-4 sm:left-6 z-[90] w-10 h-10 rounded-xl border border-border bg-card/80 backdrop-blur text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-card transition-all flex items-center justify-center shadow-sm"
      >
        <TerminalIcon className="w-4 h-4" />
      </button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        key="terminal"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
        className="fixed bottom-4 left-4 sm:left-6 z-[150] w-[92vw] sm:w-[560px] rounded-2xl overflow-hidden border border-border bg-[#0d1117]/95 backdrop-blur-xl shadow-2xl shadow-black/50"
        style={{ maxHeight: '420px' }}
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-white/5">
          <div className="flex gap-1.5">
            <button
              onClick={() => setIsOpen(false)}
              className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"
            />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex-1 text-center text-[11px] text-white/30 font-mono">
            aashiq@portfolio — terminal
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/20 hover:text-white/60 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Output area */}
        <div
          className="h-64 overflow-y-auto p-4 font-mono text-xs leading-relaxed cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map(line => (
            <pre
              key={line.id}
              className={`whitespace-pre-wrap break-words ${lineColor(line.type)}`}
            >
              {line.content}
            </pre>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input row */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-white/5 bg-[#0d1117]">
          <span className="font-mono text-xs text-primary shrink-0">{PROMPT}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isBooting}
            className="flex-1 bg-transparent font-mono text-xs text-foreground/90 outline-none caret-primary"
            autoComplete="off"
            spellCheck={false}
            aria-label="Terminal input"
          />
          <span className="w-2 h-4 bg-primary/80 animate-pulse" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Terminal;
