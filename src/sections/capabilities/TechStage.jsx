import { useEffect, useLayoutEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useTheme } from "../../context/ThemeContext";
import { usePrefersReducedMotion } from "../../motion";
import TechScene from "./TechScene";
import { capabilityShape } from "./shapes";

/**
 * WebGL stage for the active capability. Category changes run exit → swap →
 * enter: the old marks recede, React swaps the label buttons, the new marks
 * arrive — each step interruptible by the next click. Label buttons are the
 * real controls (hover, focus, click); the scene only positions them.
 */
const TechStage = ({ capability, entered, active, previewing, onHover, onPick, pinned, onFail }) => {
  const hostRef = useRef(null);
  const layerRef = useRef(null);
  const sceneRef = useRef(null);
  const introduced = useRef(false);
  const swapToken = useRef(0);
  const { theme } = useTheme();
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(capability);

  useEffect(() => {
    let scene;
    try {
      scene = new TechScene(hostRef.current, layerRef.current, { theme, reduced });
    } catch {
      // WebGL refused to start (blocked, lost or unsupported): use the logo grid.
      onFail();
      return undefined;
    }
    sceneRef.current = scene;
    const ro = new ResizeObserver(() => scene.resize());
    ro.observe(hostRef.current);
    return () => {
      ro.disconnect();
      scene.dispose();
      sceneRef.current = null;
      introduced.current = false;
    };
    // Created once; theme and motion preference are pushed in below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.reduced = reduced;
  }, [reduced]);

  useEffect(() => {
    sceneRef.current?.setTheme(theme);
  }, [theme]);

  // First reveal waits for the section's scroll entrance.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!entered || !scene || introduced.current) return;
    introduced.current = true;
    scene.intro(shown);
    scene.enter(shown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entered]);

  // Category change: old marks out, then swap the labels.
  useEffect(() => {
    if (capability.id === shown.id) return;
    const token = ++swapToken.current;
    const scene = sceneRef.current;
    if (!scene || !introduced.current) {
      setShown(capability);
      return;
    }
    scene.exit().then(() => {
      if (token === swapToken.current) setShown(capability);
    });
  }, [capability, shown.id]);

  // New labels are in the DOM: build and bring in the new marks.
  const firstShown = useRef(true);
  useLayoutEffect(() => {
    if (firstShown.current) {
      firstShown.current = false;
      return;
    }
    if (introduced.current) sceneRef.current?.enter(shown);
  }, [shown]);

  useEffect(() => {
    sceneRef.current?.highlight(active);
  }, [active, shown]);

  useEffect(() => {
    sceneRef.current?.preview(previewing);
  }, [previewing]);

  const onPointerMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    sceneRef.current?.pointer(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
  };

  return (
    <div
      ref={hostRef}
      className="absolute inset-0"
      onPointerMove={onPointerMove}
      onPointerLeave={() => sceneRef.current?.pointer(0, 0)}
    >
      <ul ref={layerRef} aria-label={`${shown.label} technologies`} className="absolute inset-0">
        {shown.techs.map((t) => (
          <li key={t.name}>
            <button
              type="button"
              data-tech-label={t.name}
              data-avatar="excited"
              aria-pressed={pinned === t.name}
              aria-describedby="capability-detail"
              onPointerEnter={() => onHover(t.name)}
              onPointerLeave={() => onHover(null)}
              onFocus={() => onHover(t.name)}
              onBlur={() => onHover(null)}
              onClick={() => onPick(t.name)}
              style={{ opacity: 0, width: 0, height: 0 }}
              className="tech-mark group absolute left-0 top-0 rounded-md outline-none focus-visible:ring-1 focus-visible:ring-signal focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            >
              <span className="tech-mark__label pointer-events-none absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-dim transition-[color,opacity] duration-300 group-hover:text-ink group-focus-visible:text-ink group-data-[state=dim]:opacity-40 group-data-[state=on]:text-ink">
                {t.name}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

TechStage.propTypes = {
  capability: capabilityShape.isRequired,
  entered: PropTypes.bool.isRequired,
  active: PropTypes.string,
  pinned: PropTypes.string,
  previewing: PropTypes.bool.isRequired,
  onHover: PropTypes.func.isRequired,
  onPick: PropTypes.func.isRequired,
  onFail: PropTypes.func.isRequired,
};

export default TechStage;
