import React from "react";
import { Link } from "react-router-dom";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  ChevronUp,
} from "lucide-react";
import { useReducedMotion } from "framer-motion";
import logo from "../assets/logo.jpeg";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Skills", path: "/skills" },
  { label: "Projects", path: "/projects" },
  { label: "Education", path: "/education" },
  { label: "Contact", path: "/contactus" },
];

const SOCIAL = [
  { Icon: Github, href: "https://github.com/aashik9567", label: "GitHub" },
  {
    Icon: Linkedin,
    href: "https://www.linkedin.com/in/aashiq-mahato-9a343b2b4/",
    label: "LinkedIn",
  },
  { Icon: Twitter, href: "https://twitter.com/", label: "Twitter" },
  { Icon: Mail, href: "mailto:aashikmahato9567@gmail.com", label: "Email" },
];

const Footer = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <footer className="mt-20 border-t border-border bg-background">
      <div className="px-4 pt-16 mx-auto max-w-7xl md:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-3 no-underline">
              <div className="overflow-hidden border rounded-lg shadow-sm w-9 h-9 border-border bg-card shrink-0">
                <img
                  src={logo}
                  alt="Logo"
                  className="object-cover w-full h-full"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <span className="text-lg font-semibold">
                <span className="gradient-text">Aashiq</span>
                <span className="text-muted-foreground">.dev</span>
              </span>
            </Link>

            <p className="mt-4 text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              Electronics Engineer &amp; Full-Stack Developer
            </p>
            <p className="max-w-xs mt-3 text-sm leading-relaxed text-muted-foreground">
              Building innovative solutions at the intersection of hardware and
              software.
            </p>

            <div className="flex gap-2 mt-5">
              {SOCIAL.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex items-center justify-center transition-colors border w-9 h-9 rounded-xl border-border bg-card/60 backdrop-blur text-muted-foreground hover:text-foreground hover:bg-card/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="mb-4 text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              Explore
            </p>
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map(({ label, path }) => (
                <Link
                  key={path}
                  to={path}
                  className="text-sm transition-colors rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 w-fit">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-4 text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              Contact
            </p>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              Open to freelance, collaborations, and full-time opportunities.
            </p>

            <a
              href="mailto:aashikmahato9567@gmail.com"
              className="inline-flex items-center gap-2 text-sm transition-colors rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
              <Mail size={16} />
              aashikmahato9567@gmail.com
            </a>

            <p className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
              <MapPin size={16} />
              Kathmandu, Nepal
            </p>

            <div className="inline-flex items-center gap-2 mt-5 px-3 py-1.5 rounded-full border border-border bg-card/60 backdrop-blur text-xs font-medium text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Available for Hire
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 py-8 mt-10 border-t border-border">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 Aashiq Mahato. All rights reserved.
          </p>
          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: shouldReduceMotion ? "auto" : "smooth",
              })
            }
            className="inline-flex items-center justify-center w-10 h-10 transition-colors border rounded-xl border-border bg-card/60 backdrop-blur text-muted-foreground hover:text-foreground hover:bg-card/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            aria-label="Back to top">
            <ChevronUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
