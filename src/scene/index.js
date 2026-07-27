// 3D layer (Three.js via @react-three/fiber). The hero scene lands here in
// Phase 5 as a lazy-loaded component; keep everything under src/scene so the
// three.js bundle stays in its own async chunk.
export { default as useWebGLSupport } from "./useWebGLSupport";
export { disposeObject } from "./dispose";
