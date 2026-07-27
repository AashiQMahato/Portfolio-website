import PropTypes from "prop-types";
import { Reveal } from "../../motion";

/**
 * The three-level "Schematic" heading pattern: mono index label →
 * oversized display headline → dim blurb.
 */
const SectionHeading = ({ index, label, title, blurb }) => (
  <Reveal className="mb-14 md:mb-20" selector="[data-heading-row]">
    <p
      data-heading-row
      className="font-mono text-[11px] md:text-xs uppercase tracking-[0.25em] text-signal"
    >
      <span className="mr-3 inline-block h-px w-10 bg-signal align-middle" aria-hidden="true" />
      {index} <span className="text-ink-dim">{"//"}</span> {label}
    </p>
    <h2
      data-heading-row
      className="mt-4 font-display font-semibold tracking-tight text-ink text-[clamp(2rem,5vw,3.75rem)] leading-[1.05] text-balance"
    >
      {title}
    </h2>
    {blurb ? (
      <p data-heading-row className="mt-5 max-w-xl text-ink-dim">
        {blurb}
      </p>
    ) : null}
  </Reveal>
);

SectionHeading.propTypes = {
  index: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  title: PropTypes.node.isRequired,
  blurb: PropTypes.node,
};

export default SectionHeading;
