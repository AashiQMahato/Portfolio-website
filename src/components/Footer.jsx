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
import logo from "../assets/logo.jpeg";

/* ─── Static data ─────────────────────────────────────────────────────────── */
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

const TECH = [
  { name: "React", icon: "⚛️" },
  { name: "Tailwind", icon: "🎨" },
  { name: "Node.js", icon: "🟢" },
  { name: "JavaScript", icon: "🟨" },
  { name: "Vite", icon: "⚡" },
  { name: "Framer", icon: "🎞️" },
];

/* ─── Component ───────────────────────────────────────────────────────────── */
const Footer = () => (
  <footer className="f-footer">
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 32px 0" }}>
      {/* ── ROW 1 — 4‑Column Grid ─────────────────────────────────────────── */}
      <div className="f-grid">
        {/* Col 1 — Brand */}
        <div>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
              textDecoration: "none",
            }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid rgba(0,245,255,0.3)",
                flexShrink: 0,
              }}>
              <img
                src={logo}
                alt="Logo"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <span className="f-brand-name">
              Aashiq<span className="f-brand-dot">.dev</span>
            </span>
          </Link>

          <p
            className="f-grad-text"
            style={{
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 12,
              letterSpacing: 1,
            }}>
            Electronics Engineer &amp; Full-Stack Developer
          </p>
          <p
            className="f-body-text"
            style={{ lineHeight: 1.75, maxWidth: 240, marginBottom: 20 }}>
            Building innovative solutions at the intersection of hardware and
            software.
          </p>

          <div style={{ display: "flex", gap: 8 }}>
            {SOCIAL.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="f-social-btn">
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Col 2 — Navigation */}
        <div>
          <p className="f-section-heading">Explore</p>
          <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {NAV_LINKS.map(({ label, path }) => (
              <Link key={path} to={path} className="f-nav-link">
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Col 3 — Tech Stack */}
        <div>
          <p className="f-section-heading">Built With</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
            }}>
            {TECH.map(({ name, icon }) => (
              <div key={name} className="f-chip">
                <span style={{ fontSize: 14, lineHeight: 1 }}>{icon}</span>
                <span className="f-chip-label">{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Col 4 — Contact Teaser */}
        <div>
          <p className="f-section-heading">Get In Touch</p>
          <p
            className="f-body-text"
            style={{ lineHeight: 1.75, marginBottom: 16 }}>
            Open to freelance, collaborations, and full-time opportunities.
          </p>
          <a href="mailto:aashikmahato9567@gmail.com" className="f-email-link">
            <Mail size={13} style={{ flexShrink: 0 }} />
            aashikmahato9567@gmail.com
          </a>
          <p
            className="f-location"
            style={{
              margin: "10px 0 18px",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}>
            <MapPin
              size={13}
              style={{ color: "rgba(0,245,255,0.6)", flexShrink: 0 }}
            />
            Kathmandu, Nepal
          </p>
          <div className="f-avail-badge">
            <span
              className="f-grad-text"
              style={{ fontSize: 12, fontWeight: 600 }}>
              ✦ Available for Hire
            </span>
          </div>
        </div>
      </div>

      {/* ── ROW 2 — Gradient Divider ──────────────────────────────────────── */}
      <div
        style={{
          height: 1,
          margin: "48px 0 0",
          background:
            "linear-gradient(90deg, transparent, #00f5ff, #8b5cf6, #f0abfc, transparent)",
        }}
      />

      {/* ── ROW 3 — Bottom Bar ────────────────────────────────────────────── */}
      <div className="f-bottom-bar">
        <p className="f-small-text">
          &copy; 2026 Aashiq Muhsin. All rights reserved.
        </p>
        <p className="f-small-text">
          Designed &amp; Built with <span style={{ color: "#f0abfc" }}>❤️</span>{" "}
          using React &amp; Tailwind
        </p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="f-backtop"
          aria-label="Back to top">
          <ChevronUp size={15} />
        </button>
      </div>
    </div>

    {/* ── Scoped Styles ─────────────────────────────────────────────────────── */}
    <style>{`
      /* ── Layout ── */
      .f-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 48px;
        align-items: start;
      }
      .f-bottom-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 12px;
        padding: 24px 0 32px;
      }

      /* ── Gradient text (shared) ── */
      .f-grad-text {
        background: linear-gradient(90deg, #00f5ff, #8b5cf6, #f0abfc);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .f-section-heading {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 2px;
        margin: 0 0 16px;
        padding-bottom: 8px;
        background: linear-gradient(90deg, #00f5ff, #8b5cf6, #f0abfc);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        border-bottom: 1px solid;
        border-image: linear-gradient(90deg, #00f5ff, #8b5cf6, #f0abfc) 1;
      }

      /* ── DARK MODE ──────────────────────────────────────────────────────── */
      html.dark .f-footer, html:not(.light) .f-footer {
        background: #030712;
        border-top: 1px solid rgba(255,255,255,0.07);
        margin-top: 5rem;
      }
      html.dark .f-brand-name, html:not(.light) .f-brand-name {
        font-size: 18px; font-weight: 700; color: #fff;
        font-family: Space Grotesk, Inter, sans-serif;
      }
      html.dark .f-brand-dot, html:not(.light) .f-brand-dot {
        color: rgba(255,255,255,0.32);
      }
      html.dark .f-body-text, html:not(.light) .f-body-text {
        font-size: 13px; color: rgba(255,255,255,0.52);
      }
      html.dark .f-nav-link, html:not(.light) .f-nav-link {
        font-size: 14px; color: rgba(255,255,255,0.52);
        text-decoration: none; padding-left: 0;
        border-left: 2px solid transparent; line-height: 1;
        transition: color 150ms, border-color 150ms, padding-left 150ms;
      }
      html.dark .f-nav-link:hover, html:not(.light) .f-nav-link:hover {
        color: #00f5ff; border-left-color: #00f5ff; padding-left: 8px;
      }
      html.dark .f-social-btn, html:not(.light) .f-social-btn {
        width: 32px; height: 32px; display: flex; align-items: center;
        justify-content: center; border-radius: 8px;
        border: 1px solid rgba(0,245,255,0.35);
        color: rgba(255,255,255,0.85); text-decoration: none;
        background: rgba(0,245,255,0.05);
        backdrop-filter: blur(10px);
        transition: border-color 150ms, color 150ms, background 150ms;
      }
      html.dark .f-social-btn:hover, html:not(.light) .f-social-btn:hover {
        border-color: #f0abfc; color: #00f5ff; background: rgba(240,171,252,0.08);
      }
      /* Glassmorphism chips — visibly distinct in dark mode */
      html.dark .f-chip, html:not(.light) .f-chip {
        display: flex; align-items: center; gap: 6px;
        padding: 7px 10px; border-radius: 8px;
        background: rgba(255,255,255,0.09);
        border: 1px solid rgba(255,255,255,0.2);
        box-shadow: 0 2px 8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06);
        backdrop-filter: blur(12px);
      }
      html.dark .f-chip-label, html:not(.light) .f-chip-label {
        font-size: 12px; color: rgba(255,255,255,0.75);
      }
      html.dark .f-email-link, html:not(.light) .f-email-link {
        display: inline-flex; align-items: center; gap: 6px;
        font-size: 13px; color: rgba(255,255,255,0.55);
        text-decoration: none; transition: color 150ms;
      }
      html.dark .f-email-link:hover, html:not(.light) .f-email-link:hover {
        color: #00f5ff;
      }
      html.dark .f-location, html:not(.light) .f-location {
        font-size: 13px; color: rgba(255,255,255,0.42);
      }
      html.dark .f-avail-badge, html:not(.light) .f-avail-badge {
        display: inline-block; padding: 5px 14px; border-radius: 999px;
        background: rgba(0,245,255,0.05);
        border: 1px solid rgba(0,245,255,0.3);
      }
      html.dark .f-small-text, html:not(.light) .f-small-text {
        font-size: 12px; color: rgba(255,255,255,0.32);
      }
      html.dark .f-backtop, html:not(.light) .f-backtop {
        width: 32px; height: 32px; display: flex; align-items: center;
        justify-content: center; border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.12);
        background: rgba(255,255,255,0.05);
        color: rgba(255,255,255,0.4);
        cursor: pointer; transition: border-color 150ms, color 150ms;
      }
      html.dark .f-backtop:hover, html:not(.light) .f-backtop:hover {
        border-color: #00f5ff; color: #00f5ff;
      }

      /* ── LIGHT MODE ─────────────────────────────────────────────────────── */
      html.light .f-footer {
        background: #f0f0f8;
        border-top: 1px solid rgba(0,0,0,0.08);
        margin-top: 5rem;
      }
      html.light .f-brand-name {
        font-size: 18px; font-weight: 700; color: #0f172a;
        font-family: Space Grotesk, Inter, sans-serif;
      }
      html.light .f-brand-dot { color: rgba(0,0,0,0.35); }
      html.light .f-body-text { font-size: 13px; color: rgba(0,0,0,0.55); }
      html.light .f-nav-link {
        font-size: 14px; color: rgba(0,0,0,0.55);
        text-decoration: none; padding-left: 0;
        border-left: 2px solid transparent; line-height: 1;
        transition: color 150ms, border-color 150ms, padding-left 150ms;
      }
      html.light .f-nav-link:hover {
        color: #0284c7; border-left-color: #0284c7; padding-left: 8px;
      }
      html.light .f-social-btn {
        width: 32px; height: 32px; display: flex; align-items: center;
        justify-content: center; border-radius: 8px;
        border: 1px solid rgba(0,100,200,0.3);
        color: #334155; text-decoration: none;
        background: rgba(255,255,255,0.7);
        backdrop-filter: blur(10px);
        transition: border-color 150ms, color 150ms, background 150ms;
      }
      html.light .f-social-btn:hover {
        border-color: #a855f7; color: #0284c7; background: rgba(168,85,247,0.08);
      }
      /* Glassmorphism chips — visibly distinct in light mode */
      html.light .f-chip {
        display: flex; align-items: center; gap: 6px;
        padding: 7px 10px; border-radius: 8px;
        background: rgba(255,255,255,0.85);
        border: 1px solid rgba(0,0,0,0.12);
        box-shadow: 0 2px 8px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.9);
        backdrop-filter: blur(12px);
      }
      html.light .f-chip-label { font-size: 12px; color: rgba(0,0,0,0.65); }
      html.light .f-email-link {
        display: inline-flex; align-items: center; gap: 6px;
        font-size: 13px; color: rgba(0,0,0,0.55);
        text-decoration: none; transition: color 150ms;
      }
      html.light .f-email-link:hover { color: #0284c7; }
      html.light .f-location { font-size: 13px; color: rgba(0,0,0,0.45); }
      html.light .f-avail-badge {
        display: inline-block; padding: 5px 14px; border-radius: 999px;
        background: rgba(255,255,255,0.7);
        border: 1px solid rgba(0,150,200,0.3);
      }
      html.light .f-small-text { font-size: 12px; color: rgba(0,0,0,0.38); }
      html.light .f-backtop {
        width: 32px; height: 32px; display: flex; align-items: center;
        justify-content: center; border-radius: 8px;
        border: 1px solid rgba(0,0,0,0.12);
        background: rgba(255,255,255,0.7);
        color: rgba(0,0,0,0.45);
        cursor: pointer; transition: border-color 150ms, color 150ms;
      }
      html.light .f-backtop:hover { border-color: #0284c7; color: #0284c7; }

      /* ── Responsive ─────────────────────────────────────────────────────── */
      @media (max-width: 1024px) {
        .f-grid { grid-template-columns: repeat(2, 1fr); gap: 40px; }
      }
      @media (max-width: 640px) {
        .f-grid { grid-template-columns: 1fr; gap: 0; }
        .f-grid > div { padding: 28px 0; }
        html.dark .f-grid > div, html:not(.light) .f-grid > div {
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        html.light .f-grid > div { border-bottom: 1px solid rgba(0,0,0,0.07); }
        .f-grid > div:first-child { padding-top: 0; }
        .f-grid > div:last-child { border-bottom: none; }
        .f-bottom-bar { flex-direction: column; align-items: center; text-align: center; gap: 10px; }
      }
    `}</style>
  </footer>
);

export default Footer;
