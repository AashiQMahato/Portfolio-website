# Signal — design & motion system

The portfolio's visual language: a dark-first editorial canvas where type does
most of the work, one accent colour carries meaning, and small engineering
marks (coordinates, indexes, mono metadata) say *electronics engineer* without
turning the site into a sci-fi dashboard.

## Tokens

Defined as RGB triplets in `src/index.css` (`:root` = dark, `html.light` =
paper) and exposed through Tailwind (`bg-background`, `text-ink`, …).

| Token | Use |
| --- | --- |
| `background` | page ground (#070708 / #F3F1EC) |
| `panel` | the only raised surface (hairline cards, menus, dialogs) |
| `line` | 1px hairlines, dividers, card borders |
| `ink` | primary text |
| `ink-dim` | secondary text — AA at any size |
| `ink-faint` | **large type or decoration only** (fails AA for body text) |
| `signal` | the accent (#FF6A33). Fills, rules, active markers, large type |
| `accent-ink` | accent for small text (always AA) |
| `primary-foreground` | text on a `signal` fill |

Rules: one accent per view region; no gradients except media scrims; no glow;
no glassmorphism except the scrolled nav bar. Radius: `rounded-full` for
buttons and pills, `rounded-xl` (0.75rem) max for surfaces, media square or
`rounded-lg`.

## Type

Geist Variable + Geist Mono Variable (self-hosted). Size, leading and tracking
travel together: large type tightens, small type opens up.

| Class | Use |
| --- | --- |
| `text-display-xl` | hero name only |
| `text-display` | page titles |
| `text-display-2` | section titles |
| `text-statement` | large editorial paragraphs |
| `text-lede` | intro paragraphs |
| `.hud` | mono uppercase micro-labels (indexes, metadata, status) |

Section header pattern: `.hud` index row (`(02) — About`) above a
`text-display-2` title. Use `tabular-nums` for numbers that change.

## Layout

`.shell` = max-width container with the fluid `--gutter`. Sections use
generous vertical rhythm (`py-[clamp(6rem,14vh,12rem)]`). Prefer asymmetric
12-column grids on desktop; mobile is a deliberate single column.

## Motion

Everything animates through GSAP (`src/motion`, import from `../motion`).
CSS transitions are fine for tiny hover/press states. Never animate layout
properties (width/height/top/left) on content — transform, opacity and
clip-path only.

| Token | Value | Use |
| --- | --- | --- |
| `DUR.fast` | 0.3s | hover, press |
| `DUR.base` | 0.6s | UI |
| `DUR.enter` | 1.0s | section entrances |
| `DUR.cinematic` | 1.4s | hero, image reveals |
| `EASE.out` | power3.out | default |
| `EASE.strong` | power4.out | type |
| `EASE.expo` | expo.out | masks, images |
| `EASE.inOut` | expo.inOut | curtains, transitions |

Primitives:

- `<Reveal variant="rise|lines|chars|clip|fade">` — scroll-triggered entrance.
- `<SplitText lines={[…]} | text by="words|chars">` — React-owned splitting.
- `<ImageReveal variant="clip|side|scale|iris|parallax" drift={n}>`.
- `<Magnetic>` / `<MagneticButton>` — fine-pointer lean, ≤12px.
- `data-cursor="view|explore|read|drag|copy|button|hide"` (+
  `data-cursor-label`) — sets the desktop cursor state.
- `data-transition="project"` on a link containing an `<img>` — Flip image
  expansion into the next page; every other internal link gets the curtain.
  `data-transition="none"` opts out.

Every GSAP call lives in `useGSAP(() => …, { scope: ref })` so it is reverted
on unmount. Under `prefers-reduced-motion` primitives render final state,
Lenis is off, the cursor and preloader are absent, and transitions are
instant. Desktop-only effects check `(hover: hover) and (pointer: fine)` or
`gsap.matchMedia()`.

## Adding motion

1. Reach for a primitive first (`Reveal`, `ImageReveal`, `SplitText`).
2. A section with its own identity gets a `useGSAP` block scoped to the
   section ref, using tokens from `motion/tokens.js`.
3. Add a new `Reveal` variant only when a pattern repeats in 3+ places.
