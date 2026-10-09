import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useGSAP } from "@gsap/react";
import { gsap, EASE, usePrefersReducedMotion } from "../../motion";
import { reactAvatar } from "../../components/avatar/mood";

/**
 * The email, set large, as a copy-to-clipboard control. Copy confirmation
 * is a tiny in-place swap (the address rolls up, "Copied" rolls in) plus a
 * polite live-region announcement — no toast. If the clipboard is
 * unavailable it falls back to opening the mail client.
 */
const CopyEmail = ({ email }) => {
  const ref = useRef(null);
  const [copied, setCopied] = useState(false);
  const reduced = usePrefersReducedMotion();

  const { contextSafe } = useGSAP({ scope: ref });

  const play = contextSafe((on) => {
    if (reduced) return;
    gsap.to("[data-addr]", { yPercent: on ? -110 : 0, duration: 0.5, ease: EASE.strong });
    gsap.fromTo(
      "[data-copied]",
      { yPercent: on ? 110 : 0 },
      { yPercent: on ? 0 : 110, duration: 0.5, ease: EASE.strong },
    );
  });

  useEffect(() => {
    if (!copied) return undefined;
    const t = setTimeout(() => {
      setCopied(false);
      play(false);
    }, 1800);
    return () => clearTimeout(t);
  }, [copied, play]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      play(true);
      reactAvatar("happy", 2500);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <div ref={ref}>
      <button
        data-avatar="happy"
        type="button"
        onClick={copy}
        data-cursor="copy"
        className="group relative block max-w-full text-left"
      >
        <span className="relative block overflow-clip pb-[0.1em]">
          <span
            data-addr
            className={`block text-[clamp(1.35rem,3.5vw,3.75rem)] font-medium leading-[1.08] tracking-[-0.04em] text-ink transition-colors duration-300 group-hover:text-signal ${
              reduced && copied ? "invisible" : ""
            }`}
          >
            {/* Only ever wrap at the @, never mid-word. */}
            {email.split("@")[0]}
            <wbr />@{email.split("@")[1]}
            <span className="sr-only"> — copy email address</span>
          </span>
          <span
            data-copied
            aria-hidden="true"
            className={`absolute inset-0 flex items-center gap-4 text-[clamp(1.35rem,3.5vw,3.75rem)] font-medium leading-[1.08] tracking-[-0.04em] text-signal ${
              reduced ? (copied ? "" : "invisible") : "translate-y-[110%]"
            }`}
          >
            Copied
            <svg viewBox="0 0 24 24" className="h-[0.7em] w-[0.7em]" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12.5l5 5L20 6.5" />
            </svg>
          </span>
        </span>
        <span aria-hidden="true" className="mt-3 block h-px w-full origin-left scale-x-0 bg-signal transition-transform duration-700 ease-out group-hover:scale-x-100" />
      </button>
      <p className="hud mt-4 flex flex-wrap gap-x-4 gap-y-1">
        <span>Click to copy</span>
        <a href={`mailto:${email}`} className="link-line text-ink">
          or open in your mail app
        </a>
      </p>
      <p role="status" className="sr-only">
        {copied ? "Email address copied to clipboard" : ""}
      </p>
    </div>
  );
};

CopyEmail.propTypes = { email: PropTypes.string.isRequired };

export default CopyEmail;
