import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";
import logo from "../assets/logo.jpeg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Skills", path: "/skills" },
    { label: "Projects", path: "/projects" },
    { label: "Education", path: "/education" },
    { label: "Contact", path: "/contactus" },
  ];

  const socialLinks = [
    { icon: Github, href: "https://github.com/aashik9567", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/aashiq-mahato-9a343b2b4/", label: "LinkedIn" },
    { icon: Mail, href: "mailto:aashikmahato9567@gmail.com", label: "Email" },
  ];

  return (
    <footer className="relative mt-20 glass">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

      <div className="px-6 py-12 mx-auto max-w-7xl lg:px-16 lg:py-16">
        <div className="grid items-start gap-8 md:grid-cols-3 lg:gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center rounded-lg w-9 h-9 bg-gradient-to-br from-primary-500 to-secondary-500">
                <img src={logo} alt="Logo" className="object-cover w-full h-full" />
              </div>
              <span className="text-lg font-bold font-display">
                <span className="gradient-text">Aashiq</span>
                <span className="text-dark-400">.dev</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-dark-500">
              Electronics Engineer & Full Stack Developer building innovative solutions.
            </p>
          </div>

          {/* Nav Links */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 md:justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm transition-colors text-dark-500 hover:text-primary-400"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social & Back to Top */}
          <div className="flex items-center gap-4 md:justify-end">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center transition-all rounded-lg w-9 h-9 glass glass-hover text-dark-500 hover:text-primary-400"
                  aria-label={social.label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center ml-2 transition-all rounded-lg w-9 h-9 bg-primary-500/10 hover:bg-primary-500/20 text-primary-400"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-white/[0.06] text-center">
          <p className="text-xs text-dark-600">
            &copy; {currentYear} Aashiq Mahato. Built with React & Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
