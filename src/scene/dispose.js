/**
 * Recursively disposes geometries, materials, and textures under a Three.js
 * object. Call from scene component cleanup to avoid GPU memory leaks on
 * SPA navigation.
 */
export function disposeObject(root) {
  if (!root) return;
  root.traverse((node) => {
    node.geometry?.dispose?.();
    const materials = Array.isArray(node.material)
      ? node.material
      : node.material
        ? [node.material]
        : [];
    materials.forEach((material) => {
      Object.values(material).forEach((value) => {
        if (value?.isTexture) value.dispose();
      });
      material.dispose();
    });
  });
}
