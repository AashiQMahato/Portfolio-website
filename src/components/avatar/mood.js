// Dependency-free so any component can nudge the companion without pulling
// the renderer into its chunk. All editable copy for the companion lives here.
export const AVATAR_REACT_EVENT = "avatar:react";
export const AVATAR_SAY_EVENT = "avatar:say";

/** Play a short reaction (an animation key from aashik.avatar.json), then fall back to context. */
export const reactAvatar = (animation, ms = 3000) =>
  window.dispatchEvent(new CustomEvent(AVATAR_REACT_EVENT, { detail: { animation, ms } }));

/** Ask the companion to say one line (ignored in quiet mode). `context` carries ids, e.g. { capability }. */
export const sayAvatar = (text, { mood, context } = {}) =>
  window.dispatchEvent(new CustomEvent(AVATAR_SAY_EVENT, { detail: { text, mood, context } }));

/**
 * Logical behaviours → animation presets that exist in the exported
 * definition (src/assets/aashik.avatar.json). Nothing here is invented.
 */
export const BEHAVIOR = {
  idle: "idle",
  greeting: "happy",
  curious: "curious",
  thinking: "thinking",
  focused: "working",
  playful: "playful",
  warm: "happy",
  attentive: "listening",
  celebration: "celebrate",
};

/** Clicking the character: the first line, then playful replies in turn. */
export const GREETING = "Hey! What are we exploring today?";
export const PLAYFUL = [
  "Still here. Still curious.",
  "I'm mostly sphere, partly helpful.",
  "Poke me once more and I'll recite resistor colour codes.",
];

/** "Tell me about this section" — one line per section id. */
export const SECTION_ABOUT = {
  top: "Aashik: electronics engineer and full-stack developer. Hardware in, interfaces out.",
  work: "Five featured builds — AI tooling, computer vision, product web, school ops, assistive hardware.",
  about: "How an electronics degree turned into building the software on top of it.",
  experience: "Roles and study so far: frontend work, technical writing, and the engineering degree.",
  skills: "Six disciplines; pick one and every tool traces back to a real project.",
  writing: "Notes from the workbench: IoT dashboards and UI motion.",
  contact: "Email is fastest — replies usually within 24 hours.",
};

/** Said once, after the visitor has settled in a section (never on a fly-by). */
export const ARRIVAL = {
  work: "Need a recommendation?",
  about: "Hardware first, software on top — that's the whole story.",
  skills: "Curious how these tools get used? Pick a discipline.",
  contact: "Ready to say hello?",
};

/** Hovering a project. Specific where the project data supports it. */
export const PROJECT_LINES = {
  "studio-tools": "Background removal, OCR, PDF tools — one toolbox.",
  "automated-attendance-system": "Faces in, attendance out. YOLOv8 + FaceNet.",
  "cable-network-website": "An ISP site: plans, coverage and a live network visual.",
  "smart-school-management": "Four dashboards, one school. Admin to parent.",
  "ultrasonic-blind-stick": "Hardware! Ultrasonic sensing with GSM/GPS alerts.",
};
export const PROJECT_FALLBACK = "Ooh, this one has a story. Go on, click it.";

/** Choosing a capability in the Capabilities lab. */
export const CAPABILITY_LINES = {
  web: "Making pixels behave. Nice.",
  backend: "The mysterious machinery.",
  ai: "Teaching cameras to recognise faces.",
  embedded: "Small devices. Big responsibilities.",
  iot: "Sensors that phone home.",
  tools: "The workbench essentials.",
};

/** Secondary shortcut list (real home section ids, in page order). */
export const DESTINATIONS = [
  { id: "top", label: "Home" },
  { id: "work", label: "Projects" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Capabilities" },
  { id: "writing", label: "Writing" },
  { id: "contact", label: "Contact" },
];

/** The optional tour (started only from the character's own actions). */
export const TOUR_STEPS = [
  { id: "top", mood: BEHAVIOR.greeting, text: "Hi! I'm Aashik's sidekick — electronics engineer, full-stack developer." },
  { id: "work", mood: BEHAVIOR.curious, text: "Selected work: from AI tooling to assistive hardware." },
  { id: "skills", mood: BEHAVIOR.focused, text: "Capabilities: pick a discipline to trace each tool to real projects." },
  { id: "contact", mood: BEHAVIOR.warm, text: "That's the tour. Say hello any time — email is fastest." },
];
export const TOUR_STEP_MS = 7500;
