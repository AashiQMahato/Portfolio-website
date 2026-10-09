// Dependency-free so any component can nudge the avatar without pulling the
// renderer into its chunk. The companion (AIChatbot) listens for these.
export const AVATAR_REACT_EVENT = "avatar:react";

/** Play a short reaction (an animation key from aashik.avatar.json), then fall back to context. */
export const reactAvatar = (animation, ms = 3000) =>
  window.dispatchEvent(new CustomEvent(AVATAR_REACT_EVENT, { detail: { animation, ms } }));

/** Home sections → mood while that section holds the viewport's center band. */
export const SECTION_MOODS = {
  top: "idle",
  work: "curious",
  about: "happy",
  experience: "proud",
  skills: "working",
  writing: "listening",
  contact: "excited",
};

const ROUTE_MOODS = [
  ["/projects", "curious"],
  ["/blog", "listening"],
  ["/resume", "proud"],
  ["/now", "happy"],
  ["/timeline", "thinking"],
  ["/developer-dashboard", "working"],
  ["/analytics", "working"],
];

/** Route → resting mood. Unknown paths are the 404 page. */
export const routeMood = (pathname) => {
  if (pathname === "/") return "idle";
  const hit = ROUTE_MOODS.find(([r]) => pathname === r || pathname.startsWith(`${r}/`));
  return hit ? hit[1] : "confused";
};
