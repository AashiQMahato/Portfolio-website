// Dependency-free so any component can nudge the avatar without pulling the
// renderer into its chunk. Central, editable config for the navigator lives here.
export const AVATAR_REACT_EVENT = "avatar:react";

/** Play a short reaction (an animation key from aashik.avatar.json), then fall back to context. */
export const reactAvatar = (animation, ms = 3000) =>
  window.dispatchEvent(new CustomEvent(AVATAR_REACT_EVENT, { detail: { animation, ms } }));

/**
 * Logical behaviours → animation presets that exist in the exported
 * definition (src/assets/aashik.avatar.json). No preset is invented: where
 * the export has no exact match, the closest one is used.
 */
export const BEHAVIOR = {
  idle: "idle",
  greeting: "happy",
  curious: "curious",
  focused: "working",
  thinking: "thinking",
  warm: "happy",
  attentive: "listening",
  celebration: "celebrate",
};

/** Home sections → mood while that section holds the viewport's center band. */
export const SECTION_MOODS = {
  top: BEHAVIOR.idle,
  work: BEHAVIOR.curious,
  about: BEHAVIOR.thinking,
  experience: "proud",
  skills: BEHAVIOR.focused,
  writing: BEHAVIOR.thinking,
  contact: BEHAVIOR.warm,
};

const ROUTE_MOODS = [
  ["/projects", BEHAVIOR.curious],
  ["/blog", BEHAVIOR.thinking],
  ["/resume", "proud"],
  ["/now", "happy"],
  ["/timeline", BEHAVIOR.thinking],
  ["/developer-dashboard", BEHAVIOR.focused],
  ["/analytics", BEHAVIOR.focused],
];

/** Route → resting mood. Unknown paths are the 404 page. */
export const routeMood = (pathname) => {
  if (pathname === "/") return BEHAVIOR.idle;
  const hit = ROUTE_MOODS.find(([r]) => pathname === r || pathname.startsWith(`${r}/`));
  return hit ? hit[1] : "confused";
};

/** Navigator destinations: real home section ids, in page order. */
export const DESTINATIONS = [
  { id: "top", label: "Home" },
  { id: "work", label: "Projects" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Capabilities" },
  { id: "writing", label: "Writing" },
  { id: "contact", label: "Contact" },
];

/** One line the guide says the first time a section comes into view. */
export const SECTION_MESSAGES = {
  work: "See something interesting? Every build has a case study.",
  skills: "Let's explore the tools behind my work.",
  writing: "Here's how I think through technical problems.",
  contact: "Let's build something useful.",
};

export const TOUR_INVITE = "Want a quick tour of my portfolio?";

/** The optional tour: ~30 s across real sections, one line + mood per stop. */
export const TOUR_STEPS = [
  { id: "top", mood: BEHAVIOR.greeting, text: "Hi! I'm Aashik's guide — electronics engineer, full-stack developer." },
  { id: "work", mood: BEHAVIOR.curious, text: "Selected work: from AI tooling to assistive hardware." },
  { id: "skills", mood: BEHAVIOR.focused, text: "Capabilities: pick a discipline to trace each tool to real projects." },
  { id: "contact", mood: BEHAVIOR.warm, text: "That's the tour. Say hello any time — email is fastest." },
];
export const TOUR_STEP_MS = 7500;
