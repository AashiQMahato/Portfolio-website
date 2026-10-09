import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import useActiveSection from "../../motion/useActiveSection";
import { useTheme } from "../../context/ThemeContext";
import { AVATAR_REACT_EVENT, SECTION_MOODS, routeMood } from "./mood";

const SECTION_IDS = Object.keys(SECTION_MOODS);
// Inactivity ladder: ms without input → mood.
const IDLE_STEPS = [
  [150_000, "sleeping"],
  [80_000, "drowsy"],
  [40_000, "bored"],
];
const ACTIVITY = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart", "scroll"];

/**
 * The companion's current animation key.
 * Priority: transient reaction → chat state → inactivity → section / route.
 */
export default function useAvatarMood({ chatOpen, chatTyping }) {
  const { pathname } = useLocation();
  const section = useActiveSection(pathname === "/" ? SECTION_IDS : []);
  const { theme } = useTheme();
  const [reaction, setReaction] = useState(null);
  const [idleMood, setIdleMood] = useState(null);
  const reactionTimer = useRef(0);

  const react = (animation, ms) => {
    window.clearTimeout(reactionTimer.current);
    setReaction(animation);
    reactionTimer.current = window.setTimeout(() => setReaction(null), ms);
  };
  const reactRef = useRef(react);
  reactRef.current = react;

  // Reactions dispatched from anywhere via reactAvatar().
  useEffect(() => {
    const onReact = (e) => reactRef.current(e.detail.animation, e.detail.ms);
    window.addEventListener(AVATAR_REACT_EVENT, onReact);
    return () => {
      window.removeEventListener(AVATAR_REACT_EVENT, onReact);
      window.clearTimeout(reactionTimer.current);
    };
  }, []);

  // A theme flip is a small surprise (skip the initial render).
  const firstTheme = useRef(theme);
  useEffect(() => {
    if (theme !== firstTheme.current) reactRef.current("surprised", 1600);
  }, [theme]);

  // Inactivity ladder; any input after dozing off plays a short wake-up.
  useEffect(() => {
    let last = Date.now();
    let current = null;
    const set = (m) => {
      if (m !== current) setIdleMood((current = m));
    };
    const onActivity = () => {
      last = Date.now();
      if (current === "sleeping" || current === "drowsy") reactRef.current("waking", 2800);
      set(null);
    };
    const tick = () => {
      if (document.hidden) return set("sleeping");
      const quiet = Date.now() - last;
      set(IDLE_STEPS.find(([ms]) => quiet >= ms)?.[1] ?? null);
    };
    const id = window.setInterval(tick, 5000);
    ACTIVITY.forEach((t) => window.addEventListener(t, onActivity, { passive: true }));
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(id);
      ACTIVITY.forEach((t) => window.removeEventListener(t, onActivity));
      document.removeEventListener("visibilitychange", tick);
    };
  }, []);

  if (reaction) return reaction;
  if (chatTyping) return "thinking";
  if (chatOpen) return "listening";
  if (idleMood) return idleMood;
  return (section && SECTION_MOODS[section]) || routeMood(pathname);
}
