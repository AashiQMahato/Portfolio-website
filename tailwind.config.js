/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk Variable", "Space Grotesk", "system-ui", "sans-serif"],
        sans: ["Space Grotesk Variable", "Space Grotesk", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono Variable", "JetBrains Mono", "Fira Code", "monospace"],
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
        // "Schematic" design tokens (see :root in index.css)
        panel: "rgb(var(--panel) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          dim: "rgb(var(--ink-dim) / <alpha-value>)",
        },
        signal: "rgb(var(--signal) / <alpha-value>)",
        ember: "rgb(var(--ember) / <alpha-value>)",
        // Canvas tokens
        "accent-ink": "rgb(var(--accent-ink) / <alpha-value>)",
        "sky-high": "rgb(var(--sky-high) / <alpha-value>)",
        "sky-low": "rgb(var(--sky-low) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
        },
      },
      fontSize: {
        // Hero display headline ("IMPOSSIBLE TO IGNORE." scale)
        display: [
          "clamp(3.25rem, 10vw, 8.5rem)",
          { lineHeight: "0.95", letterSpacing: "-0.03em", fontWeight: "700" },
        ],
        // Section title scale
        "display-2": [
          "clamp(2.25rem, 6vw, 4.5rem)",
          { lineHeight: "1.02", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        // Mono HUD micro-labels
        hud: ["0.6875rem", { lineHeight: "1.3", letterSpacing: "0.2em" }],
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
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
    },
  },
  plugins: [],
};
