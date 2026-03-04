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
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Magnet } from "./ui";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/logo.jpeg";

/* ── Theme Toggle ── */
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const themes = ["dark", "system", "light"];
  const idx = themes.indexOf(theme);

  const cycleTheme = () => setTheme(themes[(idx + 1) % 3]);

  const icons = [
    { key: "dark", Icon: Moon, label: "Dark" },
    { key: "system", Icon: Monitor, label: "System" },
    { key: "light", Icon: Sun, label: "Light" },
  ];

  return (
    <>
      {/* Desktop: pill with 3 segments */}
      <div className="hidden sm:flex items-center gap-0 p-1 rounded-full glass relative">
        {/* Sliding highlight */}
        <motion.div
          className="absolute top-1 bottom-1 rounded-full"
          style={{
            width: "28px",
            background: "rgba(0, 245, 255, 0.15)",
            border: "1px solid rgba(0, 245, 255, 0.2)",
          }}
          animate={{ left: `${idx * 28 + 4}px` }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
        {icons.map((t) => (
          <button
            key={t.key}
            onClick={() => setTheme(t.key)}
            className={`relative z-10 w-7 h-7 flex items-center justify-center rounded-full transition-colors duration-300 cursor-pointer ${
              theme === t.key
                ? "text-cyan-300"
                : "text-slate-500 hover:text-slate-300"
            }`}
            title={t.label}>
            <t.Icon className="w-3.5 h-3.5" />
          </button>
        ))}
      </div>

      {/* Mobile: single cycling button */}
      <button
        onClick={cycleTheme}
        className="sm:hidden p-2 rounded-xl glass text-slate-400 hover:text-white transition-colors cursor-pointer"
        title={`Theme: ${theme}`}>
        {theme === "dark" ? (
          <Moon className="w-4 h-4" />
        ) : theme === "light" ? (
          <Sun className="w-4 h-4" />
        ) : (
          <Monitor className="w-4 h-4" />
        )}
      </button>
    </>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const location = useLocation();

  const navItems = useMemo(
    () => [
      { path: "/", label: "Home", icon: Home },
      { path: "/about", label: "About", icon: User },
      { path: "/skills", label: "Skills", icon: Code2 },
      { path: "/projects", label: "Projects", icon: FolderKanban },
      { path: "/education", label: "Education", icon: GraduationCap },
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

  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "py-2 glass shadow-lg shadow-primary-500/5"
            : "py-4 bg-transparent"
        }`}>
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
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
                <span className="hidden text-xl font-bold sm:block font-display">
                  <span className="gradient-text">Aashiq</span>
                  <span className="text-dark-400">.dev</span>
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="items-center hidden lg:flex">
              <div className="flex items-center gap-1 p-1.5 rounded-2xl glass">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = index === activeIndex;
                  return (
                    <Link key={item.path} to={item.path}>
                      <motion.div
                        className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-300 ${
                          isActive
                            ? "text-white"
                            : "text-dark-400 hover:text-dark-200"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}>
                        {isActive && (
                          <motion.div
                            layoutId="activeNavBg"
                            className="absolute inset-0 shadow-lg bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-primary-500/30"
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
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              <ThemeToggle />

              <Magnet strength={0.2}>
                <Link
                  to="/contactus"
                  className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-secondary-500 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300 hover:-translate-y-0.5">
                  <Sparkles className="w-4 h-4" />
                  Hire Me
                </Link>
              </Magnet>

              <motion.button
                onClick={toggleMenu}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="lg:hidden p-2.5 rounded-xl glass text-dark-300"
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-40 bg-dark-950/80 backdrop-blur-sm lg:hidden"
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
                    className="p-2 rounded-xl glass">
                    <X className="w-5 h-5 text-dark-300" />
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
                              ? "bg-primary-500/20 text-primary-300 border border-primary-500/30"
                              : "text-dark-400 hover:text-dark-200 hover:bg-white/5"
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
                    className="flex items-center justify-center w-full gap-2 px-5 py-3 text-sm font-semibold text-white shadow-lg rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 shadow-primary-500/25">
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
