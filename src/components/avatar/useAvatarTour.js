import { useEffect, useState } from "react";
import { TOUR_STEPS, TOUR_STEP_MS } from "./mood";

/**
 * Optional guided tour, only ever started by the visitor. Each stop scrolls
 * to its section; stops auto-advance unless paused — or under reduced
 * motion, where the visitor steps through with Skip instead.
 */
export default function useAvatarTour({ scrollTo, reduced }) {
  const [index, setIndex] = useState(-1);
  const [paused, setPaused] = useState(false);
  const active = index >= 0;
  const next = () => setIndex((i) => (i + 1 < TOUR_STEPS.length ? i + 1 : -1));

  useEffect(() => {
    if (active) scrollTo(`#${TOUR_STEPS[index].id}`);
  }, [active, index, scrollTo]);

  useEffect(() => {
    if (!active || paused || reduced) return undefined;
    const t = window.setTimeout(next, TOUR_STEP_MS);
    return () => window.clearTimeout(t);
  }, [active, index, paused, reduced]);

  return {
    active,
    index,
    step: active ? TOUR_STEPS[index] : null,
    total: TOUR_STEPS.length,
    paused,
    start: () => {
      setPaused(false);
      setIndex(0);
    },
    togglePause: () => setPaused((p) => !p),
    skip: next,
    end: () => setIndex(-1),
  };
}
