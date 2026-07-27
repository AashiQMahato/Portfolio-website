import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import CircuitBoard from "./CircuitBoard";

/** Tracks the `dark` class the ThemeProvider stamps on <html>. */
const useDocumentTheme = () => {
  const read = () =>
    document.documentElement.classList.contains("dark") ? "dark" : "light";
  const [theme, setTheme] = useState(read);

  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(read()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return theme;
};

/**
 * Pointer-parallax + scroll rig. The board tilts toward the cursor and,
 * as the hero scrolls away, pitches toward board level and sinks — handing
 * the eye off to the rail trace below.
 */
const Rig = ({ theme }) => {
  const group = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    if (!group.current) return;
    const scroll = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
    const rot = group.current.rotation;
    rot.y = THREE.MathUtils.damp(rot.y, -0.35 + pointer.current.x * 0.22 + scroll * 0.5, 2.5, delta);
    rot.x = THREE.MathUtils.damp(rot.x, pointer.current.y * 0.1 + scroll * 0.35, 2.5, delta);
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      -0.15 - scroll * 1.4,
      3,
      delta,
    );
  });

  return (
    <group ref={group} position={[1.15, 0.45, 0]} scale={0.72}>
      <CircuitBoard theme={theme} />
    </group>
  );
};

/**
 * The lazy-loaded WebGL hero layer. Renders only while on screen
 * (frameloop pauses when the hero scrolls out of view). R3F disposes
 * GPU resources automatically on unmount.
 */
const HeroScene = () => {
  const wrapRef = useRef(null);
  const [visible, setVisible] = useState(true);
  const theme = useDocumentTheme();

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Keep the typographic zone clean and stop the canvas reading as a hard
  // rectangle: fade toward the copy on the left, and feather every edge.
  const mask = [
    "linear-gradient(100deg, transparent 18%, black 52%)",
    "linear-gradient(to top, transparent 2%, black 26%)",
    "radial-gradient(ellipse 92% 88% at 68% 46%, black 42%, transparent 82%)",
  ].join(", ");

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0"
      aria-hidden="true"
      style={{
        WebkitMaskImage: mask,
        maskImage: mask,
        WebkitMaskComposite: "source-in",
        maskComposite: "intersect",
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 2.2, 4.4], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ camera }) => camera.lookAt(0, -0.2, 0)}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 5, 2]} intensity={0.9} />
        <directionalLight position={[-4, 2, -2]} intensity={0.25} color="#53E9C5" />
        <Rig theme={theme} />
      </Canvas>
    </div>
  );
};

Rig.propTypes = {
  theme: PropTypes.oneOf(["dark", "light"]),
};

export default HeroScene;
