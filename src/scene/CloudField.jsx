import { useEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import { animate } from "../motion/animeSetup";
import { getCloudTexture } from "./cloudTexture";

const COUNT = 10;
// Depth layers: [z, x half-span, base scale] — far clouds drift wider/slower.
const LAYERS = [
  [-14, 30, 8],
  [-9.5, 22, 5.5],
  [-5, 15, 3.6],
];

/**
 * ~10 billboard cloud sprites in three parallax depth layers. Drift and
 * "breathing" are time-indexed, so anime.js owns them (via the three.js
 * adapter loaded in SkyScene); each animation handle is paused on unmount.
 */
const CloudField = ({ registerMaterial }) => {
  const groupRef = useRef(null);
  const texture = useMemo(() => getCloudTexture(), []);

  const clouds = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => {
        const [z, span, base] = LAYERS[i % LAYERS.length];
        const scale = base * (0.75 + Math.random() * 0.5);
        return {
          z: z + (Math.random() - 0.5) * 2,
          span,
          scale,
          y: -3 + Math.random() * 7 + (z === -14 ? 1.5 : 0),
          opacity: 0.5 + Math.random() * 0.4,
          duration: 38000 + Math.random() * 42000,
        };
      }),
    [],
  );

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return undefined;
    const anims = [];
    group.children.forEach((sprite, i) => {
      const c = clouds[i];
      if (!c) return;
      // Endless sideways drift; seek() scatters starting phases.
      const drift = animate(sprite, {
        x: [-c.span - 6, c.span + 6],
        duration: c.duration,
        ease: "linear",
        loop: true,
      });
      drift.seek(Math.random() * c.duration);
      anims.push(drift);
      // Slow vertical "breathing".
      anims.push(
        animate(sprite, {
          scaleY: [c.scale * 0.52, c.scale * 0.6],
          duration: 9000 + Math.random() * 7000,
          ease: "inOutSine",
          alternate: true,
          loop: true,
        }),
      );
    });
    return () => anims.forEach((a) => a.pause());
  }, [clouds]);

  return (
    <group ref={groupRef}>
      {clouds.map((c, i) => (
        <sprite
          key={i}
          position={[0, c.y, c.z]}
          scale={[c.scale, c.scale * 0.56, 1]}
        >
          <spriteMaterial
            ref={(mat) => mat && registerMaterial?.(mat, c.opacity)}
            map={texture}
            transparent
            opacity={c.opacity}
            depthWrite={false}
          />
        </sprite>
      ))}
    </group>
  );
};

CloudField.propTypes = {
  registerMaterial: PropTypes.func,
};

export default CloudField;
