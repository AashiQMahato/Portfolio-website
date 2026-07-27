import { useLayoutEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Two board finishes so the hero sits correctly on either ground: a dark
// solder-mask on the near-black theme, a pale mask on the light theme.
const PALETTE = {
  dark: {
    signal: "#53E9C5",
    ember: "#FFB454",
    board: "#0D1411",
    chip: "#161C24",
    pad: "#39424F",
  },
  // On the light ground a pale board washes out, so the light theme uses a
  // dark FR-4 green solder-mask — how a real PCB actually looks — which reads
  // as deliberate against white and keeps the traces legible.
  light: {
    signal: "#3FD9AE",
    ember: "#FFB454",
    board: "#14342A",
    chip: "#0E241D",
    pad: "#C9A227",
  },
};

const BOARD_SIZE = [3.2, 0.08, 2.0];
const TRACE_Y = 0.052;

// L-shaped trace runs on the board surface as [x, z] waypoint lists.
// End points land on chip footprints so the copper reads as intentional.
const TRACES = [
  [
    [-1.45, -0.7],
    [-0.4, -0.7],
    [-0.4, 0.2],
  ],
  [
    [-1.3, 0.8],
    [-0.1, 0.8],
    [-0.1, 0.38],
  ],
  [
    [1.4, -0.8],
    [0.6, -0.8],
    [0.6, -0.15],
  ],
  [
    [1.45, 0.7],
    [0.9, 0.7],
    [0.9, 0.1],
    [0.5, 0.1],
  ],
  [
    [-1.45, 0.1],
    [-0.85, 0.1],
    [-0.85, -0.35],
  ],
  [
    [0.2, -0.95],
    [0.2, -0.5],
    [-0.18, -0.5],
  ],
];

const CHIPS = [
  { pos: [-0.4, 0.2], size: [0.52, 0.1, 0.52], core: true },
  { pos: [0.6, -0.15], size: [0.36, 0.08, 0.36] },
  { pos: [-0.85, -0.35], size: [0.28, 0.06, 0.42] },
  { pos: [0.9, 0.55], size: [0.22, 0.05, 0.22] },
];

// Deterministic via positions (golden-angle spiral keeps them uncluttered).
const VIAS = Array.from({ length: 26 }, (_, i) => {
  const a = i * 2.399963;
  const r = 0.18 + (i / 26) * 1.15;
  return [Math.cos(a) * r * 1.35, Math.sin(a) * r * 0.78];
});

/** Per-segment boxes for one trace path. */
const traceSegments = (path, width = 0.022) => {
  const segments = [];
  for (let i = 0; i < path.length - 1; i += 1) {
    const [x1, z1] = path[i];
    const [x2, z2] = path[i + 1];
    const dx = x2 - x1;
    const dz = z2 - z1;
    const len = Math.hypot(dx, dz);
    segments.push({
      pos: [(x1 + x2) / 2, TRACE_Y, (z1 + z2) / 2],
      size: dx !== 0 ? [len + width, 0.012, width] : [width, 0.012, len + width],
    });
  }
  return segments;
};

// The pulse rides the longest trace, out and back, forever.
const PULSE_PATH = TRACES[3];
const PULSE_LENGTHS = PULSE_PATH.slice(1).map((p, i) =>
  Math.hypot(p[0] - PULSE_PATH[i][0], p[1] - PULSE_PATH[i][1]),
);
const PULSE_TOTAL = PULSE_LENGTHS.reduce((a, b) => a + b, 0);

const pulsePosition = (t) => {
  let d = t * PULSE_TOTAL;
  for (let i = 0; i < PULSE_LENGTHS.length; i += 1) {
    if (d <= PULSE_LENGTHS[i]) {
      const f = PULSE_LENGTHS[i] === 0 ? 0 : d / PULSE_LENGTHS[i];
      const [x1, z1] = PULSE_PATH[i];
      const [x2, z2] = PULSE_PATH[i + 1];
      return [x1 + (x2 - x1) * f, z1 + (z2 - z1) * f];
    }
    d -= PULSE_LENGTHS[i];
  }
  return PULSE_PATH[PULSE_PATH.length - 1];
};

/**
 * Stylized PCB built from primitives: one board slab, merged-per-segment
 * emissive traces, a few chips, instanced vias, a blinking LED, and a
 * signal pulse riding the longest trace. ~2k triangles, no textures.
 */
const CircuitBoard = ({ theme = "dark" }) => {
  const C = PALETTE[theme] || PALETTE.dark;
  const glow = 0.9;
  const viasRef = useRef(null);
  const pulseRef = useRef(null);
  const ledRef = useRef(null);
  const boardRef = useRef(null);

  const segments = useMemo(() => TRACES.flatMap((t) => traceSegments(t)), []);

  useLayoutEffect(() => {
    const mesh = viasRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    VIAS.forEach(([x, z], i) => {
      dummy.position.set(x, 0.045, z);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    // Idle bob — the whole board breathes slightly.
    if (boardRef.current) {
      boardRef.current.position.y = Math.sin(t * 0.6) * 0.04;
    }
    // Signal pulse: eased loop along the trace.
    if (pulseRef.current) {
      const phase = (t * 0.22) % 1;
      const [x, z] = pulsePosition(phase);
      pulseRef.current.position.set(x, TRACE_Y + 0.015, z);
      pulseRef.current.material.opacity = Math.min(1, Math.sin(phase * Math.PI) * 2);
    }
    // Amber status LED blink.
    if (ledRef.current) {
      ledRef.current.material.emissiveIntensity = 1.5 + Math.sin(t * 2.4) * 1.2;
    }
  });

  return (
    <group ref={boardRef}>
      {/* Board slab */}
      <mesh>
        <boxGeometry args={BOARD_SIZE} />
        <meshStandardMaterial color={C.board} roughness={0.85} metalness={0.15} />
      </mesh>

      {/* Emissive copper traces */}
      {segments.map((seg, i) => (
        <mesh key={i} position={seg.pos}>
          <boxGeometry args={seg.size} />
          <meshStandardMaterial
            color={C.signal}
            emissive={C.signal}
            emissiveIntensity={glow}
            toneMapped={false}
            roughness={0.4}
          />
        </mesh>
      ))}

      {/* Chips */}
      {CHIPS.map((chip, i) => (
        <group key={i} position={[chip.pos[0], 0.04 + chip.size[1] / 2, chip.pos[1]]}>
          <mesh>
            <boxGeometry args={chip.size} />
            <meshStandardMaterial color={C.chip} roughness={0.55} metalness={0.35} />
          </mesh>
          {chip.core ? (
            <mesh position={[0, chip.size[1] / 2 + 0.005, 0]}>
              <boxGeometry args={[0.2, 0.01, 0.2]} />
              <meshStandardMaterial
                color={C.signal}
                emissive={C.signal}
                emissiveIntensity={glow * 0.8}
                toneMapped={false}
              />
            </mesh>
          ) : null}
        </group>
      ))}

      {/* Instanced vias */}
      <instancedMesh ref={viasRef} args={[undefined, undefined, VIAS.length]}>
        <cylinderGeometry args={[0.018, 0.018, 0.014, 10]} />
        <meshStandardMaterial color={C.pad} roughness={0.35} metalness={0.7} />
      </instancedMesh>

      {/* Status LED */}
      <mesh ref={ledRef} position={[1.3, 0.06, -0.75]}>
        <boxGeometry args={[0.05, 0.03, 0.05]} />
        <meshStandardMaterial
          color={C.ember}
          emissive={C.ember}
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>

      {/* Signal pulse */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.028, 12, 12]} />
        <meshBasicMaterial color={C.signal} transparent toneMapped={false} />
      </mesh>
    </group>
  );
};

CircuitBoard.propTypes = {
  theme: PropTypes.oneOf(["dark", "light"]),
};

export default CircuitBoard;
