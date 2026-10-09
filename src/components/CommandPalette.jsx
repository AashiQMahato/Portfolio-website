import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import {
  Search,
  Home,
  User,
  Code2,
  FolderKanban,
  Layers,
  Briefcase,
  PenLine,
  Mail,
  LayoutDashboard,
  BookOpen,
  Compass,
  Github,
  Terminal,
  Moon,
  Sun,
  Monitor,
  Clock,
  Star,
  FileText,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { projects } from "../data/portfolioData";
import { blogPosts } from "../data/blogPosts";
import { gsap, EASE, DUR, usePrefersReducedMotion } from "../motion";

/* ─── Command definitions ─────────────────────────────────── */

const NAV_TARGETS = [
  { id: "home", label: "Home", description: "Go to homepage", icon: Home, to: "/", keywords: ["home", "start", "main"] },
  { id: "work", label: "Work", description: "Selected work", icon: Layers, to: "/#work", keywords: ["work", "featured", "case", "studies"] },
  { id: "about", label: "About", description: "About Aashiq", icon: User, to: "/#about", keywords: ["about", "bio", "profile"] },
  { id: "experience", label: "Experience", description: "Roles & education", icon: Briefcase, to: "/#experience", keywords: ["experience", "jobs", "education", "degree", "university"] },
  { id: "skills", label: "Skills", description: "Technical skills & expertise", icon: Code2, to: "/#skills", keywords: ["skills", "tech", "expertise", "languages"] },
  { id: "writing", label: "Writing", description: "Latest articles", icon: PenLine, to: "/#writing", keywords: ["writing", "articles", "posts"] },
  { id: "contact", label: "Contact", description: "Get in touch", icon: Mail, to: "/#contact", keywords: ["contact", "hire", "email", "reach"] },
  { id: "projects", label: "Projects", description: "View all projects", icon: FolderKanban, to: "/projects", keywords: ["projects", "portfolio", "builds"] },
  { id: "blog", label: "Blog", description: "Technical writing & insights", icon: BookOpen, to: "/blog", keywords: ["blog", "articles", "writing", "posts"] },
  { id: "resume", label: "Resume", description: "View & download resume", icon: FileText, to: "/resume", keywords: ["resume", "cv", "download", "pdf"] },
  { id: "now", label: "Now", description: "What I'm doing now", icon: Compass, to: "/now", keywords: ["now", "currently", "doing", "learning"] },
  { id: "timeline", label: "Timeline", description: "My developer journey", icon: Clock, to: "/timeline", keywords: ["timeline", "journey", "history", "milestones"] },
  { id: "dashboard", label: "Developer Dashboard", description: "GitHub activity & stats", icon: LayoutDashboard, to: "/developer-dashboard", keywords: ["dashboard", "github", "activity", "stats", "analytics"] },
];

const buildCommands = (navigate, theme, setTheme) => [
  // Navigation
  ...NAV_TARGETS.map(({ id, to, ...rest }) => ({
    ...rest,
    group: "Navigation",
    id: `nav-${id}`,
    action: () => navigate(to),
  })),
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
    label: "Match System Theme",
    description: "Use your device's current setting",
    icon: Monitor,
    keywords: ["system", "theme", "auto", "mode"],
    action: () => setTheme("system"),
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
  <span className="flex items-center gap-1">
    {keys.map((k, i) => (
      <React.Fragment key={i}>
        <kbd className="rounded border border-line bg-background px-1.5 py-0.5 font-mono text-[10px] leading-none text-ink-dim">
          {k}
        </kbd>
        {i < keys.length - 1 && (
          <span aria-hidden="true" className="text-[10px] text-ink-dim">
            +
          </span>
        )}
      </React.Fragment>
    ))}
  </span>
);

KbdHint.propTypes = {
  keys: PropTypes.arrayOf(PropTypes.string).isRequired,
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

/* ─── Main Component ──────────────────────────────────────── */
const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const selectedItemRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const allCommands = useMemo(
    () => buildCommands(navigate, theme, setTheme).filter((c) => !c.hidden),
    [navigate, theme, setTheme],
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

  const openPalette = useCallback(() => {
    setIsOpen(true);
    setQuery("");
    setSelectedIdx(0);
  }, []);

  // The query is kept while the panel fades out and reset on the next open.
  const closePalette = useCallback(() => setIsOpen(false), []);

  const runCommand = useCallback(
    (cmd) => {
      closePalette();
      setTimeout(() => cmd.action(), 50);
    },
    [closePalette],
  );

  // Global keyboard shortcut (the nav button dispatches a synthetic ⌘K too)
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
          { y: reduced ? 0 : -8 },
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

  // Move focus in on open, hand it back on close.
  useEffect(() => {
    if (!isOpen) return undefined;
    const previous = document.activeElement;
    inputRef.current?.focus({ preventScroll: true });
    return () => previous?.focus?.({ preventScroll: true });
  }, [isOpen]);

  // Arrow key navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((i) => Math.min(i + 1, filteredCommands.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filteredCommands[selectedIdx];
        if (cmd) runCommand(cmd);
      }
    },
    [filteredCommands, selectedIdx, runCommand],
  );

  // Scroll selected item into view — only while open: on a closed palette this
  // ran at mount and could scroll the page itself.
  useEffect(() => {
    if (isOpen) selectedItemRef.current?.scrollIntoView({ block: "nearest" });
  }, [selectedIdx, isOpen]);

  // Reset selection on query change
  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  const activeId = filteredCommands[selectedIdx]
    ? `cmd-opt-${filteredCommands[selectedIdx].id}`
    : undefined;

  let globalIdx = 0;

  return (
    <div
      ref={rootRef}
      data-chrome
      style={{ visibility: "hidden", opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-start justify-center px-4 pt-[12vh]">
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-background/80"
        onClick={closePalette}
      />

      {/* Palette */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={(e) => trapTab(e, panelRef.current)}
        className="relative w-full max-w-xl overflow-hidden rounded-xl border border-line bg-panel shadow-2xl shadow-black/40">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-line px-4 py-4">
          <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-ink-dim" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-label="Search commands"
            aria-expanded={isOpen}
            aria-controls="cmd-listbox"
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            placeholder="Search commands, projects, blog posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-dim"
            autoComplete="off"
            spellCheck={false}
          />
          <KbdHint keys={["ESC"]} />
        </div>

        {/* Results */}
        <div
          id="cmd-listbox"
          role="listbox"
          aria-label="Results"
          data-lenis-prevent
          className="max-h-[380px] overflow-y-auto py-2 scrollbar-hide">
          {filteredCommands.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-ink-dim">
              No results for &quot;{query}&quot;
            </div>
          ) : (
            Object.entries(grouped).map(([groupName, cmds]) => (
              <div
                key={groupName}
                role="group"
                aria-labelledby={`cmd-group-${groupName}`}>
                <div id={`cmd-group-${groupName}`} className="hud px-4 pb-1.5 pt-3">
                  {groupName}
                </div>
                {cmds.map((cmd) => {
                  const idx = globalIdx++;
                  const isSelected = idx === selectedIdx;
                  const Icon = cmd.icon;
                  return (
                    <div
                      key={cmd.id}
                      id={`cmd-opt-${cmd.id}`}
                      role="option"
                      aria-selected={isSelected}
                      ref={isSelected ? selectedItemRef : null}
                      onMouseEnter={() => setSelectedIdx(idx)}
                      onClick={() => runCommand(cmd)}
                      className={`mx-2 mb-0.5 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-200 ease-out ${
                        isSelected ? "bg-ink/[0.06] text-ink" : "text-ink-dim"
                      }`}>
                      <span
                        aria-hidden="true"
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line transition-colors duration-200 ease-out ${
                          isSelected ? "text-accent-ink" : ""
                        }`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-ink">
                          {cmd.label}
                        </div>
                        {cmd.description && (
                          <div className="mt-0.5 truncate text-xs text-ink-dim">
                            {cmd.description}
                          </div>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {cmd.tag && (
                          <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-dim">
                            {cmd.tag}
                          </span>
                        )}
                        <ChevronRight
                          aria-hidden="true"
                          className={`h-3.5 w-3.5 text-accent-ink transition-opacity duration-200 ease-out ${
                            isSelected ? "opacity-100" : "opacity-0"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 text-[11px] text-ink-dim">
          <span className="flex items-center gap-1.5">
            <KbdHint keys={["↑", "↓"]} />
            navigate
          </span>
          <span className="flex items-center gap-1.5">
            <KbdHint keys={["↵"]} />
            select
          </span>
          <span className="flex items-center gap-1.5">
            <KbdHint keys={["ESC"]} />
            close
          </span>
          <span className="ml-auto hidden items-center gap-1.5 sm:flex">
            <KbdHint keys={["⌘", "K"]} />
            toggle
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
