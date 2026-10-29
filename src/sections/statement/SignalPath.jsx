import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { gsap, EASE } from "../../motion";
import { techColor } from "../capabilities/techColor";
import { STAGES, CHAIN } from "./stages";
import { SenseScene, ProcessScene, ConnectScene, ExperienceScene } from "./StageScenes";

const byId = Object.fromEntries(STAGES.map((s) => [s.id, s]));
const SCENES = { sense: SenseScene, process: ProcessScene, connect: ConnectScene, experience: ExperienceScene };

/** Layout position of `el` inside `root`, ignoring transforms (so motion never bends the wire). */
const offsetBox = (el, root) => {
  let x = 0;
  let y = 0;
  let n = el;
  while (n && n !== root) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
};

/*
 * Shape of each leg, as in the reference: drop from Sense into the top of
 * the Process card, climb back up between the columns, settle onto Connect,
 * then wave across to the laptop.
 */
const legs = [
  (a, b) => `C${a.x + (b.x - a.x) * 0.6} ${a.y} ${a.x + (b.x - a.x) * 0.25} ${b.y} ${b.x} ${b.y}`,
  (a, b) => `C${a.x + (b.x - a.x) * 0.55} ${a.y} ${a.x + (b.x - a.x) * 0.5} ${b.y - 38} ${b.x} ${b.y}`,
  (a, b) => `C${a.x + (b.x - a.x) * 0.4} ${a.y + 22} ${b.x - (b.x - a.x) * 0.35} ${b.y - 52} ${b.x} ${b.y}`,
];

/** Official mark (Simple Icons) or nothing — never an invented logo. The section is always dark. */
const PartChip = ({ part }) => (
    <li className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-mono text-[0.6875rem] leading-none tracking-[0.04em] text-ink-dim">
      {part.icon && (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3 w-3 shrink-0">
          <path d={part.icon.path} fill={techColor(`#${part.icon.hex}`, "dark")} />
        </svg>
      )}
      {part.label}
    </li>
);
PartChip.propTypes = { part: PropTypes.shape({ label: PropTypes.string.isRequired, icon: PropTypes.object }).isRequired };

const Pill = ({ stage }) => {
  const { pill } = stage;
  const cls =
    "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[rgb(var(--stage)/0.55)] bg-[rgb(8_9_14/0.85)] px-3 py-1.5 text-[0.75rem] leading-none text-ink shadow-[0_0_24px_-6px_rgb(var(--stage)/0.6)] backdrop-blur";
  if (pill.to) {
    return (
      <Link
        to={pill.to}
        data-cursor="link"
        className={`${cls} group/pill pointer-events-auto transition-colors duration-300 hover:border-[rgb(var(--stage))] hover:bg-[rgb(var(--stage)/0.15)]`}
      >
        {pill.label}
        <ArrowUpRight aria-hidden="true" className="ml-1.5 h-3.5 w-3.5 transition-transform duration-300 group-hover/pill:-translate-y-0.5 group-hover/pill:translate-x-0.5" />
        <span className="sr-only"> — open the AttendEase case study</span>
      </Link>
    );
  }
  return (
    <span className={cls}>
      <pill.Icon aria-hidden="true" strokeWidth={1.75} className="h-3.5 w-3.5 text-[rgb(var(--stage))]" />
      {pill.label}
    </span>
  );
};
Pill.propTypes = { stage: PropTypes.object.isRequired };

/* Where the wire meets each stage, as fractions of its card (Sense: of its header). */
const ANCHOR = {
  sense: "left-[calc(var(--pad)+5.5rem)] top-[4.15rem]",
  process: "left-[30%] top-0",
  connect: "left-[30%] top-[3%]",
  experience: "left-[33%] top-[12%]",
};

/** One stage: header (the control), then its plate and label pill. */
const Stage = ({ stage, on, dim, pinned, wire, readoutId }) => {
  const Scene = SCENES[stage.id];
  const framed = stage.id === "sense" || stage.id === "process";
  return (
    <li
      data-stage={stage.id}
      data-on={on}
      onPointerEnter={(e) => e.pointerType === "mouse" && wire.setProbe(stage.id)}
      onPointerLeave={(e) => e.pointerType === "mouse" && wire.setProbe(null)}
      className={`stage-${stage.id} relative flex flex-col transition-opacity duration-500 [--pad:clamp(0.25rem,2.4vw,2.5rem)] ${
        dim ? "opacity-55" : ""
      }`}
    >
      <button
        type="button"
        aria-pressed={pinned === stage.id}
        aria-describedby={readoutId}
        onFocus={() => wire.setProbe(stage.id)}
        onClick={() => wire.setPinned((p) => (p === stage.id ? null : stage.id))}
        className="relative block rounded-lg pl-[var(--pad)] text-left focus-visible:outline-offset-4"
      >
        <span
          data-node-disc
          className={`grid h-[2.875rem] w-[2.875rem] place-items-center rounded-full border bg-[rgb(var(--stage)/0.08)] transition-[transform,box-shadow,border-color] duration-500 ease-out ${
            on
              ? "border-[rgb(var(--stage))] shadow-[0_0_0_5px_rgb(var(--stage)/0.12),0_0_28px_rgb(var(--stage)/0.55)] motion-safe:scale-110"
              : "border-[rgb(var(--stage)/0.75)] shadow-[0_0_18px_-2px_rgb(var(--stage)/0.45)]"
          }`}
        >
          <stage.Icon aria-hidden="true" strokeWidth={1.6} className="h-5 w-5 text-[rgb(var(--stage))]" />
        </span>
        <span data-node-text className="mt-4 block">
          <span className="block text-[0.9375rem] font-medium tabular-nums leading-none text-[rgb(var(--stage))]">{stage.n}</span>
          <span className="mt-2.5 block text-[1.0625rem] font-semibold uppercase leading-none tracking-[0.01em] text-[rgb(var(--stage))]">
            {stage.name}
          </span>
          <span className="mt-3 block text-[0.8125rem] leading-[1.45] text-ink/80">
            {stage.blurb[0]}
            <br className="hidden xl:block" /> {stage.blurb[1]}
          </span>
        </span>
        <span className="sr-only">: {stage.title}</span>
      </button>
      {stage.id === "sense" && <span aria-hidden="true" data-anchor="sense" className={`absolute h-0 w-0 ${ANCHOR.sense}`} />}

      <div
        data-card
        className={`relative mt-5 aspect-[0.86/1] w-full transition-transform duration-700 ease-out ${on ? "motion-safe:-translate-y-1.5" : ""}`}
      >
        {stage.id !== "sense" && <span aria-hidden="true" data-anchor={stage.id} className={`absolute z-10 h-0 w-0 ${ANCHOR[stage.id]}`} />}
        <div
          data-frame
          data-edge={stage.id === "experience" ? undefined : stage.id}
          className={`absolute inset-0 ${framed ? "stage-card overflow-hidden rounded-xl" : ""} ${
            stage.id === "connect" ? "top-[18%] bottom-[12%]" : ""
          }`}
        >
          <div
            data-scene
            className={`h-full w-full ${
              stage.id === "connect" ? "!absolute inset-x-0 -top-[28%] bottom-0 !h-auto" : ""
            }`}
          >
            <Scene />
          </div>
        </div>
        {stage.id === "experience" && <span aria-hidden="true" data-edge="experience" className="absolute left-0 top-[20%] h-[55%] w-full" />}
        <div data-pill className={`absolute z-10 ${stage.id === "sense" ? "-bottom-3 left-[4%]" : "-bottom-1 left-[8%]"}`}>
          <Pill stage={stage} />
        </div>
      </div>
    </li>
  );
};
Stage.propTypes = {
  stage: PropTypes.object.isRequired,
  on: PropTypes.bool,
  dim: PropTypes.bool,
  pinned: PropTypes.string,
  wire: PropTypes.object.isRequired,
  readoutId: PropTypes.string.isRequired,
};

/**
 * Sense → Process → Connect → Experience. Understandable at rest; hover,
 * focus or tap brings a stage forward (disc, card, its legs of the wire) and
 * the readout names what happens there. Selection state lives in Statement
 * so the matching word in the statement can respond too. The wire is
 * measured from the real layout, so it stays attached at every width.
 */
const SignalPath = ({ active, pinned, setProbe, setPinned }) => {
  const wrap = useRef(null);
  const legRefs = useRef([]);
  const dotRef = useRef(null);
  const uid = useId().replace(/:/g, "");
  const readoutId = `${uid}-readout`;
  const [geo, setGeo] = useState(null);
  const wire = { setProbe, setPinned };
  const ai = STAGES.findIndex((s) => s.id === active);
  const stage = active ? byId[active] : null;

  const measure = useCallback(() => {
    const root = wrap.current;
    if (!root) return;
    const at = (sel) => root.querySelector(sel);
    const anchors = STAGES.map((s) => at(`[data-anchor="${s.id}"]`));
    const edges = STAGES.map((s) => at(`[data-edge="${s.id}"]`));
    if (anchors.some((a) => !a) || edges.some((e) => !e)) return;
    const pts = anchors.map((a) => offsetBox(a, root));
    const boxes = edges.map((e) => offsetBox(e, root));
    // Short links between neighbouring plates, at the height of the lower one's middle.
    const links = boxes.slice(1).map((b, i) => {
      const a = boxes[i];
      const y = Math.max(a.y + a.h * 0.5, b.y + b.h * 0.42);
      return { x1: a.x + a.w, x2: b.x, y };
    });
    setGeo({ w: root.offsetWidth, h: root.offsetHeight, pts, links });
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap.current);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [measure]);

  // A pulse runs along the leg into the selected stage.
  useEffect(() => {
    const dot = dotRef.current;
    if (ai < 1 || !dot || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const path = legRefs.current[ai - 1];
    if (!path) return undefined;
    const len = path.getTotalLength();
    const s = { t: 0 };
    dot.setAttribute("class", `stage-${STAGES[ai].id}`);
    const tw = gsap.fromTo(
      s,
      { t: 0 },
      {
        t: 1,
        duration: 0.8,
        ease: EASE.soft,
        onStart: () => gsap.set(dot, { opacity: 1 }),
        onUpdate: () => {
          const p = path.getPointAtLength(s.t * len);
          dot.setAttribute("transform", `translate(${p.x} ${p.y})`);
        },
        onComplete: () => gsap.to(dot, { opacity: 0, duration: 0.35 }),
      },
    );
    return () => tw.kill();
  }, [ai, geo]);

  const legState = (i) => (ai < 0 ? "rest" : i === ai - 1 || i === ai ? "on" : "off");
  const d = geo ? geo.pts.slice(1).map((b, i) => `M${geo.pts[i].x} ${geo.pts[i].y} ${legs[i](geo.pts[i], b)}`) : [];

  return (
    <div
      ref={wrap}
      className="relative"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setProbe(null);
      }}
    >
      <p aria-hidden="true" className="mb-[clamp(2.5rem,7vh,4.75rem)] hidden items-center justify-end gap-[clamp(0.75rem,1.8vw,1.75rem)] font-mono text-[0.625rem] uppercase tracking-[0.32em] text-ink/70 sm:flex">
        {CHAIN.map((c, i) => (
          <span key={c} data-chain className="flex items-center gap-[clamp(0.75rem,1.8vw,1.75rem)]">
            {i > 0 && <span className="tracking-normal text-ink-faint">→</span>}
            {c}
          </span>
        ))}
      </p>

      {geo && (
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${geo.w} ${geo.h}`}
          className="pointer-events-none absolute inset-0 z-[5] hidden h-full w-full overflow-visible md:block"
        >
          <defs>
            <linearGradient id={`${uid}-g`} gradientUnits="userSpaceOnUse" x1={geo.pts[0].x} y1="0" x2={geo.pts[3].x} y2="0">
              <stop offset="0" stopColor="rgb(var(--c-sense))" />
              <stop offset="0.33" stopColor="rgb(var(--c-process))" />
              <stop offset="0.68" stopColor="rgb(var(--c-connect))" />
              <stop offset="1" stopColor="rgb(var(--c-experience))" />
            </linearGradient>
            <filter id={`${uid}-glow`} x="-20%" y="-50%" width="140%" height="200%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>

          {/* Links between plates */}
          {geo.links.map((l, i) => (
            <g key={i} className={`stage-${STAGES[i + 1].id}`} data-link opacity={ai < 0 || ai === i || ai === i + 1 ? 1 : 0.3}>
              <path d={`M${l.x1} ${l.y}H${l.x2}`} stroke={`url(#${uid}-g)`} strokeWidth="1.2" pathLength="1" strokeDasharray="1" data-wire="link" />
              <circle cx={l.x1} cy={l.y} r="2.6" fill="rgb(var(--stage))" />
              <circle cx={l.x2} cy={l.y} r="2.6" fill="rgb(var(--stage))" />
            </g>
          ))}

          {/* Glow under, crisp line over — drawn leg by leg */}
          {d.map((p, i) => {
            const st = legState(i);
            return (
              <g key={i} opacity={st === "off" ? 0.28 : 1} className="transition-opacity duration-500">
                <path
                  d={p}
                  data-wire="glow"
                  pathLength="1"
                  strokeDasharray="1"
                  fill="none"
                  stroke={`url(#${uid}-g)`}
                  strokeWidth={st === "on" ? 6 : 4}
                  opacity="0.55"
                  filter={`url(#${uid}-glow)`}
                />
                <path
                  ref={(el) => (legRefs.current[i] = el)}
                  d={p}
                  data-wire="leg"
                  pathLength="1"
                  strokeDasharray="1"
                  fill="none"
                  strokeLinecap="round"
                  stroke={`url(#${uid}-g)`}
                  strokeWidth={st === "on" ? 2 : 1.25}
                />
              </g>
            );
          })}

          {/* Terminals */}
          {geo.pts.map((p, i) => (
            <g key={STAGES[i].id} data-terminal className={`stage-${STAGES[i].id}`}>
              <circle cx={p.x} cy={p.y} r={ai === i ? 9 : 6} fill="rgb(var(--stage) / 0.25)" className="transition-[r] duration-500" />
              <circle cx={p.x} cy={p.y} r="3" fill="rgb(var(--stage))" />
              <circle cx={p.x} cy={p.y} r="1.2" fill="#fff" />
            </g>
          ))}

          <g ref={dotRef} opacity="0">
            <circle r="10" style={{ fill: "rgb(var(--stage) / 0.3)" }} />
            <circle r="3.5" fill="#fff" />
          </g>
        </svg>
      )}

      <ol className="relative grid grid-cols-2 gap-x-[clamp(1rem,1.8vw,1.75rem)] gap-y-14 md:grid-cols-4">
        {STAGES.map((s) => (
          <Stage key={s.id} stage={s} on={active === s.id} dim={!!active && active !== s.id} pinned={pinned} wire={wire} readoutId={readoutId} />
        ))}
      </ol>

      <div
        id={readoutId}
        data-readout
        aria-live="polite"
        className={`mt-12 flex min-h-[3.25rem] flex-col gap-2 md:mt-10 md:flex-row md:items-center md:gap-5 ${stage ? `stage-${stage.id}` : ""}`}
      >
        {stage ? (
          <>
            <p className="text-[0.875rem] leading-snug text-ink">
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-[rgb(var(--stage))]">
                {stage.n} / {stage.title}
              </span>
              <span className="ml-3 text-ink-dim">{stage.detail}</span>
            </p>
            <ul aria-label={`${stage.name} parts`} className="flex shrink-0 flex-wrap gap-1.5">
              {stage.parts.map((p) => (
                <PartChip key={p.label} part={p} />
              ))}
            </ul>
          </>
        ) : (
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-dim">
            Fig. 01 — Ultrasonic Blind Stick → AttendEase <span className="normal-case tracking-normal text-ink-faint">· hover, focus or tap a stage to trace the signal</span>
          </p>
        )}
      </div>
    </div>
  );
};

SignalPath.propTypes = {
  active: PropTypes.string,
  pinned: PropTypes.string,
  setProbe: PropTypes.func.isRequired,
  setPinned: PropTypes.func.isRequired,
};

export default SignalPath;
