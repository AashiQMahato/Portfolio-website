# Portfolio redesign — "Schematic"

A ground-up redesign of the portfolio into a dark, typography-led site built
around one interactive WebGL centerpiece. Every phase left the site building
and deployable.

---

## Design direction

**Engineering schematic** — the site reads as a living engineering document.
It was chosen over generic "modern gradient + rounded cards" because it says
something true about the work: electronics engineering *and* full-stack
development, expressed through PCB silkscreen and lab-notebook language.

| Element | Decision |
|---|---|
| Type | Space Grotesk (display + body) × JetBrains Mono, promoted from code-only to an editorial annotation voice |
| Color | Near-black ground `#0A0C10`, phosphor accent `#53E9C5`, solder amber `#FFB454` used at <5% frequency |
| Surface | Flat panels, 1px hairlines, near-square corners — no glassmorphism, no gradient blobs |
| Structure | Every section: mono index label → oversized display headline → dim prose |
| Motion | `power3.out`, 0.6–0.9s reveals; motion always explains hierarchy or space, never decorates |

Design tokens live as CSS variables in `src/index.css` and are exposed to
Tailwind as `bg-panel`, `border-line`, `text-ink` / `text-ink-dim`,
`text-signal`, `text-ember`.

---

## Architecture

```
src/
  motion/     GSAP + Lenis layer — tokens, Reveal, Magnetic, SmoothScroll,
              ScrollManager, useActiveSection, usePrefersReducedMotion, bootGate
  scene/      Three.js layer — CircuitBoard, HeroScene, WebGL detection, disposal
  sections/   Home one-pager sections — Hero, About, Skills, FeaturedProjects,
              TestimonialsSection, Contact
  components/schematic/   Nav, SchematicRail, SectionHeading, Cursor, BootLoader
```

Information architecture is a **hybrid one-pager**: the home route is a
scroll-driven narrative (hero → about → skills → work → voices → contact),
while case studies, blog, dashboards, resume, timeline, and "now" remain
separate routes. Old section routes (`/about`, `/skills`, `/education`,
`/testimonials`, `/contactus`) redirect to home anchors, so no link ever dies.

---

## What changed, by phase

**1 · Audit** — catalogued stack, routes, and content. Found the main bundle at
1.43 MB, CV data duplicated between `portfolioData.js` and a 1,333-line
`HomePage.jsx`, and project imagery hotlinked to third-party hosts.

**2 · Design system** — direction, type scale, palette, spacing, motion
vocabulary, component inventory.

**3 · Scaffolding** — installed `three` / `@react-three/fiber@8` /
`@react-three/drei@9` (the React-18-compatible line; R3F v9 requires React 19)
and `lenis`. Self-hosted both fonts via Fontsource, replacing a Google Fonts
CDN import. Built the `motion/` and `scene/` architecture. Mounted Lenis
site-wide, disabled under reduced motion, with `data-lenis-prevent` on the
chatbot, terminal, and command-palette scroll panels.

**4 · Core layout + motion** — rebuilt the home page as the one-pager. Added
the `SchematicRail` (fixed left hairline whose phosphor fill scrubs with scroll
progress and doubles as section navigation), a new mono top nav with live
current-section indication, and the section reveal system. *Fixed a latent bug:*
the `animate-marquee` keyframes the existing `Marquee` component referenced were
never defined in Tailwind — marquees had silently never animated.

**5 · 3D hero** — a stylized PCB built entirely from primitives (~2k triangles,
no textures or model downloads): emissive phosphor traces, chips, 26 instanced
vias, a blinking amber status LED, and a signal pulse riding the longest trace.
Pointer parallax plus a scroll-driven camera that pitches toward board level and
hands the eye off to the rail. Lazy-loaded into its own async chunk; gated on
reduced motion × WebGL support × viewport ≥768px × Save-Data, with the blueprint
grid as the static fallback. `frameloop` pauses when the hero leaves the viewport.

**6 · Micro-interactions** — custom crosshair cursor with contextual states
(ring over interactive elements, `[ VIEW ]` badge over project media, hidden
over text fields), magnetic CTAs clamped to ±8px, and a ~1.2s skippable boot
sequence coordinated with the hero entrance via `bootGate`. All fine-pointer
only and inert under reduced motion.

**7 · Performance + accessibility** — see below.

**8 · Final QA** — restyled the footer (the last off-system surface), removed a
dead placeholder Twitter link, restored access to the real resume PDF, and swept
all routes, keyboard order, and responsive breakpoints. Four real bugs surfaced
and were fixed:

1. **The hero rendered as a hard black rectangle in light theme.** The PCB is
   near-black by design, which is invisible against the dark ground but glaring
   on white. Fixed by giving the scene a theme-aware palette — the light theme
   now uses a dark FR-4 green solder-mask with gold vias, how a real board
   actually looks, so it reads as deliberate — plus a radial mask that feathers
   every canvas edge instead of only the left and bottom.
2. **`<Rig>` never received the theme prop**, so the scene would always have
   fallen back to the default palette. Caught by lint after the refactor.
3. **The resume PDF was unreachable.** `/resume` renders from CV data and its
   "Download PDF" button only calls `window.print()`; the old direct link pointed
   at `/src/assets/…`, which resolves in dev but 404s in production. The PDF now
   ships from `public/` with a real download link beside the print button.
4. **Fixed FABs overlapped footer content** at mobile and tablet widths.

---

## Performance

Eager JavaScript went from **1,428 KB (479 KB gzip) → 380 KB (~128 KB gzip)**,
a **73% cut**, with no features removed.

| Change | Effect |
|---|---|
| Removed 9 unused packages (antd, @ant-design/icons, tsparticles, react-tsparticles, react-simple-typewriter, react-typed, react-responsive, i18next, react-i18next) | Dead weight gone |
| Chatbot, ⌘K palette, terminal, Iridescence, `/projects` → lazy + `requestIdleCallback` | Off the critical path |
| framer-motion evicted from the entry chunk (barrel import removed, `RotatingText` rewritten on GSAP, dead Footer import deleted) | Loads only with legacy lazy pages |
| `Prism` → `PrismLight` with 8 registered languages | Highlighter chunk 800 KB → 233 KB |
| three.js isolated behind `React.lazy` | 222 KB gzip, fetched only when the hero gate passes |
| Favicon: 267 KB JPEG → 300-byte SVG | — |

Animation is transform/opacity only; images sit in fixed `aspect-video` boxes,
so there is no layout shift from motion.

---

## Accessibility

- Skip link as the first focusable element, targeting the `<main>` landmark
- Semantic landmarks, single `<h1>`, ordered heading hierarchy, labelled `<nav>`s
- `focus-visible` rings on every interactive element; full keyboard operability
- `role="meter"` with min/max/now on skill bars; all images carry `alt`
- Duplicate testimonial marquee row marked `aria-hidden` so quotes are announced once
- `prefers-reduced-motion` honored end to end: Lenis off, reveals become static,
  WebGL hero swaps to its fallback, cursor reverts to native, boot sequence skipped
- Contrast: dim text ≈5.5:1 on the dark ground; light-theme accent darkened to
  `#0B7A60` and amber to `#9E5A0C` to hold AA

---

## QA results

- **Routes** — all 15 render with content; all 5 legacy redirects land on the
  correct home anchor
- **Keyboard** — skip link focuses first and animates into view; tab order follows
  DOM order
- **Responsive** — verified at 375 / 768 / desktop; WebGL scene correctly absent
  below 768px (no three.js request at all), cursor and magnetics absent on touch
- **Themes** — dark and light both verified across hero, sections, and footer,
  including the WebGL scene in each palette
- **Build & lint** — production build passes; every file authored in this
  redesign lints with 0 errors (2 benign fast-refresh warnings)

### Environment caveats

Three things could not be measured inside the automated browser pane and are
worth a 30-second check in a real browser: **cursor states and magnetic pull**
(need a real pointer), **the boot animation** (CSS transitions and rAF freeze
when the pane backgrounds the tab), and **hero frame rate**.

---

## Known follow-ups

1. **`public/vite.jpg`** — 643 KB, unreferenced (a leftover template avatar), but
   still shipped in `dist`. Safe to delete.
2. **`src/assets/12.jpg` (3.1 MB), `AAMS.png` (2.8 MB)** — referenced only by the
   now-orphaned legacy components; not in the bundle. Optimize to WebP/AVIF if
   reused, otherwise remove.
3. **Orphaned legacy components** — `HomePage`, `About`, `Skills`, `Education`,
   `Testimonials`, `ContactUs`, `Navbar` are no longer imported anywhere. They are
   tree-shaken out of the build and cost nothing at runtime; deleting them is safe
   whenever you're confident nothing is worth salvaging.
4. **Project imagery** — still hotlinked to Springer, Unsplash, YouTube, Freepik,
   and GitHub raw. A schematic fallback panel renders if any fail, but hosting
   these locally would be more robust.
5. **Deploy config** — `package.json` still has a GitHub Pages `homepage` field and
   `gh-pages` deploy script while `vercel.json` targets Vercel. Vite ignores
   `homepage`, so this is inert, but the two paths should be reconciled.
6. **No portrait** — the redesign is typography-led and carries no profile photo.
   Deliberate, but easy to add to the About section if you'd prefer one.
