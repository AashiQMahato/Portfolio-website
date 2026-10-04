import { createElement, Fragment } from "react";
import PropTypes from "prop-types";

const HEADINGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

/**
 * Lightweight, React-owned text splitting (no DOM mutation, so it survives
 * re-renders and needs no cleanup).
 *
 *  - `lines`  explicit line array → each line in a clipping mask, inner span
 *             carries data-split-line (animate yPercent from 100)
 *  - `words`  data-split-word spans inside masks
 *  - `chars`  data-split-char spans, words kept unbreakable
 *
 * Headings get an aria-label with the full text and the split spans are
 * aria-hidden, so assistive tech reads one phrase rather than fragments.
 * Visible text content is unchanged for crawlers.
 */
const SplitText = ({
  as = "span",
  text,
  lines,
  by = "words",
  className = "",
  lineClassName = "",
  accent,
  ...rest
}) => {
  const full = lines ? lines.join(" ") : text;
  const label = HEADINGS.has(as) ? { "aria-label": full } : {};
  const hide = HEADINGS.has(as) ? { "aria-hidden": "true" } : {};

  const renderWords = (str, lineIdx = 0) =>
    str.split(" ").map((word, i, arr) => {
      const isAccent = accent && accent.includes(word.replace(/[.,]/g, ""));
      const inner =
        by === "chars" ? (
          <span className="inline-block whitespace-nowrap">
            {word.split("").map((ch, j) => (
              <span key={j} data-split-char className="inline-block will-change-transform">
                {ch}
              </span>
            ))}
          </span>
        ) : (
          <span data-split-word className="inline-block will-change-transform">
            {word}
          </span>
        );
      return (
        <Fragment key={`${lineIdx}-${i}`}>
          <span className={`inline-block overflow-clip pb-[0.08em] -mb-[0.08em] align-top ${isAccent ? "text-signal" : ""}`}>
            {inner}
          </span>
          {i < arr.length - 1 ? " " : null}
        </Fragment>
      );
    });

  const children = lines
    ? lines.map((line, i) => (
        <span key={i} className={`line-mask ${lineClassName}`} {...hide}>
          <span data-split-line className="block will-change-transform">
            {by === "lines" ? line : renderWords(line, i)}
          </span>
        </span>
      ))
    : <span {...hide}>{renderWords(text)}</span>;

  return createElement(as, { className, ...label, ...rest }, children);
};

SplitText.propTypes = {
  as: PropTypes.string,
  text: PropTypes.string,
  lines: PropTypes.arrayOf(PropTypes.string),
  by: PropTypes.oneOf(["lines", "words", "chars"]),
  className: PropTypes.string,
  lineClassName: PropTypes.string,
  accent: PropTypes.arrayOf(PropTypes.string),
};

export default SplitText;
