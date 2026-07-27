import * as THREE from "three";

let cached = null;

/**
 * Procedural soft-cloud sprite texture: overlapping white radial-gradient
 * blobs on a 256² canvas. Generated once at runtime — no network fetch, no
 * bundled asset. (Deliberately not drei's Cloud, which pulls its texture
 * from a remote CDN.)
 */
export function getCloudTexture() {
  if (cached) return cached;
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const blobs = [
    [0.5, 0.56, 0.3, 0.9],
    [0.34, 0.6, 0.22, 0.8],
    [0.66, 0.6, 0.23, 0.8],
    [0.44, 0.46, 0.18, 0.7],
    [0.6, 0.44, 0.16, 0.65],
    [0.26, 0.68, 0.13, 0.6],
    [0.74, 0.68, 0.13, 0.6],
  ];
  for (const [cx, cy, r, alpha] of blobs) {
    const g = ctx.createRadialGradient(
      cx * size,
      cy * size,
      0,
      cx * size,
      cy * size,
      r * size,
    );
    g.addColorStop(0, `rgba(255,255,255,${alpha})`);
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }

  cached = new THREE.CanvasTexture(canvas);
  cached.colorSpace = THREE.SRGBColorSpace;
  return cached;
}
