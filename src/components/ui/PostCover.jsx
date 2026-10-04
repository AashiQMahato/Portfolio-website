import PropTypes from "prop-types";

/** Deterministic small hash so each post's trace is stable but distinct. */
const seed = (str) => [...str].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

const tracePath = (s, w = 400, h = 120) => {
  const f1 = 2 + (s % 5);
  const f2 = 7 + (s % 11);
  const pts = [];
  for (let x = 0; x <= w; x += 4) {
    const nx = x / w;
    const y = h / 2 + Math.sin(nx * f1 * Math.PI + s) * h * 0.22 + Math.sin(nx * f2 * Math.PI) * h * 0.08;
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return `M${pts.join(" L")}`;
};

/**
 * Generated editorial cover for posts without imagery: category set large,
 * a mono index, and a signal trace derived from the slug — on-brand,
 * zero bytes of image, never a stock photo.
 */
const PostCover = ({ slug, category, index, className = "" }) => (
  <div
    aria-hidden="true"
    className={`micro-grid relative flex flex-col justify-between overflow-hidden bg-panel p-5 ${className}`}
  >
    <div className="flex items-start justify-between">
      <span className="hud text-ink">{category}</span>
      <span className="hud tabular-nums">No. {String(index).padStart(2, "0")}</span>
    </div>
    <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="absolute inset-x-0 top-1/2 h-1/3 w-full -translate-y-1/2">
      <path d={tracePath(seed(slug))} fill="none" stroke="rgb(var(--signal))" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
    <span className="text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-none tracking-[-0.05em] text-ink">
      {category}
      <span className="text-signal">.</span>
    </span>
  </div>
);

PostCover.propTypes = {
  slug: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  className: PropTypes.string,
};

export default PostCover;
