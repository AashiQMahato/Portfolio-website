import PropTypes from "prop-types";

/**
 * Presents real project media the way it exists in the world: web products
 * inside a quiet browser window (address bar shows the real host when the
 * project is live), diagrams and hardware as a plain technical figure.
 * Intrinsic width/height are always set so the layout never shifts.
 */
const ProductFrame = ({ src, alt, kind = "browser", url, caption, priority = false, className = "" }) => {
  const host = url ? new URL(url).host : null;
  const img = (
    <img
      data-frame-img
      src={src}
      alt={alt}
      width={1600}
      height={974}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      // React 18 drops the camelCase prop; the lowercase attribute reaches the DOM.
      // eslint-disable-next-line react/no-unknown-property
      fetchpriority={priority ? "high" : undefined}
      className={`block h-auto w-full ${kind === "figure" ? "object-contain" : "object-cover object-top"}`}
    />
  );

  if (kind === "figure") {
    return (
      <figure className={`overflow-hidden rounded-xl border border-line bg-panel ${className}`}>
        <div className="overflow-hidden">{img}</div>
        {caption && <figcaption className="hud border-t border-line px-4 py-3">{caption}</figcaption>}
      </figure>
    );
  }

  return (
    <figure className={`overflow-hidden rounded-xl border border-line bg-panel shadow-2xl shadow-black/30 ${className}`}>
      <div aria-hidden="true" className="flex items-center gap-3 border-b border-line px-4 py-2.5">
        <span className="flex gap-1.5">
          {[0, 1, 2].map((d) => (
            <span key={d} className="h-2.5 w-2.5 rounded-full bg-line" />
          ))}
        </span>
        <span className="mx-auto max-w-[60%] truncate rounded-md bg-background px-3 py-1 font-mono text-[11px] text-ink-dim">
          {host ?? "local build"}
        </span>
        <span className="w-[42px]" />
      </div>
      <div className="overflow-hidden">{img}</div>
      {caption && <figcaption className="hud border-t border-line px-4 py-3">{caption}</figcaption>}
    </figure>
  );
};

ProductFrame.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  kind: PropTypes.oneOf(["browser", "figure"]),
  url: PropTypes.string,
  caption: PropTypes.string,
  priority: PropTypes.bool,
  className: PropTypes.string,
};

export default ProductFrame;
