// The anime.js three adapter must load before any animate() call that
// targets three objects. This file lives in the lazy three chunk, so the
// adapter (and three itself) stay out of the entry bundle.
import "animejs/adapters/three";

import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { animate } from "../motion/animeSetup";
import useDocumentTheme from "./useDocumentTheme";
import CloudField from "./CloudField";
import StarField from "./StarField";
import { SKY_VERTEX, SKY_FRAGMENT, readTokenColor } from "./skyGradient";

const DUSK_CLOUD_TINT = "#5A6C96";
const DUSK_CLOUD_OPACITY = 0.3; // × base
const STAR_OPACITY = 0.9;

/** Pointer-parallax rig: the whole cloud group leans toward the cursor. */
const Rig = ({ children }) => {
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
    const pos = group.current.position;
    // Gentle lean toward the cursor + a slow upward drift as the page scrolls.
    const scroll =
      window.scrollY /
      Math.max(document.body.scrollHeight - window.innerHeight, 1);
    pos.x = THREE.MathUtils.damp(pos.x, pointer.current.x * 0.6, 2, delta);
    pos.y = THREE.MathUtils.damp(
      pos.y,
      -pointer.current.y * 0.4 + scroll * 2.2,
      2,
      delta,
    );
  });

  return <group ref={group}>{children}</group>;
};

Rig.propTypes = { children: PropTypes.node };

/**
 * Full-viewport WebGL sky: gradient shader plane + drifting sprite clouds +
 * a dusk starfield. Day↔dusk is an anime.js pass retargeting the sky
 * uniforms, cloud materials, and star opacity whenever the document theme
 * class flips. Renders behind all home content; pauses when the tab hides.
 */
const SkyScene = () => {
  const theme = useDocumentTheme();
  const [running, setRunning] = useState(() => !document.hidden);
  const skyMatRef = useRef(null);
  const cloudMats = useRef([]); // [{ mat, baseOpacity }]
  const starMat = useRef(null);
  const themeRef = useRef(theme);
  themeRef.current = theme;
  const firstRun = useRef(true);

  const skyUniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color(readTokenColor("--sky-high")) },
      uBottom: { value: new THREE.Color(readTokenColor("--sky-low")) },
    }),
    [],
  );

  // Pause the frameloop when the tab is hidden.
  useEffect(() => {
    const onVisibility = () => setRunning(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Day ↔ dusk crossfade, driven by the CSS tokens so WebGL and CssSky match.
  useEffect(() => {
    const dark = theme === "dark";
    const duration = firstRun.current ? 0 : 1400;
    firstRun.current = false;

    const top = new THREE.Color(readTokenColor("--sky-high"));
    const bottom = new THREE.Color(readTokenColor("--sky-low"));
    const ease = "inOutQuad";

    animate(skyUniforms.uTop.value, {
      r: top.r, g: top.g, b: top.b, duration, ease,
    });
    animate(skyUniforms.uBottom.value, {
      r: bottom.r, g: bottom.g, b: bottom.b, duration, ease,
    });
    cloudMats.current.forEach(({ mat, baseOpacity }) => {
      // Adapter parses CSS colors for material.color; dusk dims + tints navy.
      animate(mat, {
        color: dark ? DUSK_CLOUD_TINT : "#ffffff",
        opacity: dark ? baseOpacity * DUSK_CLOUD_OPACITY : baseOpacity,
        duration,
        ease,
      });
    });
    if (starMat.current) {
      animate(starMat.current, {
        opacity: dark ? STAR_OPACITY : 0,
        duration,
        ease,
      });
    }
  }, [theme, skyUniforms]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        frameloop={running ? "always" : "never"}
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      >
        {/* Sky gradient — far plane behind everything */}
        <mesh position={[0, 0, -20]} scale={[110, 60, 1]}>
          <planeGeometry />
          <shaderMaterial
            ref={skyMatRef}
            uniforms={skyUniforms}
            vertexShader={SKY_VERTEX}
            fragmentShader={SKY_FRAGMENT}
            depthWrite={false}
          />
        </mesh>

        <StarField
          registerMaterial={(mat) => {
            starMat.current = mat;
            // Materials mount after the first theme pass — apply current state.
            mat.opacity = themeRef.current === "dark" ? STAR_OPACITY : 0;
          }}
        />

        <Rig>
          <CloudField
            registerMaterial={(mat, baseOpacity) => {
              if (cloudMats.current.some((c) => c.mat === mat)) return;
              cloudMats.current.push({ mat, baseOpacity });
              if (themeRef.current === "dark") {
                mat.color.set(DUSK_CLOUD_TINT);
                mat.opacity = baseOpacity * DUSK_CLOUD_OPACITY;
              }
            }}
          />
        </Rig>
      </Canvas>
    </div>
  );
};

export default SkyScene;
