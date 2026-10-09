import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { createAvatar } from "@bible-strong/avatar-web";
import definition from "../../assets/aashik.avatar.json";

/**
 * Procedural SVG avatar. Pass `animation` for a living, looping mood or
 * `expression` for a still pose (no frame loop once it settles). Changing
 * `animation` re-targets from the frame currently on screen, so moods can
 * interrupt each other without a jump. Reduced motion is honored by the runtime.
 * Decorative unless `label` is given. Size comes from `className`.
 */
export default function Avatar({ animation, expression = "neutral", label, className = "" }) {
  const hostRef = useRef(null);
  const ctlRef = useRef(null);

  useEffect(() => {
    let ctl;
    try {
      ctl = createAvatar(hostRef.current, {
        definition,
        size: "100%",
        ariaLabel: label ?? "",
        ...(animation ? { defaultAnimation: animation } : { defaultExpression: expression }),
      });
    } catch (err) {
      // Never take the page down for a decorative avatar; callers keep their fallback.
      console.warn("[Avatar] failed to initialise:", err);
      return undefined;
    }
    ctlRef.current = ctl;
    return () => {
      ctl.destroy();
      ctlRef.current = null;
    };
    // Mount once; the effects below steer the live instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const ctl = ctlRef.current;
    if (ctl && animation && ctl.getState().activeAnimation !== animation) ctl.play(animation);
  }, [animation]);

  useEffect(() => {
    const state = ctlRef.current?.getState();
    // Also when already on `expression` mid-animation: setExpression ends the timeline (and its frame loop).
    if (state && !animation && (state.activeAnimation || state.activeExpression !== expression)) {
      ctlRef.current.setExpression(expression);
    }
  }, [animation, expression]);

  return (
    <span
      ref={hostRef}
      aria-hidden={label ? undefined : true}
      className={`pointer-events-none inline-block shrink-0 [&_.bs-avatar]:!block [&_svg]:overflow-visible ${className}`}
    />
  );
}

Avatar.propTypes = {
  animation: PropTypes.string,
  expression: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
};
