// Brand colours as shipped by Simple Icons, made legible on the site's
// backgrounds: hue and saturation stay, only lightness moves, and only when a
// mark would otherwise sink into the page. Near-black marks (Next.js, Express,
// GitHub…) take the theme's ink, which is how those brands render on dark UI.

const BG = { dark: [7, 7, 8], light: [243, 241, 236] };
const INK = { dark: "#f2f1ee", light: "#0c0c0d" };
const MIN_CONTRAST = 2.4;

const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const lum = (rgb) => {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const rgbToHsl = ([r, g, b]) => {
  const [R, G, B] = [r / 255, g / 255, b / 255];
  const max = Math.max(R, G, B);
  const min = Math.min(R, G, B);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === R ? (G - B) / d + (G < B ? 6 : 0) : max === G ? (B - R) / d + 2 : (R - G) / d + 4;
  return [h / 6, s, l];
};
const hslToRgb = ([h, s, l]) => {
  if (!s) return [l, l, l].map((v) => Math.round(v * 255));
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const f = (t) => {
    const x = t < 0 ? t + 1 : t > 1 ? t - 1 : t;
    if (x < 1 / 6) return p + (q - p) * 6 * x;
    if (x < 1 / 2) return q;
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6;
    return p;
  };
  return [f(h + 1 / 3), f(h), f(h - 1 / 3)].map((v) => Math.round(v * 255));
};
const toHex = (rgb) => `#${rgb.map((v) => v.toString(16).padStart(2, "0")).join("")}`;

const cache = new Map();

/** Display colour for a brand hex on the given theme ("dark" | "light"). */
export function techColor(hex, theme = "dark") {
  const key = `${hex}|${theme}`;
  if (cache.has(key)) return cache.get(key);
  const bg = BG[theme] ?? BG.dark;
  let rgb = hexToRgb(hex);
  let out = hex;
  if (contrast(rgb, bg) < MIN_CONTRAST) {
    const [h, s, l] = rgbToHsl(rgb);
    if (s < 0.2) {
      out = INK[theme] ?? INK.dark;
    } else {
      const step = theme === "light" ? -0.02 : 0.02;
      let L = l;
      while (contrast(rgb, bg) < MIN_CONTRAST && L > 0 && L < 1) {
        L = Math.min(1, Math.max(0, L + step));
        rgb = hslToRgb([h, s, L]);
      }
      out = toHex(rgb);
    }
  }
  cache.set(key, out);
  return out;
}

export const inkColor = (theme) => INK[theme] ?? INK.dark;
