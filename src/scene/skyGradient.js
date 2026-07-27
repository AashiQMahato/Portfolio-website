// Fullscreen vertical-gradient sky shader + helpers to read the CSS sky
// tokens so the WebGL sky always matches the CssSky fallback exactly.

export const SKY_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const SKY_FRAGMENT = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uBottom;
  varying vec2 vUv;
  void main() {
    // Slightly eased vertical blend with a soft horizon lift near the bottom.
    float t = smoothstep(0.0, 1.0, vUv.y);
    vec3 col = mix(uBottom, uTop, t);
    gl_FragColor = vec4(col, 1.0);
  }
`;

/**
 * Reads an RGB-triplet CSS token ("143 199 239") off <html> and returns a
 * CSS color string three.js can parse.
 */
export const readTokenColor = (name) => {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return `rgb(${raw.split(/\s+/).join(",")})`;
};
