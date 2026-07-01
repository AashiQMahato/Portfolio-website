import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  User,
  Code2,
  GraduationCap,
  FolderKanban,
  Mail,
  Menu,
  X,
  Sparkles,
  Moon,
  Monitor,
  Sun,
  LayoutDashboard,
  BookOpen,
  Compass,
  Search,
  Briefcase,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Magnet } from "./ui";
import { useTheme } from "../context/ThemeContext";
import { useRecruiterMode } from "../context/RecruiterModeContext";
import { siteConfig, CV } from "../data/portfolioData";
import logo from "../assets/logo.jpeg";

/* ── Theme Toggle ── */
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const themes = ["dark", "light", "system"];
  const idx = Math.max(0, themes.indexOf(theme));

  const cycleTheme = () => setTheme(themes[(idx + 1) % themes.length]);

  const iconMap = {
    dark: { Icon: Moon, label: "Dark" },
    light: { Icon: Sun, label: "Light" },
    system: { Icon: Monitor, label: "System" },
  };

  const { Icon, label } = iconMap[theme] || iconMap.dark;

  return (
    <motion.button
      onClick={cycleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="p-2.5 rounded-xl border border-border bg-card/60 backdrop-blur text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      title={`Theme: ${label} (click to cycle)`}
      aria-label={`Theme toggle. Current: ${label}`}>
      <Icon className="w-4 h-4" />
    </motion.button>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const location = useLocation();
  const { isRecruiterMode, toggleRecruiterMode } = useRecruiterMode();

  const navItems = useMemo(
    () => [
      { path: "/", label: "Home", icon: Home },
      { path: "/about", label: "About", icon: User },
      { path: "/skills", label: "Skills", icon: Code2 },
      { path: "/projects", label: "Projects", icon: FolderKanban },
      { path: "/education", label: "Education", icon: GraduationCap },
      {
        path: "/developer-dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
      { path: "/blog", label: "Blog", icon: BookOpen },
      { path: "/now", label: "Now", icon: Compass },
      { path: "/contactus", label: "Contact", icon: Mail },
    ],
    [],
  );

  useEffect(() => {
    const idx = navItems.findIndex((item) => item.path === location.pathname);
    setActiveIndex(idx >= 0 ? idx : 0);
  }, [location, navItems]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMenuOpen) setIsMenuOpen(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${
          isScrolled
            ? "py-2 bg-background/80 backdrop-blur border-b border-border"
            : "py-4 bg-transparent"
        }`}
        style={{
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}>
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between min-w-0">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 gap-4">
              <Link to="/" className="relative group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex items-center justify-center w-10 h-10 overflow-hidden shadow-lg rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-primary-500/30">
                      <img
                        src={logo}
                        alt="Logo"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  <span className="hidden text-xl font-bold md:block font-display">
                    <span className="gradient-text">Aashiq</span>
                    <span className="text-muted-foreground">.dev</span>
                  </span>
                </motion.div>
              </Link>

              {/* Status Badge */}
            </div>

            {/* Desktop Navigation */}
            <nav className="items-center justify-center flex-1 hidden min-w-0 px-4 lg:flex">
              <div className="p-1.5 rounded-2xl border border-border bg-card/60 backdrop-blur max-w-full overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex items-center gap-1 min-w-max">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = index === activeIndex;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                        aria-current={isActive ? "page" : undefined}>
                        <motion.div
                          className={`relative px-3 xl:px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-300 ${
                            isActive
                              ? "text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}>
                          {isActive && (
                            <motion.div
                              layoutId="activeNavBg"
                              className="absolute inset-0 border rounded-xl border-primary/25 bg-primary/10"
                              transition={{
                                type: "spring",
                                stiffness: 380,
                                damping: 30,
                              }}
                            />
                          )}
                          <span className="relative z-10 flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {item.label}
                          </span>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </nav>

            {/* Right Section */}
            <div className="flex items-center flex-shrink-0 gap-2 sm:gap-3">
              {/* Cmd+K Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  window.dispatchEvent(
                    new KeyboardEvent("keydown", { key: "k", metaKey: true }),
                  )
                }
                className="items-center hidden gap-2 px-3 py-2 text-xs font-medium transition-colors border md:flex rounded-xl border-border bg-card/60 text-muted-foreground hover:text-foreground hover:bg-card/80"
                title="Search (Cmd+K)">
                <Search className="w-3.5 h-3.5" />
                <span className="flex items-center gap-1 opacity-70">
                  <kbd className="font-sans">⌘</kbd>
                  <kbd className="font-sans">K</kbd>
                </span>
              </motion.button>

              <ThemeToggle />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleRecruiterMode}
                className={`hidden md:flex p-2.5 rounded-xl border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${
                  isRecruiterMode
                    ? "bg-primary/20 border-primary/50 text-primary"
                    : "border-border bg-card/60 backdrop-blur text-muted-foreground hover:text-foreground"
                }`}
                title="Toggle Recruiter Mode"
                aria-label="Toggle Recruiter Mode">
                <Briefcase className="w-4 h-4" />
              </motion.button>

              <div className="hidden md:block">
                <Magnet strength={0.2}>
                  <Link
                    to="/contactus"
                    className="flex items-center h-11 gap-2 px-6 rounded-xl text-sm font-semibold text-primary-foreground bg-primary shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60">
                    <Sparkles className="w-4 h-4" />
                    Hire Me
                  </Link>
                </Magnet>
              </div>

              <motion.button
                onClick={toggleMenu}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="lg:hidden p-2.5 rounded-xl border border-border bg-card/60 backdrop-blur text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                aria-label="Toggle menu">
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}>
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}>
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Recruiter Banner */}
      <AnimatePresence>
        {isRecruiterMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed left-0 right-0 z-40 px-4 py-3 text-sm font-medium shadow-md top-20 bg-primary text-primary-foreground border-y border-primary/30 backdrop-blur-md"
            style={{
              paddingLeft: "env(safe-area-inset-left)",
              paddingRight: "env(safe-area-inset-right)",
            }}>
            <div className="flex flex-wrap items-center justify-center gap-4 mx-auto max-w-7xl sm:justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>
                  <strong>Recruiter Mode Active:</strong> Simplified layout
                  optimized for quick scanning.
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span>{CV.experience.length}+ YOE</span>
                <span>Top Skills: React, Node.js, Arduino</span>
                <Link
                  to="/resume"
                  className="px-3 py-1.5 bg-primary-foreground text-primary rounded-md hover:opacity-90 transition-opacity">
                  View Resume
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 z-50 h-full w-80 glass-strong lg:hidden">
              <div className="flex flex-col h-full p-6">
                <div className="flex justify-end mb-8">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 border rounded-xl border-border bg-card/60 backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
                    <X className="w-5 h-5 text-muted-foreground" />
                  </motion.button>
                </div>
                <nav className="flex flex-col gap-2">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = index === activeIndex;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}>
                        <motion.div
                          whileHover={{ x: 4 }}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                            isActive
                              ? "bg-primary/10 text-primary border border-primary/25"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                          }`}>
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </motion.div>
                      </Link>
                    );
                  })}
                </nav>
                <div className="pt-6 mt-auto">
                  <Link
                    to="/contactus"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center w-full gap-2 px-6 text-sm font-semibold transition-shadow shadow-sm h-11 rounded-xl bg-primary text-primary-foreground hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60">
                    <Sparkles className="w-4 h-4" />
                    Hire Me
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
