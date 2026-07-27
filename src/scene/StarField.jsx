import { useMemo } from "react";
import PropTypes from "prop-types";
import * as THREE from "three";

const COUNT = 700;

/**
 * Sparse point-cloud starfield behind the clouds. Invisible by day; the
 * dusk theme timeline fades its material in. Custom Points (~700 verts)
 * instead of drei's Stars to keep drei out of the bundle.
 */
const StarField = ({ registerMaterial }) => {
  const geometry = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 70; // x
      positions[i * 3 + 1] = -4 + Math.random() * 26; // y — mostly above horizon
      positions[i * 3 + 2] = -17 - Math.random() * 2; // z — behind clouds
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        ref={(mat) => mat && registerMaterial?.(mat)}
        color="#F2EDE2"
        size={0.09}
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
      />
    </points>
  );
};

StarField.propTypes = {
  registerMaterial: PropTypes.func,
};

export default StarField;
