import { Radar, Cpu, RadioTower, MonitorSmartphone } from "lucide-react";
import { siArduino, siMongodb, siNodedotjs, siReact } from "simple-icons";
import blindStickDiagram from "../../assets/projects/blind-stick.svg";
import attendeaseShot from "../../assets/projects/attendease.jpg";

/**
 * The signal path, physical world → interface. Every part named here comes
 * from a shipped project (Ultrasonic Blind Stick, AttendEase); `tone` maps to
 * the per-stage colour tokens (.stage-* in index.css). `word` is the
 * statement word the stage belongs to, so selecting a stage points back at it.
 */
export const STAGES = [
  {
    id: "sense",
    n: "01",
    name: "Sense",
    title: "Physical input",
    detail: "Ultrasonic ranging, GPS fixes and camera frames — signals read straight from the physical world.",
    parts: [{ label: "HC-SR04" }, { label: "Neo-6M GPS" }, { label: "Camera" }],
    Icon: Radar,
    word: "electronics",
  },
  {
    id: "process",
    n: "02",
    name: "Process",
    title: "Embedded logic",
    detail: "Firmware on an Arduino Nano smooths noisy readings and decides what is worth acting on.",
    parts: [{ label: "Arduino Nano", icon: siArduino }, { label: "Filtering" }, { label: "Sleep states" }],
    Icon: Cpu,
    word: "electronics",
  },
  {
    id: "connect",
    n: "03",
    name: "Connect",
    title: "Data & backend",
    detail: "GSM alerts, REST APIs and databases carry the signal onward to where it is needed.",
    parts: [{ label: "SIM800L GSM" }, { label: "Node.js", icon: siNodedotjs }, { label: "MongoDB", icon: siMongodb }],
    Icon: RadioTower,
    word: "software",
  },
  {
    id: "experience",
    n: "04",
    name: "Experience",
    title: "The interface",
    detail: "React interfaces where people finally meet the system — the part they actually touch.",
    parts: [{ label: "React", icon: siReact }, { label: "AttendEase" }],
    Icon: MonitorSmartphone,
    word: "interaction",
  },
];

/**
 * The two real ends of the path. Each plate is a crop (`view`, in the
 * source's own pixel space) of a genuine project figure, with optional
 * callouts that light when their stage is selected.
 */
export const PLATES = {
  hardware: {
    src: blindStickDiagram,
    size: [1600, 974],
    view: "200 330 760 330",
    label: "Ultrasonic Blind Stick — system diagram",
    alt: "System diagram of the Ultrasonic Blind Stick: an HC-SR04 ultrasonic sensor feeding an Arduino Nano.",
    callouts: { sense: [222, 379, 216, 216], process: [552, 366, 376, 242] },
    stages: ["sense", "process"],
  },
  interface: {
    src: attendeaseShot,
    size: [1600, 974],
    view: "100 150 1440 600",
    label: "AttendEase — live recognition UI",
    alt: "AttendEase interface: a live camera card marking attendance with 99.6% recognition confidence.",
    callouts: { experience: [1062, 214, 460, 424] },
    stages: ["connect", "experience"],
  },
};

/**
 * Canvas geometry per layout, in viewBox units. `nodes` are stage centres
 * with the side their label sits on; `plates` are [x, y, w, h]; `taps`
 * join a plate to its stage.
 *  tall  — desktop column beside the statement (zig-zag down)
 *  wide  — tablet, full width under the statement (wave across)
 */
export const LAYOUTS = {
  tall: {
    w: 400,
    h: 560,
    curve: "v",
    plates: { hardware: [0, 0, 330, 128], interface: [70, 432, 330, 128] },
    nodes: {
      sense: [44, 182, "right"],
      process: [346, 252, "left"],
      connect: [54, 322, "right"],
      experience: [346, 392, "left"],
    },
    taps: [
      ["hardware", [44, 128], "sense"],
      ["interface", [346, 432], "experience"],
    ],
  },
  wide: {
    w: 640,
    h: 380,
    curve: "h",
    plates: { hardware: [0, 0, 300, 130], interface: [340, 0, 300, 130] },
    nodes: {
      sense: [44, 210, "below-start"],
      process: [228, 270, "below"],
      connect: [412, 210, "below"],
      experience: [596, 270, "below-end"],
    },
    taps: [
      ["hardware", [44, 130], "sense"],
      ["interface", [596, 130], "experience"],
    ],
  },
};

/**
 * S-curve between two node centres. "v" leaves and arrives vertically (clear
 * of labels set beside the nodes); "h" horizontally (clear of labels below).
 */
export const segment = ([x1, y1], [x2, y2], curve = "h") => {
  if (curve === "v") {
    const my = (y1 + y2) / 2;
    return `M${x1} ${y1} C${x1} ${my} ${x2} ${my} ${x2} ${y2}`;
  }
  const mx = (x1 + x2) / 2;
  return `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;
};
