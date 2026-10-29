import { Radio, Cpu, Cloud, Monitor, Activity, Code, Globe } from "lucide-react";
import { siArduino, siMongodb, siNodedotjs, siReact } from "simple-icons";

/**
 * The signal path, physical world → interface. Every part named here comes
 * from a shipped project (Ultrasonic Blind Stick, AttendEase); the id maps
 * to the per-stage colour tokens (.stage-* in index.css). `word` is the
 * statement word the stage belongs to, so selecting a stage points back at
 * it. `blurb` is the two-line caption under the stage name; `title`,
 * `detail` and `parts` surface in the readout when the stage is selected.
 */
export const STAGES = [
  {
    id: "sense",
    n: "01",
    name: "Sense",
    blurb: ["Sensors capture", "real-world data."],
    title: "Physical input",
    detail: "Ultrasonic ranging, GPS fixes and camera frames — signals read straight from the physical world.",
    parts: [{ label: "HC-SR04" }, { label: "Neo-6M GPS" }, { label: "Camera" }],
    Icon: Radio,
    pill: { label: "Sensors", Icon: Activity },
    word: "electronics",
  },
  {
    id: "process",
    n: "02",
    name: "Process",
    blurb: ["Embedded systems", "turn data into logic."],
    title: "Embedded logic",
    detail: "Firmware on an Arduino Nano smooths noisy readings and decides what is worth acting on.",
    parts: [{ label: "Arduino Nano", icon: siArduino }, { label: "Filtering" }, { label: "Sleep states" }],
    Icon: Cpu,
    pill: { label: "Firmware", Icon: Code },
    word: "electronics",
  },
  {
    id: "connect",
    n: "03",
    name: "Connect",
    blurb: ["Data flows through", "networks and APIs."],
    title: "Data & backend",
    detail: "GSM alerts, REST APIs and databases carry the signal onward to where it is needed.",
    parts: [{ label: "SIM800L GSM" }, { label: "Node.js", icon: siNodedotjs }, { label: "MongoDB", icon: siMongodb }],
    Icon: Cloud,
    pill: { label: "Cloud / Backend", Icon: Globe },
    word: "software",
  },
  {
    id: "experience",
    n: "04",
    name: "Experience",
    blurb: ["People interact with", "the final product."],
    title: "The interface",
    detail: "React interfaces where people finally meet the system — the part they actually touch.",
    parts: [{ label: "React", icon: siReact }, { label: "AttendEase" }],
    Icon: Monitor,
    pill: { label: "Web / App", to: "/projects/automated-attendance-system" },
    word: "interaction",
  },
];

/** The three readings above the stages, set like a signal chain. */
export const CHAIN = ["Physical signals", "Intelligent systems", "Meaningful interfaces"];
