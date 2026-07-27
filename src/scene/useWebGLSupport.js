import { useMemo } from "react";

/** Feature-detects WebGL so the hero can fall back to its static render. */
export default function useWebGLSupport() {
  return useMemo(() => {
    try {
      const canvas = document.createElement("canvas");
      return Boolean(
        window.WebGLRenderingContext &&
          (canvas.getContext("webgl2") || canvas.getContext("webgl")),
      );
    } catch {
      return false;
    }
  }, []);
}
