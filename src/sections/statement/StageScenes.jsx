import { useId } from "react";
import PropTypes from "prop-types";
import { RadioTower } from "lucide-react";
import { siMongodb, siNodedotjs } from "simple-icons";
import attendeaseShot from "../../assets/projects/attendease.jpg";

/*
 * The four product plates under the stages. The hardware is drawn, not
 * stock: the HC-SR04 on a breadboard and the Arduino Nano are the parts the
 * Ultrasonic Blind Stick is built from, set in a fixed oblique projection so
 * they read as objects on a bench. Connect carries the real backend marks;
 * Experience frames the real AttendEase screen.
 *
 * Each scene is static SVG/HTML — the motion (mask reveal, parallax, the
 * lift on selection) is applied from outside on [data-scene].
 */

/** Oblique projection: P(x, y, z) = o + x·u + y·v + z·w, in SVG units. */
const projector = (o, u, v, w) => (x, y, z = 0) => [
  o[0] + x * u[0] + y * v[0] + z * w[0],
  o[1] + x * u[1] + y * v[1] + z * w[1],
];
const pts = (P, list) => list.map(([x, y, z]) => P(x, y, z).map((n) => n.toFixed(2)).join(",")).join(" ");
const range = (a, b, step) => Array.from({ length: Math.floor((b - a) / step) + 1 }, (_, i) => a + i * step);

/* ── 01 Sense: HC-SR04 standing in a breadboard, jumpers looping out ── */

const SENSE = projector([46, 128], [1.32, 0.2], [-0.52, 0.5], [0, -1.55]);
const BB = { w: 104, d: 54, t: 5 };
// Two power rails at each edge, two terminal blocks of five either side of the channel.
const holeRows = [4.5, 7.5, ...range(13, 23, 2.5), ...range(31, 41, 2.5), 46.5, 49.5];
const holeCols = range(6, 98, 4.6);
const TRANSDUCERS = [38, 66];
// Header pins sit behind the module; each lead loops up over it and lands in a hole.
const WIRES = [
  { c: "#ef4444", from: [49, 16], to: [96, 13], h: 44 },
  { c: "#f97316", from: [52, 16], to: [90, 15.5], h: 38 },
  { c: "#facc15", from: [55, 16], to: [84, 18], h: 32 },
  { c: "#22c55e", from: [58, 16], to: [78, 20.5], h: 27 },
  { c: "#3b82f6", from: [46, 16], to: [8, 4.5], h: 36 },
  { c: "#a855f7", from: [43, 16], to: [14, 7.5], h: 30 },
];

const wirePath = ({ from, to, h }) => {
  const a = SENSE(from[0], from[1], 2);
  const c1 = SENSE(from[0], from[1] - 2, h + 12);
  const c2 = SENSE(to[0], to[1], h + 4);
  const b = SENSE(to[0], to[1], 0.5);
  return `M${a} C${c1} ${c2} ${b}`;
};

const SenseScene = () => {
  const id = useId().replace(/:/g, "");
  const [rx, ry] = [1.32 * 9.5, 9.5 * 1.55];
  const tilt = (Math.atan2(0.2, 1.32) * 180) / Math.PI;
  return (
    <svg viewBox="22 34 156 182" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-mesh`} cx="0.45" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#5b6170" />
          <stop offset="0.55" stopColor="#1c1f27" />
          <stop offset="1" stopColor="#0c0d12" />
        </radialGradient>
        <linearGradient id={`${id}-can`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4f6fa" />
          <stop offset="0.45" stopColor="#a9b0bd" />
          <stop offset="1" stopColor="#5d6472" />
        </linearGradient>
        <linearGradient id={`${id}-pcb`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2563c9" />
          <stop offset="1" stopColor="#173f8a" />
        </linearGradient>
        <linearGradient id={`${id}-board`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eef0f3" />
          <stop offset="1" stopColor="#b9bec8" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="0.6" r="0.5">
          <stop offset="0" stopColor="rgb(45 212 191)" stopOpacity="0.35" />
          <stop offset="1" stopColor="rgb(45 212 191)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="100" cy="165" rx="105" ry="40" fill={`url(#${id}-glow)`} />

      {/* Breadboard: sides, then the top face with rails and holes */}
      <polygon points={pts(SENSE, [[0, BB.d, 0], [BB.w, BB.d, 0], [BB.w, BB.d, -BB.t], [0, BB.d, -BB.t]])} fill="#8d939e" />
      <polygon points={pts(SENSE, [[BB.w, 0, 0], [BB.w, BB.d, 0], [BB.w, BB.d, -BB.t], [BB.w, 0, -BB.t]])} fill="#6b707a" />
      <polygon points={pts(SENSE, [[0, 0, 0], [BB.w, 0, 0], [BB.w, BB.d, 0], [0, BB.d, 0]])} fill={`url(#${id}-board)`} />
      <polygon points={pts(SENSE, [[2, 26, 0.01], [BB.w - 2, 26, 0.01], [BB.w - 2, 28, 0.01], [2, 28, 0.01]])} fill="#a3a9b4" />
      {[
        [2.8, "#e5484d"],
        [9.2, "#3b82f6"],
        [44.8, "#e5484d"],
        [51.2, "#3b82f6"],
      ].map(([y, c]) => (
        <line key={y} x1={SENSE(4, y)[0]} y1={SENSE(4, y)[1]} x2={SENSE(BB.w - 4, y)[0]} y2={SENSE(BB.w - 4, y)[1]} stroke={c} strokeWidth="0.7" opacity="0.8" />
      ))}
      <g fill="#3b3f48">
        {holeRows.flatMap((r) =>
          holeCols.map((c) => {
            const [x, y] = SENSE(c, r);
            return <rect key={`${r}-${c}`} x={x - 0.8} y={y - 0.45} width="1.6" height="0.9" rx="0.3" />;
          }),
        )}
      </g>
      {/* status LED on the rail */}
      <circle cx={SENSE(96, 12)[0]} cy={SENSE(96, 12)[1] - 1.5} r="5" fill="rgb(45 212 191)" opacity="0.25" />
      <circle cx={SENSE(96, 12)[0]} cy={SENSE(96, 12)[1] - 1.5} r="1.6" fill="#7fffe6" />

      {/* Jumpers behind the module: a darker body with a thin highlight reads as insulation */}
      {WIRES.map((w) => (
        <g key={w.c} fill="none" strokeLinecap="round">
          <path d={wirePath(w)} stroke={w.c} strokeWidth="2.4" />
          <path d={wirePath(w)} stroke="#fff" strokeOpacity="0.35" strokeWidth="0.6" transform="translate(-0.5 -0.6)" />
        </g>
      ))}

      {/* Header pins into the board */}
      {[49, 52, 55, 58].map((x) => (
        <line key={x} x1={SENSE(x, 19)[0]} y1={SENSE(x, 19)[1]} x2={SENSE(x, 19, 7)[0]} y2={SENSE(x, 19, 7)[1]} stroke="#d9b45a" strokeWidth="1.2" />
      ))}
      <polygon points={pts(SENSE, [[46.5, 19, 0], [60.5, 19, 0], [60.5, 19, 3], [46.5, 19, 3]])} fill="#111318" />

      {/* HC-SR04: PCB edge, face, crystal, silkscreen */}
      <polygon points={pts(SENSE, [[20, 18, 6], [84, 18, 6], [84, 20, 6], [84, 20, 34], [20, 20, 34], [20, 18, 34]])} fill="#0f2f6b" />
      <polygon points={pts(SENSE, [[20, 20, 6], [84, 20, 6], [84, 20, 34], [20, 20, 34]])} fill={`url(#${id}-pcb)`} stroke="#5d8fe8" strokeWidth="0.4" />
      <polygon points={pts(SENSE, [[48, 20.1, 27], [56, 20.1, 27], [56, 20.1, 31.5], [48, 20.1, 31.5]])} fill="#c9ced8" />
      <text
        transform={`translate(${SENSE(41, 20.1, 8.5)}) rotate(${tilt})`}
        fontSize="4.2"
        fill="#dbe7ff"
        opacity="0.8"
        fontFamily="ui-monospace, monospace"
        letterSpacing="0.4"
      >
        HC-SR04
      </text>

      {/* Transducers: a short stack of ellipses makes the can, then its face */}
      {TRANSDUCERS.map((cx) => {
        const steps = range(0, 9, 1.5);
        return (
          <g key={cx}>
            {steps.map((d) => {
              const [x, y] = SENSE(cx, 20 + d, 18);
              return <ellipse key={d} cx={x} cy={y} rx={rx} ry={ry} transform={`rotate(${tilt} ${x} ${y})`} fill={`url(#${id}-can)`} />;
            })}
            {(() => {
              const [x, y] = SENSE(cx, 29.5, 18);
              return (
                <g transform={`rotate(${tilt} ${x} ${y})`}>
                  <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#d7dbe3" />
                  <ellipse cx={x} cy={y} rx={rx * 0.8} ry={ry * 0.8} fill={`url(#${id}-mesh)`} />
                  <ellipse cx={x} cy={y} rx={rx * 0.8} ry={ry * 0.8} fill="none" stroke="#7d8493" strokeWidth="0.3" strokeDasharray="0.6 0.9" />
                  <ellipse cx={x - rx * 0.3} cy={y - ry * 0.35} rx={rx * 0.22} ry={ry * 0.12} fill="#fff" opacity="0.35" />
                </g>
              );
            })()}
          </g>
        );
      })}
    </svg>
  );
};

/* ── 02 Process: an Arduino Nano lying on the bench at an angle ── */

const NANO = projector([22, 148], [2.05, -0.82], [0.92, 1.12], [0, -1.6]);
const N = { w: 70, d: 28, t: 1.8 };

const ProcessScene = () => {
  const id = useId().replace(/:/g, "");
  const top = (x, y, h = 0) => NANO(x, y, N.t + h);
  const box = (x, y, w, d, h, z0 = 0) => ({
    top: pts(NANO, [[x, y, N.t + z0 + h], [x + w, y, N.t + z0 + h], [x + w, y + d, N.t + z0 + h], [x, y + d, N.t + z0 + h]]),
    front: pts(NANO, [[x, y + d, N.t + z0], [x + w, y + d, N.t + z0], [x + w, y + d, N.t + z0 + h], [x, y + d, N.t + z0 + h]]),
    side: pts(NANO, [[x, y, N.t + z0], [x, y + d, N.t + z0], [x, y + d, N.t + z0 + h], [x, y, N.t + z0 + h]]),
  });
  const chip = box(29, 8, 12, 12, 1.4);
  const usb = box(-3, 9.5, 9, 9, 4.2);
  const button = box(48, 11, 6, 6, 1.6);
  const xtal = box(18, 4, 7, 3.2, 2);
  const pins = range(5, 64, 4.2);
  const planeText = (x, y) => {
    const [ox, oy] = top(x, y, 0.05);
    const s = 1 / Math.hypot(2.05, 0.82);
    return `matrix(${2.05 * s} ${-0.82 * s} ${0.92 * s} ${1.12 * s} ${ox} ${oy})`;
  };
  return (
    <svg viewBox="14 42 176 205" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="0.55" r="0.5">
          <stop offset="0" stopColor="rgb(77 144 255)" stopOpacity="0.45" />
          <stop offset="1" stopColor="rgb(77 144 255)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-pcb`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#0c1324" />
          <stop offset="1" stopColor="#13213f" />
        </linearGradient>
        <linearGradient id={`${id}-steel`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eef1f6" />
          <stop offset="1" stopColor="#7c8494" />
        </linearGradient>
        <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>

      <ellipse cx="100" cy="130" rx="100" ry="58" fill={`url(#${id}-glow)`} />
      {/* contact shadow */}
      <polygon points={pts(NANO, [[2, 3, -6], [N.w + 4, 3, -6], [N.w + 4, N.d + 5, -6], [2, N.d + 5, -6]])} fill="#000" opacity="0.55" filter={`url(#${id}-blur)`} />

      {/* Header legs under both long edges */}
      {pins.map((x) => (
        <g key={x} stroke="#c9a24a" strokeWidth="0.9">
          <line x1={NANO(x, N.d - 1.5, 0)[0]} y1={NANO(x, N.d - 1.5, 0)[1]} x2={NANO(x, N.d - 1.5, -5)[0]} y2={NANO(x, N.d - 1.5, -5)[1]} />
          <line x1={NANO(x, 1.5, 0)[0]} y1={NANO(x, 1.5, 0)[1]} x2={NANO(x, 1.5, -5)[0]} y2={NANO(x, 1.5, -5)[1]} opacity="0.5" />
        </g>
      ))}
      <polygon points={pts(NANO, [[3, N.d - 2.6, -2.5], [66, N.d - 2.6, -2.5], [66, N.d - 0.4, -2.5], [66, N.d - 0.4, 0], [3, N.d - 0.4, 0], [3, N.d - 0.4, -2.5]])} fill="#07080c" />

      {/* PCB: edge faces, then the top */}
      <polygon points={pts(NANO, [[0, N.d, 0], [N.w, N.d, 0], [N.w, N.d, N.t], [0, N.d, N.t]])} fill="#1d3d7a" />
      <polygon points={pts(NANO, [[0, 0, 0], [0, N.d, 0], [0, N.d, N.t], [0, 0, N.t]])} fill="#16305f" />
      <polygon
        points={pts(NANO, [[0, 0, N.t], [N.w, 0, N.t], [N.w, N.d, N.t], [0, N.d, N.t]])}
        fill={`url(#${id}-pcb)`}
        stroke="rgb(77 144 255)"
        strokeOpacity="0.75"
        strokeWidth="0.6"
      />

      {/* Traces */}
      <g fill="none" stroke="rgb(77 144 255)" strokeOpacity="0.28" strokeWidth="0.45">
        {[
          [[10, 4], [16, 4], [22, 10], [29, 10]],
          [[8, 24], [20, 24], [26, 18], [29, 18]],
          [[41, 12], [46, 12], [48, 14]],
          [[41, 16], [56, 16], [60, 22], [64, 22]],
          [[35, 20], [35, 25], [50, 25]],
        ].map((line, i) => (
          <polyline key={i} points={line.map(([x, y]) => top(x, y, 0.02).join(",")).join(" ")} />
        ))}
      </g>

      {/* Pads along both edges */}
      {pins.flatMap((x) =>
        [1.6, N.d - 1.6].map((y) => {
          const [cx, cy] = top(x, y, 0.05);
          return <ellipse key={`${x}-${y}`} cx={cx} cy={cy} rx="1.6" ry="1.1" fill="#d6ad55" stroke="#7b5d1d" strokeWidth="0.3" />;
        }),
      )}

      {/* SMD passives */}
      {[
        [14, 14],
        [14, 18],
        [22, 20],
        [45, 21],
        [58, 8],
        [61, 8],
      ].map(([x, y]) => (
        <polygon key={`${x}${y}`} points={pts(NANO, [[x, y, N.t + 0.6], [x + 2.4, y, N.t + 0.6], [x + 2.4, y + 1.2, N.t + 0.6], [x, y + 1.2, N.t + 0.6]])} fill="#8a6b4a" />
      ))}

      {/* Crystal, MCU, reset button, USB */}
      <polygon points={xtal.front} fill="#6b7280" />
      <polygon points={xtal.top} fill={`url(#${id}-steel)`} />
      <g stroke="#9aa3b2" strokeWidth="0.35">
        {range(9.5, 18.5, 1.5).flatMap((t) => [
          <line key={`l${t}`} x1={top(28, t, 0.4)[0]} y1={top(28, t, 0.4)[1]} x2={top(29.4, t, 0.4)[0]} y2={top(29.4, t, 0.4)[1]} />,
          <line key={`r${t}`} x1={top(40.6, t, 0.4)[0]} y1={top(40.6, t, 0.4)[1]} x2={top(42, t, 0.4)[0]} y2={top(42, t, 0.4)[1]} />,
          <line key={`t${t}`} x1={top(t + 20, 7, 0.4)[0]} y1={top(t + 20, 7, 0.4)[1]} x2={top(t + 20, 8.4, 0.4)[0]} y2={top(t + 20, 8.4, 0.4)[1]} />,
          <line key={`b${t}`} x1={top(t + 20, 19.6, 0.4)[0]} y1={top(t + 20, 19.6, 0.4)[1]} x2={top(t + 20, 21, 0.4)[0]} y2={top(t + 20, 21, 0.4)[1]} />,
        ])}
      </g>
      <polygon points={chip.front} fill="#050608" />
      <polygon points={chip.top} fill="#14161c" stroke="#2a2e38" strokeWidth="0.3" />
      <circle cx={top(30.8, 9.8, 1.45)[0]} cy={top(30.8, 9.8, 1.45)[1]} r="0.7" fill="#2e333d" />
      <text transform={planeText(31, 15.5)} fontSize="2.2" fill="#9aa3b2" fontFamily="ui-monospace, monospace">
        ATMEGA328P
      </text>
      <polygon points={button.front} fill="#9aa3b2" />
      <polygon points={button.top} fill="#e5e7eb" />
      <circle cx={top(51, 14, 1.65)[0]} cy={top(51, 14, 1.65)[1]} r="1.6" fill="#2b2f37" />
      <polygon points={usb.side} fill="#5c6372" />
      <polygon points={usb.front} fill="#8a92a1" />
      <polygon points={usb.top} fill={`url(#${id}-steel)`} />

      {/* Status LEDs — one lit */}
      {[[57, 23, "#3a3f4a"], [60, 23, "#3a3f4a"], [63, 23, "#60a5fa"]].map(([x, y, c]) => {
        const [cx, cy] = top(x, y, 0.5);
        return (
          <g key={x}>
            {c !== "#3a3f4a" && <circle cx={cx} cy={cy} r="6" fill="#60a5fa" opacity="0.35" filter={`url(#${id}-blur)`} />}
            <ellipse cx={cx} cy={cy} rx="1.3" ry="0.9" fill={c} />
          </g>
        );
      })}

      <text transform={planeText(8, 21.5)} fontSize="3.2" fill="#e6ecff" opacity="0.85" fontFamily="ui-monospace, monospace" letterSpacing="0.3">
        NANO
      </text>
      <text transform={planeText(46, 6.2)} fontSize="2" fill="#e6ecff" opacity="0.55" fontFamily="ui-monospace, monospace">
        D13 3V3 REF A0
      </text>
    </svg>
  );
};

/* ── 03 Connect: the cloud over the real backend stack ── */

const Mark = ({ icon, label }) => (
  <svg viewBox="0 0 24 24" role="img" aria-label={label} className="h-[42%] w-[42%]">
    <path d={icon.path} fill="currentColor" />
  </svg>
);
Mark.propTypes = { icon: PropTypes.object.isRequired, label: PropTypes.string.isRequired };

const ConnectScene = () => {
  const id = useId().replace(/:/g, "");
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-end pb-[14%]">
      <svg viewBox="0 0 120 80" aria-hidden="true" className="absolute left-1/2 top-[8%] w-[62%] -translate-x-1/2 overflow-visible">
        <defs>
          <linearGradient id={`${id}-c`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7cc4ff" />
            <stop offset="0.6" stopColor="#4d90ff" />
            <stop offset="1" stopColor="#9d7dff" />
          </linearGradient>
          <filter id={`${id}-glow`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
        </defs>
        {[
          ["M30 66 H92 a18 18 0 0 0 1-36 a26 26 0 0 0-49-6 a20 20 0 0 0-14 42z", 0],
        ].map(([d]) => (
          <g key={d}>
            <path d={d} fill="rgb(77 144 255 / 0.12)" stroke={`url(#${id}-c)`} strokeWidth="5" opacity="0.6" filter={`url(#${id}-glow)`} />
            <path d={d} fill="rgb(77 144 255 / 0.08)" stroke={`url(#${id}-c)`} strokeWidth="2.2" strokeLinejoin="round" />
          </g>
        ))}
        {/* uplinks into the tiles */}
        <g stroke="rgb(157 125 255)" strokeOpacity="0.5" strokeWidth="1" strokeDasharray="2 3">
          <path d="M44 68 V84" />
          <path d="M60 68 V84" />
          <path d="M76 68 V84" />
        </g>
      </svg>
      <ul className="relative grid w-[86%] grid-cols-3 gap-[6%] rounded-xl border border-[rgb(var(--stage)/0.45)] bg-[rgb(10_11_20/0.75)] p-[6%] shadow-[0_0_40px_-12px_rgb(var(--stage)/0.6),inset_0_1px_0_rgb(255_255_255/0.06)] backdrop-blur-sm">
        {[
          { label: "SIM800L GSM", node: <RadioTower aria-hidden="true" strokeWidth={1.6} className="h-[46%] w-[46%]" /> },
          { label: "Node.js", node: <Mark icon={siNodedotjs} label="Node.js" /> },
          { label: "MongoDB", node: <Mark icon={siMongodb} label="MongoDB" /> },
        ].map((t) => (
          <li
            key={t.label}
            title={t.label}
            className="grid aspect-square place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-ink"
          >
            {t.node}
            {t.label === "SIM800L GSM" && <span className="sr-only">{t.label}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

/* ── 04 Experience: the AttendEase screen on a laptop ── */

const ExperienceScene = () => (
  <div className="relative h-full w-full [perspective:900px]">
    <div className="absolute inset-x-0 bottom-[20%] h-1/3 rounded-full bg-[rgb(var(--stage)/0.35)] blur-3xl" aria-hidden="true" />
    <div className="absolute bottom-[16%] left-[-2%] w-[106%] xl:w-[128%] origin-bottom-left [transform:rotateY(-16deg)_rotateX(2deg)]">
      <div className="relative rounded-t-[0.6rem] border border-white/15 bg-[#0b0c12] p-[2.2%] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.9)]">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[0.25rem] bg-black">
          <img
            src={attendeaseShot}
            alt="AttendEase, the automated attendance web app, marking a student present from a live camera feed"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-left-top"
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgb(255_255_255/0.12),transparent_40%)]" />
        </div>
      </div>
      <div aria-hidden="true" className="relative mx-[-5%] h-[0.7rem] rounded-b-[0.8rem] bg-gradient-to-b from-[#9aa0ad] to-[#3b3f49] [clip-path:polygon(2%_0,98%_0,100%_100%,0_100%)]">
        <span className="absolute left-1/2 top-0 h-[35%] w-[16%] -translate-x-1/2 rounded-b-md bg-[#5b606c]" />
      </div>
    </div>
  </div>
);

export { SenseScene, ProcessScene, ConnectScene, ExperienceScene };
