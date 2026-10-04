/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["Geist Variable", "system-ui", "sans-serif"],
        sans: ["Geist Variable", "system-ui", "sans-serif"],
        mono: ["Geist Mono Variable", "ui-monospace", "monospace"],
      },
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        "card-foreground": "rgb(var(--card-foreground) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        "muted-foreground": "rgb(var(--muted-foreground) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        // "Signal" design tokens (see :root in index.css)
        panel: "rgb(var(--panel) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          dim: "rgb(var(--ink-dim) / <alpha-value>)",
          faint: "rgb(var(--ink-faint) / <alpha-value>)",
        },
        signal: "rgb(var(--signal) / <alpha-value>)",
        ember: "rgb(var(--ember) / <alpha-value>)",
        "accent-ink": "rgb(var(--accent-ink) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
        },
      },
      fontSize: {
        // Editorial scale — size, leading and tracking travel together
        // (large type tightens, small type opens up).
        "display-xl": [
          "clamp(3.4rem, min(19.5vw, 19svh), 15rem)",
          { lineHeight: "0.84", letterSpacing: "-0.055em", fontWeight: "600" },
        ],
        display: [
          "clamp(3rem, 8.2vw, 8rem)",
          { lineHeight: "0.9", letterSpacing: "-0.045em", fontWeight: "600" },
        ],
        "display-2": [
          "clamp(2.4rem, 5.4vw, 5.25rem)",
          { lineHeight: "0.98", letterSpacing: "-0.04em", fontWeight: "600" },
        ],
        statement: [
          "clamp(1.85rem, 3.9vw, 3.75rem)",
          { lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "500" },
        ],
        lede: [
          "clamp(1.15rem, 1.6vw, 1.4rem)",
          { lineHeight: "1.5", letterSpacing: "-0.01em" },
        ],
        hud: ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.14em" }],
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
      },
      animation: {
        "slide-down": "slideDown 0.5s ease-out",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-down-loop": "slideDownLoop 1.6s ease-in-out infinite",
        marquee: "marquee var(--marquee-duration, 30s) linear infinite",
        "marquee-reverse":
          "marquee var(--marquee-duration, 30s) linear infinite reverse",
      },
      keyframes: {
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        slideDownLoop: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(200%)" },
        },
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      backdropBlur: {
        xs: "2px",
      },
      transitionDuration: {
        400: "400ms",
      },
      transitionTimingFunction: {
        // CSS mirrors of the GSAP tokens in src/motion/tokens.js
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
        "in-out": "cubic-bezier(0.87, 0, 0.13, 1)",
      },
    },
  },
  plugins: [],
};
