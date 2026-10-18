import { useEffect, useId, useRef } from "react";
import PropTypes from "prop-types";
import { gsap, EASE } from "../../motion";
import { useTheme } from "../../context/ThemeContext";
import { techColor } from "../capabilities/techColor";
import { STAGES, PLATES, LAYOUTS, segment } from "./stages";

const byId = Object.fromEntries(STAGES.map((s) => [s.id, s]));
const pct = (v, total) => `${(v / total) * 100}%`;

/** Official mark (Simple Icons) or nothing — never an invented logo. */
const PartChip = ({ part }) => {
  const { theme } = useTheme();
  return (
    <li className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-mono text-[0.6875rem] leading-none tracking-[0.04em] text-ink-dim">
      {part.icon && (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3 w-3 shrink-0">
          <path d={part.icon.path} fill={techColor(`#${part.icon.hex}`, theme)} />
        </svg>
      )}
      {part.label}
    </li>
  );
};
PartChip.propTypes = { part: PropTypes.shape({ label: PropTypes.string.isRequired, icon: PropTypes.object }).isRequired };

/**
 * A crop of a real project figure. The source is drawn into an SVG viewBox
 * so callouts share its pixel space exactly; selecting a stage with a
 * callout dims everything outside it.
 */
const Plate = ({ id, active, className = "", style }) => {
  const plate = PLATES[id];
  const [vx, vy, vw, vh] = plate.view.split(" ").map(Number);
  const lit = active && plate.stages.includes(active);
  const callout = active && plate.callouts[active];
  return (
    <figure data-plate className={`absolute ${className}`} style={style}>
      <div
        className={`relative h-full w-full overflow-hidden border border-line bg-panel transition-[filter,opacity] duration-500 ease-out [clip-path:polygon(0_0,100%_0,100%_calc(100%-14px),calc(100%-14px)_100%,0_100%)] ${
          !active || lit ? "opacity-100" : "opacity-50 saturate-50"
        }`}
      >
        <svg
          data-plate-img
          role="img"
          aria-label={plate.alt}
          viewBox={plate.view}
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full"
        >
          <image href={plate.src} width={plate.size[0]} height={plate.size[1]} />
          <path
            aria-hidden="true"
            fillRule="evenodd"
            d={`M${vx} ${vy}h${vw}v${vh}h${-vw}Z${callout ? `M${callout[0]} ${callout[1]}h${callout[2]}v${callout[3]}h${-callout[2]}Z` : ""}`}
            className="fill-background transition-opacity duration-500"
            opacity={callout ? 0.6 : 0}
          />
          {Object.entries(plate.callouts).map(([stage, [x, y, w, h]]) => (
            <rect
              key={stage}
              aria-hidden="true"
              x={x}
              y={y}
              width={w}
              height={h}
              rx="10"
              fill="none"
              strokeWidth="5"
              strokeDasharray="14 10"
              className={`stage-${stage} stroke-[rgb(var(--stage))] transition-opacity duration-500`}
              opacity={active === stage ? 1 : 0}
            />
          ))}
        </svg>
        <figcaption className="hud absolute bottom-0 left-0 max-w-[85%] truncate bg-background/85 px-2 py-1 text-[0.625rem]">
          {plate.label}
        </figcaption>
      </div>
    </figure>
  );
};
Plate.propTypes = {
  id: PropTypes.oneOf(Object.keys(PLATES)).isRequired,
  active: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

/** Where the label sits relative to the icon disc (disc centre = anchor). */
const PLACEMENT = {
  right: "left-[-1.5rem] top-0 -translate-y-1/2 flex-row text-left",
  left: "right-[-1.5rem] top-0 -translate-y-1/2 flex-row-reverse text-right",
  below: "left-0 top-[-1.5rem] -translate-x-1/2 flex-col items-center text-center",
  "below-start": "left-[-1.5rem] top-[-1.5rem] flex-col items-start text-left",
  "below-end": "right-[-1.5rem] top-[-1.5rem] flex-col items-end text-right",
};

/** Icon disc: brightens, rings and lifts slightly when its stage is the focus. */
const Disc = ({ stage, on, dim, className = "h-12 w-12" }) => (
  <span
    data-node-disc
    className={`relative grid shrink-0 place-items-center rounded-full border bg-background transition-[transform,box-shadow,border-color,background-color,opacity] duration-300 ease-out ${className} ${
      on
        ? "border-[rgb(var(--stage))] bg-[rgb(var(--stage)/0.14)] shadow-[0_0_0_6px_rgb(var(--stage)/0.12)] motion-safe:scale-110"
        : "border-[rgb(var(--stage)/0.45)]"
    } ${dim ? "opacity-60" : ""}`}
  >
    <stage.Icon aria-hidden="true" strokeWidth={1.6} className="h-[45%] w-[45%] text-[rgb(var(--stage))]" />
  </span>
);
Disc.propTypes = { stage: PropTypes.object.isRequired, on: PropTypes.bool, dim: PropTypes.bool, className: PropTypes.string };

/** Interaction wiring shared by both renderings: hover/focus probe, click pins. */
const handlers = (id, { setProbe, setPinned }) => ({
  onPointerEnter: (e) => e.pointerType === "mouse" && setProbe(id),
  onPointerLeave: (e) => e.pointerType === "mouse" && e.currentTarget !== document.activeElement && setProbe(null),
  onFocus: () => setProbe(id),
  onClick: () => setPinned((p) => (p === id ? null : id)),
});

/** Desktop / tablet: plates, nodes and the drawn signal path on one canvas. */
const Canvas = ({ layout, active, pinned, wire, readoutId }) => {
  const L = LAYOUTS[layout];
  const uid = useId().replace(/:/g, "");
  const pathRefs = useRef([]);
  const tapRefs = useRef([]);
  const dotRef = useRef(null);
  const points = STAGES.map((s) => L.nodes[s.id]);
  const segs = points.slice(1).map((p, i) => segment(points[i], p, L.curve));
  const ai = STAGES.findIndex((s) => s.id === active);

  // A pulse travels into the selected stage (out of the plate, for Sense).
  useEffect(() => {
    const dot = dotRef.current;
    if (ai < 0 || !dot || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const path = ai === 0 ? tapRefs.current[0] : pathRefs.current[ai - 1];
    if (!path) return undefined;
    const len = path.getTotalLength();
    const s = { t: 0 };
    dot.setAttribute("class", `stage-${STAGES[ai].id}`);
    const tw = gsap.fromTo(
      s,
      { t: 0 },
      {
        t: 1,
        duration: 0.7,
        ease: EASE.soft,
        onStart: () => gsap.set(dot, { opacity: 1 }),
        onUpdate: () => {
          const p = path.getPointAtLength(s.t * len);
          dot.setAttribute("transform", `translate(${p.x} ${p.y})`);
        },
        onComplete: () => gsap.to(dot, { opacity: 0, duration: 0.3 }),
      },
    );
    return () => tw.kill();
  }, [ai, layout]);

  const segState = (i) => {
    if (ai < 0) return "rest";
    return i === ai - 1 || i === ai ? "on" : "off";
  };

  return (
    <div
      data-canvas
      className="relative w-full"
      style={{ aspectRatio: `${L.w} / ${L.h}` }}
    >
      {/* Engineering backdrop: faint grid, masked to the canvas centre */}
      <div
        aria-hidden="true"
        data-grid
        className="micro-grid pointer-events-none absolute inset-0 [background-size:32px_32px] [mask-image:radial-gradient(closest-side,black,transparent)]"
      />

      {Object.entries(L.plates).map(([id, [x, y, w, h]]) => (
        <Plate
          key={id}
          id={id}
          active={active}
          style={{ left: pct(x, L.w), top: pct(y, L.h), width: pct(w, L.w), height: pct(h, L.h) }}
        />
      ))}

      <svg aria-hidden="true" viewBox={`0 0 ${L.w} ${L.h}`} className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        <defs>
          {segs.map((_, i) => (
            <linearGradient
              key={i}
              id={`${uid}-g${i}`}
              gradientUnits="userSpaceOnUse"
              x1={points[i][0]}
              y1={points[i][1]}
              x2={points[i + 1][0]}
              y2={points[i + 1][1]}
            >
              <stop offset="0" className={`stage-${STAGES[i].id}`} style={{ stopColor: "rgb(var(--stage))" }} />
              <stop offset="1" className={`stage-${STAGES[i + 1].id}`} style={{ stopColor: "rgb(var(--stage))" }} />
            </linearGradient>
          ))}
        </defs>

        {/* Taps: plate edge → its stage */}
        {L.taps.map(([, from, stageId], i) => {
          const to = L.nodes[stageId];
          return (
            <g key={stageId} className={`stage-${stageId}`}>
              <path d={`M${from[0]} ${from[1]}L${to[0]} ${to[1]}`} className="stroke-ink/15" strokeWidth="1" fill="none" />
              <path
                ref={(el) => (tapRefs.current[i] = el)}
                data-wire={i === 0 ? "in" : "out"}
                d={i === 0 ? `M${from[0]} ${from[1]}L${to[0]} ${to[1]}` : `M${to[0]} ${to[1]}L${from[0]} ${from[1]}`}
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset="0"
                fill="none"
                strokeWidth={active === stageId ? 2.5 : 1.5}
                className="stroke-[rgb(var(--stage))] transition-[stroke-width,opacity] duration-300"
                opacity={ai < 0 || active === stageId ? 0.9 : 0.3}
              />
              <circle cx={from[0]} cy={from[1]} r="3" className="fill-background stroke-[rgb(var(--stage))]" strokeWidth="1.5" />
            </g>
          );
        })}

        {/* Track, then the coloured signal drawn over it */}
        <path d={segs.join("")} fill="none" strokeWidth="1" className="stroke-ink/15" strokeDasharray="2 5" />
        {segs.map((d, i) => {
          const st = segState(i);
          return (
            <path
              key={i}
              ref={(el) => (pathRefs.current[i] = el)}
              data-wire="seg"
              d={d}
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset="0"
              fill="none"
              strokeLinecap="round"
              stroke={`url(#${uid}-g${i})`}
              strokeWidth={st === "on" ? 3 : 2}
              opacity={st === "off" ? 0.25 : st === "on" ? 1 : 0.85}
              className="transition-[stroke-width,opacity] duration-300"
            />
          );
        })}

        <g ref={dotRef} opacity="0" data-pulse>
          <circle r="9" style={{ fill: "rgb(var(--stage) / 0.22)" }} />
          <circle r="3.5" style={{ fill: "rgb(var(--stage))" }} />
        </g>
      </svg>

      {/* Ends of the line, named like the Hero's trace */}
      <span
        aria-hidden="true"
        className="hud absolute -translate-y-1/2 pl-3 text-[0.625rem]"
        style={{ left: pct(L.taps[0][1][0], L.w), top: pct((L.taps[0][1][1] + L.nodes.sense[1]) / 2 - 6, L.h) }}
      >
        Signal in
      </span>
      <span
        aria-hidden="true"
        className="hud absolute -translate-y-1/2 pr-3 text-right text-[0.625rem]"
        style={{
          right: pct(L.w - L.taps[1][1][0], L.w),
          // Tall: just above the plate, clear of the stage label beside the node.
          top: pct(L.curve === "v" ? L.taps[1][1][1] - 12 : (L.taps[1][1][1] + L.nodes.experience[1]) / 2 + 6, L.h),
        }}
      >
        Interface out
      </span>

      <ol className="pointer-events-none absolute inset-0">
        {STAGES.map((stage) => {
          const [x, y, side] = L.nodes[stage.id];
          const on = active === stage.id;
          return (
            <li
              key={stage.id}
              data-node
              className={`stage-${stage.id} absolute h-0 w-0 ${on ? "z-10" : ""}`}
              style={{ left: pct(x, L.w), top: pct(y, L.h) }}
            >
              <button
                type="button"
                aria-pressed={pinned === stage.id}
                aria-label={`${stage.n} ${stage.name}: ${stage.title}`}
                aria-describedby={readoutId}
                {...handlers(stage.id, wire)}
                className={`pointer-events-auto absolute flex w-max items-center gap-3 rounded-full focus-visible:outline-offset-4 ${PLACEMENT[side]}`}
              >
                <Disc stage={stage} on={on} dim={!!active && !on} />
                <span
                  data-node-label
                  className={`rounded-md bg-background/85 px-1.5 py-1 transition-opacity duration-300 ${active && !on ? "opacity-55" : ""}`}
                >
                  <span className="hud block text-[rgb(var(--stage))]">
                    {stage.n} <span aria-hidden="true">·</span> {stage.name}
                  </span>
                  <span className="mt-0.5 block text-[0.9375rem] font-medium leading-tight tracking-[-0.01em] text-ink">
                    {stage.title}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
Canvas.propTypes = {
  layout: PropTypes.oneOf(Object.keys(LAYOUTS)).isRequired,
  active: PropTypes.string,
  pinned: PropTypes.string,
  wire: PropTypes.object.isRequired,
  readoutId: PropTypes.string.isRequired,
};

/** Below md: the same path as a vertical flow, every label and detail visible. */
const Stack = ({ active, pinned, wire }) => (
  <div data-canvas className="space-y-6">
    <Plate id="hardware" active={active} className="!relative block aspect-[2.3/1] w-full" />
    <ol className="relative space-y-5">
      <span aria-hidden="true" className="absolute bottom-6 left-[1.375rem] top-6 w-px -translate-x-1/2 bg-line" />
      <span
        aria-hidden="true"
        data-rail
        className="absolute bottom-6 left-[1.375rem] top-6 w-px origin-top -translate-x-1/2 signal-rail opacity-70"
      />
      {STAGES.map((stage) => {
        const on = active === stage.id;
        return (
          <li key={stage.id} data-node className={`stage-${stage.id} relative`}>
            <button
              type="button"
              aria-pressed={pinned === stage.id}
              {...handlers(stage.id, wire)}
              className="flex w-full items-start gap-4 rounded-lg text-left"
            >
              <Disc stage={stage} on={on} dim={!!active && !on} className="h-11 w-11" />
              <span className={`min-w-0 pt-0.5 transition-opacity duration-300 ${active && !on ? "opacity-60" : ""}`}>
                <span className="hud block text-[rgb(var(--stage))]">
                  {stage.n} <span aria-hidden="true">·</span> {stage.name}
                </span>
                <span className="mt-1 block text-lg font-medium leading-tight tracking-[-0.015em] text-ink">{stage.title}</span>
                <span className="mt-1.5 block text-[0.9375rem] leading-relaxed text-ink-dim">{stage.detail}</span>
              </span>
            </button>
            <ul aria-label={`${stage.name} parts`} className="mt-2.5 flex flex-wrap gap-1.5 pl-[3.75rem]">
              {stage.parts.map((p) => (
                <PartChip key={p.label} part={p} />
              ))}
            </ul>
          </li>
        );
      })}
    </ol>
    <Plate id="interface" active={active} className="!relative block aspect-[2.3/1] w-full" />
  </div>
);
Stack.propTypes = { active: PropTypes.string, pinned: PropTypes.string, wire: PropTypes.object.isRequired };

/**
 * Sense → Process → Connect → Experience, between a real hardware figure and
 * a real product screen. Understandable at rest; hover, focus or tap brings a
 * stage forward (disc, its wires, its plate callout) and the readout names
 * what happens there. Selection state lives in Statement so the matching
 * word in the statement can respond too.
 */
const SignalPath = ({ layout, active, pinned, setProbe, setPinned }) => {
  const wire = { setProbe, setPinned };
  const stage = active ? byId[active] : null;
  const readoutId = `${useId().replace(/:/g, "")}-readout`;

  const onBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setProbe(null);
  };

  if (layout === "stack") {
    return (
      <div onBlur={onBlur}>
        <Stack active={active} pinned={pinned} wire={wire} />
      </div>
    );
  }

  return (
    <div onBlur={onBlur}>
      <Canvas layout={layout} active={active} pinned={pinned} wire={wire} readoutId={readoutId} />
      <div
        id={readoutId}
        data-readout
        aria-live="polite"
        className={`mt-6 min-h-[6.5rem] border-t border-line pt-4 ${stage ? `stage-${stage.id}` : ""}`}
      >
        {stage ? (
          <>
            <p className="hud text-[rgb(var(--stage))]">
              {stage.n} / {stage.name} <span className="text-ink-dim">— {stage.title}</span>
            </p>
            <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-ink">{stage.detail}</p>
            <ul aria-label={`${stage.name} parts`} className="mt-3 flex flex-wrap gap-1.5">
              {stage.parts.map((p) => (
                <PartChip key={p.label} part={p} />
              ))}
            </ul>
          </>
        ) : (
          <>
            <p className="hud">Fig. 01 — Signal path, four stages</p>
            <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-ink-dim">
              One system from breadboard to browser. Hover, focus or tap a stage to trace the signal.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

SignalPath.propTypes = {
  layout: PropTypes.oneOf(["tall", "wide", "stack"]).isRequired,
  active: PropTypes.string,
  pinned: PropTypes.string,
  setProbe: PropTypes.func.isRequired,
  setPinned: PropTypes.func.isRequired,
};

export default SignalPath;
