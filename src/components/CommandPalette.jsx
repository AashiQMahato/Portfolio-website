import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Home,
  User,
  Code2,
  FolderKanban,
  GraduationCap,
  Mail,
  LayoutDashboard,
  BookOpen,
  Compass,
  ExternalLink,
  Github,
  Download,
  Terminal,
  Moon,
  Sun,
  Monitor,
  Briefcase,
  Sparkles,
  ArrowRight,
  Clock,
  Star,
  Cpu,
  FileText,
  ChevronRight,
  BarChart2,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useRecruiterMode } from "../context/RecruiterModeContext";
import { projects } from "../data/portfolioData";
import { blogPosts } from "../data/blogPosts";

/* ─── Command definitions ─────────────────────────────────── */

const buildCommands = (
  navigate,
  theme,
  setTheme,
  isRecruiterMode,
  toggleRecruiterMode,
) => [
  // Navigation
  {
    group: "Navigation",
    id: "nav-home",
    label: "Home",
    description: "Go to homepage",
    icon: Home,
    keywords: ["home", "start", "main"],
    action: () => navigate("/"),
  },
  {
    group: "Navigation",
    id: "nav-about",
    label: "About",
    description: "About Aashiq",
    icon: User,
    keywords: ["about", "bio", "profile"],
    action: () => navigate("/about"),
  },
  {
    group: "Navigation",
    id: "nav-skills",
    label: "Skills",
    description: "Technical skills & expertise",
    icon: Code2,
    keywords: ["skills", "tech", "expertise", "languages"],
    action: () => navigate("/skills"),
  },
  {
    group: "Navigation",
    id: "nav-projects",
    label: "Projects",
    description: "View all projects",
    icon: FolderKanban,
    keywords: ["projects", "work", "portfolio", "builds"],
    action: () => navigate("/projects"),
  },
  {
    group: "Navigation",
    id: "nav-education",
    label: "Education",
    description: "Academic background",
    icon: GraduationCap,
    keywords: ["education", "degree", "university", "college"],
    action: () => navigate("/education"),
  },
  {
    group: "Navigation",
    id: "nav-blog",
    label: "Blog",
    description: "Technical writing & insights",
    icon: BookOpen,
    keywords: ["blog", "articles", "writing", "posts"],
    action: () => navigate("/blog"),
  },
  {
    group: "Navigation",
    id: "nav-dashboard",
    label: "Developer Dashboard",
    description: "GitHub activity & stats",
    icon: LayoutDashboard,
    keywords: ["dashboard", "github", "activity", "stats", "analytics"],
    action: () => navigate("/developer-dashboard"),
  },
  {
    group: "Navigation",
    id: "nav-now",
    label: "Now",
    description: "What I'm doing now",
    icon: Compass,
    keywords: ["now", "currently", "doing", "learning"],
    action: () => navigate("/now"),
  },
  {
    group: "Navigation",
    id: "nav-timeline",
    label: "Timeline",
    description: "My developer journey",
    icon: Clock,
    keywords: ["timeline", "journey", "history", "milestones"],
    action: () => navigate("/timeline"),
  },
  {
    group: "Navigation",
    id: "nav-resume",
    label: "Resume",
    description: "View & download resume",
    icon: FileText,
    keywords: ["resume", "cv", "download", "pdf"],
    action: () => navigate("/resume"),
  },
  {
    group: "Navigation",
    id: "nav-contact",
    label: "Contact",
    description: "Get in touch",
    icon: Mail,
    keywords: ["contact", "hire", "email", "reach"],
    action: () => navigate("/contactus"),
  },
  // Actions
  {
    group: "Actions",
    id: "action-theme-dark",
    label: "Switch to Dark Mode",
    description: "Enable dark theme",
    icon: Moon,
    keywords: ["dark", "theme", "night", "mode"],
    action: () => setTheme("dark"),
    hidden: theme === "dark",
  },
  {
    group: "Actions",
    id: "action-theme-light",
    label: "Switch to Light Mode",
    description: "Enable light theme",
    icon: Sun,
    keywords: ["light", "theme", "day", "mode"],
    action: () => setTheme("light"),
    hidden: theme === "light",
  },
  {
    group: "Actions",
    id: "action-theme-system",
    label: "Use System Theme",
    description: "Follow system preference",
    icon: Monitor,
    keywords: ["system", "theme", "auto", "mode"],
    action: () => setTheme("system"),
    hidden: theme === "system",
  },
  {
    group: "Actions",
    id: "action-recruiter-mode",
    label: isRecruiterMode ? "Exit Recruiter Mode" : "Enable Recruiter Mode",
    description: isRecruiterMode
      ? "Return to full portfolio"
      : "Simplified view for recruiters",
    icon: Briefcase,
    keywords: ["recruiter", "mode", "hr", "simplified"],
    action: () => toggleRecruiterMode(),
  },
  {
    group: "Actions",
    id: "action-terminal",
    label: "Launch Terminal Mode",
    description: "Open developer terminal",
    icon: Terminal,
    keywords: ["terminal", "cli", "command", "shell"],
    action: () => window.dispatchEvent(new CustomEvent("open-terminal")),
  },
  {
    group: "Actions",
    id: "action-github",
    label: "Open GitHub Profile",
    description: "github.com/AashiQMahato",
    icon: Github,
    keywords: ["github", "profile", "code", "repos"],
    action: () => window.open("https://github.com/AashiQMahato", "_blank"),
  },
  // Projects
  ...projects.map((p) => ({
    group: "Projects",
    id: `project-${p.slug}`,
    label: p.title,
    description: p.shortDesc,
    icon: Star,
    keywords: [
      p.slug,
      ...p.tags.map((t) => t.toLowerCase()),
      p.category?.toLowerCase(),
    ],
    action: () => navigate(`/projects/${p.slug}`),
    tag: p.category,
  })),
  // Blog posts
  ...blogPosts.map((post) => ({
    group: "Blog",
    id: `blog-${post.slug}`,
    label: post.title,
    description: `${post.category} · ${post.readTime}`,
    icon: BookOpen,
    keywords: [post.slug, post.category?.toLowerCase(), "blog", "article"],
    action: () => navigate(`/blog/${post.slug}`),
    tag: post.category,
  })),
];

/* ─── Fuzzy search ────────────────────────────────────────── */
const fuzzyMatch = (query, text) => {
  if (!query) return true;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t.includes(q)) return true;
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
  }
  return qi === q.length;
};

const scoreCommand = (cmd, query) => {
  if (!query) return 1;
  const q = query.toLowerCase();
  const label = cmd.label.toLowerCase();
  const desc = (cmd.description || "").toLowerCase();
  const kw = (cmd.keywords || []).join(" ").toLowerCase();

  if (label === q) return 100;
  if (label.startsWith(q)) return 80;
  if (label.includes(q)) return 60;
  if (desc.includes(q) || kw.includes(q)) return 40;
  if (fuzzyMatch(q, label) || fuzzyMatch(q, kw)) return 20;
  return 0;
};

/* ─── Keyboard shortcut hint ──────────────────────────────── */
const KbdHint = ({ keys }) => (
  <div className="flex items-center gap-1">
    {keys.map((k, i) => (
      <React.Fragment key={i}>
        <kbd className="px-1.5 py-0.5 text-[10px] font-medium rounded border border-border bg-muted/40 text-muted-foreground font-sans leading-none">
          {k}
        </kbd>
        {i < keys.length - 1 && (
          <span className="text-muted-foreground/50 text-[10px]">+</span>
        )}
      </React.Fragment>
    ))}
  </div>
);

/* ─── Main Component ──────────────────────────────────────── */
const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const selectedItemRef = useRef(null);

  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { isRecruiterMode, toggleRecruiterMode } = useRecruiterMode();

  const allCommands = useMemo(
    () =>
      buildCommands(
        navigate,
        theme,
        setTheme,
        isRecruiterMode,
        toggleRecruiterMode,
      ).filter((c) => !c.hidden),
    [navigate, theme, setTheme, isRecruiterMode, toggleRecruiterMode],
  );

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return allCommands;
    return allCommands
      .map((cmd) => ({ ...cmd, score: scoreCommand(cmd, query) }))
      .filter((cmd) => cmd.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [query, allCommands]);

  const grouped = useMemo(() => {
    const groups = {};
    filteredCommands.forEach((cmd) => {
      if (!groups[cmd.group]) groups[cmd.group] = [];
      groups[cmd.group].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  // Flatten for keyboard nav
  const flatList = useMemo(() => filteredCommands, [filteredCommands]);

  const openPalette = useCallback(() => {
    setIsOpen(true);
    setQuery("");
    setSelectedIdx(0);
  }, []);

  const closePalette = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setSelectedIdx(0);
  }, []);

  const runCommand = useCallback(
    (cmd) => {
      closePalette();
      setTimeout(() => cmd.action(), 50);
    },
    [closePalette],
  );

  // Global keyboard shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) closePalette();
        else openPalette();
      }
      if (e.key === "Escape" && isOpen) closePalette();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, openPalette, closePalette]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Arrow key navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((i) => Math.min(i + 1, flatList.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = flatList[selectedIdx];
        if (cmd) runCommand(cmd);
      }
    },
    [flatList, selectedIdx, runCommand],
  );

  // Scroll selected item into view
  useEffect(() => {
    selectedItemRef.current?.scrollIntoView({ block: "nearest" });
  }, [selectedIdx]);

  // Reset selection on query change
  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  // Group icons
  const groupIcon = {
    Navigation: ArrowRight,
    Projects: Star,
    Blog: BookOpen,
    Actions: Sparkles,
  };

  let globalIdx = 0;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="cmd-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[200] bg-background/70 backdrop-blur-sm"
              onClick={closePalette}
            />

            {/* Palette */}
            <motion.div
              key="cmd-palette"
              initial={{ opacity: 0, scale: 0.96, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -12 }}
              transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
              className="fixed top-[12vh] left-1/2 -translate-x-1/2 z-[201] w-full max-w-xl"
              role="dialog"
              aria-label="Command palette"
              aria-modal="true">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl shadow-black/30">
                {/* Top shimmer */}
                <div className="absolute top-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

                {/* Search input */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
                  <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search commands, projects, blog posts..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                    autoComplete="off"
                    spellCheck={false}
                  />
                  <KbdHint keys={["ESC"]} />
                </div>

                {/* Results */}
                <div
                  ref={listRef}
                  data-lenis-prevent
                  className="max-h-[380px] overflow-y-auto py-2 scrollbar-hide">
                  {flatList.length === 0 ? (
                    <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                      No results for &quot;{query}&quot;
                    </div>
                  ) : (
                    Object.entries(grouped).map(([groupName, cmds]) => (
                      <div key={groupName}>
                        <div className="px-4 py-2 flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/60">
                            {groupName}
                          </span>
                        </div>
                        {cmds.map((cmd) => {
                          const idx = globalIdx++;
                          const isSelected = idx === selectedIdx;
                          const Icon = cmd.icon;
                          return (
                            <div
                              key={cmd.id}
                              ref={isSelected ? selectedItemRef : null}
                              onMouseEnter={() => setSelectedIdx(idx)}
                              onClick={() => runCommand(cmd)}
                              className={`mx-2 mb-0.5 flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors duration-100 ${
                                isSelected
                                  ? "bg-primary/10 text-foreground"
                                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                              }`}>
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                  isSelected
                                    ? "bg-primary/15 text-primary"
                                    : "bg-muted/40"
                                }`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">
                                  {cmd.label}
                                </div>
                                {cmd.description && (
                                  <div className="text-[11px] text-muted-foreground/70 truncate mt-0.5">
                                    {cmd.description}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {cmd.tag && (
                                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
                                    {cmd.tag}
                                  </span>
                                )}
                                {isSelected && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}>
                                    <ChevronRight className="w-3.5 h-3.5 text-primary" />
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 border-t border-border bg-muted/10 flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60">
                    <KbdHint keys={["↑", "↓"]} />
                    <span>navigate</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60">
                    <KbdHint keys={["↵"]} />
                    <span>select</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60">
                    <KbdHint keys={["ESC"]} />
                    <span>close</span>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5 text-[11px] text-muted-foreground/50">
                    <KbdHint keys={["⌘", "K"]} />
                    <span>toggle</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CommandPalette;
